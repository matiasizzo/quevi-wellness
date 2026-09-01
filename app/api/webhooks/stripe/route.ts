import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendOrderEmails, sendGiftEmails, type GiftCardEmail } from '@/lib/orderEmails'
import { generateGiftCode } from '@/lib/giftCode'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

// ── Datos de quien paga, según Stripe ────────────────────────────────────────
// Hay cobros que no nacen del checkout de la web: links de pago que se envían a
// mano (reservas de un servicio) y señas de cita. En esos no hay fila previa ni
// metadata nuestra, así que el pedido caía en el CRM con el importe y nada más.
// Stripe sí guarda quién pagó, y aquí se lo pedimos.
type PayerDetails = {
  name: string
  email: string
  phone: string
  items: { name: string; quantity: number; price: number }[]
  // payment_link  = link de pago enviado a mano
  // stripe_checkout = página de pago de Stripe (p. ej. seña de cita)
  // stripe        = cobro suelto, sin sesión de pago
  source: 'payment_link' | 'stripe_checkout' | 'stripe'
}

async function fetchPayerDetails(stripe: Stripe, pi: Stripe.PaymentIntent): Promise<PayerDetails> {
  const payer: PayerDetails = { name: '', email: '', phone: '', items: [], source: 'stripe' }

  try {
    const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1 })
    const session = sessions.data[0]
    if (session) {
      payer.name = session.customer_details?.name ?? ''
      payer.email = session.customer_email ?? session.customer_details?.email ?? ''
      // El teléfono solo llega si el link de pago tiene activada su recogida
      payer.phone = session.customer_details?.phone ?? ''
      payer.source = session.payment_link ? 'payment_link' : 'stripe_checkout'

      try {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 })
        payer.items = lines.data.map(l => {
          const qty = Math.max(1, l.quantity ?? 1)
          return {
            name: l.description ?? 'Concepto sin nombre',
            quantity: qty,
            price: Math.round((l.amount_total ?? 0) / qty) / 100,
          }
        })
      } catch (e) {
        console.error('[webhook/stripe] No se pudieron leer las líneas de la sesión:', e)
      }
    }
  } catch (e) {
    console.error('[webhook/stripe] No se pudo leer la sesión de pago:', e)
  }

  // Respaldo: los datos de facturación de la tarjeta
  if (!payer.name || !payer.email || !payer.phone) {
    try {
      const chargeId = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id
      const charge = chargeId ? await stripe.charges.retrieve(chargeId) : null
      payer.name = payer.name || (charge?.billing_details?.name ?? '')
      payer.email = payer.email || charge?.billing_details?.email || pi.receipt_email || ''
      payer.phone = payer.phone || (charge?.billing_details?.phone ?? '')
    } catch (e) {
      console.error('[webhook/stripe] No se pudieron leer los datos del cargo:', e)
    }
  }

  return payer
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  let event: Stripe.Event

  const stripe = getStripe()

  if (webhookSecret && signature) {
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    } catch (err) {
      console.error('[webhook/stripe] Signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  } else {
    console.warn('[webhook/stripe] STRIPE_WEBHOOK_SECRET not set — skipping verification')
    try {
      event = JSON.parse(body) as Stripe.Event
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { name, phone, service, appointment_date, appointment_time, notes } = session.metadata ?? {}
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? ''
    const paymentIntentId = typeof session.payment_intent === 'string'
      ? session.payment_intent
      : (session.payment_intent?.id ?? null)

    // Los links de pago no traen nuestra metadata: el nombre, el teléfono y el
    // concepto salen de lo que Stripe le pidió al cliente al pagar
    const fromPaymentLink = Boolean(session.payment_link)
    const customerName = name || session.customer_details?.name || ''
    const customerPhone = phone || session.customer_details?.phone || null

    let serviceName = service ?? ''
    if (!serviceName) {
      try {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })
        serviceName = lines.data.map(l => l.description).filter(Boolean).join(' · ')
      } catch (e) {
        console.error('[webhook/stripe] No se pudo leer el concepto de la sesión:', e)
      }
    }

    const appointmentNotes = notes
      ?? (fromPaymentLink ? 'Pagado con un link de pago de Stripe' : null)

    const supabase = getSupabaseServiceClient()
    if (supabase) {
      const { data: existing } = await supabase
        .from('appointments').select('id')
        .eq('stripe_session_id', session.id).maybeSingle()

      if (existing) {
        const { error } = await supabase.from('appointments')
          .update({ status: 'paid', stripe_payment_intent_id: paymentIntentId })
          .eq('stripe_session_id', session.id)
        if (error) console.error('[webhook/stripe] Update error:', error)
      } else {
        const { error } = await supabase.from('appointments').insert({
          name: customerName, email: customerEmail, phone: customerPhone,
          service: serviceName, appointment_date: appointment_date ?? '',
          appointment_time: appointment_time ?? '', notes: appointmentNotes,
          amount_cents: session.amount_total ?? 5000, status: 'paid',
          stripe_session_id: session.id, stripe_payment_intent_id: paymentIntentId,
        })
        if (error) console.error('[webhook/stripe] Insert error:', error)
      }
    }
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const meta = pi.metadata ?? {}

    // Los artículos vienen partidos en items_0, items_1… (límite de 500 caracteres
    // por valor de metadata en Stripe). `items` es el formato antiguo.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let items: any[] = []
    try {
      const parts = Number(meta.items_parts ?? 0)
      const json = parts > 0
        ? Array.from({ length: parts }, (_, i) => meta[`items_${i}`] ?? '').join('')
        : (meta.items ?? '[]')
      items = JSON.parse(json || '[]')
    } catch (e) {
      console.error('[webhook/stripe] No se pudo reconstruir la lista de artículos:', e)
      items = []
    }

    const supabase = getSupabaseServiceClient()
    if (supabase) {
      // El pedido ya se guardó como 'pending' al iniciar el pago: esa fila es la
      // fuente de verdad. Aquí solo lo confirmamos y disparamos los avisos.
      const { data: existing } = await supabase
        .from('orders')
        .select('id, status, shipping_address, subtotal_cents, shipping_cents')
        .eq('stripe_payment_intent_id', pi.id)
        .maybeSingle()

      const alreadyProcessed = existing?.status === 'paid' || existing?.status === 'completed'

      if (!alreadyProcessed) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const saved: any = (existing?.shipping_address as any) ?? null

        // Sin fila previa = el cobro no salió del checkout de la web (link de
        // pago, seña de cita). Le pedimos a Stripe quién pagó para no dejar la
        // venta en el CRM con el importe y nada más.
        const payer = existing ? null : await fetchPayerDetails(stripe, pi)
        const external = payer !== null && payer.source !== 'stripe'

        // Datos: primero de la base de datos, y como respaldo, de la metadata de Stripe
        const details = {
          name: saved?.name ?? meta.shipping_name ?? payer?.name ?? '',
          email: saved?.email ?? meta.shipping_email ?? payer?.email ?? '',
          phone: saved?.phone ?? meta.shipping_phone ?? payer?.phone ?? '',
          address: saved?.address ?? meta.shipping_address ?? '',
          city: saved?.city ?? meta.shipping_city ?? '',
          postalCode: saved?.postalCode ?? meta.shipping_postal_code ?? '',
          country: saved?.country ?? meta.shipping_country ?? '',
          deliveryMethod: (saved?.deliveryMethod ?? 'ship') as 'ship' | 'pickup',
          couponCode: saved?.couponCode ?? meta.coupon_code ?? '',
          discountCents: Number(saved?.discountCents ?? meta.discount_cents ?? 0),
          // En los cobros de fuera de la web no hay desglose: el subtotal es el importe
          subtotalCents: Number(existing?.subtotal_cents ?? meta.subtotal_cents ?? (payer ? pi.amount : 0)),
          shippingCents: Number(existing?.shipping_cents ?? meta.shipping_cents ?? 0),
          gift: saved?.gift ?? (meta.is_gift === '1'
            ? { isGift: true, recipientName: meta.gift_recipient_name ?? '', recipientEmail: meta.gift_recipient_email ?? '', message: meta.gift_message ?? '' }
            : null),
          // De dónde viene el cobro, para distinguirlo en el CRM
          source: payer?.source ?? null,
        }
        const orderItems = (saved?.items?.length ? saved.items : (items.length ? items : payer?.items ?? [])) ?? []

        let orderId: string | null = existing?.id ?? null

        if (existing) {
          const { error } = await supabase
            .from('orders').update({ status: 'paid', total_cents: pi.amount }).eq('id', existing.id)
          if (error) console.error('[webhook/stripe] Order update error:', error)
        } else {
          const { data: inserted, error } = await supabase.from('orders').insert({
            status: 'paid',
            subtotal_cents: details.subtotalCents,
            shipping_cents: details.shippingCents,
            total_cents: pi.amount,
            stripe_payment_intent_id: pi.id,
            shipping_address: { ...details, items: orderItems },
          }).select('id').maybeSingle()
          if (error) console.error('[webhook/stripe] Order insert error:', error)
          orderId = inserted?.id ?? null
        }

        // ── Descuento de stock ──
        // La función SQL es idempotente (marca orders.stock_applied_at), así que
        // un reintento de Stripe no vuelve a descontar. Si falla, se registra y
        // se sigue: el pedido ya está cobrado y no se puede tumbar el webhook.
        if (orderId) {
          try {
            const { error: stockErr } = await supabase.rpc('apply_online_sale_stock', { p_order_id: orderId })
            if (stockErr) console.error('[webhook/stripe] Stock update error:', stockErr.message)
          } catch (e) {
            console.error('[webhook/stripe] Stock update threw:', e)
          }
        }

        // ── Contador de usos del cupón ──
        if (details.couponCode) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: dc } = await (supabase as any)
              .from('discount_codes').select('uses').eq('code', details.couponCode).maybeSingle()
            if (dc) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (supabase as any).from('discount_codes')
                .update({ uses: (dc.uses ?? 0) + 1 }).eq('code', details.couponCode)
            }
          } catch (e) {
            console.error('[webhook/stripe] Coupon uses increment error:', e)
          }
        }

        // ── Vales regalo: un código por unidad ──
        if (details.gift?.isGift && details.gift.recipientEmail) {
          try {
            const expiresAt = new Date()
            expiresAt.setMonth(expiresAt.getMonth() + 12)
            const cards: GiftCardEmail[] = []
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rows: any[] = []
            for (const it of orderItems) {
              const qty = Math.max(1, Number(it.quantity) || 1)
              const sessions = Math.max(1, Number(it.sessions) || 1)
              for (let n = 0; n < qty; n++) {
                const code = generateGiftCode()
                cards.push({ code, itemName: it.name, totalSessions: sessions, expiresAt: expiresAt.toISOString() })
                rows.push({
                  code, item_name: it.name, item_slug: it.slug ?? null,
                  amount_cents: Number(it.priceCents ?? Math.round((it.price ?? 0) * 100)) || 0,
                  total_sessions: sessions, sessions_used: 0, status: 'active',
                  purchaser_name: details.name, purchaser_email: details.email,
                  recipient_name: details.gift.recipientName ?? '',
                  recipient_email: details.gift.recipientEmail,
                  message: details.gift.message ?? '',
                  stripe_payment_intent_id: pi.id, expires_at: expiresAt.toISOString(),
                })
              }
            }
            const { error: giftErr } = await supabase.from('gift_cards').insert(rows)
            if (giftErr) console.error('[webhook/stripe] Gift card insert error:', giftErr)
            await sendGiftEmails({
              purchaserName: details.name,
              recipientName: details.gift.recipientName ?? '',
              recipientEmail: details.gift.recipientEmail,
              message: details.gift.message || undefined,
              cards,
            })
          } catch (err) {
            console.error('[webhook/stripe] Failed generating gift cards:', err)
          }
        }

        // ── Emails de confirmación (comprador + clínica) ──
        // Para los cobros de fuera de la web (links de pago, señas) no se manda
        // el email de pedido: Stripe ya envía su recibo y no es una compra de la
        // tienda.
        if (details.email && !external) {
          try {
            await sendOrderEmails({
              orderRef: pi.id.replace('pi_', '').slice(-8).toUpperCase(),
              customerName: details.name,
              customerEmail: details.email,
              items: orderItems.map((i: { name: string; vol?: string; quantity?: number; priceCents?: number; price?: number }) => ({
                name: i.name, vol: i.vol,
                quantity: Number(i.quantity) || 1,
                priceCents: Number(i.priceCents ?? Math.round((i.price ?? 0) * 100)) || 0,
              })),
              subtotalCents: details.subtotalCents,
              shippingCents: details.shippingCents,
              discountCents: details.discountCents,
              couponCode: details.couponCode || undefined,
              totalCents: pi.amount,
              address: details.address, city: details.city,
              postalCode: details.postalCode, country: details.country,
              deliveryMethod: details.deliveryMethod,
              phone: details.phone || undefined,
            })
          } catch (err) {
            console.error('[webhook/stripe] Failed sending order emails:', err)
          }
        } else if (!external) {
          console.error('[webhook/stripe] Pedido sin email de cliente. PI:', pi.id)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
