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
  items?: OrderItem[]
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

type AdminData = {
  orders: Order[]
  appointments: Appointment[]
  bookings: Booking[]
  products: Product[]
  giftCards: GiftCard[]
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
  const cls = map[status] ?? 'bg-zinc-700/50 text-zinc-400 border-zinc-600'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-[0.06em] uppercase ${cls}`}>
      {status}
    </span>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-zinc-800/50 px-5 py-4">
      <p className="text-[11px] tracking-[0.14em] uppercase text-zinc-500 mb-1">{label}</p>
      <p className="font-mono text-[26px] font-semibold text-zinc-100 leading-none">{value}</p>
      {sub && <p className="text-[12px] text-zinc-500 mt-1">{sub}</p>}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function Empty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="mb-3 opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 9h6M9 12h6M9 15h4" />
      </svg>
      <p className="text-[14px]">{label}</p>
    </div>
  )
}

// ── Tab: Pedidos ──────────────────────────────────────────────────────────────

function PedidosTab({ orders }: { orders: Order[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const paid = orders.filter(o => o.status === 'paid' || o.status === 'completed')
  const total = paid.reduce((s, o) => s + o.total_cents, 0)

  const filtered = orders.filter(o => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    const a = o.shipping_address
    return [a?.name, a?.email, a?.phone, a?.city, o.id, o.stripe_payment_intent_id]
      .filter(Boolean).some(v => String(v).toLowerCase().includes(q))
  })

  function copy(text: string) {
    navigator.clipboard?.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total pedidos" value={orders.length} />
        <StatCard label="Pagados" value={paid.length} />
        <StatCard label="Facturación" value={euros(total)} sub="solo pedidos pagados" />
        <StatCard label="Ticket medio" value={paid.length ? euros(Math.round(total / paid.length)) : '—'} />
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por cliente, email, teléfono, ciudad o ID…"
        className="w-full bg-zinc-800/60 border border-zinc-700 rounded-lg px-4 py-2.5 text-[13px] text-zinc-200 placeholder:text-zinc-500 outline-none focus:border-zinc-500 transition-colors"
      />

      {filtered.length === 0 ? <Empty label={query ? 'Sin resultados' : 'No hay pedidos todavía'} /> : (
        <div className="space-y-2">
          {filtered.map(o => {
            const a = o.shipping_address ?? {}
            const items = a.items ?? []
            const isOpen = openId === o.id
            const ref = o.stripe_payment_intent_id
              ? o.stripe_payment_intent_id.replace('pi_', '').slice(-8).toUpperCase()
              : o.id.slice(0, 8).toUpperCase()
            return (
              <div key={o.id} className="rounded-xl border border-zinc-700/60 bg-zinc-800/30 overflow-hidden">
                <button
                  onClick={() => setOpenId(isOpen ? null : o.id)}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-700/20 transition-colors flex flex-wrap items-center gap-x-4 gap-y-2"
                >
                  <span className="font-mono text-[12px] text-zinc-500 w-[76px]">#{ref}</span>
                  <span className="text-zinc-200 font-medium min-w-[150px] flex-1">
                    {a.name || <span className="text-zinc-500">Sin nombre</span>}
                    {items.length > 0 && (
                      <span className="text-zinc-500 font-normal"> · {items.reduce((s, i) => s + (i.quantity ?? 1), 0)} art.</span>
                    )}
                  </span>
                  <span className="text-zinc-400 text-[12px] whitespace-nowrap">{fmtDate(o.created_at)}</span>
                  <StatusBadge status={o.status} />
                  <span className="font-semibold text-zinc-100 whitespace-nowrap min-w-[70px] text-right">{euros(o.total_cents)}</span>
                  <span className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-zinc-700/40 grid gap-4 md:grid-cols-2">
                    {/* Artículos */}
                    <div>
                      <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-500 mb-2">Artículos</p>
                      {items.length === 0 ? (
                        <p className="text-[13px] text-zinc-500">Sin detalle de artículos</p>
                      ) : (
                        <ul className="space-y-1.5 m-0 p-0 list-none">
                          {items.map((i, n) => (
                            <li key={n} className="flex justify-between gap-3 text-[13px]">
                              <span className="text-zinc-300">
                                {i.name}
                                {i.vol ? <span className="text-zinc-500"> · {i.vol}</span> : null}
                                <span className="text-zinc-500"> × {i.quantity ?? 1}</span>
                              </span>
                              <span className="text-zinc-400 whitespace-nowrap">
                                {typeof i.price === 'number' ? euros(Math.round(i.price * 100) * (i.quantity ?? 1)) : '—'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3 pt-3 border-t border-zinc-700/40 space-y-1 text-[12px]">
                        <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>{euros(o.subtotal_cents)}</span></div>
                        <div className="flex justify-between text-zinc-400"><span>Envío</span><span>{o.shipping_cents === 0 ? 'Gratis' : euros(o.shipping_cents)}</span></div>
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
                      <p className="text-[11px] tracking-[0.1em] uppercase text-zinc-500 mb-2">Cliente y envío</p>
                      <div className="space-y-1.5 text-[13px] text-zinc-300">
                        {a.email && (
                          <div className="flex items-center gap-2">
                            <a href={`mailto:${a.email}`} className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2">{a.email}</a>
                            <button onClick={() => copy(a.email!)} className="text-[11px] text-zinc-500 hover:text-zinc-300">copiar</button>
                          </div>
                        )}
                        {a.phone && (
                          <div className="flex items-center gap-2">
                            <a href={`https://wa.me/${a.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2">{a.phone}</a>
                            <span className="text-[11px] text-zinc-500">WhatsApp</span>
                          </div>
                        )}
                        {a.address ? (
                          <div className="pt-1 leading-relaxed text-zinc-400">
                            {a.name}<br />
                            {a.address}<br />
                            {a.postalCode} {a.city}{a.country ? `, ${a.country}` : ''}
                            <button
                              onClick={() => copy(`${a.name}\n${a.address}\n${a.postalCode} ${a.city}, ${a.country}`)}
                              className="ml-2 text-[11px] text-zinc-500 hover:text-zinc-300"
                            >
                              copiar dirección
                            </button>
                          </div>
                        ) : (
                          <p className="text-zinc-500 pt-1">Sin dirección — pedido sin envío (ritual, tratamiento o regalo)</p>
                        )}
                        {o.stripe_payment_intent_id && (
                          <p className="pt-2 font-mono text-[11px] text-zinc-600 m-0">{o.stripe_payment_intent_id}</p>
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
              color: view === v ? '#f4f4f5' : '#71717a',
              border: '1px solid',
              borderColor: view === v ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
            }}
          >
            {v === 'appointments' ? `Citas con seña (${appointments.length})` : `Formulario contacto (${bookings.length})`}
          </button>
        ))}
      </div>

      {view === 'appointments' && (
        appointments.length === 0 ? <Empty label="No hay citas todavía" /> : (
          <div className="rounded-xl border border-zinc-700/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-zinc-700/60 bg-zinc-800/80">
                    {['Fecha solicitud', 'Nombre', 'Email', 'Servicio', 'Cita', 'Importe', 'Estado'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase text-zinc-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/40">
                  {appointments.map(a => (
                    <tr key={a.id} className="hover:bg-zinc-700/20 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{fmtDate(a.created_at)}</td>
                      <td className="px-4 py-3 text-zinc-200 font-medium">{a.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{a.email}</td>
                      <td className="px-4 py-3 text-zinc-300 max-w-[160px] truncate">{a.service}</td>
                      <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
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
          <div className="rounded-xl border border-zinc-700/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-zinc-700/60 bg-zinc-800/80">
                    {['Fecha', 'Nombre', 'Email', 'Teléfono', 'Servicio', 'Estado'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] tracking-[0.1em] uppercase text-zinc-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/40">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-zinc-700/20 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{fmtDate(b.created_at)}</td>
                      <td className="px-4 py-3 text-zinc-200 font-medium">{b.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{b.email}</td>
                      <td className="px-4 py-3 text-zinc-400">{b.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-zinc-300">{b.service ?? '—'}</td>
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

function StockTab({ products }: { products: Product[] }) {
  const allVariants = products.flatMap(p => p.product_variants)
  const lowStock = allVariants.filter(v => v.active && v.stock_quantity <= 5)
  const outOfStock = allVariants.filter(v => v.active && v.stock_quantity === 0)

  function stockColor(qty: number) {
    if (qty === 0) return 'text-red-400'
    if (qty <= 5) return 'text-amber-400'
    return 'text-emerald-400'
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Productos" value={products.filter(p => p.active).length} sub={`${products.filter(p => !p.active).length} inactivos`} />
        <StatCard label="Variantes totales" value={allVariants.length} />
        <StatCard label="Stock bajo (≤5)" value={lowStock.length} />
        <StatCard label="Sin stock" value={outOfStock.length} />
      </div>

      {products.length === 0 ? <Empty label="No hay productos en Supabase" /> : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="rounded-xl border border-zinc-700/60 bg-zinc-800/30 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-700/40">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-zinc-200 truncate">{p.name}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">{p.slug}</p>
                </div>
                <div className="flex gap-2">
                  {!p.active && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-zinc-700 text-zinc-400 border border-zinc-600">inactivo</span>
                  )}
                  {p.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">destacado</span>
                  )}
                </div>
              </div>

              {p.product_variants.length === 0 ? (
                <p className="px-5 py-3 text-[13px] text-zinc-600 italic">Sin variantes</p>
              ) : (
                <div className="divide-y divide-zinc-700/30">
                  {p.product_variants.map(v => (
                    <div key={v.id} className="flex items-center gap-4 px-5 py-2.5">
                      <span className="text-[13px] text-zinc-300 flex-1">{v.name}</span>
                      <span className="text-[13px] text-zinc-400 tabular-nums">
                        {(v.price_cents / 100).toFixed(2)} €
                      </span>
                      <div className="flex items-center gap-2 min-w-[80px] justify-end">
                        <span className={`text-[14px] font-mono font-semibold tabular-nums ${stockColor(v.stock_quantity)}`}>
                          {v.stock_quantity}
                        </span>
                        <span className="text-[11px] text-zinc-600">uds.</span>
                        {v.stock_quantity === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">AGOTADO</span>
                        )}
                        {v.stock_quantity > 0 && v.stock_quantity <= 5 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">BAJO</span>
                        )}
                      </div>
                      {!v.active && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-700 text-zinc-500 border border-zinc-600">off</span>
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
    redeemed:  { label: 'Canjeado',  cls: 'bg-zinc-600/40 text-zinc-300 border-zinc-500/40' },
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
        className="w-full bg-zinc-900/60 border border-zinc-700 rounded-lg px-4 py-2.5 text-[13px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
      />

      {filtered.length === 0 ? <Empty label="No hay vales regalo" /> : (
        <div className="space-y-3">
          {filtered.map(c => {
            const left = Math.max(0, c.total_sessions - c.sessions_used)
            const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false
            const canUse = c.status === 'active' && !expired && left > 0
            return (
              <div key={c.id} className="rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[15px] font-semibold text-zinc-100 tracking-[0.08em]">{c.code}</span>
                      <GiftStatusBadge card={c} />
                    </div>
                    <p className="text-[14px] text-zinc-300 mt-1.5">{c.item_name}</p>
                    <p className="text-[12px] text-zinc-500 mt-0.5">
                      Para <span className="text-zinc-400">{c.recipient_name ?? '—'}</span>
                      {c.recipient_email ? ` · ${c.recipient_email}` : ''}
                      {c.purchaser_name ? ` · de ${c.purchaser_name}` : ''}
                    </p>
                    {c.message && <p className="text-[12px] text-zinc-500 italic mt-1">"{c.message}"</p>}
                    <p className="text-[11px] text-zinc-600 mt-1.5">
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
                        className="px-4 py-2 rounded-lg border border-zinc-700 text-[12px] text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        Reactivar
                      </button>
                    ) : c.status !== 'redeemed' && (
                      <button
                        onClick={() => act(c.id, 'cancel')}
                        disabled={busyId === c.id}
                        className="px-4 py-2 rounded-lg border border-zinc-700 text-[12px] text-zinc-500 hover:text-red-400 hover:border-red-500/40 transition-colors disabled:opacity-50 whitespace-nowrap"
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
  const [tab, setTab] = useState<'pedidos' | 'citas' | 'stock' | 'vales'>('pedidos')
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f10' }}>
        <div className="w-full max-w-[360px] px-4">
          <div className="mb-8 text-center">
            <p className="text-[11px] tracking-[0.28em] uppercase text-zinc-500 mb-2">QUEVI Wellness</p>
            <h1 className="text-[26px] font-semibold text-zinc-100">Panel de administración</h1>
          </div>

          <form onSubmit={handleLogin} className="rounded-2xl border border-zinc-700/60 bg-zinc-800/60 p-6 space-y-4">
            <div>
              <label className="block text-[12px] text-zinc-400 mb-1.5 tracking-[0.06em]">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="w-full bg-zinc-900/60 border border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-100 placeholder-zinc-600 outline-none focus:border-zinc-500 transition-colors"
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

  const TABS = [
    { id: 'pedidos', label: 'Pedidos', count: data?.orders.length ?? 0 },
    { id: 'citas',   label: 'Citas',   count: (data?.appointments.length ?? 0) + (data?.bookings.length ?? 0) },
    { id: 'vales',   label: 'Vales regalo', count: data?.giftCards?.length ?? 0 },
    { id: 'stock',   label: 'Stock',   count: data?.products.length ?? 0 },
  ] as const

  const savedPw = typeof window !== 'undefined' ? sessionStorage.getItem('quevi-admin-pw') ?? '' : ''

  return (
    <div className="min-h-screen" style={{ background: '#0f0f10', color: '#f4f4f5' }}>
      {/* Top bar */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.22em] uppercase text-zinc-500">QUEVI</span>
          <span className="text-zinc-700">/</span>
          <span className="text-[14px] font-medium text-zinc-300">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          {lastRefresh && (
            <span className="text-[11px] text-zinc-600 hidden sm:block">
              Actualizado: {lastRefresh.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={() => fetchData(savedPw)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 text-[12px] text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-50"
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
            className="px-3 py-1.5 rounded-lg border border-zinc-700 text-[12px] text-zinc-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
          >
            Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-zinc-800 px-6">
        <div className="flex gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-3.5 text-[13px] font-medium border-b-2 transition-colors"
              style={{
                borderBottomColor: tab === t.id ? '#f4f4f5' : 'transparent',
                color: tab === t.id ? '#f4f4f5' : '#71717a',
              }}
            >
              {t.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-[11px] tabular-nums"
                style={{ background: tab === t.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)', color: tab === t.id ? '#d4d4d8' : '#52525b' }}
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
            <span className="text-zinc-600 text-[14px]">Cargando…</span>
          </div>
        ) : (
          <>
            {tab === 'pedidos' && <PedidosTab orders={data.orders} />}
            {tab === 'citas'   && <CitasTab appointments={data.appointments} bookings={data.bookings} />}
            {tab === 'vales'   && <ValesTab giftCards={data.giftCards ?? []} pw={savedPw} onChanged={() => fetchData(savedPw)} />}
            {tab === 'stock'   && <StockTab products={data.products} />}
          </>
        )}
      </main>
    </div>
  )
}
