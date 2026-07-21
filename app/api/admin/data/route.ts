import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  const authHeader = request.headers.get('x-admin-password')

  if (!adminPassword || authHeader !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getSupabase()
  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  const [ordersRes, appointmentsRes, bookingsRes, productsRes, giftCardsRes] = await Promise.all([
    db.from('orders')
      .select('id, status, subtotal_cents, shipping_cents, total_cents, stripe_payment_intent_id, notes, created_at')
      .order('created_at', { ascending: false })
      .limit(200),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).from('appointments')
      .select('id, name, email, phone, service, appointment_date, appointment_time, notes, amount_cents, status, stripe_session_id, created_at')
      .order('created_at', { ascending: false })
      .limit(200),

    db.from('bookings')
      .select('id, name, email, phone, service, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200),

    db.from('products')
      .select(`
        id, name, slug, active, featured, image_url,
        product_variants (id, name, price_cents, stock_quantity, is_default, active)
      `)
      .order('name', { ascending: true }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (db as any).from('gift_cards')
      .select('id, code, item_name, amount_cents, total_sessions, sessions_used, status, purchaser_name, recipient_name, recipient_email, message, created_at, expires_at')
      .order('created_at', { ascending: false })
      .limit(300),
  ])

  return NextResponse.json({
    orders: ordersRes.data ?? [],
    appointments: appointmentsRes.data ?? [],
    bookings: bookingsRes.data ?? [],
    products: productsRes.data ?? [],
    giftCards: giftCardsRes.data ?? [],
  })
}
