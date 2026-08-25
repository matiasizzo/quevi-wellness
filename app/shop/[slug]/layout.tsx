import type { Metadata } from 'next'
import { getReadOnlyClient } from '@/lib/supabaseSafe'

// Convierte 'd-senolytic-serum' en 'D Senolytic Serum' como último recurso
function slugToName(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  let name = slugToName(slug)
  let description = `${name} de Dall'O Skin, cosmética médica formulada bajo demanda. Disponible en QUEVI Wellness Clinic con envío a toda España.`

  try {
    const db = getReadOnlyClient()
    const { data } = db
      ? await db.from('products').select('name, tagline, description').eq('slug', slug).single()
      : { data: null }

    if (data) {
      name = data.name
      description = data.tagline || data.description || description
    }
  } catch {
    // Sin conexión a Supabase usamos los valores derivados del slug
  }

  return {
    alternates: { canonical: `/shop/${slug}` },
    title: name,
    description: description.slice(0, 300),
    openGraph: {
      title: name,
      description: description.slice(0, 300),
      url: `/shop/${slug}`,
      type: 'website',
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children
}
