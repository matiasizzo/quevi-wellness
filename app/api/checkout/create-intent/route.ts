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
}

interface GiftDetails {
  isGift: boolean
  recipientName: string
  recipientEmail: string
  message: string
}

export async function POST(req: NextRequest) {
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

  const shippingCents = getShippingCents(subtotalCents)

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
      items: JSON.stringify(
        items.map((i) => ({
          id: i.id,
          slug: i.slug,
          name: i.name,
          vol: i.vol,
          priceCents: Math.round(i.price * 100),
          quantity: i.quantity,
          sessions: i.sessions ?? 1,
        }))
      ),
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

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    totalCents,
    shippingCents,
    discountCents,
  })
}
