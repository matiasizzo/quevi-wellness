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
          name: name ?? '', email: customerEmail, phone: phone ?? null,
          service: service ?? '', appointment_date: appointment_date ?? '',
          appointment_time: appointment_time ?? '', notes: notes ?? null,
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
      const { data: existing } = await supabase
        .from('orders').select('id')
        .eq('stripe_payment_intent_id', pi.id).maybeSingle()

      if (!existing) {
        const { error } = await supabase.from('orders').insert({
          status: 'paid',
          subtotal_cents: Number(meta.subtotal_cents ?? 0),
          shipping_cents: Number(meta.shipping_cents ?? 0),
          total_cents: pi.amount,
          stripe_payment_intent_id: pi.id,
          shipping_address: {
            name: meta.shipping_name ?? '',
            email: meta.shipping_email ?? '',
            phone: meta.shipping_phone ?? '',
            address: meta.shipping_address ?? '',
            city: meta.shipping_city ?? '',
            postalCode: meta.shipping_postal_code ?? '',
            country: meta.shipping_country ?? '',
            items,
          },
        })
        if (error) console.error('[webhook/stripe] Order insert error:', error)

        // ── Contador de usos del cupón (permite medir promos y aplicar max_uses) ──
        if (meta.coupon_code) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: dc } = await (supabase as any)
              .from('discount_codes').select('uses').eq('code', meta.coupon_code).maybeSingle()
            if (dc) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (supabase as any)
                .from('discount_codes')
                .update({ uses: (dc.uses ?? 0) + 1 })
                .eq('code', meta.coupon_code)
            }
          } catch (e) {
            console.error('[webhook/stripe] Coupon uses increment error:', e)
          }
        }

        // ── Vales regalo: generar un código por unidad y avisar al destinatario ──
        if (meta.is_gift === '1' && meta.gift_recipient_email) {
          try {
            const expiresAt = new Date()
            expiresAt.setMonth(expiresAt.getMonth() + 12)

            const cards: GiftCardEmail[] = []
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rows: any[] = []

            for (const it of items) {
              const qty = Math.max(1, Number(it.quantity) || 1)
              const sessions = Math.max(1, Number(it.sessions) || 1)
              for (let n = 0; n < qty; n++) {
                const code = generateGiftCode()
                cards.push({ code, itemName: it.name, totalSessions: sessions, expiresAt: expiresAt.toISOString() })
                rows.push({
                  code,
                  item_name: it.name,
                  item_slug: it.slug ?? null,
                  amount_cents: Number(it.priceCents) || 0,
                  total_sessions: sessions,
                  sessions_used: 0,
                  status: 'active',
                  purchaser_name: meta.shipping_name ?? '',
                  purchaser_email: meta.shipping_email ?? '',
                  recipient_name: meta.gift_recipient_name ?? '',
                  recipient_email: meta.gift_recipient_email,
                  message: meta.gift_message ?? '',
                  stripe_payment_intent_id: pi.id,
                  expires_at: expiresAt.toISOString(),
                })
              }
            }

            const { error: giftErr } = await supabase.from('gift_cards').insert(rows)
            if (giftErr) console.error('[webhook/stripe] Gift card insert error:', giftErr)

            await sendGiftEmails({
              purchaserName: meta.shipping_name ?? '',
              recipientName: meta.gift_recipient_name ?? '',
              recipientEmail: meta.gift_recipient_email,
              message: meta.gift_message || undefined,
              cards,
            })
          } catch (err) {
            console.error('[webhook/stripe] Failed generating gift cards:', err)
          }
        }

        // Emails de confirmación (comprador + clínica) — solo en pedidos nuevos
        if (meta.shipping_email) {
          try {
            await sendOrderEmails({
              orderRef: pi.id.replace('pi_', '').slice(-8).toUpperCase(),
              customerName: meta.shipping_name ?? '',
              customerEmail: meta.shipping_email,
              items,
              subtotalCents: Number(meta.subtotal_cents ?? 0),
              shippingCents: Number(meta.shipping_cents ?? 0),
              discountCents: Number(meta.discount_cents ?? 0),
              couponCode: meta.coupon_code || undefined,
              totalCents: pi.amount,
              address: meta.shipping_address ?? '',
              city: meta.shipping_city ?? '',
              postalCode: meta.shipping_postal_code ?? '',
              country: meta.shipping_country ?? '',
              phone: meta.shipping_phone || undefined,
            })
          } catch (err) {
            console.error('[webhook/stripe] Failed sending order emails:', err)
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
