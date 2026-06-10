'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'
import { TREATMENTS } from '@/content'

const PILLARS = [
  {
    id: 'shield',
    num: '01',
    pillar: 'SHIELD',
    title: 'Bio-Protección',
    desc: 'SPF inteligente, microbioma y antioxidación avanzada. La primera barrera clínica que escribe tu mejor mañana.',
    image: '/images/shield.png',
    overlay: 'rgba(22,35,26,',
    treatments: ['Peelings', 'Fotorejuvenecimiento IPL'],
  },
  {
    id: 'repair',
    num: '02',
    pillar: 'REPAIR',
    title: 'Regeneración',
    desc: 'PDRN, péptidos biomiméticos y células madre vegetales. Reparación celular medible desde la 4ª semana.',
    image: '/images/repair.png',
    overlay: 'rgba(58,28,15,',
    treatments: ['Neuromoduladores', "DallÒ LIPS", 'Arquitectura Face', 'PRP Photoativa', 'PDRN — Polinucleótidos', 'SEFFILLER — Células Madre'],
  },
  {
    id: 'boost',
    num: '03',
    pillar: 'BOOST',
    title: 'Optimización',
    desc: 'Vitamina C estabilizada, oligoelementos y terapia LED. La piel que respira, refleja luz y recobra densidad.',
    image: '/images/boost.png',
    overlay: 'rgba(70,36,20,',
    treatments: ['Fototerapia LED — Biohacking Lumínico', 'Ellegance — Infrarrojo Vibracional', 'Radiofrecuencia con Microagujas', 'Láser CO₂'],
  },
  {
    id: 'reset',
    num: '04',
    pillar: 'RESET / SOUL',
    title: 'Equilibrio',
    desc: 'CBD tópico, adaptógenos y melatonina. Apagamos el cortisol cutáneo para que la piel descanse de verdad.',
    image: '/images/reset.jpeg',
    overlay: 'rgba(14,28,20,',
    treatments: [],
  },
]

const ALL_TREATMENTS = TREATMENTS.flatMap((cat) => cat.items)

export default function Treatments() {
  const { ref, isInView } = useScrollAnimation()
  const [openId, setOpenId] = useState<string | null>(null)

  const openPillar = PILLARS.find((p) => p.id === openId) ?? null
  const openItems = openPillar
    ? ALL_TREATMENTS.filter((t) => openPillar.treatments.includes(t.name))
    : []

  return (
    <section id="treatments" className="bg-cream-100 py-24 border-t border-cream-400">
      <div ref={ref} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-9">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
        >
          <div>
            <motion.span variants={fadeUp} className="text-[11px] tracking-[0.32em] uppercase text-carbon-400 block mb-4">
              — Protocolos clínicos · Se reservan con cita médica
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-serif font-normal leading-[1] tracking-[-0.018em] m-0 text-carbon-900"
              style={{ fontSize: 'clamp(38px, 4.8vw, 68px)' }}
            >
              Los 4 <em className="italic text-brand-600">pilares</em> del tratamiento.
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-7 py-3 bg-brand-600 text-cream-50 rounded-full font-medium text-[13px] tracking-[0.02em] transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform whitespace-nowrap"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            >
              Reservar diagnóstico
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </motion.div>

        {/* 4 cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-[14px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {PILLARS.map((p) => {
            const isOpen = openId === p.id
            return (
              <motion.button
                key={p.pillar}
                variants={fadeUp}
                onClick={() => setOpenId(isOpen ? null : p.id)}
                aria-expanded={isOpen}
                className={`relative overflow-hidden flex flex-col justify-between rounded-[4px] text-cream-100 cursor-pointer group will-change-transform text-left border-2 transition-colors duration-300 ${
                  isOpen ? 'border-brand-500' : 'border-transparent'
                }`}
                style={{
                  minHeight: 'clamp(320px, 36vw, 480px)',
                  transition: 'transform 0.2s cubic-bezier(0.22,1,0.36,1), border-color 0.3s',
                }}
                whileHover={{ y: -5, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
              >
                {/* Background image */}
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-[1.05] transition-transform duration-[900ms]"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                {/* Overlay — keeps title/text legible over the photo */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${p.overlay}0.88) 0%, ${p.overlay}0.55) 38%, ${p.overlay}0.18) 62%, ${p.overlay}0.10) 100%)`,
                  }}
                />

                {/* Number */}
                <span className="relative z-[2] font-serif italic text-[13px] tracking-[0.04em] p-7 pb-0" style={{ color: 'rgba(245,242,236,0.75)' }}>
                  {p.num}
                </span>

                {/* Content */}
                <div className="relative z-[2] flex flex-col gap-3 p-7">
                  <span className="text-[10px] tracking-[0.26em] uppercase font-medium" style={{ color: 'rgba(245,242,236,0.8)' }}>
                    {p.pillar}
                  </span>
                  <h3 className="font-serif font-normal leading-[1.05] m-0 tracking-[-0.01em] text-cream-100" style={{ fontSize: 'clamp(28px, 2.8vw, 38px)', textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}>
                    {p.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] m-0" style={{ color: 'rgba(245,242,236,0.85)' }}>
                    {p.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.22em] uppercase text-cream-100 mt-2 pb-1 border-b self-start group-hover:gap-[16px] transition-all duration-300"
                    style={{ borderColor: 'rgba(245,242,236,0.45)' }}
                  >
                    {isOpen ? 'Cerrar' : 'Ver tratamientos'}
                    <motion.svg
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </motion.svg>
                  </span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Expanded detail panel */}
        <AnimatePresence initial={false}>
          {openPillar && (
            <motion.div
              key={openPillar.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-[14px] rounded-[4px] border border-cream-400 bg-cream-200 p-7 sm:p-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                  <div>
                    <span className="text-[10px] tracking-[0.26em] uppercase text-carbon-400 block mb-2">
                      {openPillar.pillar} · {openPillar.title}
                    </span>
                    <h3 className="font-serif font-normal text-carbon-900 m-0" style={{ fontSize: 'clamp(24px, 2.4vw, 34px)' }}>
                      Tratamientos de este pilar
                    </h3>
                    <p className="text-[13px] text-carbon-400 mt-2 m-0">
                      Los tratamientos médico-estéticos se agendan con cita previa y se confirman con una seña.
                    </p>
                  </div>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-brand-600 text-cream-50 rounded-full font-medium text-[13px] tracking-[0.02em] transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.97] whitespace-nowrap flex-shrink-0"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                  >
                    Agendar cita con seña
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>

                {openItems.length > 0 ? (
                  <div className="grid gap-[14px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {openItems.map((t) => (
                      <div key={t.name} className="flex flex-col gap-2 p-5 rounded-[4px] bg-cream-100 border border-cream-400">
                        <h4 className="font-serif font-medium text-[18px] text-carbon-900 m-0 leading-[1.25]">
                          {t.name}
                        </h4>
                        <p className="text-[13px] text-carbon-500 leading-[1.6] m-0 flex-1">
                          {t.desc}
                        </p>
                        {t.detail.duration && (
                          <span className="text-[11px] text-carbon-400 tracking-[0.04em]">
                            Duración: {t.detail.duration}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-[4px] bg-cream-100 border border-cream-400">
                    <p className="text-[14px] text-carbon-500 leading-[1.6] m-0 flex-1">
                      El pilar RESET / SOUL se trabaja a través de nuestros <strong className="text-carbon-900">Rituales de Firma</strong>:
                      aromaterapia clínica, masajes neuro-sedantes y mindfulness estético. Los rituales se compran
                      directamente — sin necesidad de seña.
                    </p>
                    <a
                      href="/rituales"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-brand-600 text-brand-600 text-[13px] font-medium transition-all duration-200 hover:bg-brand-600 hover:text-cream-50 whitespace-nowrap"
                    >
                      Ver rituales
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
