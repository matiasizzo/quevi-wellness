import type { Metadata } from 'next'
import { getReadOnlyClient } from '@/lib/supabaseSafe'

const BRAND = 'QUEVI Wellness Clinic'
const CONTEXT =
  'Cosmética médica Dall\'O Skin. Envío a toda España desde Estepona, Málaga.'

// Convierte 'd-senolytic-serum' en 'D Senolytic Serum' como último recurso
function slugToName(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Recorta en el último espacio antes del límite: Google muestra ~160 caracteres
// y una descripción partida a mitad de palabra queda mal en los resultados.
function truncate(text: string, max: number) {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '') + '…'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  let name = slugToName(slug)
  let detail = ''

  try {
    const db = getReadOnlyClient()
    const { data } = db
      ? await db
          .from('products')
          .select('name, tagline, description')
          .eq('slug', slug)
          .single()
      : { data: null }

    if (data) {
      name = data.name
      detail = [data.tagline, data.description].filter(Boolean).join('. ')
    }
  } catch {
    // Sin conexión a Supabase usamos los valores derivados del slug
  }

  // La plantilla de título del layout raíz no se aplica en este segmento,
  // así que componemos el título completo a mano.
  const title = `${name} — Dall'O Skin | ${BRAND}`

  // Las taglines de catálogo son muy cortas para una meta description útil:
  // las completamos con el contexto de marca hasta una longitud razonable.
  const description = truncate(
    (detail ? `${name}: ${detail}. ${CONTEXT}` : `${name}. ${CONTEXT}`).replace(/\.\.+/g, '.'),
    160
  )

  return {
    alternates: { canonical: `/shop/${slug}` },
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      url: `/shop/${slug}`,
      type: 'website',
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
