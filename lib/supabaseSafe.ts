import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Cliente de solo lectura para metadatos y sitemap.
 *
 * A diferencia de `lib/supabase`, no lanza si faltan las variables de entorno o
 * la URL está mal formada: devuelve null. Así un problema de configuración nunca
 * tumba el build, solo deja el sitemap sin fichas de producto.
 */
export function getReadOnlyClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null

  try {
    new URL(url)
  } catch {
    return null
  }

  try {
    return createClient<Database>(url, anon)
  } catch {
    return null
  }
}
