import type { Metadata } from 'next'
import SkinQuestionnaireForm from '@/components/SkinQuestionnaireForm'

// El enlace se pasa a mano a cada paciente (WhatsApp o email), así que la
// página no debe salir en Google ni acumular visitas sueltas de buscadores.
export const metadata: Metadata = {
  title: 'Cuestionario previo al chequeo de piel — QUEVI Wellness Clinic',
  description: 'Cuestionario médico previo a tu análisis facial en QUEVI Wellness Clinic.',
  robots: { index: false, follow: false },
}

export default function ChequeoPielPage() {
  return (
    <main className="min-h-screen bg-cream-200">
      <SkinQuestionnaireForm />
    </main>
  )
}
