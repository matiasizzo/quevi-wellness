import type { Metadata } from 'next'
import QuestionnaireFlow from '@/components/QuestionnaireForm'
import { PROTECCION_DATOS } from '@/lib/questionnaires'
import { isLang } from '@/lib/questionnaires.en'

// Solo el documento de protección de datos, para firmarlo aparte del
// cuestionario. Como los cuestionarios, el enlace se pasa a mano y no se indexa.
export const metadata: Metadata = {
  title: `${PROTECCION_DATOS.title} — QUEVI Wellness Clinic`,
  description: 'Protección de datos y consentimiento de QUEVI Wellness Clinic.',
  robots: { index: false, follow: false },
}

export default async function ProteccionDatosPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const { lang } = await searchParams
  return (
    <main className="min-h-screen bg-cream-200">
      <QuestionnaireFlow docs={['datos']} initialLang={isLang(lang) ? lang : 'es'} />
    </main>
  )
}
