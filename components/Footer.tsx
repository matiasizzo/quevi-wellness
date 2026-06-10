'use client'

import { useState } from 'react'
import Link from 'next/link'
import QueviLogo from '@/components/QueviLogo'

export default function Footer() {
  const [email, setEmail] = useState('')

  return (
    <footer className="bg-carbon-900 text-cream-100 pt-20 pb-0">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9">
        {/* Top grid */}
        <div className="grid gap-10 sm:gap-[40px] lg:gap-[60px] pb-[60px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Newsletter col */}
          <div>
            <QueviLogo variant="light" width={170} height={60} className="mb-3 -ml-1" />
            <p className="text-[13px] mb-[22px] max-w-[380px] leading-[1.6]" style={{ color: 'rgba(245,242,236,0.65)' }}>
              Una vez al mes, un texto largo. Sin descuentos, sin urgencia. Solo ciencia que se entiende y rituales que se sostienen.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); setEmail('') }} className="flex gap-2 max-w-[460px]">
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
                className="bg-cream-100 text-carbon-900 border border-cream-100 rounded-full px-[26px] py-3 text-[13px] font-medium transition-all duration-[250ms] hover:bg-transparent hover:text-cream-100"
              >
                Suscribirme
              </button>
            </form>
          </div>

          {/* Tienda */}
          <div>
            <h5 className="font-sans font-medium text-[11px] tracking-[0.22em] uppercase m-0 mb-5 text-cream-100">
              Tienda
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {[
                { label: 'Todos los productos', href: '/shop' },
                { label: 'SHIELD · Bio-Protección', href: '/shop#shield' },
                { label: 'REPAIR · Regeneración', href: '/shop#repair' },
                { label: 'BOOST · Optimización', href: '/shop#boost' },
                { label: 'RESET / SOUL · Equilibrio', href: '/shop#reset' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[13px] transition-colors duration-[250ms] hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.72)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clínica */}
          <div>
            <h5 className="font-sans font-medium text-[11px] tracking-[0.22em] uppercase m-0 mb-5 text-cream-100">
              Clínica
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {[
                { label: 'Diagnóstico BIO-SCAN', href: '/#diagnostico' },
                { label: 'Tratamientos médicos', href: '/tratamientos' },
                { label: 'Rituales de Firma', href: '/rituales' },
                { label: 'Reservar cita', href: '/#booking' },
                { label: 'FAQ', href: '/#faq' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] transition-colors duration-[250ms] hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.72)' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h5 className="font-sans font-medium text-[11px] tracking-[0.22em] uppercase m-0 mb-5 text-cream-100">
              Ayuda
            </h5>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {[
                { label: 'Envíos y devoluciones', href: '#' },
                { label: 'Suscripciones', href: '#' },
                { label: 'Mi cuenta', href: '#' },
                { label: 'Contacto', href: '/#booking' },
                { label: '+34 900 000 000', href: 'tel:+34900000000' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] transition-colors duration-[250ms] hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.72)' }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Large QUEVI watermark — hidden on small mobile to avoid overflow */}
      <div className="hidden sm:flex max-w-[1600px] mx-auto mt-[30px] items-end justify-center overflow-hidden select-none relative">
        <span
          className="font-serif font-normal text-brand-700 leading-[0.82] tracking-[0.02em]"
          style={{ fontSize: 'clamp(160px, 26vw, 420px)' }}
        >
          QUEVI
        </span>
        <span
          className="absolute font-serif italic text-brand-300 font-normal tracking-[0.04em]"
          style={{ bottom: '18%', right: '8%', fontSize: 'clamp(20px, 2vw, 32px)' }}
        >
          QUEVI
        </span>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9">
        <div
          className="flex flex-col sm:flex-row justify-between items-center py-[26px] gap-4 sm:gap-6"
          style={{ borderTop: '1px solid rgba(245,242,236,0.12)' }}
        >
          <span className="text-[11px] tracking-[0.02em]" style={{ color: 'rgba(245,242,236,0.55)' }}>
            © 2026 QUEVI Wellness Clinic · Cosmética médica de precisión · Todos los derechos reservados.
          </span>
          <div className="flex gap-2">
            {['VISA', 'MASTERCARD', 'AMEX', 'APPLE PAY', 'BIZUM'].map((p) => (
              <span key={p} className="px-[10px] py-1 rounded-[6px] text-[10px] tracking-[0.12em]" style={{ background: 'rgba(245,242,236,0.08)', color: 'rgba(245,242,236,0.65)' }}>
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-[14px]">
            <a href="#" aria-label="Instagram" className="transition-colors duration-200 hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.55)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="transition-colors duration-200 hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.55)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M14 9h3V6h-3a3 3 0 0 0-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9z" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="transition-colors duration-200 hover:text-cream-100" style={{ color: 'rgba(245,242,236,0.55)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M16 4c0 3 2 5 5 5v3a8 8 0 0 1-5-2v7a6 6 0 1 1-6-6v3a3 3 0 1 0 3 3V4h3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
