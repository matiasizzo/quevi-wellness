import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import { fetchPayerDetailsById } from '@/lib/stripePayer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Rellena los datos de quien pagó en las ventas que ya estaban guardadas sin
// ellos: los cobros con link de pago y las señas de cita anteriores al cambio
// del webhook. Solo escribe en los huecos, nunca pisa un dato que ya exista.
//
// Se procesa un puñado por llamada (cada fila son 2-3 consultas a Stripe) y se
// devuelve cuántas quedan, para poder repetir hasta terminar.
const BATCH = 20

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || req.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabase()
  if (!db) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 })

  let stripe: ReturnType<typeof getStripe>
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: 'Falta STRIPE_SECRET_KEY' }, { status: 500 })
  }

  let updated = 0
  let withoutData = 0
  let failed = 0
  let pending = 0
  // Qué encontró Stripe en cada venta, para poder ver desde el panel por qué
  // alguna sigue sin nombre
  const report: { fecha: string; importe: number; nombre: string; email: string; telefono: string; origen: string }[] = []

  // ── Pedidos cobrados sin nombre ni email ──────────────────────────────────
  const { data: orders, error: ordersErr } = await db
    .from('orders')
    .select('id, total_cents, created_at, stripe_payment_intent_id, shipping_address')
    .in('status', ['paid', 'completed'])
    .not('stripe_payment_intent_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(300)

  if (ordersErr) {
    return NextResponse.json({ error: ordersErr.message }, { status: 500 })
  }

  // Falta el nombre o falta el email: los links de pago que no piden la
  // dirección de facturación dejan uno de los dos vacío
  const blankOrders = (orders ?? []).filter(o => {
    const a = (o.shipping_address ?? {}) as Json
    return !a?.name || !a?.email
  })
  pending += Math.max(0, blankOrders.length - BATCH)

  for (const o of blankOrders.slice(0, BATCH)) {
    try {
      const payer = await fetchPayerDetailsById(stripe, o.stripe_payment_intent_id as string)
      report.push({
        fecha: String(o.created_at ?? '').slice(0, 10),
        importe: (o.total_cents ?? 0) / 100,
        nombre: payer.name,
        email: payer.email,
        telefono: payer.phone,
        origen: payer.source,
      })
      if (!payer.name && !payer.email && !payer.phone) {
        withoutData++
        continue
      }
      const previous = (o.shipping_address ?? {}) as Json
      const next = {
        ...previous,
        name: previous?.name || payer.name,
        email: previous?.email || payer.email,
        phone: previous?.phone || payer.phone,
        source: previous?.source ?? payer.source,
        items: previous?.items?.length ? previous.items : payer.items,
      }
      const { error } = await db.from('orders').update({ shipping_address: next }).eq('id', o.id)
      if (error) {
        console.error('[backfill-stripe] Order update error:', error.message)
        failed++
      } else {
        updated++
      }
    } catch (e) {
      console.error('[backfill-stripe] Stripe error en el pedido', o.id, e)
      failed++
    }
  }

  // ── Citas sin nombre o sin concepto ───────────────────────────────────────
  let apptsUpdated = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: appts } = await (db as any)
    .from('appointments')
    .select('id, name, email, phone, service, stripe_session_id, created_at')
    .not('stripe_session_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(300)

  const blankAppts = ((appts ?? []) as Json[]).filter(a => !a.name || !a.service)
  pending += Math.max(0, blankAppts.length - BATCH)

  for (const a of blankAppts.slice(0, BATCH)) {
    try {
      const session = await stripe.checkout.sessions.retrieve(a.stripe_session_id as string)
      const patch: Record<string, string> = {}
      if (!a.name && session.customer_details?.name) patch.name = session.customer_details.name
      if (!a.email && session.customer_details?.email) patch.email = session.customer_details.email
      if (!a.phone && session.customer_details?.phone) patch.phone = session.customer_details.phone
      if (!a.service) {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })
        const concept = lines.data.map(l => l.description).filter(Boolean).join(' · ')
        if (concept) patch.service = concept
      }
      if (Object.keys(patch).length === 0) {
        withoutData++
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (db as any).from('appointments').update(patch).eq('id', a.id)
      if (error) {
        console.error('[backfill-stripe] Appointment update error:', error.message)
        failed++
      } else {
        apptsUpdated++
      }
    } catch (e) {
      console.error('[backfill-stripe] Stripe error en la cita', a.id, e)
      failed++
    }
  }

  return NextResponse.json({
    success: true,
    orders: updated,
    appointments: apptsUpdated,
    withoutData,
    failed,
    pending,
    // Las ventas en las que Stripe tampoco tiene nombre: sirven para saber si
    // hay que activar la recogida de nombre y teléfono en el link de pago
    sinNombre: report.filter(r => !r.nombre),
  })
}
