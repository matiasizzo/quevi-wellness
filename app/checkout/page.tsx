'use client'

import { useState } from 'react'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useCart } from '@/lib/cartContext'
import ShippingForm from '@/components/ShippingForm'
import PaymentForm from '@/components/PaymentForm'
import Navbar from '@/components/Navbar'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export interface ShippingDetails {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  /** 'ship' = envío a domicilio · 'pickup' = recoger en clínica */
  deliveryMethod?: 'ship' | 'pickup'
}

export interface GiftDetails {
  isGift: boolean
  recipientName: string
  recipientEmail: string
  message: string
}

export default function CheckoutPage() {
  const { items, coupon } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [shipping, setShipping] = useState<ShippingDetails | null>(null)
  const [serverTotal, setServerTotal] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleShippingConfirmed(details: ShippingDetails, gift: GiftDetails) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingDetails: details, couponCode: coupon?.code, gift }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error del servidor')
      setShipping(details)
      setClientSecret(data.clientSecret)
      setServerTotal(data.totalCents)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  function handleEditShipping() {
    setClientSecret(null)
  }

  if (!items.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center gap-4">
          <p className="font-serif text-[28px] font-normal text-carbon-900">Tu carrito está vacío</p>
          <Link href="/shop" className="text-[12px] tracking-[0.2em] uppercase text-carbon-400 hover:text-carbon-900 transition-colors">
            Ver productos
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-cream-100 min-h-screen">
        {!clientSecret && (
          <ShippingForm onConfirmed={handleShippingConfirmed} loading={loading} error={error} />
        )}

        {clientSecret && shipping && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'flat',
                variables: {
                  colorPrimary: '#355539',
                  colorBackground: '#ffffff',
                  colorText: '#1e1e1e',
                  colorDanger: '#dc2626',
                  fontFamily: 'Inter, sans-serif',
                  borderRadius: '10px',
                  fontSizeBase: '13px',
                },
                rules: {
                  '.Input': { border: '1px solid #ddd8cc', padding: '12px 16px', backgroundColor: '#ffffff' },
                  '.Input:focus': { border: '1px solid #355539', boxShadow: 'none' },
                  '.Label': { fontSize: '11px', letterSpacing: '0.05em', color: '#737373', marginBottom: '6px' },
                  '.Tab': { border: '1px solid #ddd8cc', borderRadius: '10px' },
                  '.Tab--selected': { border: '1px solid #355539' },
                },
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              shipping={shipping}
              onEditShipping={handleEditShipping}
              totalCentsFromServer={serverTotal}
            />
          </Elements>
        )}
      </main>
    </>
  )
}
