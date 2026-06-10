'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import QueviLogo from '@/components/QueviLogo'
import { useCart } from '@/lib/cartContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* Promo bar */}
      <div className="bg-carbon-900 text-cream-100 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] py-2.5 sm:py-3 px-4 sm:px-6 text-center uppercase font-medium">
        <strong className="text-brand-200 font-medium">Estética consciente</strong>
        <span className="hidden sm:inline">{' '}· Envío gratuito desde 80 € · Diagnóstico médico incluido con tu primera compra</span>
        <span className="sm:hidden">{' '}· Diagnóstico médico incluido</span>
      </div>

      {/* Nav */}
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? 'border-b border-cream-400' : 'border-b border-transparent'
        }`}
        style={{
          background: scrolled ? 'rgba(245, 242, 236, 0.94)' : '#f5f2ec',
          backdropFilter: scrolled ? 'blur(12px)' : undefined,
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : undefined,
        }}
      >
        <div
          className={`grid items-center px-4 sm:px-6 lg:px-9 max-w-[1600px] mx-auto transition-all duration-[200ms] ${
            scrolled ? 'py-2.5 sm:py-3' : 'py-3 sm:py-[18px] lg:py-[22px]'
          }`}
          style={{ gridTemplateColumns: '1fr auto 1fr', transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
        >
          {/* Left — hamburger (mobile) / nav links (desktop) */}
          <div className="flex items-center">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 -ml-2 rounded-lg text-carbon-700 hover:bg-cream-300 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.svg key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 18 18 6M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg key="burger" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            {/* Desktop nav links */}
            <nav className="hidden md:flex gap-[30px] text-[13px] items-center">
              <Link href="/tratamientos" className="py-1.5 text-carbon-700 hover:text-brand-600 transition-colors duration-200 tracking-[0.01em]" style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
                Tratamientos
              </Link>
              <Link href="/rituales" className="py-1.5 text-carbon-700 hover:text-brand-600 transition-colors duration-200 tracking-[0.01em]" style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
                Rituales
              </Link>
              <Link href="/shop" className="py-1.5 text-carbon-700 hover:text-brand-600 transition-colors duration-200 tracking-[0.01em]" style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
                Tienda
              </Link>
              <Link href="/#booking" className="inline-flex items-center px-5 py-2 rounded-full bg-brand-600 text-cream-50 font-medium tracking-[0.02em] transition-all duration-200 hover:bg-brand-700 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform" style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}>
                Reservar cita
              </Link>
            </nav>
          </div>

          {/* Center logo */}
          <Link href="/" className="inline-flex items-center justify-center">
            <QueviLogo
              variant="dark"
              width={scrolled ? 130 : 150}
              height={scrolled ? 46 : 52}
              className="transition-all duration-200"
            />
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-4 justify-end">
            {/* Search — desktop only */}
            <button aria-label="Buscar" className="hidden md:flex group">
              <svg className="w-[18px] h-[18px] group-hover:[stroke:#355539] transition-colors" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            {/* Account — desktop only */}
            <button aria-label="Cuenta" className="hidden md:flex group">
              <svg className="w-[18px] h-[18px] group-hover:[stroke:#355539] transition-colors" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
              </svg>
            </button>
            {/* Cart — always visible */}
            <button
              onClick={openCart}
              aria-label="Bolsa de compra"
              className="relative group p-1"
            >
              <svg className="w-[20px] h-[20px] group-hover:[stroke:#355539] transition-colors" viewBox="0 0 24 24" fill="none" stroke="#1e1e1e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 7h12l-1 13H7L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -top-1 -right-1 bg-brand-600 text-cream-50 rounded-full text-[9px] font-semibold min-w-[16px] h-4 px-1 inline-flex items-center justify-center"
                  >
                    {count > 9 ? '9+' : count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sticky top-0 z-20 backdrop-blur-md shadow-xl border-b border-cream-400 md:hidden"
            style={{ background: 'rgba(245,242,236,0.98)' }}
          >
            <nav className="px-4 py-5 flex flex-col gap-1">
              <Link href="/tratamientos" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 text-base font-medium text-carbon-700 hover:text-brand-600 hover:bg-cream-300 rounded-xl transition-colors">
                Tratamientos
              </Link>
              <Link href="/rituales" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 text-base font-medium text-carbon-700 hover:text-brand-600 hover:bg-cream-300 rounded-xl transition-colors">
                Rituales
              </Link>
              <Link href="/shop" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 text-base font-medium text-carbon-700 hover:text-brand-600 hover:bg-cream-300 rounded-xl transition-colors">
                Tienda
              </Link>
              <Link href="/#booking" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 text-base font-medium text-cream-50 bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors text-center mt-1">
                Reservar cita
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
