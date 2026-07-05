import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string }

  const trimmed = email?.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 500 })
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: trimmed, source: 'footer' })

  // 23505 = unique_violation → ya estaba suscrito; lo tratamos como éxito
  if (error && error.code !== '23505') {
    console.error('[newsletter] Insert error:', error)
    return NextResponse.json({ error: 'No se pudo guardar. Inténtalo de nuevo.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
