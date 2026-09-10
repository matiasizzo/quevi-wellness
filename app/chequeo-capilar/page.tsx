import type { Metadata } from 'next'
import QuestionnaireForm from '@/components/QuestionnaireForm'
import { FORMS } from '@/lib/questionnaires'

// Igual que el de piel: el enlace se pasa a mano, no se indexa.
export const metadata: Metadata = {
  title: `${FORMS.capilar.title} — QUEVI Wellness Clinic`,
  description: 'Cuestionario médico previo a tu tratamiento capilar en QUEVI Wellness Clinic.',
  robots: { index: false, follow: false },
}

export default function ChequeoCapilarPage() {
  return (
    <main className="min-h-screen bg-cream-200">
      <QuestionnaireForm form="capilar" />
    </main>
  )
}
