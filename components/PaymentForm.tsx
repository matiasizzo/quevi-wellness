'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/lib/cartContext'
import { formatPrice } from '@/lib/format'
import { getShippingCents } from '@/lib/shipping'
import { couponDiscountCents } from '@/lib/discount'
import QueviLogo from '@/components/QueviLogo'
import type { ShippingDetails } from '@/app/checkout/page'

interface Props {
  clientSecret: string
  shipping: ShippingDetails
  onEditShipping: () => void
  totalCentsFromServer: number
}

export default function PaymentForm({ clientSecret, shipping, onEditShipping, totalCentsFromServer }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { items, coupon } = useCart()
  const [error, setError] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * 100 * i.quantity, 0))
  const shippingCents = getShippingCents(subtotal)
  const discountCents = coupon ? couponDiscountCents(items, coupon.percent, coupon.scope ?? 'all', coupon.appliesTo) : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setPaying(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message ?? 'Error al validar los datos de la tarjeta')
        setPaying(false)
        return
      }

      // redirect: 'if_required' keeps us on this page (and in control of navigation)
      // whenever Stripe doesn't strictly need a redirect (e.g. plain card payments).
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: shipping.name,
              email: shipping.email,
              phone: shipping.phone || undefined,
              address: { line1: shipping.address, line2: '', city: shipping.city, state: '', postal_code: shipping.postalCode, country: shipping.country },
            },
          },
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        console.error('[stripe] confirmPayment error:', confirmError)
        setError(confirmError.message ?? 'Error al confirmar el pago')
        setPaying(false)
        return
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
        router.push('/checkout/success')
        return
      }

      // Any other status (requires_action, etc.) — Stripe already redirected
      // the customer for extra steps (3D Secure) if it was needed.
      setPaying(false)
    } catch (err) {
      console.error('[stripe] Unexpected error confirming payment:', err)
      setError('Ocurrió un error inesperado al procesar el pago. Revisa la consola o inténtalo de nuevo.')
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row">

      {/* LEFT: payment form */}
      <div className="flex-1 px-6 py-10 lg:px-14 lg:py-16 lg:max-w-2xl">
        <Link href="/" className="block mb-10">
          <QueviLogo variant="dark" width={110} height={38} />
        </Link>

        <div className="flex items-center gap-2 mb-8 text-[10px] tracking-[0.2em] uppercase">
          <button onClick={onEditShipping} className="text-carbon-400 hover:text-carbon-900 transition-colors">Envío</button>
          <span className="text-carbon-300">›</span>
          <span className="text-carbon-900 font-medium">Pago</span>
        </div>

        <div className="border border-cream-400 rounded-lg divide-y divide-cream-400 mb-8 text-sm">
          <div className="flex justify-between px-4 py-3 text-carbon-400">
            <span>Contacto</span>
            <span className="text-carbon-900">{shipping.email}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-carbon-400">
            <span>Envía a</span>
            <span className="text-carbon-900 text-right">{shipping.address}, {shipping.city} {shipping.postalCode}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-carbon-400">
            <span>Método</span>
            <span className="text-carbon-900">Estándar</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="font-serif text-[24px] font-normal text-carbon-900 mb-2">Pago</h2>
          <p className="text-[12px] text-carbon-400 -mt-3">Todas las transacciones son seguras y están encriptadas.</p>

          <PaymentElement options={{ layout: 'tabs', fields: { billingDetails: 'never' } }} />

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          <button
            type="submit"
            disabled={!stripe || !elements || paying}
            className="w-full rounded-full bg-brand-600 text-cream-50 text-[12px] tracking-[0.2em] uppercase py-4 hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {paying ? 'Procesando...' : `Pagar ${formatPrice(totalCentsFromServer)}`}
          </button>

          <p className="text-[10px] text-carbon-400 text-center">Pago seguro gestionado por Stripe</p>
        </form>
      </div>

      {/* RIGHT: order summary */}
      <div className="lg:w-[420px] bg-cream-200 border-t lg:border-t-0 lg:border-l border-cream-400 px-6 py-10 lg:px-10 lg:py-16">
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <div className="relative w-16 h-16 flex-shrink-0 bg-cream-300 overflow-hidden rounded-lg">
                {item.image_url && (
                  <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                )}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-600 text-cream-50 text-[9px] flex items-center justify-center leading-none">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 flex justify-between items-start">
                <div>
                  <p className="text-sm text-carbon-900">{item.name}</p>
                  <p className="text-[12px] text-carbon-400">{item.vol}</p>
                </div>
                <p className="text-sm text-carbon-900 ml-4">{formatPrice(item.price * 100 * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-cream-400 space-y-3">
          <div className="flex justify-between text-sm text-carbon-400">
            <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
          </div>
          {coupon && discountCents > 0 && (
            <div className="flex justify-between text-sm text-brand-600">
              <span>{coupon.code} (−{coupon.percent}%)</span>
              <span>−{formatPrice(discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-carbon-400">
            <span>Envío</span>
            <span>{shippingCents === 0 ? <span className="text-brand-600">Gratis</span> : formatPrice(shippingCents)}</span>
          </div>
          <div className="flex justify-between text-base text-carbon-900 pt-3 border-t border-cream-400 font-medium">
            <span>Total</span>
            <div className="text-right">
              <span className="text-[12px] text-carbon-400 mr-1">EUR</span>
              <span>{formatPrice(totalCentsFromServer)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
