'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { TREATMENTS } from '@/content'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

function soft(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Nombres de los tratamientos destacados en la home (el detalle completo vive en /tratamientos)
const FEATURED = [
  'Neuromoduladores',
  'Remodelación Facial con Ácido Hialurónico',
  'Remodelación de Labios — DallÒ LIPS',
  'Plasma Concentrado en Plaquetas (PRP)',
  'Fototerapia LED — Biohacking Lumínico',
  'Láser CO₂',
]

export default function TreatmentsTeaser() {
  const { ref, isInView } = useScrollAnimation()

  const featured = TREATMENTS.flatMap((cat) =>
    cat.items
      .filter((t) => FEATURED.includes(t.name))
      .map((t) => ({ ...t, category: cat.category, color: cat.color }))
  )

  return (
    <section id="treatments" className="py-24 bg-cream-100 overflow-hidden border-t border-cream-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-12"
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
            Terapias ProAging y tecnologías BOOST de última generación,
            siempre con valoración médica previa.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4 mb-10"
        >
          {featured.map((t) => (
            <motion.div key={t.name} variants={scaleIn}>
              <Link
                href="/tratamientos"
                className="flex flex-col h-full rounded-3xl border bg-cream-50 overflow-hidden hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1 transition-all duration-200"
                style={{
                  borderColor: '#ddd8cc',
                  borderTopWidth: 3,
                  borderTopColor: t.color,
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <div className="relative w-full h-36" style={{ background: soft(t.color, 0.08) }}>
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium w-fit"
                    style={{ background: soft(t.color, 0.12), color: t.color }}
                  >
                    {t.category}
                  </span>
                  <h3 className="text-[16px] font-bold text-carbon-900 font-serif leading-snug m-0 flex-1">
                    {t.name}
                  </h3>
                  <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid #ddd8cc' }}>
                    <span className="flex items-center gap-1.5 text-carbon-400 text-xs">
                      <Clock size={12} />
                      {t.detail.duration ?? 'Según diagnóstico'}
                    </span>
                    <span className="font-semibold text-sm" style={{ color: t.color }}>Seña 50 €</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="text-center">
          <Link
            href="/tratamientos"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
          >
            Ver todos los tratamientos
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
