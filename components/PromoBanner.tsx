'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { isPaidTraffic } from '@/lib/attribution'

/**
 * Banner promocional de bienvenida.
 *
 * Está escrito para no estorbar a nada de lo demás:
 *  · No sale con tráfico de pago ni en las landings de campaña, donde taparía
 *    el formulario que hemos pagado por llenar.
 *  · En móvil es una barra inferior, no una ventana a pantalla completa:
 *    Google penaliza los interstitials que tapan el contenido en móvil.
 *  · Solo aparece tras una señal de usuario real (scroll, ratón o toque), así
 *    que el robot de Google, que no interactúa, nunca lo ve.
 *  · Es cliente puro y va en position fixed: no entra en el HTML que se
 *    indexa, no mueve el contenido y no toca el LCP.
 *  · Caduca solo en la fecha de `until`, sin depender de que nadie lo apague.
 *
 * Para lanzar una promo nueva: cambia PROMO y, sobre todo, su `key`, para que
 * vuelva a mostrarse a quien ya había cerrado la anterior.
 */
const PROMO = {
  /** A false, el banner no existe para nadie. */
  enabled: true,

  key: 'quevi-promo-dallo-lips-2026',

  /** Último día en el que se muestra (incluido), en horario local. */
  until: '2026-10-21',

  eyebrow: 'Oferta Dalló Lips',
  title: 'Labios con proporción, hidratación y luz',
  body:
    'Ácido hialurónico + PDRN, con la valoración médica incluida. ' +
    'Del 21 de septiembre al 21 de octubre.',

  /** Precio de la oferta. En null, el banner no enseña ningún precio. */
  price: '296 €' as string | null,

  /** Cupón, si lo hay. En null, el banner no enseña ningún código. */
  code: null as string | null,

  /** Letra pequeña obligatoria en publicidad sanitaria. */
  note: 'Tratamiento sujeto a valoración médica · Nº NICA 70353' as string | null,

  cta: { label: 'Reservar mi cita', href: '/#reservar' },

  image: {
    src: '/images/promo/dallo-lips.jpg',
    alt: 'Resultado de un tratamiento Dalló Lips en QUEVI Wellness Clinic',
  },
}

/** Páginas donde el banner nunca aparece: son las que tienen que convertir. */
const NO_PROMO_PATHS = ['/cita', '/en', '/checkout', '/admin', '/chequeo']

/** ¿Sigue viva la promo? Se apaga sola al pasar la fecha. */
function isLive() {
  if (!PROMO.enabled) return false
  const end = new Date(`${PROMO.until}T23:59:59`)
  return !Number.isNaN(end.getTime()) && Date.now() <= end.getTime()
}

export default function PromoBanner() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isLive()) return
    if (NO_PROMO_PATHS.some((p) => pathname?.startsWith(p))) return
    // Con tráfico que hemos pagado, el banner es un tapón de conversión: tapa
    // el formulario justo cuando el usuario acaba de llegar, y Google lo
    // puntúa como mala experiencia de destino.
    if (isPaidTraffic()) return

    try {
      if (sessionStorage.getItem(PROMO.key)) return
    } catch {
      // sessionStorage bloqueado — seguimos adelante
    }

    let timer: ReturnType<typeof setTimeout>
    let interacted = false

    // Señal de usuario real: sin esto no se muestra. Los rastreadores cargan
    // la página pero no hacen scroll ni mueven el ratón, así que para ellos
    // este banner no llega a existir.
    const onInteract = () => {
      if (interacted) return
      interacted = true
      cleanupSignals()
      waitForConsent()
    }
    const signals = ['scroll', 'pointermove', 'touchstart', 'keydown'] as const
    const cleanupSignals = () => signals.forEach((s) => window.removeEventListener(s, onInteract))
    signals.forEach((s) => window.addEventListener(s, onInteract, { passive: true, once: false }))

    // Si ya había bajado por la página antes de que esto se montara, esa es
    // toda la señal que necesitamos: sin esto, quien llega y hace un único
    // scroll temprano no vería nunca el banner.
    if (window.scrollY > 0) onInteract()

    // Y nunca antes de que el aviso de cookies esté respondido: dos capas a la
    // vez sobre la misma pantalla es lo que hace que se cierren las dos sin leer
    let poll: ReturnType<typeof setInterval>
    const waitForConsent = () => {
      poll = setInterval(() => {
        let consent: string | null = null
        try {
          consent = localStorage.getItem('quevi-consent') ?? localStorage.getItem('quevi-cookie-consent')
        } catch {
          consent = 'accepted'
        }
        if (consent) {
          clearInterval(poll)
          timer = setTimeout(() => setOpen(true), 900)
        }
      }, 400)
    }

    return () => {
      cleanupSignals()
      clearInterval(poll)
      clearTimeout(timer)
    }
  }, [pathname])

  const close = () => {
    setOpen(false)
    try { sessionStorage.setItem(PROMO.key, '1') } catch { /* ignore */ }
  }

  // El bloqueo de scroll y la tecla Escape solo tienen sentido en la ventana
  // de escritorio; la barra de móvil deja navegar por detrás
  useEffect(() => {
    if (!open || !isDesktop) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isDesktop])

  async function copyCode() {
    if (!PROMO.code) return
    try {
      await navigator.clipboard.writeText(PROMO.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* ignore */ }
  }

  const cerrar = (
    <button
      onClick={close}
      aria-label="Cerrar promoción"
      className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-carbon-400 hover:text-carbon-900 hover:bg-cream-300 transition-colors"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  )

  const cta = (
    <Link
      href={PROMO.cta.href}
      onClick={close}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-600 text-cream-50 text-[14px] font-medium hover:bg-brand-700 transition-colors whitespace-nowrap"
    >
      {PROMO.cta.label}
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  )

  const codigo = PROMO.code ? (
    <button
      onClick={copyCode}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-dashed border-brand-400 text-[13px] font-medium text-brand-700 hover:bg-brand-50 transition-colors"
    >
      <span className="tracking-[0.12em]">{PROMO.code}</span>
      <span className="text-[11px] text-carbon-400">{copied ? '¡copiado!' : 'copiar'}</span>
    </button>
  ) : null

  return (
    <AnimatePresence>
      {open && (
        isDesktop ? (
          // ── Escritorio: ventana centrada ──────────────────────────────────
          <motion.div
            key="promo-desktop"
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            style={{ background: 'rgba(24,26,20,0.62)', backdropFilter: 'blur(6px)' }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-[860px] rounded-3xl overflow-hidden bg-cream-100 border border-cream-400 shadow-2xl grid grid-cols-[1.05fr_1fr]"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {cerrar}
              <div className="p-10 flex flex-col justify-center gap-4">
                <span className="text-[11px] tracking-[0.22em] uppercase text-brand-700">{PROMO.eyebrow}</span>
                <h2 id="promo-title" className="font-serif text-[30px] leading-[1.15] text-carbon-900 m-0">
                  {PROMO.title}
                </h2>
                <p className="text-[14px] leading-relaxed text-carbon-500 m-0">{PROMO.body}</p>
                {PROMO.price && (
                  <p className="font-serif text-[40px] leading-none text-brand-700 m-0">{PROMO.price}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {cta}
                  {codigo}
                </div>
                {PROMO.note && (
                  <p className="text-[11px] leading-relaxed text-carbon-400 m-0 mt-1">{PROMO.note}</p>
                )}
              </div>
              <div className="relative bg-cream-300 min-h-[320px]">
                <Image
                  src={PROMO.image.src}
                  alt={PROMO.image.alt}
                  fill
                  className="object-cover"
                  sizes="430px"
                  priority={false}
                />
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // ── Móvil: barra inferior, sin tapar la página ────────────────────
          <motion.div
            key="promo-movil"
            className="fixed left-0 right-0 bottom-0 z-[100] p-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="region"
            aria-labelledby="promo-title"
          >
            <div className="relative rounded-2xl border border-cream-400 bg-cream-100 shadow-xl p-4 pr-12">
              {cerrar}
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-cream-300">
                  <Image src={PROMO.image.src} alt="" fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] tracking-[0.18em] uppercase text-brand-700">{PROMO.eyebrow}</span>
                  <h2 id="promo-title" className="font-serif text-[17px] leading-tight text-carbon-900 m-0 mt-0.5">
                    {PROMO.title}
                  </h2>
                  {PROMO.price && (
                    <p className="font-serif text-[20px] leading-none text-brand-700 m-0 mt-1">{PROMO.price}</p>
                  )}
                </div>
              </div>
              <p className="text-[12px] leading-snug text-carbon-500 m-0 mt-2">{PROMO.body}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {cta}
                {codigo}
              </div>
              {PROMO.note && (
                <p className="text-[10px] leading-snug text-carbon-400 m-0 mt-2">{PROMO.note}</p>
              )}
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  )
}
