'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { formatPrice } from '@/lib/format'
import { getShippingCents } from '@/lib/shipping'
import { couponDiscountCents } from '@/lib/discount'
import QueviLogo from '@/components/QueviLogo'
import type { ShippingDetails, GiftDetails } from '@/app/checkout/page'

interface Props {
  onConfirmed: (details: ShippingDetails, gift: GiftDetails) => void
  loading: boolean
  error: string | null
}

export default function ShippingForm({ onConfirmed, loading, error }: Props) {
  const { items, coupon } = useCart()
  const [pickup, setPickup] = useState(false)
  const subtotal = Math.round(items.reduce((sum, i) => sum + i.price * 100 * i.quantity, 0))
  // Recoger en tienda: sin coste de envío
  const shippingCents = pickup ? 0 : getShippingCents(subtotal)
  const discountCents = coupon ? couponDiscountCents(items, coupon.percent, coupon.scope ?? 'all', coupon.appliesTo) : 0
  const total = Math.max(0, subtotal + shippingCents - discountCents)

  const [form, setForm] = useState<ShippingDetails>({
    name: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'ES',
  })
  const [gift, setGift] = useState<GiftDetails>({
    isGift: false, recipientName: '', recipientEmail: '', message: '',
  })
  // La dirección solo es obligatoria si es envío a domicilio y no es regalo
  const addressRequired = !gift.isGift && !pickup

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGiftChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setGift((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onConfirmed({ ...form, deliveryMethod: pickup ? 'pickup' : 'ship' }, gift)
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

          {/* Gift toggle */}
          <label
            className="flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors mt-1"
            style={{
              borderColor: gift.isGift ? '#355539' : '#ddd8cc',
              background: gift.isGift ? 'rgba(213,226,214,0.35)' : '#fdfcfa',
            }}
          >
            <input
              type="checkbox"
              checked={gift.isGift}
              onChange={(e) => setGift((prev) => ({ ...prev, isGift: e.target.checked }))}
              className="mt-0.5 accent-brand-600 w-4 h-4"
            />
            <span className="flex-1">
              <span className="text-sm font-medium text-carbon-900 flex items-center gap-1.5">
                🎁 Es un regalo
              </span>
              <span className="block text-[12px] text-carbon-500 mt-0.5">
                Enviaremos un vale con un código único a la persona que elijas. Podrá canjearlo en clínica.
              </span>
            </span>
          </label>

          {gift.isGift && (
            <div className="space-y-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4">
              <p className="text-[11px] tracking-[0.14em] uppercase text-brand-700 font-medium">Datos del destinatario</p>
              <input name="recipientName" required value={gift.recipientName} onChange={handleGiftChange}
                placeholder="Nombre de quien recibe el regalo" className={inputClass} />
              <input name="recipientEmail" type="email" required value={gift.recipientEmail} onChange={handleGiftChange}
                placeholder="Email de quien recibe el regalo" className={inputClass} />
              <textarea name="message" value={gift.message} onChange={handleGiftChange} rows={3}
                placeholder="Mensaje personal (opcional)" className={inputClass + ' resize-none'} />
            </div>
          )}

          <h2 className="font-serif text-[24px] font-normal text-carbon-900 pt-4 mb-2">
            {gift.isGift ? 'Datos de facturación' : 'Entrega'}
          </h2>

          {/* Método de entrega — oculto en regalos (los vales son digitales) */}
          {!gift.isGift && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPickup(false)}
                className="text-left rounded-xl border p-4 transition-colors"
                style={{
                  borderColor: !pickup ? '#355539' : '#ddd8cc',
                  background: !pickup ? 'rgba(213,226,214,0.35)' : '#fdfcfa',
                }}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-carbon-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  Envío a domicilio
                </span>
                <span className="block text-[12px] text-carbon-500 mt-1">
                  {subtotal >= 5000 ? 'Gratis' : '4,95 € · gratis desde 50 €'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPickup(true)}
                className="text-left rounded-xl border p-4 transition-colors"
                style={{
                  borderColor: pickup ? '#355539' : '#ddd8cc',
                  background: pickup ? 'rgba(213,226,214,0.35)' : '#fdfcfa',
                }}
              >
                <span className="flex items-center gap-2 text-sm font-medium text-carbon-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" /><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                  </svg>
                  Recoger en tienda
                </span>
                <span className="block text-[12px] text-carbon-500 mt-1">Gratis · en la clínica de Estepona</span>
              </button>
            </div>
          )}

          {pickup && !gift.isGift && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4 text-[13px] text-carbon-600 leading-relaxed">
              Recoge tu pedido en <strong className="text-carbon-900">QUEVI Wellness Clinic</strong> — Calle Gibraltar 2, Local Bajo, 29680 Estepona (Málaga).
              Te avisaremos por email cuando esté listo. Horario: Lun–Vie 09:00–20:00.
            </div>
          )}

          {(!pickup || gift.isGift) && (
            <select name="country" required={addressRequired} value={form.country} onChange={handleChange} className={inputClass}>
              <option value="ES">España</option>
              <option value="PT">Portugal</option>
              <option value="FR">Francia</option>
              <option value="DE">Alemania</option>
              <option value="IT">Italia</option>
              <option value="GB">Reino Unido</option>
              <option value="US">Estados Unidos</option>
            </select>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input name="name" required value={form.name} onChange={handleChange}
              placeholder="Tu nombre completo" className={inputClass} />
            <input name="phone" type="tel" required={pickup} value={form.phone} onChange={handleChange}
              placeholder={pickup ? 'Teléfono' : 'Teléfono (opcional)'} className={inputClass} />
          </div>

          {(!pickup || gift.isGift) && (
            <>
              <input name="address" required={addressRequired} value={form.address} onChange={handleChange}
                placeholder={gift.isGift ? 'Dirección (opcional)' : 'Dirección'} className={inputClass} />

              <div className="grid grid-cols-2 gap-3">
                <input name="postalCode" required={addressRequired} value={form.postalCode} onChange={handleChange}
                  placeholder={gift.isGift ? 'Código postal (opcional)' : 'Código postal'} className={inputClass} />
                <input name="city" required={addressRequired} value={form.city} onChange={handleChange}
                  placeholder={gift.isGift ? 'Ciudad (opcional)' : 'Ciudad'} className={inputClass} />
              </div>
            </>
          )}

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
            <span>{pickup ? 'Recogida en tienda' : 'Envío'}</span>
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
