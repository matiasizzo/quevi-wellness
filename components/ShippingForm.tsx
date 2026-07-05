'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { formatPrice } from '@/lib/format'
import { getShippingCents } from '@/lib/shipping'
import QueviLogo from '@/components/QueviLogo'
import type { ShippingDetails } from '@/app/checkout/page'

interface Props {
  onConfirmed: (details: ShippingDetails) => void
  loading: boolean
  error: string | null
}

export default function ShippingForm({ onConfirmed, loading, error }: Props) {
  const { items, coupon } = useCart()
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * 100 * i.quantity, 0))
  const shippingCents = getShippingCents(subtotal)
  const discountCents = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0
  const total = Math.max(0, subtotal + shippingCents - discountCents)

  const [form, setForm] = useState<ShippingDetails>({
    name: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'ES',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onConfirmed(form)
  }

  const inputClass = 'w-full border border-cream-400 bg-cream-50 rounded-lg px-4 py-3 text-sm text-carbon-900 placeholder:text-carbon-400 focus:outline-none focus:border-brand-600 transition-colors'

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row">

      {/* LEFT: form */}
      <div className="flex-1 px-6 py-10 lg:px-14 lg:py-16 lg:max-w-2xl">
        <Link href="/" className="block mb-10">
          <QueviLogo variant="dark" width={110} height={38} />
        </Link>

        <div className="flex items-center gap-2 mb-8 text-[10px] tracking-[0.2em] uppercase">
          <span className="text-carbon-900 font-medium">Envío</span>
          <span className="text-carbon-300">›</span>
          <span className="text-carbon-400">Pago</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-serif text-[24px] font-normal text-carbon-900 mb-2">Contacto</h2>

          <input name="email" type="email" required value={form.email} onChange={handleChange}
            placeholder="Correo electrónico" className={inputClass} />

          <h2 className="font-serif text-[24px] font-normal text-carbon-900 pt-4 mb-2">Entrega</h2>

          <select name="country" required value={form.country} onChange={handleChange} className={inputClass}>
            <option value="ES">España</option>
            <option value="PT">Portugal</option>
            <option value="FR">Francia</option>
            <option value="DE">Alemania</option>
            <option value="IT">Italia</option>
            <option value="GB">Reino Unido</option>
            <option value="US">Estados Unidos</option>
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input name="name" required value={form.name} onChange={handleChange}
              placeholder="Nombre completo" className={inputClass} />
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              placeholder="Teléfono" className={inputClass} />
          </div>

          <input name="address" required value={form.address} onChange={handleChange}
            placeholder="Dirección" className={inputClass} />

          <div className="grid grid-cols-2 gap-3">
            <input name="postalCode" required value={form.postalCode} onChange={handleChange}
              placeholder="Código postal" className={inputClass} />
            <input name="city" required value={form.city} onChange={handleChange}
              placeholder="Ciudad" className={inputClass} />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 text-cream-50 text-[12px] tracking-[0.2em] uppercase py-4 hover:bg-brand-700 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Procesando...' : 'Continuar al pago'}
          </button>
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
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
