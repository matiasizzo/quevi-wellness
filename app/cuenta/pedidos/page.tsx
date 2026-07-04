import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Mis pedidos',
}

type OrderItem = {
  name: string
  vol?: string
  quantity: number
  priceCents: number
}

type ShippingInfo = {
  name: string
  email: string
  address: string
  city: string
  postalCode: string
  country: string
  items: OrderItem[]
}

type Order = {
  id: string
  status: string
  subtotal_cents: number
  shipping_cents: number
  total_cents: number
  stripe_payment_intent_id: string | null
  shipping_address: ShippingInfo | null
  created_at: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  paid:      { label: 'Pagado',    color: 'text-brand-700 bg-brand-50 border-brand-200' },
  shipped:   { label: 'Enviado',   color: 'text-blue-700 bg-blue-50 border-blue-200' },
  delivered: { label: 'Entregado', color: 'text-carbon-900 bg-cream-300 border-cream-400' },
  cancelled: { label: 'Cancelado', color: 'text-red-700 bg-red-50 border-red-200' },
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function orderRef(piId: string | null) {
  if (!piId) return '—'
  return piId.replace('pi_', '').slice(-8).toUpperCase()
}

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/cuenta/login')

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('shipping_address->>email', user.email ?? '')
    .order('created_at', { ascending: false })

  const list = (orders ?? []) as unknown as Order[]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream-200">
        <div className="max-w-[1000px] mx-auto px-6 pt-14 pb-6 border-b border-cream-400">
          <Link href="/cuenta" className="text-[10px] tracking-[0.2em] uppercase text-carbon-400 hover:text-carbon-900 transition-colors">
            ← Mi cuenta
          </Link>
          <h1 className="font-serif text-[44px] font-normal text-carbon-900 mt-4 mb-2">
            Mis pedidos
          </h1>
          <p className="text-[12px] tracking-[0.1em] uppercase text-carbon-400">
            {list.length} {list.length === 1 ? 'pedido' : 'pedidos'}
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto px-6 py-14">
          {list.length === 0 ? (
            <div className="max-w-md border border-cream-400 rounded-2xl p-12 text-center">
              <p className="font-serif text-[22px] font-normal text-carbon-900 mb-3">
                Sin pedidos aún
              </p>
              <p className="text-[12px] text-carbon-400 mb-8 leading-relaxed">
                Cuando realices tu primera compra aparecerá aquí.
              </p>
              <Link
                href="/shop"
                className="inline-block border border-brand-600 text-brand-600 text-[10px] tracking-[0.2em] uppercase px-8 py-3 rounded-full hover:bg-brand-600 hover:text-cream-50 transition-colors"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {list.map((order) => {
                const status = STATUS_LABELS[order.status] ?? STATUS_LABELS.paid
                const info = order.shipping_address
                return (
                  <div key={order.id} className="border border-cream-400 rounded-2xl overflow-hidden">
                    <div className="bg-cream-300 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-cream-400">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-carbon-400 mb-0.5">Referencia</p>
                          <p className="text-[12px] font-medium text-carbon-900 font-mono">#{orderRef(order.stripe_payment_intent_id)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-carbon-400 mb-0.5">Fecha</p>
                          <p className="text-[12px] text-carbon-900">{formatDate(order.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-carbon-400 mb-0.5">Total</p>
                          <p className="text-[12px] font-medium text-carbon-900">{formatPrice(order.total_cents)}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] tracking-[0.15em] uppercase px-3 py-1 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="px-6 py-5 divide-y divide-cream-300">
                      {(info?.items ?? []).map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                          <div>
                            <p className="text-sm text-carbon-900">{item.name}</p>
                            {item.vol && (
                              <p className="text-[12px] text-carbon-400 mt-0.5">{item.vol}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-[12px] text-carbon-400">× {item.quantity}</p>
                            <p className="text-[12px] text-carbon-900 mt-0.5">{formatPrice(item.priceCents * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {info && (
                      <div className="px-6 py-4 bg-cream-100 border-t border-cream-300">
                        <p className="text-[9px] tracking-[0.2em] uppercase text-carbon-400 mb-1">Dirección de envío</p>
                        <p className="text-[12px] text-carbon-400">
                          {info.name} — {info.address}, {info.city} {info.postalCode}, {info.country}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
