'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  readConsent,
  readLegacyConsent,
  saveConsent,
  type ConsentCategories,
} from '@/lib/consent'

/**
 * Banner de consentimiento con categorías separadas.
 *
 * Analítica y publicidad van por separado porque Google Consent Mode v2 las
 * trata como permisos distintos: una cosa es medir el tráfico y otra medir
 * conversiones de anuncios y hacer remarketing. Un único "aceptar" no vale.
 *
 * A quien había respondido al banner anterior (que solo cubría analítica) se le
 * vuelve a preguntar, porque nunca dio consentimiento publicitario — pero las
 * casillas arrancan con su decisión previa.
 */

type Category = {
  key: keyof ConsentCategories | 'necessary'
  name: string
  desc: string
  required: boolean
}

const CATEGORIES: Category[] = [
  {
    key: 'necessary',
    name: 'Técnicas',
    desc: 'Necesarias para el funcionamiento (carrito, sesión, seguridad). No se pueden desactivar.',
    required: true,
  },
  {
    key: 'analytics',
    name: 'Analíticas',
    desc: 'Google Analytics y Microsoft Clarity: nos dicen cómo se navega el sitio para poder mejorarlo.',
    required: false,
  },
  {
    key: 'ads',
    name: 'Publicitarias',
    desc: 'Google Ads: nos permiten saber qué anuncio te trajo hasta aquí y no repetirte anuncios que ya has visto.',
    required: false,
  },
]

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selection, setSelection] = useState<ConsentCategories>({
    analytics: true,
    ads: true,
  })

  useEffect(() => {
    // Con una decisión v2 guardada no se pregunta nada
    if (readConsent()) return

    // Sin ella, preseleccionamos con lo que hubiera respondido al banner viejo
    const legacy = readLegacyConsent()
    if (legacy === 'rejected') setSelection({ analytics: false, ads: false })
    setVisible(true)
  }, [])

  const decide = (categories: ConsentCategories) => {
    saveConsent(categories)
    setVisible(false)
  }

  const acceptAll = () => decide({ analytics: true, ads: true })
  const rejectAll = () => decide({ analytics: false, ads: false })
  const saveSelection = () => decide(selection)

  const toggle = (key: keyof ConsentCategories) =>
    setSelection((s) => ({ ...s, [key]: !s[key] }))

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        role="dialog"
        aria-label="Preferencias de cookies"
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
                  Tú decides qué cookies usamos
                </p>
                <p className="text-[13px] text-carbon-500 leading-[1.6] m-0">
                  Las técnicas son imprescindibles. Las analíticas y las publicitarias solo se activan si nos das permiso, y puedes elegirlas por separado.{' '}
                  <button
                    onClick={() => setShowDetails(v => !v)}
                    className="text-brand-600 underline underline-offset-2 hover:text-brand-700 transition-colors"
                    aria-expanded={showDetails}
                  >
                    {showDetails ? 'Ver menos' : 'Personalizar'}
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
                      <div className="mt-3 grid sm:grid-cols-3 gap-3">
                        {CATEGORIES.map((c) => {
                          const checked = c.required || selection[c.key as keyof ConsentCategories]
                          return (
                            <div
                              key={c.key}
                              className="p-3 rounded-[8px] border border-cream-400 bg-cream-200"
                            >
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-[12px] font-medium text-carbon-900">{c.name}</span>
                                {c.required ? (
                                  <span
                                    className="text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(53,85,57,0.12)', color: '#355539' }}
                                  >
                                    Siempre
                                  </span>
                                ) : (
                                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => toggle(c.key as keyof ConsentCategories)}
                                      className="w-3.5 h-3.5 accent-brand-600 cursor-pointer"
                                      aria-label={`Cookies ${c.name.toLowerCase()}`}
                                    />
                                    <span className="text-[10px] tracking-[0.1em] uppercase text-carbon-400">
                                      {checked ? 'Sí' : 'No'}
                                    </span>
                                  </label>
                                )}
                              </div>
                              <p className="text-[12px] text-carbon-400 leading-[1.5] m-0">{c.desc}</p>
                            </div>
                          )
                        })}
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
                onClick={rejectAll}
                className="px-5 py-2.5 rounded-full border border-cream-500 text-carbon-600 text-[13px] font-medium transition-all duration-200 hover:border-carbon-400 hover:text-carbon-900 active:scale-[0.97]"
              >
                Solo necesarias
              </button>
              {showDetails && (
                <button
                  onClick={saveSelection}
                  className="px-5 py-2.5 rounded-full border border-brand-600 text-brand-600 text-[13px] font-medium transition-all duration-200 hover:bg-brand-50 active:scale-[0.97]"
                >
                  Guardar selección
                </button>
              )}
              <button
                onClick={acceptAll}
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
