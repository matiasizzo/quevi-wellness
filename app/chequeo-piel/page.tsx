import type { Metadata } from 'next'
import QuestionnaireForm from '@/components/QuestionnaireForm'
import { FORMS } from '@/lib/questionnaires'

// El enlace se pasa a mano a cada paciente (WhatsApp o email), así que la
// página no debe salir en Google ni acumular visitas sueltas de buscadores.
export const metadata: Metadata = {
  title: `${FORMS.piel.title} — QUEVI Wellness Clinic`,
  description: 'Cuestionario médico previo a tu análisis facial en QUEVI Wellness Clinic.',
  robots: { index: false, follow: false },
}

export default function ChequeoPielPage() {
  return (
    <main className="min-h-screen bg-cream-200">
      <QuestionnaireForm form="piel" />
    </main>
  )
}
