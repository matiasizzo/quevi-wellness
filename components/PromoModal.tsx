'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Banner promocional de bienvenida. Se muestra una vez por sesión del navegador
 * y solo se cierra con la cruz (o Escape). Cambiar PROMO_KEY al lanzar una promo
 * nueva para que vuelva a mostrarse a quien ya la había cerrado.
 */
const PROMO_KEY = 'quevi-promo-verano-2026'
const PROMO_CODE = 'VERANOQUEVI'

const PROMO_ITEMS = [
  {
    name: 'D-Relax Legs',
    desc: 'Piernas ligeras: drenaje, presoterapia y adiós a la pesadez del calor.',
    image: '/images/rituales/cover-piernas-v2.jpg',
    href: '/rituales#ritual-relax-piernas',
    before: 132,
    after: 99,
  },
  {
    name: 'D-Bio Lumina',
    desc: 'Efecto glow: higiene de precisión, Ellegance y fototerapia LED. Bruma incluida.',
    image: '/images/rituales/cover-biolumina.jpg',
    href: '/rituales#ritual-bio-lumina',
    before: 132,
    after: 99,
  },
]

export default function PromoModal() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(PROMO_KEY)) return
    } catch {
      // sessionStorage bloqueado — mostramos igualmente
    }
    // No competir con el banner de cookies: esperamos a que se haya respondido
    const show = () => setOpen(true)
    let timer: ReturnType<typeof setTimeout>
    const poll = setInterval(() => {
      let consent: string | null = null
      try { consent = localStorage.getItem('quevi-cookie-consent') } catch { consent = 'accepted' }
      if (consent) {
        clearInterval(poll)
        timer = setTimeout(show, 700)
      }
    }, 400)
    return () => { clearInterval(poll); clearTimeout(timer) }
  }, [])

  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem(PROMO_KEY, '1') } catch { /* ignore */ }
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* ignore */ }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
          style={{ background: 'rgba(24,26,20,0.62)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[820px] max-h-[90vh] overflow-y-auto rounded-[22px] sm:rounded-[28px] shadow-2xl"
            style={{ background: '#f5f2ec' }}
          >
            {/* Cerrar */}
            <button
              onClick={close}
              aria-label="Cerrar promoción"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
              style={{ background: 'rgba(245,242,236,0.92)', border: '1px solid #ddd8cc' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#23261f" strokeWidth="1.7" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Cabecera */}
            <div className="relative overflow-hidden px-5 sm:px-10 pt-6 pb-5 sm:pt-10 sm:pb-7 text-center" style={{ background: '#355539' }}>
              <div
                className="absolute pointer-events-none"
                style={{ top: '-140px', right: '-90px', width: '380px', height: '380px', borderRadius: '50%', background: 'rgba(233,196,120,0.20)', filter: 'blur(70px)' }}
              />
              <div
                className="absolute pointer-events-none"
                style={{ bottom: '-160px', left: '-80px', width: '340px', height: '340px', borderRadius: '50%', background: 'rgba(196,135,106,0.22)', filter: 'blur(70px)' }}
              />
              <div className="relative">
                <span
                  className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.24em] uppercase mb-2.5 sm:mb-4"
                  style={{ color: '#f5f2ec', background: 'rgba(245,242,236,0.12)', border: '1px solid rgba(245,242,236,0.24)' }}
                >
                  Verano 2026 · Plazas limitadas
                </span>
                <h2
                  id="promo-title"
                  className="font-serif font-normal leading-[1.06] tracking-[-0.015em] m-0 mb-2 sm:mb-3 text-balance"
                  style={{ fontSize: 'clamp(24px, 6.4vw, 46px)', color: '#f9f7f3' }}
                >
                  Disfruta el verano <em className="italic" style={{ color: '#e9c478' }}>en QUEVI</em>
                </h2>
                <p className="text-[12.5px] sm:text-[15px] leading-[1.5] sm:leading-[1.6] m-0 mx-auto max-w-[440px]" style={{ color: '#c9d8c9' }}>
                  Piernas ligeras y piel luminosa, con un
                  <strong style={{ color: '#f9f7f3' }}> 25% de descuento</strong> toda la temporada.
                </p>
              </div>
            </div>

            {/* Rituales */}
            <div className="px-4 sm:px-8 py-5 sm:py-7">
              <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-4">
                {PROMO_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={close}
                    className="group flex flex-row sm:flex-col rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ borderColor: '#ddd8cc', background: '#faf8f4' }}
                  >
                    <div className="relative flex-none w-[104px] sm:w-full aspect-square sm:aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 104px, 380px"
                      />
                      <span
                        className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-[0.08em] uppercase"
                        style={{ background: '#c4876a', color: '#fff' }}
                      >
                        −25%
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:gap-1.5 px-3.5 py-2.5 sm:p-4 flex-1 min-w-0 justify-center sm:justify-start">
                      <h3 className="font-serif font-medium text-[15.5px] sm:text-[17px] m-0 leading-[1.2]" style={{ color: '#23261f' }}>
                        {item.name}
                      </h3>
                      <p
                        className="text-[11.5px] sm:text-[12.5px] leading-[1.4] sm:leading-[1.55] m-0 sm:flex-1 overflow-hidden"
                        style={{ color: '#5b6152', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                      >
                        {item.desc}
                      </p>
                      <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1.5">
                        <span className="font-serif text-[18px] sm:text-[20px] font-medium" style={{ color: '#355539' }}>{item.after} €</span>
                        <span className="text-[12px] sm:text-[13px] line-through" style={{ color: '#9a9585' }}>{item.before} €</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Código */}
              <div
                className="mt-3 sm:mt-5 rounded-2xl px-4 py-3 sm:p-5 flex flex-row items-center gap-3 sm:gap-4 text-left"
                style={{ background: '#ede9e0', border: '1px dashed #c4876a' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[9.5px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.16em] uppercase m-0 mb-0.5 sm:mb-1.5" style={{ color: '#5b6152' }}>
                    Usa tu código al pagar
                  </p>
                  <button
                    onClick={copyCode}
                    className="font-serif text-[20px] sm:text-[27px] tracking-[0.06em] sm:tracking-[0.08em] transition-opacity hover:opacity-70 cursor-pointer bg-transparent border-0 p-0 text-left"
                    style={{ color: '#355539' }}
                    aria-label={`Copiar código ${PROMO_CODE}`}
                  >
                    {PROMO_CODE}
                  </button>
                  <p className="text-[10px] sm:text-[11.5px] m-0 mt-0.5 sm:mt-1" style={{ color: copied ? '#355539' : '#9a9585' }}>
                    {copied ? '✓ Código copiado' : 'Tócalo para copiarlo'}
                  </p>
                </div>
                <Link
                  href="/rituales"
                  onClick={close}
                  className="flex-none inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-[12px] sm:text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                  style={{ background: '#355539', color: '#f9f7f3' }}
                >
                  <span className="sm:hidden">Ver</span>
                  <span className="hidden sm:inline">Ver los rituales</span>
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <p className="text-[9.5px] sm:text-[11px] text-center m-0 mt-2.5 sm:mt-4 leading-[1.45]" style={{ color: '#9a9585' }}>
                Descuento aplicable a los rituales D-Relax Legs y D-Bio Lumina. No acumulable con otras promociones.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
