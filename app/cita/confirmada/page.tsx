import { CheckCircle2, CalendarDays, Clock, Stethoscope, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PurchaseConversion from '@/components/PurchaseConversion'

export const metadata = {
  title: '¡Cita confirmada! — QUEVI Wellness Clinic',
  description: 'Tu cita médica en QUEVI ha sido confirmada y el pago procesado correctamente.',
}

export default async function CitaConfirmadaPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  return (
    <>
      {/* Seña de la cita: 50 € */}
      <PurchaseConversion value={50} transactionId={sessionId} />
      <Navbar />
      <main className="min-h-screen bg-cream-200 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24">
          <div className="w-full max-w-lg">
            {/* Card */}
            <div className="bg-cream-100 border border-cream-400 rounded-3xl p-10 shadow-brand text-center">
              {/* Check icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                  <CheckCircle2 size={40} className="text-brand-600" strokeWidth={1.5} />
                </div>
              </div>

              {/* Badge */}
              <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium tracking-wide uppercase mb-5">
                Pago confirmado · 50,00€
              </span>

              {/* Heading */}
              <h1 className="font-serif font-normal text-3xl sm:text-4xl leading-tight tracking-tight text-carbon-900 mb-4">
                ¡Cita{' '}
                <em className="italic font-normal text-brand-600">confirmada!</em>
              </h1>

              {/* Subtext */}
              <p className="text-carbon-500 text-base leading-relaxed mb-8 max-w-sm mx-auto">
                Recibirás un email de confirmación con los detalles de tu cita.
                Nos vemos pronto.
              </p>

              {/* Detail chips */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream-200 border border-cream-400">
                  <CalendarDays size={15} className="text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-carbon-700 font-medium">
                    Fecha confirmada
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream-200 border border-cream-400">
                  <Clock size={15} className="text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-carbon-700 font-medium">
                    Hora reservada
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream-200 border border-cream-400">
                  <Stethoscope size={15} className="text-brand-600 flex-shrink-0" />
                  <span className="text-sm text-carbon-700 font-medium">
                    Consulta médica
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 font-medium rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-brand hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
              >
                <ArrowLeft size={16} />
                Volver al inicio
              </Link>

              {/* Session reference */}
              {sessionId && (
                <p className="mt-6 text-xs text-carbon-300 break-all">
                  Ref: {sessionId}
                </p>
              )}
            </div>

            {/* Reassurance note */}
            <p className="mt-6 text-center text-xs text-carbon-400 leading-relaxed">
              Puedes cancelar tu cita hasta 24h antes sin coste alguno.
              <br />
              ¿Necesitas ayuda?{' '}
              <a
                href="mailto:info@quevi.com"
                className="underline hover:text-brand-600 transition-colors"
              >
                info@quevi.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
