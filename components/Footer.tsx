'use client'

import { useState } from 'react'
import Link from 'next/link'
import QueviLogo from '@/components/QueviLogo'
import { SITE } from '@/content'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-carbon-900 text-cream-100 pt-16 pb-0">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9">
        {/* Top grid */}
        <div className="grid gap-10 lg:gap-[60px] pb-[50px] grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Newsletter col */}
          <div>
            <QueviLogo variant="light" width={170} height={60} className="mb-3 -ml-1" />
            <p className="text-[13px] mb-[22px] max-w-[380px] leading-[1.6]" style={{ color: 'rgba(245,242,236,0.65)' }}>
              Una vez al mes, un texto largo. Sin descuentos, sin urgencia. Solo ciencia que se entiende y rituales que se sostienen.
            </p>
            {status === 'ok' ? (
              <p className="text-[13px] max-w-[460px] leading-[1.6] m-0 px-[22px] py-3 rounded-full" style={{ color: '#adc5af', border: '1px solid rgba(173,197,175,0.4)' }}>
                ✓ ¡Listo! Te has suscrito correctamente.
              </p>
            ) : (
              <>
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-[460px]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="flex-1 bg-transparent rounded-full px-[22px] py-3 font-sans text-[13px] text-cream-100 outline-none transition-colors duration-200"
                    style={{
                      border: '1px solid rgba(245,242,236,0.32)',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#f9f7f3' }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(245,242,236,0.32)' }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-cream-100 text-carbon-900 border border-cream-100 rounded-full px-[26px] py-3 text-[13px] font-medium transition-all duration-[250ms] hover:bg-transparent hover:text-cream-100 disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Enviando…' : 'Suscribirme'}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="text-[12px] mt-2 m-0" style={{ color: '#e0a98e' }}>
                    No se pudo completar la suscripción. Inténtalo de nuevo.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Explora */}
          <div>
            <h5 className="font-sans font-medium text-[11px] tracking-[0.22em] uppercase m-0 mb-5 text-cream-100">
              Explora
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {[
                { label: 'Tienda', href: '/shop' },
                { label: 'Tratamientos', href: '/tratamientos' },
                { label: 'Rituales de Firma', href: '/rituales' },
                { label: 'Reservar cita', href: '/#booking' },
                { label: 'Mi cuenta', href: '/cuenta' },
                { label: 'Journal', href: '/blog' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] transition-colors duration-[250ms] hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.72)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h5 className="font-sans font-medium text-[11px] tracking-[0.22em] uppercase m-0 mb-5 text-cream-100">
              Contacto
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-3 text-[13px]" style={{ color: 'rgba(245,242,236,0.72)' }}>
              <li>
                <a href={`https://wa.me/${SITE.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="transition-colors duration-[250ms] hover:text-cream-100">
                  {SITE.phone} · WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="transition-colors duration-[250ms] hover:text-cream-100">
                  {SITE.email}
                </a>
              </li>
              <li className="leading-[1.6]">{SITE.address}</li>
              <li>Lun – Vie · 09:00 – 20:00</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Minimal brand mark */}
      <div className="max-w-[1600px] mx-auto mt-2 mb-8 flex flex-col items-center justify-center gap-5 select-none px-6">
        <span className="block w-14 h-px" style={{ background: 'rgba(245,242,236,0.22)' }} />
        <QueviLogo variant="light" width={190} height={66} />
        <p className="text-[11px] leading-[1.7] text-center max-w-[640px] m-0" style={{ color: 'rgba(245,242,236,0.45)' }}>
          QUEVI WELLNESS CLINIC SL es un centro médico con unidad de estética, distribuidor
          autorizado de los productos Dall&apos;O Skin y aplicador oficial de los protocolos
          Dall&apos;O Selfcare bajo contrato de gerenciamiento. Las marcas Dall&apos;O pertenecen
          a sus respectivos titulares. La compra de productos es independiente de la
          contratación de servicios médicos.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9">
        <div
          className="flex flex-col sm:flex-row justify-between items-center py-[26px] gap-4 sm:gap-6"
          style={{ borderTop: '1px solid rgba(245,242,236,0.12)' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="text-[11px] tracking-[0.02em]" style={{ color: 'rgba(245,242,236,0.55)' }}>
              © 2026 QUEVI WELLNESS CLINIC SL · NIF B88657044
            </span>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              {[
                { label: 'Privacidad', href: '/privacidad' },
                { label: 'Cookies', href: '/politica-cookies' },
                { label: 'Aviso legal', href: '/aviso-legal' },
                { label: 'Términos de compra', href: '/terminos' },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-[11px] underline underline-offset-2 transition-colors hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.55)' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {['VISA', 'MASTERCARD', 'AMEX', 'APPLE PAY', 'BIZUM'].map((p) => (
              <span key={p} className="px-[10px] py-1 rounded-[6px] text-[10px] tracking-[0.12em]" style={{ background: 'rgba(245,242,236,0.08)', color: 'rgba(245,242,236,0.65)' }}>
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-[14px]">
            <a href="https://www.instagram.com/queviwellness" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors duration-200 hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.55)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="https://www.facebook.com/queviwellness" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition-colors duration-200 hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.55)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M14 9h3V6h-3a3 3 0 0 0-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
