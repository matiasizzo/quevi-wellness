import type { Metadata } from 'next'
import LeadLanding from '@/components/LeadLanding'
import { LANDING_ES } from '@/lib/landingCopy'

export const metadata: Metadata = {
  title: LANDING_ES.meta.title,
  description: LANDING_ES.meta.description,
  alternates: {
    canonical: '/cita/diagnostico',
    languages: {
      'es-ES': '/cita/diagnostico',
      'en-GB': '/en/skin-consultation',
    },
  },
  openGraph: {
    title: LANDING_ES.meta.title,
    description: LANDING_ES.meta.description,
    url: '/cita/diagnostico',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function DiagnosticoLandingPage() {
  return <LeadLanding copy={LANDING_ES} />
}
