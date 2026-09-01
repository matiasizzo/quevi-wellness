'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────

type OrderItem = {
  name?: string
  vol?: string
  quantity?: number
  price?: number
  sessions?: number
}

type ShippingAddress = {
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  deliveryMethod?: 'ship' | 'pickup'
  couponCode?: string | null
  discountCents?: number
  items?: OrderItem[]
  // De dónde vino el cobro cuando no salió del checkout de la web
  source?: 'payment_link' | 'stripe_checkout' | 'stripe' | null
}

// Etiqueta para los cobros que no nacen de la tienda online
const ORDER_SOURCE_LABELS: Record<string, string> = {
  payment_link: 'link de pago',
  stripe_checkout: 'cobro stripe',
}

type Order = {
  id: string
  status: string
  subtotal_cents: number
  shipping_cents: number
  total_cents: number
  stripe_payment_intent_id: string | null
  notes: string | null
  shipping_address: ShippingAddress | null
  created_at: string
}

type Appointment = {
  id: string
  name: string
  email: string
  phone: string | null
  service: string
  appointment_date: string
  appointment_time: string
  notes: string | null
  amount_cents: number
  status: string
  stripe_session_id: string | null
  created_at: string
}

type Booking = {
  id: string
  name: string
  email: string
  phone: string | null
  service: string | null
  message: string | null
  status: string
  created_at: string
}

type Variant = {
  id: string
  name: string
  price_cents: number
  stock_quantity: number
  is_default: boolean
  active: boolean
}

type Product = {
  id: string
  name: string
  slug: string
  active: boolean
  featured: boolean
  image_url: string | null
  product_variants: Variant[]
}

type GiftCard = {
  id: string
  code: string
  item_name: string
  amount_cents: number
  total_sessions: number
  sessions_used: number
  status: string
  purchaser_name: string | null
  recipient_name: string | null
  recipient_email: string | null
  message: string | null
  created_at: string
  expires_at: string | null
}

type StoreSaleItem = {
  variant_id: string | null
  product_name: string
  variant_name: string
  quantity: number
  unit_price_cents: number
}

type StoreSale = {
  id: string
  sold_at: string
  payment_method: string
  customer_name: string | null
  customer_phone: string | null
  subtotal_cents: number
  discount_cents: number
  total_cents: number
  items: StoreSaleItem[]
  notes: string | null
  status: string
  cancelled_at: string | null
  created_at: string
}

type AdminData = {
  orders: Order[]
  appointments: Appointment[]
  bookings: Booking[]
  products: Product[]
  giftCards: GiftCard[]
  storeSales: StoreSale[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function euros(cents: number) {
  return (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    completed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    new: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
    refunded: 'bg-red-500/20 text-red-300 border-red-500/30',
  }
  const cls = map[status] ?? 'bg-zinc-700/50 text-zinc-300 border-zinc-500'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-[0.06em] uppercase ${cls}`}>
      {status}
    </span>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-600/80 bg-zinc-800/60 px-5 py-4">
      <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-400 mb-1">{label}</p>
      <p className="font-mono text-[26px] font-semibold text-zinc-100 leading-none">{value}</p>
      {sub && <p className="text-[12px] text-zinc-400 mt-1">{sub}</p>}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function Empty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-3 opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
      <p className="text-[14px]">{label}</p>
    </div>
  )
}

// ── Tab: Ventas (pedidos online cobrados + ventas manuales en tienda) ─────────

// Un pedido online solo es una venta cuando se ha cobrado. Los "pending" son
// checkouts que nadie llegó a pagar: ensucian la lista y no se muestran.
const ORDER_SALE_STATUSES = ['paid', 'completed', 'refunded']

type SaleRow =
  | { kind: 'online'; key: string; date: string; total: number; counted: boolean; order: Order }
  | { kind: 'manual'; key: string; date: string; total: number; counted: boolean; sale: StoreSale }

function VentasTab({
  orders,
  storeSales,
  pw,
  onChanged,
}: {
  orders: Order[]
  storeSales: StoreSale[]
  pw: string
  onChanged: () => void
}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'all' | 'online' | 'manual'>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [syncSinNombre, setSyncSinNombre] = useState<{ fecha: string; importe: number; email: string; telefono: string }[]>([])

  const onlineRows: SaleRow[] = orders
    .filter(o => ORDER_SALE_STATUSES.includes(o.status))
    .map(o => ({
      kind: 'online',
      key: `order-${o.id}`,
      date: o.created_at,
      total: o.total_cents,
      counted: o.status === 'paid' || o.status === 'completed',
      order: o,
    }))

  // Las ventas de mostrador aparecen aquí en cuanto se registran, junto a las
  // online, ordenadas por fecha
  const manualRows: SaleRow[] = storeSales.map(s => ({
    kind: 'manual',
    key: `store-${s.id}`,
    date: s.sold_at,
    total: s.total_cents,
    counted: s.status !== 'cancelled',
    sale: s,
  }))

  const hiddenPending = orders.length - onlineRows.length

  const rows = [...onlineRows, ...manualRows]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const counted = rows.filter(r => r.counted)
  const total = counted.reduce((s, r) => s + r.total, 0)

  const byKind = kind === 'all' ? rows : rows.filter(r => r.kind === kind)

  const q = query.trim().toLowerCase()
  const filtered = !q ? byKind : byKind.filter(r => {
    const fields: (string | null | undefined)[] = r.kind === 'online'
      ? [
          r.order.shipping_address?.name,
          r.order.shipping_address?.email,
          r.order.shipping_address?.phone,
          r.order.shipping_address?.city,
          r.order.id,
          r.order.stripe_payment_intent_id,
          ...(r.order.shipping_address?.items ?? []).map(i => i.name),
        ]
      : [
          r.sale.customer_name,
          r.sale.customer_phone,
          r.sale.notes,
          r.sale.id,
          ...(r.sale.items ?? []).map(i => `${i.product_name} ${i.variant_name}`),
        ]
    return fields.filter(Boolean).some(v => String(v).toLowerCase().includes(q))
  })

  function copy(text: string) {
    navigator.clipboard?.writeText(text)
  }

  // Recupera de Stripe los datos de las ventas antiguas que se guardaron sin
  // ellos (cobros con link de pago y señas anteriores al arreglo del webhook)
  async function syncStripeData() {
    setSyncMsg('')
    setSyncSinNombre([])
    setActionError('')
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/backfill-stripe', {
        method: 'POST',
        headers: { 'x-admin-password': pw },
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setActionError(json.error ?? 'No se pudieron recuperar los datos de Stripe')
        return
      }
      const partes = [
        `${json.orders} ventas actualizadas`,
        json.appointments ? `${json.appointments} citas actualizadas` : '',
        json.withoutData ? `${json.withoutData} sin datos en Stripe` : '',
        json.failed ? `${json.failed} con error` : '',
        json.pending ? `quedan ${json.pending}, vuelve a pulsar` : '',
      ].filter(Boolean)
      setSyncMsg(partes.join(' · '))
      setSyncSinNombre(Array.isArray(json.sinNombre) ? json.sinNombre : [])
      onChanged()
    } catch {
      setActionError('Error de red')
    } finally {
      setSyncing(false)
    }
  }

  async function voidSale(id: string) {
    if (!confirm('¿Anular esta venta? El stock volverá a como estaba antes.')) return
    setActionError('')
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/store-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({ action: 'void', id }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setActionError(json.error ?? 'No se pudo anular la venta')
        return
      }
      onChanged()
    } catch {
      setActionError('Error de red')
    } finally {
      setBusyId(null)
    }
  }

  function printOrder(o: Order) {
    const a = o.shipping_address ?? {}
    const items = a.items ?? []
    const ref = o.stripe_payment_intent_id
      ? o.stripe_payment_intent_id.replace('pi_', '').slice(-8).toUpperCase()
      : o.id.slice(0, 8).toUpperCase()
    const esc = (s: unknown) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))
    const isPickup = a.deliveryMethod === 'pickup'
    const discount = o.subtotal_cents + o.shipping_cents - o.total_cents

    const rows = items.map((i) => {
      const qty = Number(i.quantity) || 1
      const unit = typeof i.price === 'number' ? i.price : 0
      return `<tr>
        <td>${esc(i.name)}${i.vol ? ` <span class="muted">· ${esc(i.vol)}</span>` : ''}${i.sessions && i.sessions > 1 ? ` <span class="muted">· ${i.sessions} sesiones</span>` : ''}</td>
        <td class="c">${qty}</td>
        <td class="r">${euros(Math.round(unit * 100))}</td>
        <td class="r">${euros(Math.round(unit * 100) * qty)}</td>
      </tr>`
    }).join('')

    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
      <title>Pedido #${ref} — QUEVI</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color: #1a1d1a; margin: 0; padding: 32px 36px; font-size: 13px; }
        .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2e4a32; padding-bottom: 16px; margin-bottom: 20px; }
        .brand { font-size: 22px; letter-spacing: 5px; color: #2e4a32; font-weight: 700; }
        .brand small { display: block; font-size: 9px; letter-spacing: 3px; color: #5c6158; font-weight: 400; margin-top: 2px; }
        .ref { text-align: right; }
        .ref .n { font-size: 20px; font-weight: 700; }
        .ref .d { font-size: 12px; color: #5c6158; margin-top: 2px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 22px; }
        .box { border: 1px solid #ddd6c7; border-radius: 8px; padding: 12px 14px; }
        .box h3 { margin: 0 0 8px; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #5c6158; }
        .box p { margin: 2px 0; line-height: 1.5; }
        .pickup { background: #e4ecdf; border-color: #2e4a32; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th { text-align: left; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #5c6158; border-bottom: 1.5px solid #2e4a32; padding: 8px 6px; }
        td { padding: 9px 6px; border-bottom: 1px solid #eee; }
        th.c, td.c { text-align: center; } th.r, td.r { text-align: right; }
        .muted { color: #999; font-size: 11px; }
        .totals { width: 260px; margin-left: auto; }
        .totals tr td { border: none; padding: 3px 6px; }
        .totals .tot td { border-top: 1.5px solid #2e4a32; font-weight: 700; font-size: 15px; padding-top: 8px; }
        .disc td { color: #2e4a32; }
        .foot { margin-top: 30px; padding-top: 14px; border-top: 1px solid #ddd6c7; font-size: 10px; color: #999; }
        .pi { font-family: monospace; font-size: 10px; color: #999; }
        .checklist { margin-top: 22px; border: 1px dashed #bbb; border-radius: 8px; padding: 12px 14px; }
        .checklist h3 { margin: 0 0 8px; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #5c6158; }
        .checklist label { display: block; margin: 5px 0; }
        @media print { body { padding: 16px; } .noprint { display: none; } }
        .noprint { text-align: center; margin-bottom: 18px; }
        .noprint button { font: inherit; font-size: 13px; font-weight: 600; background: #2e4a32; color: #fff; border: none; border-radius: 999px; padding: 9px 22px; cursor: pointer; }
      </style></head><body>
      <div class="noprint"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
      <div class="head">
        <div class="brand">QUEVI<small>WELLNESS CLINIC</small></div>
        <div class="ref"><div class="n">Pedido #${ref}</div><div class="d">${esc(fmtDate(o.created_at))}</div><div class="d">Estado: ${esc(o.status === 'paid' ? 'Pagado' : o.status)}</div></div>
      </div>
      <div class="grid">
        <div class="box">
          <h3>Cliente</h3>
          <p><strong>${esc(a.name) || '—'}</strong></p>
          <p>${esc(a.email) || ''}</p>
          <p>${esc(a.phone) || ''}</p>
        </div>
        <div class="box ${isPickup ? 'pickup' : ''}">
          <h3>${isPickup ? '🏬 Recoge en tienda' : 'Enviar a'}</h3>
          ${isPickup
            ? `<p>El cliente pasa a recoger el pedido en la clínica.</p><p>QUEVI Wellness Clinic · Calle Gibraltar 2, Estepona</p>`
            : `<p><strong>${esc(a.name)}</strong></p><p>${esc(a.address)}</p><p>${esc(a.postalCode)} ${esc(a.city)}${a.country ? ', ' + esc(a.country) : ''}</p>`}
        </div>
      </div>
      <table>
        <thead><tr><th>Artículo</th><th class="c">Cant.</th><th class="r">Precio</th><th class="r">Total</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="4" class="muted">Sin detalle de artículos</td></tr>'}</tbody>
      </table>
      <table class="totals">
        <tr><td>Subtotal</td><td class="r">${euros(o.subtotal_cents)}</td></tr>
        <tr><td>${isPickup ? 'Recogida' : 'Envío'}</td><td class="r">${o.shipping_cents === 0 ? 'Gratis' : euros(o.shipping_cents)}</td></tr>
        ${discount > 0 ? `<tr class="disc"><td>Descuento${a.couponCode ? ' (' + esc(a.couponCode) + ')' : ''}</td><td class="r">− ${euros(discount)}</td></tr>` : ''}
        <tr class="tot"><td>Total</td><td class="r">${euros(o.total_cents)}</td></tr>
      </table>
      <div class="checklist">
        <h3>Preparación del pedido</h3>
        ${items.map((i) => `<label>☐ ${esc(i.name)}${i.vol ? ' · ' + esc(i.vol) : ''} × ${Number(i.quantity) || 1}</label>`).join('') || '<p class="muted">—</p>'}
        <label style="margin-top:8px;">☐ Empaquetado · ☐ Etiqueta de envío · ☐ Albarán incluido</label>
      </div>
      <div class="foot">
        <p class="pi">${esc(o.stripe_payment_intent_id ?? '')}</p>
        <p>QUEVI Wellness Clinic SL · NIF B88657044 · Calle Gibraltar 2, Local Bajo, 29680 Estepona, Málaga · queviwellnessclinic.es</p>
      </div>
      <script>window.onload = function () { setTimeout(function () { window.print() }, 400) }</script>
      </body></html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

  // Mismo ticket que el de los pedidos online, con los datos de mostrador
  function printSale(s: StoreSale) {
    const saleItems = s.items ?? []
    const ref = s.id.slice(0, 8).toUpperCase()
    const esc = (v: unknown) => String(v ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))
    const payment = PAYMENT_LABELS[s.payment_method] ?? s.payment_method
    const cancelled = s.status === 'cancelled'

    const rows = saleItems.map((i) => {
      const qty = Number(i.quantity) || 1
      return `<tr>
        <td>${esc(i.product_name)}${i.variant_name ? ` <span class="muted">· ${esc(i.variant_name)}</span>` : ''}</td>
        <td class="c">${qty}</td>
        <td class="r">${euros(i.unit_price_cents)}</td>
        <td class="r">${euros(i.unit_price_cents * qty)}</td>
      </tr>`
    }).join('')

    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
      <title>Ticket #${ref} — QUEVI</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color: #1a1d1a; margin: 0; padding: 32px 36px; font-size: 13px; }
        .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2e4a32; padding-bottom: 16px; margin-bottom: 20px; }
        .brand { font-size: 22px; letter-spacing: 5px; color: #2e4a32; font-weight: 700; }
        .brand small { display: block; font-size: 9px; letter-spacing: 3px; color: #5c6158; font-weight: 400; margin-top: 2px; }
        .ref { text-align: right; }
        .ref .n { font-size: 20px; font-weight: 700; }
        .ref .d { font-size: 12px; color: #5c6158; margin-top: 2px; }
        .void { border: 1.5px solid #b3261e; color: #b3261e; border-radius: 8px; padding: 8px 12px; margin-bottom: 18px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; font-size: 11px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 22px; }
        .box { border: 1px solid #ddd6c7; border-radius: 8px; padding: 12px 14px; }
        .box h3 { margin: 0 0 8px; font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #5c6158; }
        .box p { margin: 2px 0; line-height: 1.5; }
        .store { background: #e4ecdf; border-color: #2e4a32; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th { text-align: left; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #5c6158; border-bottom: 1.5px solid #2e4a32; padding: 8px 6px; }
        td { padding: 9px 6px; border-bottom: 1px solid #eee; }
        th.c, td.c { text-align: center; } th.r, td.r { text-align: right; }
        .muted { color: #999; font-size: 11px; }
        .totals { width: 260px; margin-left: auto; }
        .totals tr td { border: none; padding: 3px 6px; }
        .totals .tot td { border-top: 1.5px solid #2e4a32; font-weight: 700; font-size: 15px; padding-top: 8px; }
        .disc td { color: #2e4a32; }
        .foot { margin-top: 30px; padding-top: 14px; border-top: 1px solid #ddd6c7; font-size: 10px; color: #999; }
        .pi { font-family: monospace; font-size: 10px; color: #999; }
        @media print { body { padding: 16px; } .noprint { display: none; } }
        .noprint { text-align: center; margin-bottom: 18px; }
        .noprint button { font: inherit; font-size: 13px; font-weight: 600; background: #2e4a32; color: #fff; border: none; border-radius: 999px; padding: 9px 22px; cursor: pointer; }
      </style></head><body>
      <div class="noprint"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
      <div class="head">
        <div class="brand">QUEVI<small>WELLNESS CLINIC</small></div>
        <div class="ref"><div class="n">Ticket #${ref}</div><div class="d">${esc(fmtDate(s.sold_at))}</div><div class="d">Pago: ${esc(payment)}</div></div>
      </div>
      ${cancelled ? `<div class="void">Venta anulada${s.cancelled_at ? ` el ${esc(fmtDate(s.cancelled_at))}` : ''} · stock devuelto</div>` : ''}
      <div class="grid">
        <div class="box">
          <h3>Cliente</h3>
          <p><strong>${esc(s.customer_name) || 'Cliente de mostrador'}</strong></p>
          <p>${esc(s.customer_phone) || ''}</p>
        </div>
        <div class="box store">
          <h3>🏬 Venta en tienda</h3>
          <p>Entregado en mano en la clínica.</p>
          <p>QUEVI Wellness Clinic · Calle Gibraltar 2, Estepona</p>
        </div>
      </div>
      <table>
        <thead><tr><th>Artículo</th><th class="c">Cant.</th><th class="r">Precio</th><th class="r">Total</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="4" class="muted">Sin detalle de artículos</td></tr>'}</tbody>
      </table>
      <table class="totals">
        <tr><td>Subtotal</td><td class="r">${euros(s.subtotal_cents)}</td></tr>
        ${s.discount_cents > 0 ? `<tr class="disc"><td>Descuento</td><td class="r">− ${euros(s.discount_cents)}</td></tr>` : ''}
        <tr class="tot"><td>Total</td><td class="r">${euros(s.total_cents)}</td></tr>
      </table>
      ${s.notes ? `<p class="muted">${esc(s.notes)}</p>` : ''}
      <div class="foot">
        <p class="pi">${esc(s.id)}</p>
        <p>QUEVI Wellness Clinic SL · NIF B88657044 · Calle Gibraltar 2, Local Bajo, 29680 Estepona, Málaga · queviwellnessclinic.es</p>
      </div>
      <script>window.onload = function () { setTimeout(function () { window.print() }, 400) }</script>
      </body></html>`

    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Ventas" value={rows.length} sub="online + tienda" />
        <StatCard label="Online" value={onlineRows.length} sub={hiddenPending > 0 ? `${hiddenPending} sin pagar ocultos` : undefined} />
        <StatCard label="Manuales" value={manualRows.length} sub="registradas en tienda" />
        <StatCard label="Facturación" value={euros(total)} sub="ventas cobradas" />
        <StatCard label="Ticket medio" value={counted.length ? euros(Math.round(total / counted.length)) : '—'} />
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          { id: 'all', label: `Todas (${rows.length})` },
          { id: 'online', label: `Online (${onlineRows.length})` },
          { id: 'manual', label: `Manuales (${manualRows.length})` },
        ] as const).map(f => (
          <button
            key={f.id}
            onClick={() => setKind(f.id)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
            style={{
              background: kind === f.id ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: kind === f.id ? '#f4f4f5' : '#a1a1aa',
              border: '1px solid',
              borderColor: kind === f.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
            }}
          >
            {f.label}
          </button>
        ))}

        <button
          onClick={syncStripeData}
          disabled={syncing}
          title="Busca en Stripe el nombre, email y teléfono de las ventas que se guardaron sin datos (links de pago y señas)"
          className="ml-auto px-4 py-2 rounded-lg border border-zinc-600 text-[13px] font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors disabled:opacity-50"
        >
          {syncing ? 'Buscando en Stripe…' : 'Recuperar datos de Stripe'}
        </button>
      </div>

      {syncMsg && <p className="text-[13px] text-emerald-400">{syncMsg}</p>}

      {syncSinNombre.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-[13px] text-amber-200">
          <p className="m-0 font-medium">
            En {syncSinNombre.length} {syncSinNombre.length === 1 ? 'venta' : 'ventas'} Stripe no guarda el nombre del cliente:
          </p>
          <ul className="mt-2 mb-2 space-y-1 list-none p-0">
            {syncSinNombre.slice(0, 10).map((r, n) => (
              <li key={n} className="text-amber-100/90">
                {r.fecha} · {r.importe.toFixed(2)} € · {r.email || r.telefono || 'sin ningún dato'}
              </li>
            ))}
          </ul>
          <p className="m-0 text-amber-200/80">
            Para que lo guarde en los próximos, activa en el link de pago de Stripe la recogida del nombre
            (dirección de facturación) y del teléfono.
          </p>
        </div>
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por cliente, email, teléfono, producto o ID…"
        className="w-full bg-zinc-800/60 border border-zinc-600 rounded-lg px-4 py-2.5 text-[13px] text-zinc-200 placeholder:text-zinc-400 outline-none focus:border-zinc-500 transition-colors"
      />

      {actionError && <p className="text-[13px] text-red-400">{actionError}</p>}

      {filtered.length === 0 ? <Empty label={query ? 'Sin resultados' : 'No hay ventas todavía'} /> : (
        <div className="space-y-2">
          {filtered.map(row => {
            if (row.kind === 'manual') {
              const s = row.sale
              const isOpen = openId === row.key
              const cancelled = s.status === 'cancelled'
              const saleItems = s.items ?? []
              const units = saleItems.reduce((n, it) => n + (it.quantity ?? 0), 0)
              const ref = s.id.slice(0, 8).toUpperCase()
              return (
                <div
                  key={row.key}
                  className={`rounded-xl border border-zinc-600/80 bg-zinc-800/50 overflow-hidden ${cancelled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-stretch">
                    <button
                      onClick={() => setOpenId(isOpen ? null : row.key)}
                      className="flex-1 min-w-0 text-left px-4 py-3 hover:bg-zinc-700/20 transition-colors flex flex-wrap items-center gap-x-4 gap-y-2"
                    >
                      <span className="font-mono text-[12px] text-zinc-400 w-[76px]">#{ref}</span>
                      <span className="text-zinc-200 font-medium min-w-[150px] flex-1">
                        {s.customer_name || <span className="text-zinc-400">Venta en tienda</span>}
                        {units > 0 && <span className="text-zinc-400 font-normal"> · {units} art.</span>}
                      </span>
                      <span className="text-zinc-300 text-[12px] whitespace-nowrap">{fmtDate(s.sold_at)}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-[0.06em] uppercase bg-sky-500/20 text-sky-300 border-sky-500/30">
                        manual
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-700/60 text-zinc-200 border border-zinc-500 uppercase tracking-[0.06em]">
                        {PAYMENT_LABELS[s.payment_method] ?? s.payment_method}
                      </span>
                      {cancelled && <StatusBadge status="cancelled" />}
                      <span className="font-semibold text-zinc-100 whitespace-nowrap min-w-[70px] text-right">{euros(s.total_cents)}</span>
                      <span className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    <button
                      onClick={() => printSale(s)}
                      title="Imprimir ticket de la venta"
                      className="flex-shrink-0 px-4 flex items-center gap-1.5 border-l border-zinc-600/80 text-[12px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                      </svg>
                      <span className="hidden sm:inline">Imprimir</span>
                    </button>
                    {!cancelled && (
                      <button
                        onClick={() => voidSale(s.id)}
                        disabled={busyId === s.id}
                        title="Anular la venta y devolver el stock"
                        className="flex-shrink-0 px-4 flex items-center border-l border-zinc-600/80 text-[12px] font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {busyId === s.id ? 'Anulando…' : 'Anular'}
                      </button>
                    )}
                  </div>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-zinc-600/60 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-400 mb-2">Artículos</p>
                        {saleItems.length === 0 ? (
                          <p className="text-[13px] text-zinc-400">Sin detalle de artículos</p>
                        ) : (
                          <ul className="space-y-1.5 m-0 p-0 list-none">
                            {saleItems.map((it, n) => (
                              <li key={n} className="flex justify-between gap-3 text-[13px]">
                                <span className="text-zinc-200">
                                  {it.product_name}
                                  <span className="text-zinc-400"> · {it.variant_name}</span>
                                  <span className="text-zinc-400"> × {it.quantity}</span>
                                </span>
                                <span className="text-zinc-300 whitespace-nowrap">
                                  {euros(it.unit_price_cents * (it.quantity ?? 1))}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-3 pt-3 border-t border-zinc-600/60 space-y-1 text-[12px]">
                          <div className="flex justify-between text-zinc-300"><span>Subtotal</span><span>{euros(s.subtotal_cents)}</span></div>
                          {s.discount_cents > 0 && (
                            <div className="flex justify-between text-emerald-400">
                              <span>Descuento</span>
                              <span>− {euros(s.discount_cents)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-zinc-100 font-semibold pt-1"><span>Total</span><span>{euros(s.total_cents)}</span></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-400 mb-2">Venta en tienda</p>
                        <div className="space-y-1.5 text-[13px] text-zinc-200">
                          <p className="m-0">Cobrado en {PAYMENT_LABELS[s.payment_method] ?? s.payment_method}</p>
                          {s.customer_name && <p className="m-0">{s.customer_name}</p>}
                          {s.customer_phone && (
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://wa.me/${s.customer_phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-200 hover:text-zinc-100 underline underline-offset-2"
                              >
                                {s.customer_phone}
                              </a>
                              <span className="text-[11px] text-zinc-400">WhatsApp</span>
                            </div>
                          )}
                          {s.notes && <p className="text-zinc-300 italic m-0">{s.notes}</p>}
                          {cancelled && (
                            <p className="text-red-400 m-0">
                              Anulada{s.cancelled_at ? ` el ${fmtDate(s.cancelled_at)}` : ''} · stock devuelto
                            </p>
                          )}
                          <p className="pt-2 font-mono text-[11px] text-zinc-400 m-0">{s.id}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            const o = row.order
            const a = o.shipping_address ?? {}
            const items = a.items ?? []
            const isOpen = openId === row.key
            const ref = o.stripe_payment_intent_id
              ? o.stripe_payment_intent_id.replace('pi_', '').slice(-8).toUpperCase()
              : o.id.slice(0, 8).toUpperCase()
            return (
              <div key={row.key} className="rounded-xl border border-zinc-600/80 bg-zinc-800/50 overflow-hidden">
                <div className="flex items-stretch">
                  <button
                    onClick={() => setOpenId(isOpen ? null : row.key)}
                    className="flex-1 min-w-0 text-left px-4 py-3 hover:bg-zinc-700/20 transition-colors flex flex-wrap items-center gap-x-4 gap-y-2"
                  >
                    <span className="font-mono text-[12px] text-zinc-400 w-[76px]">#{ref}</span>
                    <span className="text-zinc-200 font-medium min-w-[150px] flex-1">
                      {a.name || a.email || a.phone || <span className="text-zinc-400">Sin nombre</span>}
                      {items.length > 0 && (
                        <span className="text-zinc-400 font-normal"> · {items.reduce((s, i) => s + (i.quantity ?? 1), 0)} art.</span>
                      )}
                    </span>
                    <span className="text-zinc-300 text-[12px] whitespace-nowrap">{fmtDate(o.created_at)}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-[0.06em] uppercase bg-zinc-700/50 text-zinc-300 border-zinc-500">
                      {a.source ? ORDER_SOURCE_LABELS[a.source] ?? 'online' : 'online'}
                    </span>
                    <StatusBadge status={o.status} />
                    <span className="font-semibold text-zinc-100 whitespace-nowrap min-w-[70px] text-right">{euros(o.total_cents)}</span>
                    <span className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {(o.status === 'paid' || o.status === 'completed') && (
                    <button
                      onClick={() => printOrder(o)}
                      title="Imprimir hoja de pedido"
                      className="flex-shrink-0 px-4 flex items-center gap-1.5 border-l border-zinc-600/80 text-[12px] font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                      </svg>
                      <span className="hidden sm:inline">Imprimir</span>
                    </button>
                  )}
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-600/60 grid gap-4 md:grid-cols-2">
                    {/* Artículos */}
                    <div>
                      <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-400 mb-2">Artículos</p>
                      {items.length === 0 ? (
                        <p className="text-[13px] text-zinc-400">Sin detalle de artículos</p>
                      ) : (
                        <ul className="space-y-1.5 m-0 p-0 list-none">
                          {items.map((i, n) => (
                            <li key={n} className="flex justify-between gap-3 text-[13px]">
                              <span className="text-zinc-200">
                                {i.name}
                                {i.vol ? <span className="text-zinc-400"> · {i.vol}</span> : null}
                                <span className="text-zinc-400"> × {i.quantity ?? 1}</span>
                              </span>
                              <span className="text-zinc-300 whitespace-nowrap">
                                {typeof i.price === 'number' ? euros(Math.round(i.price * 100) * (i.quantity ?? 1)) : '—'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3 pt-3 border-t border-zinc-600/60 space-y-1 text-[12px]">
                        <div className="flex justify-between text-zinc-300"><span>Subtotal</span><span>{euros(o.subtotal_cents)}</span></div>
                        <div className="flex justify-between text-zinc-300"><span>Envío</span><span>{o.shipping_cents === 0 ? 'Gratis' : euros(o.shipping_cents)}</span></div>
                        {o.subtotal_cents + o.shipping_cents !== o.total_cents && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Descuento</span>
                            <span>− {euros(o.subtotal_cents + o.shipping_cents - o.total_cents)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-zinc-100 font-semibold pt-1"><span>Total</span><span>{euros(o.total_cents)}</span></div>
                      </div>
                    </div>

                    {/* Cliente y envío */}
                    <div>
                      <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-400 mb-2">Cliente y envío</p>
                      <div className="space-y-1.5 text-[13px] text-zinc-200">
                        {a.email && (
                          <div className="flex items-center gap-2">
                            <a href={`mailto:${a.email}`} className="text-zinc-200 hover:text-zinc-100 underline underline-offset-2">{a.email}</a>
                            <button onClick={() => copy(a.email!)} className="text-[11px] text-zinc-400 hover:text-zinc-200">copiar</button>
                          </div>
                        )}
                        {a.phone && (
                          <div className="flex items-center gap-2">
                            <a href={`https://wa.me/${a.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-zinc-200 hover:text-zinc-100 underline underline-offset-2">{a.phone}</a>
                            <span className="text-[11px] text-zinc-400">WhatsApp</span>
                          </div>
                        )}
                        {a.deliveryMethod === 'pickup' ? (
                          <div className="pt-1 leading-relaxed">
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">🏬 Recoge en tienda</span>
                            <p className="text-zinc-400 text-[12px] mt-0.5 m-0">El cliente pasa a recoger el pedido en la clínica. No hay que enviarlo.</p>
                          </div>
                        ) : a.address ? (
                          <div className="pt-1 leading-relaxed text-zinc-300">
                            {a.name}<br />
                            {a.address}<br />
                            {a.postalCode} {a.city}{a.country ? `, ${a.country}` : ''}
                            <button
                              onClick={() => copy(`${a.name}\n${a.address}\n${a.postalCode} ${a.city}, ${a.country}`)}
                              className="ml-2 text-[11px] text-zinc-400 hover:text-zinc-200"
                            >
                              copiar dirección
                            </button>
                          </div>
                        ) : a.source && ORDER_SOURCE_LABELS[a.source] ? (
                          <div className="pt-1 leading-relaxed">
                            <span className="text-zinc-300">Cobrado con {ORDER_SOURCE_LABELS[a.source]} de Stripe</span>
                            <p className="text-zinc-400 text-[12px] mt-0.5 m-0">
                              Fuera de la tienda online, sin envío. Los datos son los que dejó el cliente al pagar.
                            </p>
                          </div>
                        ) : (
                          <p className="text-zinc-400 pt-1">Sin dirección — pedido sin envío (ritual, tratamiento o regalo)</p>
                        )}
                        {o.stripe_payment_intent_id && (
                          <p className="pt-2 font-mono text-[11px] text-zinc-400 m-0">{o.stripe_payment_intent_id}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Tab: Citas ────────────────────────────────────────────────────────────────

function CitasTab({ appointments, bookings }: { appointments: Appointment[]; bookings: Booking[] }) {
  const [view, setView] = useState<'appointments' | 'bookings'>('appointments')
  const paidAppts = appointments.filter(a => a.status === 'paid')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Citas con seña" value={appointments.length} />
        <StatCard label="Pagadas" value={paidAppts.length} />
        <StatCard label="Facturado (citas)" value={euros(paidAppts.reduce((s, a) => s + a.amount_cents, 0))} />
        <StatCard label="Solicitudes (formulario)" value={bookings.length} />
      </div>

      <div className="flex gap-2">
        {(['appointments', 'bookings'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
            style={{
              background: view === v ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: view === v ? '#f4f4f5' : '#a1a1aa',
              border: '1px solid',
              borderColor: view === v ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)',
            }}
          >
            {v === 'appointments' ? `Citas con seña (${appointments.length})` : `Formulario contacto (${bookings.length})`}
          </button>
        ))}
      </div>

      {view === 'appointments' && (
        appointments.length === 0 ? <Empty label="No hay citas todavía" /> : (
          <div className="rounded-xl border border-zinc-600/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-zinc-600/80 bg-zinc-800/80">
                    {['Fecha solicitud', 'Nombre', 'Email', 'Servicio', 'Cita', 'Importe', 'Estado'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase text-zinc-400 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {appointments.map(a => (
                    <tr key={a.id} className="hover:bg-zinc-700/20 transition-colors">
                      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{fmtDate(a.created_at)}</td>
                      <td className="px-4 py-3 text-zinc-200 font-medium">{a.name}</td>
                      <td className="px-4 py-3 text-zinc-300">{a.email}</td>
                      <td className="px-4 py-3 text-zinc-200 max-w-[160px] truncate">{a.service}</td>
                      <td className="px-4 py-3 text-zinc-200 whitespace-nowrap">
                        {a.appointment_date} {a.appointment_time && `· ${a.appointment_time}`}
                      </td>
                      <td className="px-4 py-3 text-zinc-100 font-semibold whitespace-nowrap">{euros(a.amount_cents)}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {view === 'bookings' && (
        bookings.length === 0 ? <Empty label="No hay solicitudes todavía" /> : (
          <div className="rounded-xl border border-zinc-600/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-zinc-600/80 bg-zinc-800/80">
                    {['Fecha', 'Nombre', 'Email', 'Teléfono', 'Servicio', 'Estado'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase text-zinc-400 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-zinc-700/20 transition-colors">
                      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{fmtDate(b.created_at)}</td>
                      <td className="px-4 py-3 text-zinc-200 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-zinc-300">{b.email}</td>
                      <td className="px-4 py-3 text-zinc-300">{b.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-200">{b.service ?? '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  )
}

// ── Tab: Stock ────────────────────────────────────────────────────────────────

// ── Venta en tienda: modal ────────────────────────────────────────────────────

type SaleLine = { variantId: string; quantity: number; unitPrice: string }

type VariantOption = {
  id: string
  label: string
  productName: string
  variantName: string
  priceCents: number
  stock: number
}

// Acepta "12,50" y "12.50"
function toCents(value: string): number {
  const n = Number(value.replace(',', '.').trim())
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100)
}

function localNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const PAYMENT_LABELS: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  bizum: 'Bizum',
  otro: 'Otro',
}

const inputCls =
  'w-full bg-zinc-950/70 border border-zinc-600 rounded-lg px-3 py-2 text-[13px] text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors'

function VentaTiendaModal({
  products,
  pw,
  onClose,
  onSaved,
}: {
  products: Product[]
  pw: string
  onClose: () => void
  onSaved: () => void
}) {
  const [lines, setLines] = useState<SaleLine[]>([{ variantId: '', quantity: 1, unitPrice: '' }])
  const [paymentMethod, setPaymentMethod] = useState('efectivo')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [discount, setDiscount] = useState('')
  const [soldAt, setSoldAt] = useState(localNow)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const options: VariantOption[] = products
    .filter(p => p.active)
    .flatMap(p =>
      p.product_variants
        .filter(v => v.active)
        .map(v => ({
          id: v.id,
          label: `${p.name} · ${v.name}`,
          productName: p.name,
          variantName: v.name,
          priceCents: v.price_cents,
          stock: v.stock_quantity,
        })),
    )

  const byId = new Map(options.map(o => [o.id, o]))
  const chosen = new Set(lines.map(l => l.variantId).filter(Boolean))

  function updateLine(index: number, patch: Partial<SaleLine>) {
    setLines(prev => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)))
  }

  function pickVariant(index: number, variantId: string) {
    const opt = byId.get(variantId)
    updateLine(index, {
      variantId,
      // El precio de catálogo entra por defecto, pero se puede editar
      unitPrice: opt ? (opt.priceCents / 100).toFixed(2) : '',
    })
  }

  const subtotalCents = lines.reduce((sum, l) => {
    if (!l.variantId) return sum
    return sum + toCents(l.unitPrice) * Math.max(0, l.quantity)
  }, 0)
  const discountCents = Math.min(toCents(discount), subtotalCents)
  const totalCents = subtotalCents - discountCents

  const filled = lines.filter(l => l.variantId)
  const overStock = filled.filter(l => {
    const opt = byId.get(l.variantId)
    return opt ? l.quantity > opt.stock : false
  })
  const badQty = filled.some(l => !Number.isFinite(l.quantity) || l.quantity < 1)
  const canSave = filled.length > 0 && overStock.length === 0 && !badQty && !saving

  async function submit() {
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/store-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({
          action: 'create',
          items: filled.map(l => ({
            variant_id: l.variantId,
            quantity: l.quantity,
            unit_price_cents: toCents(l.unitPrice),
          })),
          paymentMethod,
          customerName,
          customerPhone,
          discountCents,
          notes,
          soldAt,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error ?? 'No se pudo registrar la venta')
        return
      }
      onSaved()
      onClose()
    } catch {
      setError('Error de red')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-8"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[720px] rounded-2xl border border-zinc-600/80 bg-zinc-900 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-700 px-6 py-4">
          <div>
            <h2 className="text-[17px] font-semibold text-zinc-100">Venta en tienda</h2>
            <p className="text-[12px] text-zinc-400 mt-0.5">Se descuenta del stock al guardar</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-[20px] leading-none px-2">
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Líneas de producto */}
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-400">Productos</p>
            {lines.map((line, i) => {
              const opt = byId.get(line.variantId)
              const excess = opt ? line.quantity > opt.stock : false
              return (
                <div key={i} className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={line.variantId}
                      onChange={e => pickVariant(i, e.target.value)}
                      className={`${inputCls} flex-1 min-w-[200px]`}
                    >
                      <option value="">Selecciona producto…</option>
                      {options.map(o => (
                        <option
                          key={o.id}
                          value={o.id}
                          disabled={o.id !== line.variantId && chosen.has(o.id)}
                        >
                          {o.label} — {o.stock} uds.
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={e => updateLine(i, { quantity: Math.trunc(Number(e.target.value)) })}
                      className={`${inputCls} w-[80px] tabular-nums`}
                      aria-label="Cantidad"
                    />

                    <div className="relative w-[110px]">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={line.unitPrice}
                        onChange={e => updateLine(i, { unitPrice: e.target.value })}
                        placeholder="0,00"
                        className={`${inputCls} pr-6 tabular-nums`}
                        aria-label="Precio unitario"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-zinc-400">€</span>
                    </div>

                    {lines.length > 1 && (
                      <button
                        onClick={() => setLines(prev => prev.filter((_, idx) => idx !== i))}
                        className="px-2.5 py-2 rounded-lg border border-zinc-600 text-[12px] text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                  {excess && opt && (
                    <p className="text-[12px] text-red-400 pl-1">
                      Solo quedan {opt.stock} uds. de {opt.label}
                    </p>
                  )}
                </div>
              )
            })}

            <button
              onClick={() => setLines(prev => [...prev, { variantId: '', quantity: 1, unitPrice: '' }])}
              className="mt-1 px-3 py-1.5 rounded-lg border border-zinc-600 text-[12px] text-zinc-300 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
            >
              + Añadir producto
            </button>
          </div>

          {/* Datos de la venta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5">Método de pago</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={inputCls}>
                {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5">Fecha de la venta</label>
              <input
                type="datetime-local"
                value={soldAt}
                onChange={e => setSoldAt(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5">Cliente <span className="text-zinc-400">(opcional)</span></label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5">Teléfono <span className="text-zinc-400">(opcional)</span></label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+34 …"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5">Descuento <span className="text-zinc-400">(€, opcional)</span></label>
              <input
                type="text"
                inputMode="decimal"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="0,00"
                className={`${inputCls} tabular-nums`}
              />
            </div>
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5">Notas <span className="text-zinc-400">(opcional)</span></label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej. venta tras tratamiento"
                className={inputCls}
              />
            </div>
          </div>

          {/* Totales */}
          <div className="rounded-xl border border-zinc-600/80 bg-zinc-800/60 px-5 py-4 space-y-1.5">
            <div className="flex justify-between text-[13px] text-zinc-300">
              <span>Subtotal</span>
              <span className="tabular-nums">{euros(subtotalCents)}</span>
            </div>
            {discountCents > 0 && (
              <div className="flex justify-between text-[13px] text-amber-300">
                <span>Descuento</span>
                <span className="tabular-nums">− {euros(discountCents)}</span>
              </div>
            )}
            <div className="flex justify-between text-[16px] font-semibold text-zinc-100 pt-1.5 border-t border-zinc-600/70">
              <span>Total</span>
              <span className="tabular-nums">{euros(totalCents)}</span>
            </div>
          </div>

          {error && <p className="text-[13px] text-red-400">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-700 px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-zinc-600 text-[13px] text-zinc-300 hover:text-zinc-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={!canSave}
            className="px-5 py-2 rounded-lg bg-zinc-100 text-zinc-900 text-[13px] font-semibold transition-opacity disabled:opacity-40"
          >
            {saving ? 'Guardando…' : 'Registrar venta'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Venta en tienda: listado ──────────────────────────────────────────────────

function VentasTiendaList({
  sales,
  pw,
  onChanged,
}: {
  sales: StoreSale[]
  pw: string
  onChanged: () => void
}) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function voidSale(id: string) {
    if (!confirm('¿Anular esta venta? El stock volverá a como estaba antes.')) return
    setError('')
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/store-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({ action: 'void', id }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error ?? 'No se pudo anular la venta')
        return
      }
      onChanged()
    } catch {
      setError('Error de red')
    } finally {
      setBusyId(null)
    }
  }

  if (sales.length === 0) {
    return (
      <p className="text-[13px] text-zinc-400 italic px-1">
        Todavía no hay ventas registradas en el local.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-[13px] text-red-400">{error}</p>}
      {sales.map(s => {
        const cancelled = s.status === 'cancelled'
        const units = (s.items ?? []).reduce((n, it) => n + (it.quantity ?? 0), 0)
        return (
          <div
            key={s.id}
            className={`rounded-xl border border-zinc-600/80 bg-zinc-800/50 px-5 py-3.5 ${cancelled ? 'opacity-50' : ''}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[14px] font-semibold text-zinc-100 tabular-nums">{euros(s.total_cents)}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-700/60 text-zinc-200 border border-zinc-500 uppercase tracking-[0.06em]">
                    {PAYMENT_LABELS[s.payment_method] ?? s.payment_method}
                  </span>
                  {cancelled && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 uppercase tracking-[0.06em]">
                      anulada
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-zinc-300 mt-1">
                  {(s.items ?? []).map(it => `${it.quantity}× ${it.product_name} (${it.variant_name})`).join(' · ') || '—'}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  {fmtDate(s.sold_at)} · {units} uds.
                  {s.customer_name ? ` · ${s.customer_name}` : ''}
                  {s.discount_cents > 0 ? ` · dto. ${euros(s.discount_cents)}` : ''}
                  {s.notes ? ` · ${s.notes}` : ''}
                </p>
              </div>

              {!cancelled && (
                <button
                  onClick={() => voidSale(s.id)}
                  disabled={busyId === s.id}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-600 text-[12px] text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                >
                  {busyId === s.id ? 'Anulando…' : 'Anular'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StockTab({
  products,
  storeSales,
  pw,
  onChanged,
}: {
  products: Product[]
  storeSales: StoreSale[]
  pw: string
  onChanged: () => void
}) {
  const allVariants = products.flatMap(p => p.product_variants)
  const lowStock = allVariants.filter(v => v.active && v.stock_quantity <= 5)
  const outOfStock = allVariants.filter(v => v.active && v.stock_quantity <= 0)
  // Una compra online puede dejar el stock en negativo: el pago ya está cobrado
  // y no se puede rechazar. El negativo dice cuántas unidades se deben.
  const negativeStock = allVariants.filter(v => v.active && v.stock_quantity < 0)

  const activeSales = storeSales.filter(s => s.status !== 'cancelled')
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const todaySales = activeSales.filter(s => new Date(s.sold_at) >= startOfToday)
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total_cents, 0)

  function stockColor(qty: number) {
    if (qty <= 0) return 'text-red-400'
    if (qty <= 5) return 'text-amber-400'
    return 'text-emerald-400'
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-400">Stock</p>
        <p className="text-[13px] text-zinc-400 mt-0.5">
          Registra las ventas del local con el botón <span className="text-zinc-200">Venta en tienda</span> de
          abajo a la izquierda, para que el stock cuadre con la tienda online
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard label="Productos" value={products.filter(p => p.active).length} sub={`${products.filter(p => !p.active).length} inactivos`} />
        <StatCard label="Variantes totales" value={allVariants.length} />
        <StatCard label="Stock bajo (≤5)" value={lowStock.length} />
        <StatCard
          label="Sin stock"
          value={outOfStock.length}
          sub={negativeStock.length > 0 ? `${negativeStock.length} en negativo` : undefined}
        />
        <StatCard label="Ventas hoy en tienda" value={euros(todayTotal)} sub={`${todaySales.length} ventas`} />
      </div>

      <div className="space-y-3">
        <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-400">Ventas en tienda</p>
        <VentasTiendaList sales={storeSales} pw={pw} onChanged={onChanged} />
      </div>

      <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-400 pt-2">Inventario</p>

      {products.length === 0 ? <Empty label="No hay productos en Supabase" /> : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="rounded-xl border border-zinc-600/80 bg-zinc-800/50 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-600/60">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-zinc-200 truncate">{p.name}</p>
                  <p className="text-[11px] text-zinc-400 font-mono">{p.slug}</p>
                </div>
                <div className="flex gap-2">
                  {!p.active && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-700 text-zinc-300 border border-zinc-500">inactivo</span>
                  )}
                  {p.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">destacado</span>
                  )}
                </div>
              </div>

              {p.product_variants.length === 0 ? (
                <p className="px-5 py-3 text-[13px] text-zinc-400 italic">Sin variantes</p>
              ) : (
                <div className="divide-y divide-zinc-700">
                  {p.product_variants.map(v => (
                    <div key={v.id} className="flex items-center gap-4 px-5 py-2.5">
                      <span className="text-[13px] text-zinc-200 flex-1">{v.name}</span>
                      <span className="text-[13px] text-zinc-300 tabular-nums">
                        {(v.price_cents / 100).toFixed(2)} €
                      </span>
                      <div className="flex items-center gap-2 min-w-[80px] justify-end">
                        <span className={`text-[14px] font-mono font-semibold tabular-nums ${stockColor(v.stock_quantity)}`}>
                          {v.stock_quantity}
                        </span>
                        <span className="text-[11px] text-zinc-400">uds.</span>
                        {v.stock_quantity < 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/30 text-red-300 border border-red-500/50 whitespace-nowrap">
                            FALTAN {Math.abs(v.stock_quantity)}
                          </span>
                        )}
                        {v.stock_quantity === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">AGOTADO</span>
                        )}
                        {v.stock_quantity > 0 && v.stock_quantity <= 5 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">BAJO</span>
                        )}
                      </div>
                      {!v.active && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-700 text-zinc-400 border border-zinc-500">off</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tab: Vales regalo ─────────────────────────────────────────────────────────

function GiftStatusBadge({ card }: { card: GiftCard }) {
  const expired = card.expires_at ? new Date(card.expires_at) < new Date() : false
  const status = expired && card.status === 'active' ? 'expired' : card.status
  const map: Record<string, { label: string; cls: string }> = {
    active:    { label: 'Activo',    cls: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    redeemed:  { label: 'Canjeado',  cls: 'bg-zinc-600/40 text-zinc-200 border-zinc-500/40' },
    cancelled: { label: 'Cancelado', cls: 'bg-red-500/20 text-red-300 border-red-500/30' },
    expired:   { label: 'Caducado',  cls: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  }
  const s = map[status] ?? map.active
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-[0.06em] uppercase ${s.cls}`}>
      {s.label}
    </span>
  )
}

function ValesTab({ giftCards, pw, onChanged }: { giftCards: GiftCard[]; pw: string; onChanged: () => void }) {
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function act(id: string, action: 'use' | 'cancel' | 'reactivate') {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/gift-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) onChanged()
    } finally {
      setBusyId(null)
    }
  }

  const q = query.trim().toUpperCase()
  const filtered = q
    ? giftCards.filter(c =>
        c.code.includes(q) ||
        (c.recipient_name ?? '').toUpperCase().includes(q) ||
        (c.item_name ?? '').toUpperCase().includes(q))
    : giftCards

  const active = giftCards.filter(c => c.status === 'active')
  const outstanding = active.reduce((s, c) => s + (c.amount_cents || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Vales emitidos" value={giftCards.length} />
        <StatCard label="Activos" value={active.length} />
        <StatCard label="Canjeados" value={giftCards.filter(c => c.status === 'redeemed').length} />
        <StatCard label="Valor pendiente" value={euros(outstanding)} sub="vales activos" />
      </div>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por código, destinatario o experiencia…"
        className="w-full bg-zinc-950/70 border border-zinc-600 rounded-lg px-4 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors"
      />

      {filtered.length === 0 ? <Empty label="No hay vales regalo" /> : (
        <div className="space-y-3">
          {filtered.map(c => {
            const left = Math.max(0, c.total_sessions - c.sessions_used)
            const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false
            const canUse = c.status === 'active' && !expired && left > 0
            return (
              <div key={c.id} className="rounded-xl border border-zinc-600/80 bg-zinc-800/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[15px] font-semibold text-zinc-100 tracking-[0.08em]">{c.code}</span>
                      <GiftStatusBadge card={c} />
                    </div>
                    <p className="text-[14px] text-zinc-200 mt-1.5">{c.item_name}</p>
                    <p className="text-[12px] text-zinc-400 mt-0.5">
                      Para <span className="text-zinc-300">{c.recipient_name ?? '—'}</span>
                      {c.recipient_email ? ` · ${c.recipient_email}` : ''}
                      {c.purchaser_name ? ` · de ${c.purchaser_name}` : ''}
                    </p>
                    {c.message && <p className="text-[12px] text-zinc-400 italic mt-1">"{c.message}"</p>}
                    <p className="text-[11px] text-zinc-400 mt-1.5">
                      {euros(c.amount_cents)} · {left}/{c.total_sessions} sesiones disponibles
                      {c.expires_at ? ` · caduca ${fmtDate(c.expires_at)}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {canUse && (
                      <button
                        onClick={() => act(c.id, 'use')}
                        disabled={busyId === c.id}
                        className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[12px] font-medium hover:bg-emerald-500/30 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {c.total_sessions > 1 ? 'Usar 1 sesión' : 'Marcar canjeado'}
                      </button>
                    )}
                    {c.status === 'cancelled' ? (
                      <button
                        onClick={() => act(c.id, 'reactivate')}
                        disabled={busyId === c.id}
                        className="px-4 py-2 rounded-lg border border-zinc-600 text-[12px] text-zinc-300 hover:text-zinc-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        Reactivar
                      </button>
                    ) : c.status !== 'redeemed' && (
                      <button
                        onClick={() => act(c.id, 'cancel')}
                        disabled={busyId === c.id}
                        className="px-4 py-2 rounded-lg border border-zinc-600 text-[12px] text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AdminData | null>(null)
  const [tab, setTab] = useState<'ventas' | 'citas' | 'stock' | 'vales'>('ventas')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [saleOpen, setSaleOpen] = useState(false)

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/data', {
        headers: { 'x-admin-password': pwd },
      })
      if (res.status === 401) {
        setError('Contraseña incorrecta')
        setAuthed(false)
        sessionStorage.removeItem('quevi-admin-pw')
        return
      }
      if (!res.ok) {
        setError('Error al cargar datos')
        return
      }
      const json = await res.json() as AdminData
      setData(json)
      setAuthed(true)
      setLastRefresh(new Date())
      sessionStorage.setItem('quevi-admin-pw', pwd)
    } catch {
      setError('Error de red')
    } finally {
      setLoading(false)
    }
  }, [])

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem('quevi-admin-pw')
    if (saved) fetchData(saved)
  }, [fetchData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    fetchData(password)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('quevi-admin-pw')
    setAuthed(false)
    setData(null)
    setPassword('')
  }

  // ── Login screen ─────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#17171a' }}>
        <div className="w-full max-w-[360px] px-4">
          <div className="mb-8 text-center">
            <p className="text-[11px] tracking-[0.28em] uppercase text-zinc-400 mb-2">QUEVI Wellness</p>
            <h1 className="text-[26px] font-semibold text-zinc-100">Panel de administración</h1>
          </div>

          <form onSubmit={handleLogin} className="rounded-2xl border border-zinc-600/80 bg-zinc-800/60 p-6 space-y-4">
            <div>
              <label className="block text-[12px] text-zinc-300 mb-1.5 tracking-[0.06em]">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full bg-zinc-950/70 border border-zinc-600 rounded-lg px-4 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
            {error && (
              <p className="text-[13px] text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-zinc-100 text-zinc-900 text-[14px] font-semibold transition-opacity disabled:opacity-50"
            >
              {loading ? 'Verificando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────────────────

  // El contador de ventas cuenta lo mismo que se ve en la lista: pedidos
  // online cobrados + ventas registradas a mano
  const ventasCount =
    (data?.orders ?? []).filter(o => ORDER_SALE_STATUSES.includes(o.status)).length +
    (data?.storeSales?.length ?? 0)

  const TABS = [
    { id: 'ventas', label: 'Ventas', count: ventasCount },
    { id: 'citas',   label: 'Citas',   count: (data?.appointments.length ?? 0) + (data?.bookings.length ?? 0) },
    { id: 'vales',   label: 'Vales regalo', count: data?.giftCards?.length ?? 0 },
    { id: 'stock',   label: 'Stock',   count: data?.products.length ?? 0 },
  ] as const

  const savedPw = typeof window !== 'undefined' ? sessionStorage.getItem('quevi-admin-pw') ?? '' : ''

  return (
    <div className="min-h-screen" style={{ background: '#17171a', color: '#f4f4f5' }}>
      {/* Top bar */}
      <header className="border-b border-zinc-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-400">QUEVI</span>
          <span className="text-zinc-400">/</span>
          <span className="text-[14px] font-medium text-zinc-200">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-[11px] text-zinc-400 hidden sm:block">
              Actualizado: {lastRefresh.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={() => fetchData(savedPw)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-600 text-[12px] text-zinc-300 hover:text-zinc-200 hover:border-zinc-500 transition-colors disabled:opacity-50"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Refrescar
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg border border-zinc-600 text-[12px] text-zinc-300 hover:text-red-400 hover:border-red-500/40 transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-700 px-6">
        <div className="flex gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium border-b-2 transition-colors"
              style={{
                borderBottomColor: tab === t.id ? '#f4f4f5' : 'transparent',
                color: tab === t.id ? '#f4f4f5' : '#a1a1aa',
              }}
            >
              {t.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[11px] tabular-nums"
                style={{ background: tab === t.id ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)', color: tab === t.id ? '#e4e4e7' : '#a1a1aa' }}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {!data ? (
          <div className="flex items-center justify-center py-32">
            <span className="text-zinc-400 text-[14px]">Cargando…</span>
          </div>
        ) : (
          <>
            {tab === 'ventas'  && (
              <VentasTab
                orders={data.orders}
                storeSales={data.storeSales ?? []}
                pw={savedPw}
                onChanged={() => fetchData(savedPw)}
              />
            )}
            {tab === 'citas'   && <CitasTab appointments={data.appointments} bookings={data.bookings} />}
            {tab === 'vales'   && <ValesTab giftCards={data.giftCards ?? []} pw={savedPw} onChanged={() => fetchData(savedPw)} />}
            {tab === 'stock'   && (
              <StockTab
                products={data.products}
                storeSales={data.storeSales ?? []}
                pw={savedPw}
                onChanged={() => fetchData(savedPw)}
              />
            )}
          </>
        )}
      </main>

      {/* Botón flotante: ocupa el sitio del de WhatsApp, que en el admin no
          pinta nada. Disponible desde cualquier pestaña. */}
      <button
        onClick={() => setSaleOpen(true)}
        aria-label="Registrar una venta en tienda"
        className="group fixed left-4 bottom-4 sm:left-6 sm:bottom-6 z-40 flex items-center gap-0 hover:gap-2.5 h-14 pl-4 pr-4 rounded-full bg-emerald-500 text-emerald-950 shadow-lg hover:bg-emerald-400 transition-all"
        style={{ boxShadow: '0 6px 24px -4px rgba(16,185,129,0.55)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <path d="M3 6h18l-1.5 11.5a2 2 0 0 1-2 1.5H6.5a2 2 0 0 1-2-1.5Z" />
          <path d="M8 6V4.5A2.5 2.5 0 0 1 10.5 2h3A2.5 2.5 0 0 1 16 4.5V6" />
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14px] font-semibold transition-all duration-300 group-hover:max-w-[160px]">
          Venta en tienda
        </span>
      </button>

      {saleOpen && data && (
        <VentaTiendaModal
          products={data.products}
          pw={savedPw}
          onClose={() => setSaleOpen(false)}
          onSaved={() => fetchData(savedPw)}
        />
      )}
    </div>
  )
}
