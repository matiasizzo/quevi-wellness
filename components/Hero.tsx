'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const EASE = [0.22, 1, 0.36, 1] as const
const PHOTO_BG = '#e8ddd0'

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-cream-400"
      style={{ background: PHOTO_BG }}
    >
      {/* Image — natural ratio on mobile/tablet (never crops); capped height on
          desktop so the whole hero (text + CTAs) fits within one screen */}
      <div className="relative w-full aspect-[1448/1086] lg:aspect-auto lg:h-[min(74vh,720px)]">
        <Image
          src="/images/hero.png"
          alt="QUEVI Wellness Clinic"
          fill
          className="object-contain object-right"
          priority
          sizes="100vw"
        />

        {/* Seamless fade left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg,
              ${PHOTO_BG} 0%,
              ${PHOTO_BG} 26%,
              rgba(232,221,208,0.88) 40%,
              rgba(232,221,208,0.40) 56%,
              rgba(232,221,208,0.06) 70%,
              transparent 82%
            )`,
          }}
        />

        {/* Text — centred vertically over left half */}
        <div className="absolute inset-0 z-[2] flex items-center">
          <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
            <motion.div
              className="flex flex-col gap-[14px] sm:gap-[18px] lg:gap-[22px] max-w-[500px]"
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className="inline-flex items-center gap-[10px] text-[11px] tracking-[0.24em] uppercase text-brand-700 font-medium">
                <span className="inline-block w-7 h-px bg-brand-500" />
                Wellness Clinic · Cosmética médica
              </span>

              <h1
                className="font-serif font-bold leading-[0.96] tracking-[-0.022em] m-0 text-carbon-900 text-balance"
                style={{ fontSize: 'clamp(34px, 6.8vw, 96px)', maxWidth: '13ch' }}
              >
                Tu rutina, <em className="not-italic font-normal text-brand-600">prescrita</em>.
                <br />No vendida.
              </h1>

              {/* Description — desktop only; on mobile/tablet it overlaps the
                  photo awkwardly, so it's hidden below the lg breakpoint */}
              <p className="hidden lg:block text-[16px] sm:text-[17px] text-carbon-500 max-w-[420px] leading-[1.65]">
                Una clínica de bienestar que cruza diagnóstico médico, terapia regenerativa y
                cosmética magistral de precisión — porque tu piel no necesita una novedad, necesita tu historia.
              </p>

              <div className="flex gap-3 flex-wrap pt-1">
                <a
                  href="#diagnostico"
                  className="group inline-flex items-center gap-2 px-7 py-3 bg-brand-600 text-cream-50 rounded-full font-medium text-[13px] tracking-[0.02em] shadow-brand transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                >
                  Reservar diagnóstico
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="/shop"
                  className="inline-flex items-center gap-2 px-[26px] py-3 text-carbon-900 rounded-full font-medium text-[13px] tracking-[0.02em] border border-carbon-300 bg-transparent transition-all duration-200 hover:bg-cream-300 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                >
                  Ver toda la tienda
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
