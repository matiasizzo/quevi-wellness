import type { Metadata } from 'next'
import QuestionnaireFlow from '@/components/QuestionnaireForm'
import { FORMS } from '@/lib/questionnaires'
import { isLang } from '@/lib/questionnaires.en'
import { docsForPage } from '@/lib/questionnaireLinks'

// El enlace se pasa a mano a cada paciente (WhatsApp o email), así que la
// página no debe salir en Google ni acumular visitas sueltas de buscadores.
export const metadata: Metadata = {
  title: `${FORMS.piel.title} — QUEVI Wellness Clinic`,
  description: 'Cuestionario médico previo a tu análisis facial en QUEVI Wellness Clinic.',
  robots: { index: false, follow: false },
}

// Por defecto pide primero la protección de datos y después el cuestionario;
// con ?solo=cuestionario, solo el cuestionario (ver lib/questionnaireLinks.ts)
export default async function ChequeoPielPage({
  searchParams,
}: {
  searchParams: Promise<{ solo?: string; lang?: string }>
}) {
  const { solo, lang } = await searchParams
  return (
    <main className="min-h-screen bg-cream-200">
      <QuestionnaireFlow docs={docsForPage('piel', solo)} initialLang={isLang(lang) ? lang : 'es'} />
    </main>
  )
}
