'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { RITUALES } from '@/content'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

// Versión compacta de Rituales para la home — el detalle completo vive en /rituales
export default function RitualesTeaser() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="rituales" className="py-24 bg-cream-300 overflow-hidden">
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
            className="inline-block px-4 py-1.5 rounded-full bg-terra-100 text-terra-700 text-sm font-medium mb-4"
          >
            Rituales de Firma Dall&apos;O Selfcare
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif font-normal text-4xl sm:text-5xl leading-[1.05] tracking-tight text-carbon-900 mb-4 text-balance"
          >
            Ingeniería cutánea{' '}
            <em className="italic font-normal text-brand-600">&amp; Biohacking</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-carbon-500 text-lg max-w-2xl mx-auto">
            Experiencias de 60 a 90 minutos. Protocolos oficiales de Dall&apos;O Selfcare,
            aplicados en QUEVI bajo autorización.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {RITUALES.map((ritual) => (
            <motion.div key={ritual.id} variants={scaleIn}>
              <Link
                href="/rituales"
                className="flex flex-col gap-3 h-full p-6 rounded-3xl border border-cream-400 bg-cream-100 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1 transition-all duration-200"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-terra-100 text-terra-700 text-xs font-medium w-fit">
                  {ritual.badge}
                </span>
                <h3 className="text-lg font-bold text-carbon-900 font-serif leading-snug m-0">
                  {ritual.name}
                </h3>
                <p className="text-sm text-brand-600 font-medium italic m-0 flex-1">{ritual.tagline}</p>
                <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid #ddd8cc' }}>
                  <span className="flex items-center gap-1.5 text-carbon-400 text-xs">
                    <Clock size={12} />
                    {ritual.duration}
                  </span>
                  <span className="text-terra-600 font-semibold text-sm">{ritual.priceEur} €</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'} className="text-center">
          <Link
            href="/rituales"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 text-sm font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
          >
            Descubrir los rituales
            <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
