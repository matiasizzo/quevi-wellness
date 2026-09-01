#!/usr/bin/env node
/**
 * Rellena en el CRM los datos de quien pagó, en los cobros que no salieron del
 * checkout de la web: links de pago enviados a mano y señas de cita.
 *
 * Esos cobros llegaban al panel con el importe y nada más, porque Stripe no
 * manda nuestra metadata. Este script se los pide a Stripe (nombre, email,
 * teléfono si el link lo recoge, y el concepto que se cobró) y los escribe en
 * las filas que están vacías. El webhook ya lo hace solo para los nuevos: esto
 * es para los que ya estaban.
 *
 *   node scripts/backfill-stripe-payer.mjs            # solo enseña qué haría
 *   node scripts/backfill-stripe-payer.mjs --apply    # escribe los cambios
 *
 * Necesita en el entorno (o en .env.local):
 *   STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import fs from 'node:fs'
import path from 'node:path'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// ── Entorno ──────────────────────────────────────────────────────────────────
const envFile = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const { STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
const missing = ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
  .filter(k => !process.env[k])
if (missing.length) {
  console.error(`Faltan variables de entorno: ${missing.join(', ')}`)
  process.exit(1)
}

const apply = process.argv.includes('--apply')
const stripe = new Stripe(STRIPE_SECRET_KEY)
const db = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

// ── Datos del pagador, tal y como los guarda Stripe ──────────────────────────
async function payerFromPaymentIntent(paymentIntentId) {
  const payer = { name: '', email: '', phone: '', items: [], source: 'stripe' }

  const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 })
  const session = sessions.data[0]
  if (session) {
    payer.name = session.customer_details?.name ?? ''
    payer.email = session.customer_email ?? session.customer_details?.email ?? ''
    payer.phone = session.customer_details?.phone ?? ''
    payer.source = session.payment_link ? 'payment_link' : 'stripe_checkout'
    const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 })
    payer.items = lines.data.map(l => {
      const qty = Math.max(1, l.quantity ?? 1)
      return { name: l.description ?? 'Concepto sin nombre', quantity: qty, price: Math.round((l.amount_total ?? 0) / qty) / 100 }
    })
  }

  if (!payer.name || !payer.email || !payer.phone) {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
    const billing = pi.latest_charge?.billing_details
    payer.name = payer.name || (billing?.name ?? '')
    payer.email = payer.email || billing?.email || pi.receipt_email || ''
    payer.phone = payer.phone || (billing?.phone ?? '')
  }

  return payer
}

// ── Pedidos sin nombre ───────────────────────────────────────────────────────
async function backfillOrders() {
  const { data: orders, error } = await db
    .from('orders')
    .select('id, total_cents, created_at, stripe_payment_intent_id, shipping_address')
    .in('status', ['paid', 'completed'])
    .not('stripe_payment_intent_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(300)
  if (error) throw error

  const blank = orders.filter(o => {
    const a = o.shipping_address ?? {}
    return !a.name && !a.email
  })
  console.log(`Pedidos cobrados sin datos de cliente: ${blank.length} de ${orders.length}`)

  for (const o of blank) {
    let payer
    try {
      payer = await payerFromPaymentIntent(o.stripe_payment_intent_id)
    } catch (e) {
      console.error(`  ✗ ${o.id}: no se pudo consultar Stripe — ${e.message}`)
      continue
    }
    if (!payer.name && !payer.email && !payer.phone) {
      console.log(`  · ${o.id}: Stripe tampoco tiene datos del pagador`)
      continue
    }

    const previous = o.shipping_address ?? {}
    const next = {
      ...previous,
      name: previous.name || payer.name,
      email: previous.email || payer.email,
      phone: previous.phone || payer.phone,
      source: previous.source ?? payer.source,
      items: previous.items?.length ? previous.items : payer.items,
    }

    console.log(`  ✓ ${o.id} · ${(o.total_cents / 100).toFixed(2)} € → ${next.name || '(sin nombre)'} · ${next.email || '(sin email)'}${next.phone ? ` · ${next.phone}` : ''}`)
    if (apply) {
      const { error: upErr } = await db.from('orders').update({ shipping_address: next }).eq('id', o.id)
      if (upErr) console.error(`    error al guardar: ${upErr.message}`)
    }
  }
}

// ── Citas sin nombre ─────────────────────────────────────────────────────────
async function backfillAppointments() {
  const { data: appts, error } = await db
    .from('appointments')
    .select('id, name, email, phone, service, stripe_session_id, created_at')
    .order('created_at', { ascending: false })
    .limit(300)
  if (error) throw error

  const blank = appts.filter(a => a.stripe_session_id && (!a.name || !a.service))
  console.log(`\nCitas sin nombre o sin concepto: ${blank.length} de ${appts.length}`)

  for (const a of blank) {
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(a.stripe_session_id)
    } catch (e) {
      console.error(`  ✗ ${a.id}: no se pudo consultar Stripe — ${e.message}`)
      continue
    }

    const patch = {}
    if (!a.name && session.customer_details?.name) patch.name = session.customer_details.name
    if (!a.email && session.customer_details?.email) patch.email = session.customer_details.email
    if (!a.phone && session.customer_details?.phone) patch.phone = session.customer_details.phone
    if (!a.service) {
      try {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 20 })
        const concept = lines.data.map(l => l.description).filter(Boolean).join(' · ')
        if (concept) patch.service = concept
      } catch { /* el concepto es opcional */ }
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  · ${a.id}: Stripe tampoco tiene datos`)
      continue
    }

    console.log(`  ✓ ${a.id} → ${JSON.stringify(patch)}`)
    if (apply) {
      const { error: upErr } = await db.from('appointments').update(patch).eq('id', a.id)
      if (upErr) console.error(`    error al guardar: ${upErr.message}`)
    }
  }
}

await backfillOrders()
await backfillAppointments()
console.log(apply ? '\nHecho: cambios guardados.' : '\nSimulación. Repite con --apply para guardar los cambios.')
