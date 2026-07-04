'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cartContext'
import Navbar from '@/components/Navbar'

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-600">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="font-serif text-[36px] font-normal text-carbon-900 mb-4">
            ¡Pedido confirmado!
          </h1>
          <p className="text-[14px] text-carbon-400 leading-relaxed mb-10">
            Gracias por tu compra. Recibirás un email de confirmación en breve con los detalles de tu pedido.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/shop"
              className="w-full bg-brand-600 text-cream-50 text-[12px] tracking-[0.2em] uppercase py-4 rounded-full hover:bg-brand-700 transition-colors text-center block"
            >
              Seguir comprando
            </Link>
            <Link
              href="/cuenta/pedidos"
              className="w-full border border-cream-400 text-[12px] tracking-[0.2em] uppercase py-4 rounded-full hover:border-brand-400 transition-colors text-center block text-carbon-900"
            >
              Ver mis pedidos
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
