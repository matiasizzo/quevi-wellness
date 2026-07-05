'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/lib/shipping'

function priceFmt(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}

export default function CartDrawer() {
  const { items, count, total, coupon, setCoupon, isOpen, closeCart, removeItem, updateQty } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD_CENTS / 100
  const remainingForFree = Math.max(0, freeShippingThreshold - total)
  const shippingProgress = Math.min(100, (total / freeShippingThreshold) * 100)
  const discount = coupon ? (total * coupon.percent) / 100 : 0

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault()
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput }),
      })
      const data = await res.json()
      if (data.valid) {
        setCoupon({ code: data.code, percent: data.discountPercent })
        setCouponInput('')
      } else {
        setCouponError(data.error ?? 'Código no válido')
      }
    } catch {
      setCouponError('Error de conexión')
    } finally {
      setCouponLoading(false)
    }
  }

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-carbon-900/40 backdrop-blur-[2px]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 h-full z-[61] flex flex-col bg-cream-100 shadow-2xl"
            style={{ width: 'min(100vw, 440px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-400">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-[20px] font-normal text-carbon-900 m-0">
                  Tu bolsa
                </h2>
                {count > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-600 text-cream-50 text-[10px] font-semibold">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full text-carbon-500 hover:bg-cream-300 hover:text-carbon-900 transition-colors"
                aria-label="Cerrar carrito"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-carbon-300">
                    <path d="M6 7h12l-1 13H7L6 7z" />
                    <path d="M9 7a3 3 0 0 1 6 0" />
                  </svg>
                  <p className="text-[15px] text-carbon-500 leading-[1.6]">Tu bolsa está vacía.<br />Añade productos de la tienda.</p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-600 text-cream-50 text-[13px] font-medium transition-all hover:bg-brand-700"
                  >
                    Ir a la tienda
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col divide-y divide-cream-400 px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex gap-4 py-5"
                      >
                        {/* Image */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                          {item.image_url ? (
                            <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="w-1 h-8 rounded-full" style={{ background: item.stripe }} />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <span className="text-[11px] tracking-[0.14em] uppercase font-medium" style={{ color: item.stripe }}>
                            Dall&apos;O Skin
                          </span>
                          <h3 className="font-serif text-[15px] text-carbon-900 leading-[1.3] m-0 truncate">
                            {item.name}
                          </h3>
                          <span className="text-[12px] text-carbon-400">{item.vol}</span>

                          <div className="flex items-center justify-between mt-1">
                            {/* Qty stepper */}
                            <div className="inline-flex items-center gap-0 rounded-full border border-cream-400 overflow-hidden">
                              <button
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-carbon-500 hover:bg-cream-300 transition-colors text-[16px] leading-none"
                                aria-label="Quitar uno"
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-[13px] font-medium text-carbon-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-carbon-500 hover:bg-cream-300 transition-colors text-[16px] leading-none"
                                aria-label="Añadir uno"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-serif text-[15px] text-carbon-900 font-medium">
                                {item.price > 0 ? priceFmt(item.price * item.quantity) : 'Consultar'}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-carbon-300 hover:text-terra-500 transition-colors"
                                aria-label="Eliminar producto"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M6 18 18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-400 px-6 py-5 flex flex-col gap-4">
                {/* Free shipping progress */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[12px] text-carbon-500 leading-[1.4] m-0">
                    {remainingForFree > 0 ? (
                      <>Te faltan <strong className="text-brand-700">{priceFmt(remainingForFree)}</strong> para el envío gratuito</>
                    ) : (
                      <strong className="text-brand-700">🎉 ¡Tienes envío gratuito!</strong>
                    )}
                  </p>
                  <div className="h-1.5 rounded-full bg-cream-400 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-brand-600"
                      initial={false}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                {/* Coupon */}
                {coupon ? (
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-brand-50 border border-brand-200">
                    <span className="text-[12px] text-brand-700">
                      <strong>{coupon.code}</strong> · −{coupon.percent}%
                    </span>
                    <button
                      onClick={() => setCoupon(null)}
                      className="text-[11px] text-carbon-400 underline underline-offset-2 hover:text-carbon-700 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={applyCoupon} className="flex flex-col gap-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null) }}
                        placeholder="Código de descuento"
                        className="flex-1 border border-cream-400 bg-cream-50 rounded-full px-4 py-2 text-[12px] text-carbon-900 placeholder:text-carbon-400 outline-none focus:border-brand-500 transition-colors uppercase tracking-[0.06em]"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 rounded-full border border-carbon-300 text-[11px] font-medium text-carbon-700 hover:border-brand-600 hover:text-brand-600 transition-colors disabled:opacity-40"
                      >
                        {couponLoading ? '...' : 'Aplicar'}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-600 m-0">{couponError}</p>}
                  </form>
                )}

                {/* Totals */}
                {coupon && discount > 0 && (
                  <div className="flex justify-between items-baseline -mb-2">
                    <span className="text-[12px] text-brand-700">Descuento ({coupon.code})</span>
                    <span className="text-[13px] text-brand-700">−{priceFmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-[13px] text-carbon-500 tracking-[0.04em]">Subtotal</span>
                  <span className="font-serif text-[20px] text-carbon-900 font-normal">
                    {total > 0 ? priceFmt(Math.max(0, total - discount)) : 'Precio a consultar'}
                  </span>
                </div>
                <p className="text-[11px] text-carbon-400 leading-[1.5] -mt-1">
                  Impuestos incluidos. Envío calculado al finalizar la compra.
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-brand-600 text-cream-50 font-medium text-[14px] tracking-[0.02em] transition-all hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.98] will-change-transform"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                >
                  Finalizar compra
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <button
                  onClick={closeCart}
                  className="text-[12px] text-carbon-400 tracking-[0.08em] uppercase hover:text-carbon-700 transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
