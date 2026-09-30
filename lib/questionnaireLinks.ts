import type { DocKey, FormKey } from '@/lib/questionnaires'
import type { Lang } from '@/lib/questionnaires.en'

// Qué documentos abre cada enlace. Lo usan las páginas públicas para saber qué
// pedir y el CRM para montar el enlace que se envía a la paciente, así que la
// regla vive en un solo sitio:
//   /proteccion-datos                      → solo la protección de datos
//   /chequeo-piel                          → protección de datos y después piel
//   /chequeo-piel?solo=cuestionario        → solo el cuestionario de piel
//   (igual con /chequeo-capilar) · ?lang=en para abrirlo en inglés

export function docsForPage(form: FormKey, solo: string | undefined): DocKey[] {
  return solo === 'cuestionario' ? [form] : ['datos', form]
}

export function linkFor(opts: { datos: boolean; form: FormKey | null; lang: Lang }): string | null {
  const { datos, form, lang } = opts
  if (!datos && !form) return null
  const params = new URLSearchParams()
  if (form && !datos) params.set('solo', 'cuestionario')
  if (lang !== 'es') params.set('lang', lang)
  const path = form ? (form === 'piel' ? '/chequeo-piel' : '/chequeo-capilar') : '/proteccion-datos'
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}
