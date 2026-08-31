import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/database.types'

/** Campos de atribución que acepta el formulario. Todo lo demás se ignora. */
const ATTRIBUTION_FIELDS = [
  'gclid',
  'wbraid',
  'gbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'landing_page',
] as const

/** Recorta y descarta vacíos: en la base preferimos null a cadena vacía. */
function clean(value: unknown, max = 512): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : null
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, phone, service, message, locale, source } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Identificadores de campaña: sin esto no hay conversiones offline en Ads
  const attribution: Record<string, string | null> = {}
  for (const field of ATTRIBUTION_FIELDS) {
    attribution[field] = clean(body[field])
  }

  const { error } = await supabase.from('bookings').insert({
    name: clean(name, 200)!,
    email: clean(email, 200)!,
    phone: clean(phone, 40),
    service: clean(service, 200),
    message: clean(message, 2000),
    locale: clean(locale, 5),
    source: clean(source, 40),
    ...attribution,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
