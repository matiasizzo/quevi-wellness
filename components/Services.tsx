'use client'

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-600">
        <path d="M9 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-10V3" />
        <path d="M9 3h6M6.5 14h11" />
      </svg>
    ),
    label: 'Formulado bajo pedido',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-600">
        <path d="M3 21c0-9 9-18 18-18-1 8-7 16-15 17-1 0-2 0-3 1z" />
        <path d="M3 21 13 11" />
      </svg>
    ),
    label: 'Activos de grado biotec',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-600">
        <path d="M6 4v6a4 4 0 0 0 8 0V4" />
        <circle cx="18" cy="14" r="2" />
        <path d="M10 14v3a4 4 0 0 0 8 0v-1" />
      </svg>
    ),
    label: 'Avalado por médicos',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-600">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </svg>
    ),
    label: 'Sin parabenos · sin rellenos',
  },
]

export default function Services() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="pilares" className="bg-cream-200 py-16">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-block text-[11px] tracking-[0.32em] uppercase text-carbon-400 mb-4"
        >
          Centro médico · Unidad de estética avanzada · Medicina de precisión
        </motion.span>

        <motion.h2
          variants={fadeUp}
          className="font-serif font-normal leading-[1.05] tracking-[-0.012em] m-0 mb-10 text-carbon-900 text-balance"
          style={{ fontSize: 'clamp(26px, 3vw, 40px)' }}
        >
          Longevidad <em className="italic text-brand-600">externa</em>,
          longevidad <em className="italic text-brand-600">interna</em>.
        </motion.h2>

        <motion.ul
          variants={staggerContainer}
          className="list-none m-0 p-0 grid grid-cols-2 lg:grid-cols-4 border-y border-cream-400"
        >
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.label}
              variants={fadeUp}
              className={[
                'py-6 px-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left',
                i % 2 !== 0 ? 'border-l border-cream-400' : '',
                i >= 2 ? 'border-t border-cream-400 lg:border-t-0' : '',
                i === 2 ? 'lg:border-l border-cream-400' : '',
              ].filter(Boolean).join(' ')}
            >
              <span className="flex-shrink-0">{f.icon}</span>
              <span className="text-[11px] tracking-[0.16em] uppercase text-carbon-900 font-medium leading-[1.5] max-w-[16ch]">
                {f.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}
