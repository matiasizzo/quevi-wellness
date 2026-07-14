'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { RITUALES } from '@/content'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

function soft(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
            Biohacking <em className="italic font-normal text-brand-600">&amp; Longevidad</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-carbon-500 text-lg max-w-2xl mx-auto">
            Experiencias de 60 minutos en suite privada. Protocolos oficiales de
            Dall&apos;O Selfcare, aplicados en QUEVI bajo autorización.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10"
        >
          {RITUALES.map((ritual) => (
            <motion.div key={ritual.id} variants={scaleIn}>
              <Link
                href="/rituales"
                className="flex flex-col h-full rounded-3xl border bg-cream-100 overflow-hidden hover:shadow-lg hover:shadow-brand-100/40 hover:-translate-y-1 transition-all duration-200"
                style={{
                  borderColor: '#ddd8cc',
                  borderTopWidth: 3,
                  borderTopColor: ritual.color,
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <div className="relative w-full h-32" style={{ background: soft(ritual.color, 0.1) }}>
                  <Image
                    src={ritual.image}
                    alt={ritual.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5 flex-1">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium w-fit"
                    style={{ background: soft(ritual.color, 0.14), color: ritual.color }}
                  >
                    {ritual.badge}
                  </span>
                  <h3 className="text-[16px] font-bold text-carbon-900 font-serif leading-snug m-0">
                    {ritual.name}
                  </h3>
                  <p className="text-[13px] italic m-0 flex-1" style={{ color: ritual.color }}>
                    {ritual.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid #ddd8cc' }}>
                    <span className="flex items-center gap-1.5 text-carbon-400 text-xs">
                      <Clock size={12} />
                      60 min
                    </span>
                    <span className="font-semibold text-sm" style={{ color: ritual.color }}>{ritual.priceEur} €</span>
                  </div>
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
