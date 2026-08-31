import type { Metadata } from 'next'
import LeadLanding from '@/components/LeadLanding'
import { LANDING_EN } from '@/lib/landingCopy'

export const metadata: Metadata = {
  title: LANDING_EN.meta.title,
  description: LANDING_EN.meta.description,
  alternates: {
    canonical: '/en/skin-consultation',
    languages: {
      'en-GB': '/en/skin-consultation',
      'es-ES': '/cita/diagnostico',
    },
  },
  openGraph: {
    title: LANDING_EN.meta.title,
    description: LANDING_EN.meta.description,
    url: '/en/skin-consultation',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function SkinConsultationLandingPage() {
  return <LeadLanding copy={LANDING_EN} />
}
