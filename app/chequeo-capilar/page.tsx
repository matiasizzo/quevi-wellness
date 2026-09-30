import type { Metadata } from 'next'
import QuestionnaireFlow from '@/components/QuestionnaireForm'
import { FORMS } from '@/lib/questionnaires'
import { isLang } from '@/lib/questionnaires.en'
import { docsForPage } from '@/lib/questionnaireLinks'

// Igual que el de piel: el enlace se pasa a mano, no se indexa.
export const metadata: Metadata = {
  title: `${FORMS.capilar.title} — QUEVI Wellness Clinic`,
  description: 'Cuestionario médico previo a tu tratamiento capilar en QUEVI Wellness Clinic.',
  robots: { index: false, follow: false },
}

export default async function ChequeoCapilarPage({
  searchParams,
}: {
  searchParams: Promise<{ solo?: string; lang?: string }>
}) {
  const { solo, lang } = await searchParams
  return (
    <main className="min-h-screen bg-cream-200">
      <QuestionnaireFlow docs={docsForPage('capilar', solo)} initialLang={isLang(lang) ? lang : 'es'} />
    </main>
  )
}
