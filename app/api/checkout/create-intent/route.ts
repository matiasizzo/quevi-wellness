import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import { getShippingCents } from '@/lib/shipping'
import { couponDiscountCents } from '@/lib/discount'
import type { CartItem } from '@/lib/cartContext'

interface ShippingDetails {
  name: string
  email: string
  phone?: string
  address: string
  city: string
  postalCode: string
  country: string
  deliveryMethod?: 'ship' | 'pickup'
}

interface GiftDetails {
  isGift: boolean
  recipientName: string
  recipientEmail: string
  message: string
}

/**
 * Stripe limita cada valor de metadata a 500 caracteres (y 50 claves).
 * La lista de artículos supera ese límite a partir de 3 productos, así que la
 * partimos en fragmentos items_0, items_1… y el webhook la recompone.
 */
const META_CHUNK = 450
const MAX_CHUNKS = 20

function chunkItemsMetadata(json: string): Record<string, string> {
  const meta: Record<string, string> = {}
  const chunks: string[] = []
  for (let i = 0; i < json.length; i += META_CHUNK) chunks.push(json.slice(i, i + META_CHUNK))
  if (chunks.length > MAX_CHUNKS) {
    // Carrito enorme: guardamos lo que cabe y dejamos constancia
    meta.items_truncated = '1'
    chunks.length = MAX_CHUNKS
  }
  chunks.forEach((c, i) => { meta[`items_${i}`] = c })
  meta.items_parts = String(chunks.length)
  return meta
}

export async function POST(req: NextRequest) {
  try {
  const { items, shippingDetails, couponCode, gift } = await req.json() as {
    items: CartItem[]
    shippingDetails: ShippingDetails
    couponCode?: string
    gift?: GiftDetails
  }

  if (!items?.length) {
    return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
  }

  const subtotalCents = Math.round(
    items.reduce((sum, i) => sum + Math.round((Number(i.price) || 0) * 100) * (Number(i.quantity) || 1), 0)
  )

  if (!subtotalCents || subtotalCents < 50) {
    return NextResponse.json({ error: `Importe inválido: ${subtotalCents} céntimos.` }, { status: 400 })
  }

  // Recoger en tienda no tiene coste de envío. Es un regalo → tampoco se envía.
  const isPickup = shippingDetails?.deliveryMethod === 'pickup'
  const shippingCents = (isPickup || gift?.isGift) ? 0 : getShippingCents(subtotalCents)

  // Cupón — se revalida SIEMPRE en servidor, nunca se confía en el % del cliente
  let discountCents = 0
  let appliedCoupon = ''
  if (couponCode?.trim()) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key, { auth: { persistSession: false } })
      const { data } = await supabase
        .from('discount_codes')
        .select('code, discount_percent, max_uses, uses, scope, applies_to_slugs')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .single()

      if (data && (data.max_uses === null || data.uses < data.max_uses)) {
        const scope = data.scope === 'products' ? 'products' : 'all'
        discountCents = couponDiscountCents(items, data.discount_percent, scope, data.applies_to_slugs)
        appliedCoupon = data.code
      }
    }
  }

  const totalCents = Math.max(50, subtotalCents + shippingCents - discountCents)

  const stripe = getStripe()
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
    metadata: {
      ...chunkItemsMetadata(JSON.stringify(
        items.map((i) => ({
          slug: i.slug,
          name: i.name,
          vol: i.vol,
          priceCents: Math.round(i.price * 100),
          quantity: i.quantity,
          sessions: i.sessions ?? 1,
        }))
      )),
      subtotal_cents: String(subtotalCents),
      shipping_cents: String(shippingCents),
      discount_cents: String(discountCents),
      coupon_code: appliedCoupon,
      shipping_name: shippingDetails.name,
      shipping_email: shippingDetails.email,
      shipping_phone: shippingDetails.phone ?? '',
      shipping_address: shippingDetails.address,
      shipping_city: shippingDetails.city,
      shipping_postal_code: shippingDetails.postalCode,
      shipping_country: shippingDetails.country,
      // Regalo
      is_gift: gift?.isGift ? '1' : '0',
      gift_recipient_name: gift?.isGift ? (gift.recipientName ?? '') : '',
      gift_recipient_email: gift?.isGift ? (gift.recipientEmail ?? '') : '',
      gift_message: gift?.isGift ? (gift.message ?? '').slice(0, 480) : '',
    },
  })

  // ── Guardar el pedido YA, como 'pending' ───────────────────────────────────
  // La base de datos es la fuente de verdad: el webhook solo lo marcará pagado.
  // Así los datos del cliente y los artículos nunca dependen de los límites de
  // metadata de Stripe (500 caracteres por valor).
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && serviceKey) {
      const db = createClient(url, serviceKey, { auth: { persistSession: false } })
      const { error: insertErr } = await db.from('orders').insert({
        status: 'pending',
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        stripe_payment_intent_id: paymentIntent.id,
        shipping_address: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          phone: shippingDetails.phone ?? '',
          address: shippingDetails.address,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
          deliveryMethod: isPickup ? 'pickup' : 'ship',
          items: items.map((i) => ({
            slug: i.slug,
            name: i.name,
            vol: i.vol,
            price: i.price,
            priceCents: Math.round(i.price * 100),
            quantity: i.quantity,
            sessions: i.sessions ?? 1,
          })),
          couponCode: appliedCoupon || null,
          discountCents,
          gift: gift?.isGift
            ? {
                isGift: true,
                recipientName: gift.recipientName ?? '',
                recipientEmail: gift.recipientEmail ?? '',
                message: gift.message ?? '',
              }
            : null,
        },
      })
      if (insertErr) console.error('[create-intent] No se pudo guardar el pedido:', insertErr)
    } else {
      console.warn('[create-intent] SUPABASE_SERVICE_ROLE_KEY no configurada — pedido no guardado')
    }
  } catch (e) {
    // Nunca bloquear el pago porque falle el guardado previo
    console.error('[create-intent] Error guardando el pedido:', e)
  }

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    totalCents,
    shippingCents,
    discountCents,
  })
  } catch (err) {
    // Nunca devolver un cuerpo vacío: el cliente hace res.json() y necesita el motivo
    const message = err instanceof Error ? err.message : 'Error inesperado'
    console.error('[create-intent] Error:', err)
    return NextResponse.json(
      { error: `No se pudo iniciar el pago: ${message}` },
      { status: 500 },
    )
  }
}
