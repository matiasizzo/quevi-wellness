'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, Sparkles } from 'lucide-react'
import { RITUALES, SELLO_DALLO, ritualBookingLabel } from '@/content'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'
import { useCart } from '@/lib/cartContext'

/** Convierte el color de marca del ritual en un tono suave para fondos */
function soft(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function Rituales() {
  const { ref, isInView } = useScrollAnimation()
  const [openId, setOpenId] = useState<string | null>(null)
  const { addItem } = useCart()

  return (
    <section id="rituales" className="py-28 bg-cream-300 overflow-hidden">
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
            className="inline-block px-4 py-1.5 rounded-full bg-terra-100 text-terra-700 text-sm font-medium mb-4"
          >
            Rituales de Firma Dall&apos;O Selfcare
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif font-normal text-4xl sm:text-5xl leading-[1.05] tracking-tight text-carbon-900 mb-4 text-balance"
          >
            Biohacking <em className="italic font-normal text-brand-600">&amp; Longevidad</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-carbon-500 text-lg max-w-2xl mx-auto">
            Experiencias de 60 minutos en suite privada que combinan alta cosmética de
            producción propia con tecnología de vanguardia. Cada ritual facial incluye
            tu tratamiento de continuidad en casa (Home Care).
          </motion.p>
          <motion.p variants={fadeUp} className="text-brand-600 text-sm font-medium mt-3">
            Protocolos oficiales de Dall&apos;O Selfcare, aplicados en QUEVI bajo autorización.
          </motion.p>
        </motion.div>

        {/* Ritual cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid sm:grid-cols-2 gap-6 mb-12"
        >
          {RITUALES.map((ritual) => {
            const isOpen = openId === ritual.id
            return (
              <motion.div
                key={ritual.id}
                variants={scaleIn}
                className={`rounded-3xl border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden will-change-transform bg-cream-100 ${
                  isOpen
                    ? 'shadow-xl shadow-brand-100/30'
                    : 'hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1'
                }`}
                style={{
                  borderColor: isOpen ? ritual.color : '#ddd8cc',
                  borderTopWidth: 3,
                  borderTopColor: ritual.color,
                }}
              >
                {/* Card header — always visible */}
                <button
                  onClick={() => setOpenId(isOpen ? null : ritual.id)}
                  className="w-full text-left p-7"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium w-fit"
                        style={{ background: soft(ritual.color, 0.14), color: ritual.color }}
                      >
                        {ritual.badge}
                      </span>
                      <h3 className="text-xl font-bold text-carbon-900 font-serif leading-snug">
                        {ritual.name}
                      </h3>
                      <p className="text-sm font-medium italic" style={{ color: ritual.color }}>
                        {ritual.tagline}
                      </p>
                      <p className="text-sm text-carbon-500 leading-relaxed mt-1">
                        {ritual.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-carbon-400 text-xs">
                        <Clock size={12} />
                        <span>{ritual.duration}</span>
                        <span className="text-cream-500">·</span>
                        <span className="font-semibold" style={{ color: ritual.color }}>{ritual.priceEur} €</span>
                        {ritual.homeCare.length > 0 && (
                          <>
                            <span className="text-cream-500">·</span>
                            <span className="text-carbon-500">Home Care incluido</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-3 flex-shrink-0">
                      {/* Product / ambience thumbnail */}
                      <div
                        className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden"
                        style={{ background: soft(ritual.color, 0.1) }}
                      >
                        <Image
                          src={ritual.image}
                          alt={ritual.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                        style={isOpen
                          ? { background: ritual.color, color: '#f9f7f3' }
                          : { background: '#ddd8cc', color: '#525252' }}
                      >
                        <ChevronDown size={16} />
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
                      <div className="px-7 pb-7 flex flex-col gap-6 border-t border-cream-400 pt-5">
                        {/* Results */}
                        <div>
                          <p className="text-xs font-semibold text-carbon-400 uppercase tracking-wider mb-3">
                            Resultados
                          </p>
                          <ul className="flex flex-col gap-2">
                            {ritual.results.map((r) => (
                              <li key={r} className="flex items-start gap-2 text-sm text-carbon-700">
                                <Sparkles size={13} className="mt-0.5 flex-shrink-0" style={{ color: ritual.color }} />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Phases */}
                        <div>
                          <p className="text-xs font-semibold text-carbon-400 uppercase tracking-wider mb-3">
                            El protocolo, fase a fase
                          </p>
                          <ol className="flex flex-col gap-3">
                            {ritual.phases.map((phase, i) => (
                              <li key={i} className="flex gap-3">
                                <span
                                  className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
                                  style={{ background: soft(ritual.color, 0.14), color: ritual.color }}
                                >
                                  {i + 1}
                                </span>
                                <div>
                                  <p className="text-sm font-semibold text-carbon-800">{phase.title}</p>
                                  <p className="text-xs text-carbon-500 leading-relaxed mt-0.5">{phase.desc}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Home Care incluido */}
                        {ritual.homeCare.length > 0 && (
                          <div
                            className="rounded-2xl p-5"
                            style={{ background: soft(ritual.color, 0.08), border: `1px solid ${soft(ritual.color, 0.25)}` }}
                          >
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: ritual.color }}>
                              Tu tratamiento no termina en el centro
                            </p>
                            <p className="text-xs text-carbon-500 leading-relaxed mb-4">
                              Este ritual incluye tu kit de continuidad en casa (Home Care) —
                              fórmulas exclusivas elaboradas en pequeños lotes galénicos para
                              mantener la máxima potencia de sus activos.
                            </p>
                            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
                              {ritual.homeCare.map((product) => (
                                <div
                                  key={product.name}
                                  className="flex items-center gap-3 bg-cream-50 rounded-xl p-3 border border-cream-400"
                                >
                                  <div className="relative w-14 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream-200">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                      sizes="56px"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-carbon-900 leading-tight m-0">
                                      {product.name}
                                    </p>
                                    <p className="text-[11px] text-carbon-400 m-0 mt-0.5">{product.vol}</p>
                                    <p className="text-[11px] text-carbon-500 leading-snug m-0 mt-1">{product.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            onClick={() => addItem({
                              id: `ritual-${ritual.id}`,
                              slug: ritual.id,
                              name: ritual.name,
                              price: ritual.priceEur,
                              vol: ritual.duration,
                              image_url: ritual.image,
                              stripe: ritual.color,
                            })}
                            className="group inline-flex items-center justify-center gap-2 w-full py-3 text-cream-50 text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.97] will-change-transform cursor-pointer"
                            style={{ background: ritual.color, transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                          >
                            Comprar · {ritual.priceEur} €
                            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" />
                            </svg>
                          </button>
                          <a
                            href={`/?service=${encodeURIComponent(ritualBookingLabel(ritual.name))}#booking`}
                            className="group inline-flex items-center justify-center gap-2 w-full py-3 text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
                            style={{
                              border: `1px solid ${ritual.color}`,
                              color: ritual.color,
                              transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                            }}
                          >
                            Reservar con seña · 50 €
                            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                            </svg>
                          </a>
                        </div>
                        <p className="text-xs text-carbon-400 leading-relaxed m-0 -mt-3">
                          Cómpralo completo online, o resérvalo con una seña de 50 € y abona el resto en clínica.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Sello Dall'O */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="rounded-3xl bg-gradient-to-br from-carbon-900 to-carbon-800 p-8 sm:p-10 text-cream-50 flex flex-col sm:flex-row gap-8 items-start"
        >
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-terra-500/20 border border-terra-400/30 flex items-center justify-center">
            <span className="text-terra-300 text-2xl font-serif">D</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold font-serif">{SELLO_DALLO.title}</h3>
            <p className="text-carbon-300 text-sm leading-relaxed">{SELLO_DALLO.description}</p>
            <p className="text-carbon-400 text-sm leading-relaxed italic">{SELLO_DALLO.homecare}</p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
