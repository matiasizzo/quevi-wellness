import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Dinero de Stripe: lo que hay en la cuenta y lo que se ha ido transferido al
// banco. Aquí solo aparece lo que Stripe ha cobrado de verdad — las ventas
// registradas a mano en el CRM (efectivo, datáfono del local) no pasan por
// Stripe y por tanto no cuentan en ninguna de estas cifras.

function sumByCurrency(amounts: Stripe.Balance.Available[] | undefined, currency: string) {
  return (amounts ?? [])
    .filter(a => a.currency === currency)
    .reduce((sum, a) => sum + a.amount, 0)
}

type BankInfo = { bank: string; last4: string }

function bankOf(destination: Stripe.Payout['destination']): BankInfo | null {
  if (!destination || typeof destination === 'string') return null
  if ('last4' in destination && destination.last4) {
    const bank = 'bank_name' in destination && destination.bank_name ? destination.bank_name : ''
    return { bank: bank ?? '', last4: destination.last4 }
  }
  return null
}

export async function GET(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || req.headers.get('x-admin-password') !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let stripe: ReturnType<typeof getStripe>
  try {
    stripe = getStripe()
  } catch {
    return NextResponse.json({ error: 'Falta STRIPE_SECRET_KEY' }, { status: 500 })
  }

  try {
    const [balance, payoutList, account] = await Promise.all([
      stripe.balance.retrieve(),
      stripe.payouts.list({ limit: 30, expand: ['data.destination'] }),
      // null = nuestra propia cuenta; si falla, seguimos sin el calendario de pagos
      stripe.accounts.retrieve(null).catch(() => null),
    ])

    const currency = 'eur'

    const payouts = payoutList.data.map(p => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      // Fecha en la que el dinero llega (o llegó) a la cuenta corriente
      arrivalDate: p.arrival_date ? p.arrival_date * 1000 : null,
      created: p.created * 1000,
      automatic: p.automatic,
      bank: bankOf(p.destination),
      failureMessage: p.failure_message ?? null,
      description: p.description ?? null,
    }))

    const eurPayouts = payouts.filter(p => p.currency === currency)
    const inTransit = eurPayouts
      .filter(p => p.status === 'pending' || p.status === 'in_transit')
      .reduce((sum, p) => sum + p.amount, 0)

    const since = Date.now() - 30 * 24 * 60 * 60 * 1000
    const paidLast30 = eurPayouts
      .filter(p => p.status === 'paid' && (p.arrivalDate ?? p.created) >= since)
      .reduce((sum, p) => sum + p.amount, 0)

    const schedule = account?.settings?.payouts?.schedule ?? null

    return NextResponse.json({
      currency,
      // Disponible = ya se puede transferir. Pendiente = cobrado pero aún
      // retenido por Stripe hasta que libera el dinero.
      available: sumByCurrency(balance.available, currency),
      pending: sumByCurrency(balance.pending, currency),
      inTransit,
      paidLast30,
      payouts: eurPayouts,
      schedule: schedule
        ? {
            interval: schedule.interval ?? null,
            delayDays: schedule.delay_days ?? null,
            weeklyAnchor: schedule.weekly_anchor ?? null,
            monthlyAnchor: schedule.monthly_anchor ?? null,
          }
        : null,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'No se pudo consultar Stripe'
    console.error('[stripe-balance]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
