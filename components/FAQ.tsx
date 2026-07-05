'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { FAQS } from '@/content'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

function FAQItem({
  item, isOpen, onToggle,
}: {
  item: (typeof FAQS)[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`rounded-3xl border transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden will-change-transform ${
        isOpen
          ? 'border-brand-300 bg-cream-100 shadow-sm shadow-brand-100/30'
          : 'border-cream-400 bg-cream-100 hover:border-brand-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-100/30'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
        aria-expanded={isOpen}
      >
        <span className={`font-medium text-base transition-colors ${isOpen ? 'text-brand-700' : 'text-carbon-800'}`}>
          {item.question}
        </span>
        <motion.div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-brand-600 text-cream-50' : 'bg-cream-400 text-carbon-600'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="minus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Minus size={14} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Plus size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-6 pb-6">
              <p className="text-carbon-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ({ limit }: { limit?: number }) {
  const { ref, isInView } = useScrollAnimation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)
  const faqs = limit ? FAQS.slice(0, limit) : FAQS

  return (
    <section id="faq" className="py-28 bg-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 items-start">
          {/* Left — sticky header */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="lg:sticky lg:top-28 flex flex-col gap-5"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium w-fit"
            >
              Preguntas frecuentes
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-serif font-normal text-4xl sm:text-5xl leading-[1.05] tracking-tight text-carbon-900"
            >
              ¿Tienes alguna{' '}
              <em className="italic font-normal text-brand-600">duda?</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-carbon-500 text-lg leading-relaxed">
              Respondemos las preguntas más habituales de nuestros pacientes. Si no encuentras lo que buscas, contáctanos sin compromiso.
            </motion.p>
            <motion.a
              variants={fadeUp}
              href="#booking"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-cream-50 text-sm font-medium rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.97] shadow-brand w-fit mt-2 will-change-transform"
            >
              Pregúntanos directamente
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col gap-3"
          >
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                item={faq}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
