import type Stripe from 'stripe'

// ── Datos de quien paga, según Stripe ────────────────────────────────────────
// Hay cobros que no nacen del checkout de la web: links de pago que se envían a
// mano (reservas de un servicio) y señas de cita. En esos no hay fila previa ni
// metadata nuestra, así que el pedido caía en el CRM con el importe y nada más.
// Stripe sí guarda quién pagó, y aquí se lo pedimos.
export type PayerDetails = {
  name: string
  email: string
  phone: string
  items: { name: string; quantity: number; price: number }[]
  // payment_link    = link de pago enviado a mano
  // stripe_checkout = página de pago de Stripe (p. ej. seña de cita)
  // stripe          = cobro suelto, sin sesión de pago
  source: 'payment_link' | 'stripe_checkout' | 'stripe'
  // Cliente de Stripe asociado al cobro, si lo hay
  customerId?: string
}

export async function fetchPayerDetails(stripe: Stripe, pi: Stripe.PaymentIntent): Promise<PayerDetails> {
  const payer: PayerDetails = { name: '', email: '', phone: '', items: [], source: 'stripe', customerId: '' }

  try {
    const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1 })
    const session = sessions.data[0]
    if (session) {
      payer.name = session.customer_details?.name ?? ''
      payer.email = session.customer_email ?? session.customer_details?.email ?? ''
      // El teléfono solo llega si el link de pago tiene activada su recogida
      payer.phone = session.customer_details?.phone ?? ''
      payer.source = session.payment_link ? 'payment_link' : 'stripe_checkout'
      payer.customerId = typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? '')

      try {
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50 })
        payer.items = lines.data.map(l => {
          const qty = Math.max(1, l.quantity ?? 1)
          return {
            name: l.description ?? 'Concepto sin nombre',
            quantity: qty,
            price: Math.round((l.amount_total ?? 0) / qty) / 100,
          }
        })
      } catch (e) {
        console.error('[stripePayer] No se pudieron leer las líneas de la sesión:', e)
      }
    }
  } catch (e) {
    console.error('[stripePayer] No se pudo leer la sesión de pago:', e)
  }

  // Respaldo: los datos de facturación de la tarjeta
  if (!payer.name || !payer.email || !payer.phone) {
    try {
      const chargeId = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id
      const charge = chargeId ? await stripe.charges.retrieve(chargeId) : null
      payer.name = payer.name || (charge?.billing_details?.name ?? '')
      payer.email = payer.email || charge?.billing_details?.email || pi.receipt_email || ''
      payer.phone = payer.phone || (charge?.billing_details?.phone ?? '')
    } catch (e) {
      console.error('[stripePayer] No se pudieron leer los datos del cargo:', e)
    }
  }

  // Último respaldo: la ficha de cliente que Stripe crea con el cobro. Muchos
  // links de pago no piden la dirección de facturación, y entonces el nombre
  // solo está aquí.
  if (!payer.name || !payer.email || !payer.phone) {
    try {
      const customerId = payer.customerId
        || (typeof pi.customer === 'string' ? pi.customer : pi.customer?.id ?? '')
      if (customerId) {
        const customer = await stripe.customers.retrieve(customerId)
        if (!customer.deleted) {
          payer.name = payer.name || (customer.name ?? '')
          payer.email = payer.email || (customer.email ?? '')
          payer.phone = payer.phone || (customer.phone ?? '')
        }
      }
    } catch (e) {
      console.error('[stripePayer] No se pudo leer la ficha de cliente:', e)
    }
  }

  return payer
}

// Igual que la anterior, partiendo solo del id del cobro (para los pedidos que
// ya estaban guardados sin datos)
export async function fetchPayerDetailsById(stripe: Stripe, paymentIntentId: string): Promise<PayerDetails> {
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] })
  return fetchPayerDetails(stripe, pi)
}
