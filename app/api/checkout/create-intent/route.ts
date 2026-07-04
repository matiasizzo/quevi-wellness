import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getShippingCents } from '@/lib/shipping'
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

export async function POST(req: NextRequest) {
  const { items, shippingDetails } = await req.json() as {
    items: CartItem[]
    shippingDetails: ShippingDetails
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
  const totalCents = subtotalCents + shippingCents

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
        }))
      ),
      subtotal_cents: String(subtotalCents),
      shipping_cents: String(shippingCents),
      shipping_name: shippingDetails.name,
      shipping_email: shippingDetails.email,
      shipping_phone: shippingDetails.phone ?? '',
      shipping_address: shippingDetails.address,
      shipping_city: shippingDetails.city,
      shipping_postal_code: shippingDetails.postalCode,
      shipping_country: shippingDetails.country,
    },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    totalCents,
    shippingCents,
  })
}
