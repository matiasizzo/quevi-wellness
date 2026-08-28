import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

type SaleLine = {
  variant_id?: string
  quantity?: number
  unit_price_cents?: number
}

type Body = {
  action?: 'create' | 'void'
  id?: string
  items?: SaleLine[]
  paymentMethod?: string
  customerName?: string
  customerPhone?: string
  discountCents?: number
  notes?: string
  soldAt?: string
}

const PAYMENT_METHODS = ['efectivo', 'tarjeta', 'bizum', 'otro']

// Si el SQL de supabase/ventas_tienda.sql todavía no se ha ejecutado, la RPC
// no existe y PostgREST devuelve PGRST202. Lo traducimos a un aviso claro.
function missingFunction(err: { code?: string; message?: string } | null) {
  if (!err) return false
  return err.code === 'PGRST202' || (err.message ?? '').includes('Could not find the function')
}

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || req.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Body
  try {
    body = await req.json() as Body
  } catch {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 })

  const action = body.action ?? 'create'

  // ── Anular una venta (devuelve el stock) ──────────────────────────────────
  if (action === 'void') {
    if (!body.id) {
      return NextResponse.json({ error: 'Falta el id de la venta' }, { status: 400 })
    }
    const { data, error } = await supabase.rpc('void_store_sale', { p_sale_id: body.id })
    if (error) {
      if (missingFunction(error)) {
        return NextResponse.json(
          { error: 'Falta ejecutar supabase/ventas_tienda.sql en Supabase' },
          { status: 500 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true, sale: data })
  }

  // ── Registrar una venta ───────────────────────────────────────────────────
  const rawItems = Array.isArray(body.items) ? body.items : []
  const items = rawItems
    .filter(it => it && typeof it.variant_id === 'string' && it.variant_id.trim() !== '')
    .map(it => ({
      variant_id: it.variant_id as string,
      quantity: Math.trunc(Number(it.quantity ?? 0)),
      unit_price_cents:
        it.unit_price_cents === undefined || it.unit_price_cents === null
          ? null
          : Math.max(0, Math.round(Number(it.unit_price_cents))),
    }))

  if (items.length === 0) {
    return NextResponse.json({ error: 'Añade al menos un producto a la venta' }, { status: 400 })
  }
  if (items.some(it => !Number.isFinite(it.quantity) || it.quantity <= 0)) {
    return NextResponse.json({ error: 'Las cantidades deben ser mayores que 0' }, { status: 400 })
  }
  if (items.some(it => it.unit_price_cents !== null && !Number.isFinite(it.unit_price_cents))) {
    return NextResponse.json({ error: 'Precio inválido en alguna línea' }, { status: 400 })
  }

  const paymentMethod = PAYMENT_METHODS.includes(body.paymentMethod ?? '')
    ? body.paymentMethod
    : 'efectivo'

  const discountCents = Math.max(0, Math.round(Number(body.discountCents ?? 0)) || 0)

  let soldAt: string | null = null
  if (body.soldAt) {
    const parsed = new Date(body.soldAt)
    if (!Number.isNaN(parsed.getTime())) soldAt = parsed.toISOString()
  }

  const { data, error } = await supabase.rpc('register_store_sale', {
    p_items: items,
    p_payment_method: paymentMethod,
    p_customer_name: body.customerName ?? null,
    p_customer_phone: body.customerPhone ?? null,
    p_discount_cents: discountCents,
    p_notes: body.notes ?? null,
    p_sold_at: soldAt ?? new Date().toISOString(),
  })

  if (error) {
    if (missingFunction(error)) {
      return NextResponse.json(
        { error: 'Falta ejecutar supabase/ventas_tienda.sql en Supabase' },
        { status: 500 },
      )
    }
    // Los "raise exception" del SQL (stock insuficiente, etc.) llegan aquí con
    // el texto ya en castellano y listo para mostrar al usuario
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, sale: data })
}
