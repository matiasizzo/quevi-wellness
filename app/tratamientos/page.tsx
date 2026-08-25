import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Treatments from '@/components/Treatments'
import Booking from '@/components/Booking'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  alternates: { canonical: '/tratamientos' },
  title: 'Terapias Faciales Pro-Aging',
  description:
    'Terapias faciales Quevi Pro-Aging en Estepona: neuromoduladores, ácido hialurónico, PRP, PDRN, inductores de colágeno, peelings y tecnologías BOOST (LED, microneedling RF, láser CO₂, IPL). Reserva con seña de 50 €.',
}

export default function TratamientosPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Page hero */}
        <section
          className="relative overflow-hidden border-b border-cream-400 px-4 sm:px-6 lg:px-9 py-12 sm:py-16 lg:py-20"
          style={{ background: '#ede9e0' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(600px 400px at 85% 10%, rgba(213, 226, 214, 0.45), transparent 60%),
                radial-gradient(500px 400px at 10% 90%, rgba(245, 228, 219, 0.45), transparent 60%)
              `,
            }}
          />
          <div className="max-w-[1600px] mx-auto relative z-[2]">
            <nav className="flex gap-[10px] items-center text-[12px] tracking-[0.04em] text-carbon-500 mb-6">
              <Link href="/" className="text-carbon-500 border-b border-transparent hover:border-carbon-500 transition-colors">Inicio</Link>
              <span className="text-carbon-400">/</span>
              <span className="text-carbon-900">Tratamientos</span>
            </nav>

            <h1
              className="font-serif font-normal leading-[0.98] tracking-[-0.022em] m-0 mb-4 text-carbon-900 text-balance"
              style={{ fontSize: 'clamp(40px, 5.4vw, 76px)', maxWidth: '16ch' }}
            >
              Terapias Faciales <em className="italic text-brand-600">Pro-Aging</em>
            </h1>
            <p className="text-[16px] sm:text-[17px] text-carbon-500 max-w-[560px] m-0 mb-7 leading-[1.65]">
              Terapias que ayudan a estimular la renovación celular y prolongan la vida
              cutánea, potenciadas con tecnologías BOOST de última generación.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                'Valoración médica previa',
                'Seña de 50 € descontable',
                'Protocolos personalizados',
              ].map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] tracking-[0.1em] uppercase text-brand-700"
                  style={{ border: '1px solid rgba(53,85,57,0.25)', background: 'rgba(213,226,214,0.35)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        <Treatments />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
