'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock } from 'lucide-react'
import { TREATMENTS } from '@/content'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

/** Convierte el color de la categoría en un tono suave para fondos */
function soft(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const SPEC_LABELS: { key: 'application' | 'duration' | 'anesthesia' | 'sessions' | 'durability' | 'requirements' | 'recovery' | 'aftercare'; label: string }[] = [
  { key: 'application',  label: 'Aplicación' },
  { key: 'duration',     label: 'Tiempo del procedimiento' },
  { key: 'anesthesia',   label: 'Anestesia' },
  { key: 'sessions',     label: 'Sesiones' },
  { key: 'durability',   label: 'Duración del efecto' },
  { key: 'requirements', label: 'Requisitos' },
  { key: 'recovery',     label: 'Recuperación' },
  { key: 'aftercare',    label: 'Post-tratamiento' },
]

export default function Treatments() {
  const { ref, isInView } = useScrollAnimation()
  const [openName, setOpenName] = useState<string | null>(null)

  return (
    <section id="treatments" className="py-28 bg-cream-100 overflow-hidden border-t border-cream-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4"
          >
            Terapias Faciales Quevi Pro-Aging
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif font-normal text-4xl sm:text-5xl leading-[1.05] tracking-tight text-carbon-900 mb-4 text-balance"
          >
            Renovación celular <em className="italic font-normal text-brand-600">&amp; longevidad cutánea</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-carbon-500 text-lg max-w-2xl mx-auto">
            Terapias que ayudan a estimular la renovación celular y prolongan la vida de tu piel,
            combinadas con tecnologías de última generación.
          </motion.p>
          <motion.p variants={fadeUp} className="text-brand-600 text-sm font-medium mt-3">
            Se agendan con cita previa y se confirman con una seña de 50 €, descontable del tratamiento.
          </motion.p>
        </motion.div>

        {TREATMENTS.map((cat) => (
          <div key={cat.category} className="mb-14 last:mb-0">
            {/* Category header */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex items-center gap-3 mb-2"
            >
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
              <h3 className="font-serif font-medium text-2xl text-carbon-900 m-0">{cat.category}</h3>
            </motion.div>
            <p className="text-carbon-500 text-sm mb-7 ml-[22px]">{cat.desc}</p>

            {/* Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="grid sm:grid-cols-2 gap-5"
            >
              {cat.items.map((t) => {
                const isOpen = openName === t.name
                const specs = SPEC_LABELS.filter((s) => t.detail[s.key])
                return (
                  <motion.div
                    key={t.name}
                    variants={scaleIn}
                    className={`rounded-3xl border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden will-change-transform bg-cream-50 ${
                      isOpen ? 'shadow-xl shadow-brand-100/30' : 'hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1'
                    }`}
                    style={{
                      borderColor: isOpen ? cat.color : '#ddd8cc',
                      borderTopWidth: 3,
                      borderTopColor: cat.color,
                    }}
                  >
                    {/* Card header */}
                    <button
                      onClick={() => setOpenName(isOpen ? null : t.name)}
                      className="w-full text-left p-6"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-carbon-900 font-serif leading-snug m-0">
                            {t.name}
                          </h4>
                          <p className="text-sm text-carbon-500 leading-relaxed m-0">
                            {t.desc}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
                            {t.detail.duration && (
                              <span className="inline-flex items-center gap-2 text-carbon-400 text-xs">
                                <Clock size={12} />
                                {t.detail.duration}
                              </span>
                            )}
                            {t.price && (
                              <span
                                className="font-serif text-[15px] font-medium"
                                style={{ color: cat.color }}
                              >
                                {t.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 flex-shrink-0">
                          <div
                            className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden"
                            style={{ background: soft(cat.color, 0.08) }}
                          >
                            <Image src={t.image} alt={t.name} fill className="object-cover" sizes="96px" />
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            style={isOpen
                              ? { background: cat.color, color: '#f9f7f3' }
                              : { background: '#ddd8cc', color: '#525252' }}
                          >
                            <ChevronDown size={15} />
                          </motion.div>
                        </div>
                      </div>
                    </button>

                    {/* Expandable detail */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="px-6 pb-6 flex flex-col gap-5 border-t border-cream-400 pt-5">
                            {/* Specs */}
                            <div className="flex flex-col divide-y divide-cream-300 rounded-2xl border border-cream-300 bg-cream-100 overflow-hidden">
                              {specs.map((s) => (
                                <div key={s.key} className="grid grid-cols-[130px_1fr] sm:grid-cols-[170px_1fr] gap-3 px-4 py-2.5">
                                  <span className="text-[11px] font-semibold uppercase tracking-wider pt-0.5" style={{ color: cat.color }}>
                                    {s.label}
                                  </span>
                                  <span className="text-[13px] text-carbon-700 leading-relaxed">
                                    {t.detail[s.key]}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {t.detail.note && (
                              <p className="text-xs text-carbon-500 leading-relaxed m-0 px-4 py-3 rounded-xl" style={{ background: soft(cat.color, 0.07), border: `1px solid ${soft(cat.color, 0.2)}` }}>
                                <strong className="text-carbon-700">Observación:</strong> {t.detail.note}
                              </p>
                            )}

                            {/* CTA */}
                            <a
                              href={`/?service=${encodeURIComponent(t.name)}#booking`}
                              className="group inline-flex items-center justify-center gap-2 w-full py-3 text-cream-50 text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.97] will-change-transform"
                              style={{ background: cat.color, transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                            >
                              Reservar con seña · 50 €
                              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                              </svg>
                            </a>
                            <p className="text-xs text-carbon-400 leading-relaxed m-0 -mt-3">
                              {t.price
                                ? `Precio de referencia: ${t.price}. La seña se descuenta del importe final, que se confirma tras la valoración médica.`
                                : 'La seña se descuenta del precio final. El precio total se define tras la valoración médica.'}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}
