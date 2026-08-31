import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, service, date, time, notes, attribution } = body

    // Identificadores de campaña: permiten la conversión offline en Google Ads
    const attr = (attribution ?? {}) as Record<string, string | undefined>
    const campaign = {
      gclid: attr.gclid ?? null,
      wbraid: attr.wbraid ?? null,
      gbraid: attr.gbraid ?? null,
      utm_source: attr.utm_source ?? null,
      utm_medium: attr.utm_medium ?? null,
      utm_campaign: attr.utm_campaign ?? null,
    }

    if (!name || !email || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email, servicio, fecha y hora.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServiceClient()
    if (supabase) {
      const { error: dbError } = await supabase.from('appointments').insert({
        name, email,
        phone: phone ?? null,
        service,
        appointment_date: date,
        appointment_time: time,
        notes: notes ?? null,
        amount_cents: 5000,
        status: 'pending',
        ...campaign,
      })
      if (dbError) console.error('[checkout/appointment] Supabase insert error:', dbError)
    }

    const stripe = getStripe()
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: 5000,
          product_data: {
            name: 'Consulta médica QUEVI',
            description: `${service} — ${date} a las ${time}`,
          },
        },
        quantity: 1,
      }],
      success_url: `${siteUrl}/cita/confirmada?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#booking`,
      customer_email: email,
      metadata: { name, phone: phone ?? '', service, appointment_date: date, appointment_time: time, notes: notes ?? '' },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout/appointment] Error:', msg)
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    )
  }
}
