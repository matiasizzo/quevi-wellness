import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Cuestionarios de piel para el panel. Van por su propio endpoint y no dentro
// de /api/admin/data porque la firma pesa: el listado se sirve sin ella y solo
// se pide entera cuando hay que imprimir un cuestionario concreto.

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

const LIST_COLUMNS =
  'id, created_at, patient_name, patient_email, patient_phone, patient_age, answers, signed_at, consent, content_hash'

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || req.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 })

  const id = req.nextUrl.searchParams.get('id')

  // Un cuestionario concreto, con la firma, para imprimirlo
  if (id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db as any)
      .from('skin_questionnaires')
      .select(`${LIST_COLUMNS}, signature, ip, user_agent`)
      .eq('id', id)
      .maybeSingle()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ questionnaire: data })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db as any)
    .from('skin_questionnaires')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) {
    // Si aún no se ha ejecutado supabase/cuestionario_piel.sql, la tabla no
    // existe: se avisa en vez de romper el panel
    const missingTable = error.message.includes('does not exist') || error.code === '42P01'
    return NextResponse.json(
      { error: missingTable ? 'Falta ejecutar supabase/cuestionario_piel.sql en Supabase' : error.message },
      { status: 500 },
    )
  }

  return NextResponse.json({ questionnaires: data ?? [] })
}
