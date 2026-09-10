import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { isFormKey, CONSENTIMIENTOS_OPCIONALES } from '@/lib/questionnaires'

export const dynamic = 'force-dynamic'

// Guarda los cuestionarios de salud que rellena la paciente en /chequeo-piel y
// /chequeo-capilar. Es un endpoint público (no hay login de paciente), así que
// solo acepta lo que necesita y con límites de tamaño: nada de confiar en que
// el cuerpo venga bien formado.

const MAX_BODY = 400_000 // ~400 KB: de sobra para las respuestas y la firma
const MAX_SIGNATURE = 300_000

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function text(value: unknown, max = 400): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  if (raw.length > MAX_BODY) {
    return NextResponse.json({ error: 'El cuestionario es demasiado grande' }, { status: 413 })
  }

  let body: {
    form?: unknown
    answers?: unknown
    signature?: unknown
    consent?: unknown
    declaracion?: unknown
    optionalConsents?: unknown
  }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }

  // Cuál de los dos cuestionarios es
  const form = isFormKey(body.form) ? body.form : null
  if (!form) {
    return NextResponse.json({ error: 'Cuestionario desconocido' }, { status: 400 })
  }

  const answers = (body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers)
    ? body.answers
    : null) as Record<string, unknown> | null

  if (!answers) {
    return NextResponse.json({ error: 'Faltan las respuestas del cuestionario' }, { status: 400 })
  }

  const firstName = text(answers.nombre, 200)
  const surname = text(answers.apellidos, 200)
  const name = [firstName, surname].filter(Boolean).join(' ')
  const email = text(answers.email, 200).toLowerCase()
  const phone = text(answers.telefono, 60)
  const dni = text(answers.dni, 40)
  const birthDate = text(answers.fecha_nacimiento, 40)

  if (!firstName) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 })
  if (!isEmail(email)) return NextResponse.json({ error: 'El correo electrónico no es válido' }, { status: 400 })

  const signature = typeof body.signature === 'string' ? body.signature : ''
  if (!signature.startsWith('data:image/png;base64,') || signature.length > MAX_SIGNATURE) {
    return NextResponse.json({ error: 'Falta la firma o no se pudo leer' }, { status: 400 })
  }

  // El consentimiento para tratar datos de salud es obligatorio: sin él no hay
  // base legal para guardar nada
  if (body.consent !== true || body.declaracion !== true) {
    return NextResponse.json({ error: 'Falta confirmar la declaración y la autorización' }, { status: 400 })
  }

  // Las autorizaciones opcionales: lo que no venga marcado cuenta como No
  const rawOptional = (body.optionalConsents && typeof body.optionalConsents === 'object'
    ? body.optionalConsents
    : {}) as Record<string, unknown>
  const optional: Record<string, boolean> = {}
  for (const c of CONSENTIMIENTOS_OPCIONALES) {
    optional[c.id] = rawOptional[c.id] === 'Sí'
  }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 500 })

  // Huella del contenido firmado: si alguien modificara la fila más adelante,
  // el hash dejaría de cuadrar con lo que firmó la paciente
  const contentHash = createHash('sha256')
    .update(form + JSON.stringify(answers) + signature)
    .digest('hex')

  const now = new Date().toISOString()
  const forwarded = req.headers.get('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0].trim() || null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (db as any).from('health_questionnaires').insert({
    form,
    patient_name: name,
    patient_email: email,
    patient_phone: phone || null,
    patient_dni: dni || null,
    patient_birth_date: birthDate || null,
    answers,
    signature,
    signed_at: now,
    consent: true,
    consent_photos: optional.fotos ?? false,
    consent_comms: optional.comunicaciones ?? false,
    consent_promo: optional.promocion ?? false,
    content_hash: contentHash,
    ip,
    user_agent: (req.headers.get('user-agent') ?? '').slice(0, 400) || null,
  })

  if (error) {
    // El detalle va al log del servidor; a la paciente no se le enseña
    console.error('[skin-questionnaire] Insert error:', error.message)
    const missingTable = error.message.includes('does not exist') || error.code === '42P01'
    return NextResponse.json(
      {
        error: missingTable
          ? 'El cuestionario todavía no está activado en la clínica. Avisa en recepción.'
          : 'No se pudo guardar el cuestionario. Inténtalo de nuevo en unos minutos.',
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true })
}
