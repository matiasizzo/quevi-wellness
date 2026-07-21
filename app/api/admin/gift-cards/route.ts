import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || req.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, action } = await req.json() as { id?: string; action?: 'use' | 'cancel' | 'reactivate' }
  if (!id || !action) {
    return NextResponse.json({ error: 'id y action requeridos' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 })

  const { data: card, error: readErr } = await supabase
    .from('gift_cards')
    .select('id, total_sessions, sessions_used, status')
    .eq('id', id)
    .maybeSingle()

  if (readErr || !card) {
    return NextResponse.json({ error: 'Vale no encontrado' }, { status: 404 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let update: any = {}

  if (action === 'cancel') {
    update = { status: 'cancelled' }
  } else if (action === 'reactivate') {
    update = { status: 'active', redeemed_at: null }
  } else if (action === 'use') {
    if (card.status !== 'active') {
      return NextResponse.json({ error: 'El vale no está activo' }, { status: 400 })
    }
    const used = card.sessions_used + 1
    const fullyUsed = used >= card.total_sessions
    update = {
      sessions_used: used,
      status: fullyUsed ? 'redeemed' : 'active',
      redeemed_at: fullyUsed ? new Date().toISOString() : null,
    }
  }

  const { error: updErr } = await supabase.from('gift_cards').update(update).eq('id', id)
  if (updErr) {
    return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
