// Emails transaccionales de pedidos vía Resend (https://resend.com)
// Requiere RESEND_API_KEY. Opcionales: RESEND_FROM_EMAIL, ORDER_NOTIFICATIONS_EMAIL.

type OrderEmailItem = {
  name: string
  vol?: string
  quantity: number
  priceCents: number
}

export type OrderEmailData = {
  orderRef: string
  customerName: string
  customerEmail: string
  items: OrderEmailItem[]
  subtotalCents: number
  shippingCents: number
  totalCents: number
  address: string
  city: string
  postalCode: string
  country: string
  phone?: string
}

function eur(cents: number) {
  return (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €'
}

function itemsTableHtml(items: OrderEmailItem[]) {
  const rows = items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;color:#1e1e1e;font-size:14px;">
        ${i.name}${i.vol ? ` <span style="color:#999;font-size:12px;">· ${i.vol}</span>` : ''}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:center;color:#666;font-size:13px;">× ${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;color:#1e1e1e;font-size:14px;">${eur(i.priceCents * i.quantity)}</td>
    </tr>`).join('')

  return `<table style="width:100%;border-collapse:collapse;">${rows}</table>`
}

function baseLayout(content: string) {
  return `
  <div style="background:#f5f2ec;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:560px;margin:0 auto;background:#fdfcfa;border-radius:16px;overflow:hidden;border:1px solid #ddd8cc;">
      <div style="background:#16231a;padding:28px;text-align:center;">
        <span style="color:#f9f7f3;font-size:26px;letter-spacing:6px;">QUEVI</span><br/>
        <span style="color:#adc5af;font-size:11px;letter-spacing:3px;">WELLNESS CLINIC</span>
      </div>
      <div style="padding:32px 28px;">
        ${content}
      </div>
      <div style="padding:20px 28px;border-top:1px solid #eee;text-align:center;">
        <p style="color:#999;font-size:11px;margin:0;">QUEVI Wellness Clinic · Estepona, Málaga · queviwellnessclinic.es</p>
      </div>
    </div>
  </div>`
}

function totalsHtml(d: OrderEmailData) {
  return `
  <table style="width:100%;margin-top:16px;">
    <tr><td style="color:#666;font-size:13px;padding:3px 0;">Subtotal</td><td style="text-align:right;color:#666;font-size:13px;">${eur(d.subtotalCents)}</td></tr>
    <tr><td style="color:#666;font-size:13px;padding:3px 0;">Envío</td><td style="text-align:right;color:#666;font-size:13px;">${d.shippingCents === 0 ? 'Gratis' : eur(d.shippingCents)}</td></tr>
    <tr><td style="color:#1e1e1e;font-size:16px;padding:8px 0;border-top:1px solid #eee;"><strong>Total</strong></td><td style="text-align:right;color:#1e1e1e;font-size:16px;border-top:1px solid #eee;"><strong>${eur(d.totalCents)}</strong></td></tr>
  </table>`
}

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[orderEmails] RESEND_API_KEY not set — skipping email:', subject)
    return
  }
  const from = process.env.RESEND_FROM_EMAIL ?? 'QUEVI Wellness Clinic <onboarding@resend.dev>'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`[orderEmails] Resend error ${res.status} for "${subject}":`, body)
  }
}

export async function sendOrderEmails(d: OrderEmailData) {
  const clinicEmail = process.env.ORDER_NOTIFICATIONS_EMAIL

  // ── Email al comprador ──
  const customerHtml = baseLayout(`
    <h1 style="color:#1e1e1e;font-size:24px;font-weight:normal;margin:0 0 8px;">¡Gracias por tu pedido${d.customerName ? `, ${d.customerName.split(' ')[0]}` : ''}!</h1>
    <p style="color:#666;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Hemos recibido tu pedido <strong style="color:#355539;">#${d.orderRef}</strong> y ya lo estamos preparando.
      Te avisaremos cuando salga en camino.
    </p>
    ${itemsTableHtml(d.items)}
    ${totalsHtml(d)}
    <div style="margin-top:24px;padding:16px;background:#f5f2ec;border-radius:10px;">
      <p style="color:#999;font-size:11px;letter-spacing:2px;margin:0 0 6px;">DIRECCIÓN DE ENVÍO</p>
      <p style="color:#1e1e1e;font-size:13px;line-height:1.5;margin:0;">
        ${d.customerName}<br/>${d.address}<br/>${d.postalCode} ${d.city}, ${d.country}
      </p>
    </div>
  `)

  await sendEmail(d.customerEmail, `Pedido confirmado #${d.orderRef} — QUEVI Wellness Clinic`, customerHtml)

  // ── Email a la clínica ──
  if (clinicEmail) {
    const clinicHtml = baseLayout(`
      <h1 style="color:#1e1e1e;font-size:22px;font-weight:normal;margin:0 0 8px;">Nuevo pedido #${d.orderRef}</h1>
      <p style="color:#666;font-size:14px;line-height:1.6;margin:0 0 24px;">
        <strong>${d.customerName}</strong> (${d.customerEmail}${d.phone ? ` · ${d.phone}` : ''}) ha realizado una compra.
      </p>
      ${itemsTableHtml(d.items)}
      ${totalsHtml(d)}
      <div style="margin-top:24px;padding:16px;background:#f5f2ec;border-radius:10px;">
        <p style="color:#999;font-size:11px;letter-spacing:2px;margin:0 0 6px;">ENVIAR A</p>
        <p style="color:#1e1e1e;font-size:13px;line-height:1.5;margin:0;">
          ${d.address}<br/>${d.postalCode} ${d.city}, ${d.country}
        </p>
      </div>
    `)

    await sendEmail(clinicEmail, `🛒 Nuevo pedido #${d.orderRef} · ${eur(d.totalCents)}`, clinicHtml)
  } else {
    console.warn('[orderEmails] ORDER_NOTIFICATIONS_EMAIL not set — clinic notification skipped')
  }
}
