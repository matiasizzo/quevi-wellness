import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizeGiftCode } from '@/lib/giftCode'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { code } = await req.json() as { code?: string }
  const normalized = normalizeGiftCode(code ?? '')

  if (!normalized) {
    return NextResponse.json({ valid: false, error: 'Introduce un código' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ valid: false, error: 'Servicio no disponible' }, { status: 500 })
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase
    .from('gift_cards')
    .select('code, item_name, total_sessions, sessions_used, status, expires_at')
    .eq('code', normalized)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ valid: false, error: 'Código no encontrado' })
  }

  const expired = data.expires_at ? new Date(data.expires_at) < new Date() : false
  const sessionsLeft = Math.max(0, data.total_sessions - data.sessions_used)

  // Solo se exponen datos no sensibles (nada del comprador/destinatario)
  return NextResponse.json({
    valid: true,
    itemName: data.item_name,
    totalSessions: data.total_sessions,
    sessionsUsed: data.sessions_used,
    sessionsLeft,
    status: expired ? 'expired' : data.status,
    expiresAt: data.expires_at,
    usable: !expired && data.status === 'active' && sessionsLeft > 0,
  })
}
