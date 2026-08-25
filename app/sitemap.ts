import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from '@/lib/blogPosts'
import { getReadOnlyClient } from '@/lib/supabaseSafe'

const base = 'https://queviwellnessclinic.es'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const core: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tratamientos`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/rituales`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/shop`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.dateISO ? new Date(post.dateISO) : now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  // Fichas de producto: se leen de Supabase para no tener que mantener la lista a mano
  let products: MetadataRoute.Sitemap = []
  try {
    const db = getReadOnlyClient()
    const { data } = db
      ? await db.from('products').select('slug, updated_at')
      : { data: null }
    if (data) {
      products = data
        .filter((p) => Boolean(p?.slug))
        .map((p) => ({
          url: `${base}/shop/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
    }
  } catch {
    // Si Supabase no responde el sitemap sigue siendo válido sin las fichas
  }

  const legal: MetadataRoute.Sitemap = [
    '/aviso-legal',
    '/privacidad',
    '/terminos',
    '/politica-cookies',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.2,
  }))

  return [...core, ...posts, ...products, ...legal]
}
