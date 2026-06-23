'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'quevi-cookie-consent'

type ConsentState = 'accepted' | 'rejected' | null

export default function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState
    setConsent(stored)
    setMounted(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setConsent('accepted')
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setConsent('rejected')
  }

  if (!mounted || consent !== null) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      >
        <div
          className="max-w-[860px] mx-auto rounded-[12px] shadow-2xl overflow-hidden"
          style={{ background: 'rgba(245,242,236,0.97)', backdropFilter: 'blur(16px)', border: '1px solid rgba(53,85,57,0.18)' }}
        >
          <div className="p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#355539" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-sans font-medium text-[14px] text-carbon-900 mb-1">
                  Usamos cookies para mejorar tu experiencia
                </p>
                <p className="text-[13px] text-carbon-500 leading-[1.6] m-0">
                  Utilizamos cookies técnicas necesarias para el funcionamiento del sitio y, con tu consentimiento, cookies analíticas para entender cómo se usa.{' '}
                  <button
                    onClick={() => setShowDetails(v => !v)}
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 transition-colors"
                  >
                    {showDetails ? 'Ver menos' : 'Más información'}
                  </button>
                </p>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 grid sm:grid-cols-2 gap-3">
                        {[
                          {
                            name: 'Cookies técnicas',
                            desc: 'Necesarias para el funcionamiento (carrito, sesión). No se pueden desactivar.',
                            required: true,
                          },
                          {
                            name: 'Cookies analíticas',
                            desc: 'Nos ayudan a entender cómo se navega el sitio para mejorarlo.',
                            required: false,
                          },
                        ].map((c) => (
                          <div
                            key={c.name}
                            className="p-3 rounded-[8px] border border-cream-400 bg-cream-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px] font-medium text-carbon-900">{c.name}</span>
                              <span
                                className="text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                                style={{
                                  background: c.required ? 'rgba(53,85,57,0.12)' : 'rgba(30,30,30,0.08)',
                                  color: c.required ? '#355539' : '#666',
                                }}
                              >
                                {c.required ? 'Obligatoria' : 'Opcional'}
                              </span>
                            </div>
                            <p className="text-[12px] text-carbon-400 leading-[1.5] m-0">{c.desc}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-carbon-400 mt-3 m-0">
                        Consulta nuestra{' '}
                        <a href="/politica-cookies" className="underline underline-offset-2 hover:text-carbon-700 transition-colors">
                          Política de cookies
                        </a>{' '}
                        y{' '}
                        <a href="/privacidad" className="underline underline-offset-2 hover:text-carbon-700 transition-colors">
                          Política de privacidad
                        </a>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-end">
              <button
                onClick={reject}
                className="px-5 py-2.5 rounded-full border border-cream-500 text-carbon-600 text-[13px] font-medium transition-all duration-200 hover:border-carbon-400 hover:text-carbon-900 active:scale-[0.97]"
              >
                Solo necesarias
              </button>
              <button
                onClick={accept}
                className="px-5 py-2.5 rounded-full bg-brand-600 text-cream-50 text-[13px] font-medium transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
