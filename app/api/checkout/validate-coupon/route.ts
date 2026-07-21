import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { code } = await req.json() as { code: string }

  if (!code?.trim()) {
    return NextResponse.json({ valid: false, error: 'Introduce un código' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.json({ valid: false, error: 'Servicio no disponible' }, { status: 500 })
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const { data, error } = await supabase
    .from('discount_codes')
    .select('code, discount_percent, max_uses, uses, scope')
    .eq('code', code.trim().toUpperCase())
    .eq('active', true)
    .single()

  if (error || !data) {
    return NextResponse.json({ valid: false, error: 'Código no válido' })
  }

  if (data.max_uses !== null && data.uses >= data.max_uses) {
    return NextResponse.json({ valid: false, error: 'Este código ha llegado a su límite de usos' })
  }

  return NextResponse.json({
    valid: true,
    code: data.code,
    discountPercent: data.discount_percent,
    scope: data.scope === 'products' ? 'products' : 'all',
  })
}
