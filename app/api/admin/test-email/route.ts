import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Diagnóstico de configuración de Resend.
// Uso: /api/admin/test-email?pw=TU_ADMIN_PASSWORD&to=tu@email.com
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pw = searchParams.get('pw')
  const to = searchParams.get('to')

  if (!process.env.ADMIN_PASSWORD || pw !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL ?? 'QUEVI Wellness Clinic <onboarding@resend.dev>'
  const notifyTo = process.env.ORDER_NOTIFICATIONS_EMAIL ?? null

  // 1. ¿Están las variables?
  const config = {
    RESEND_API_KEY_present: Boolean(apiKey),
    RESEND_API_KEY_startsWith: apiKey ? apiKey.slice(0, 3) : null,
    RESEND_FROM_EMAIL: from,
    ORDER_NOTIFICATIONS_EMAIL: notifyTo,
  }

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      diagnosis: 'RESEND_API_KEY NO está disponible en la función. Revisa el nombre exacto en Vercel, que esté marcada para Production, y haz Redeploy.',
      config,
    })
  }

  if (!to) {
    return NextResponse.json({
      ok: true,
      diagnosis: 'RESEND_API_KEY presente. Añade &to=tu@email.com a la URL para enviar un email de prueba real.',
      config,
    })
  }

  // 2. Intento de envío real, devolviendo la respuesta cruda de Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Prueba de configuración — QUEVI',
      html: '<p>Si recibes este email, Resend está correctamente configurado. ✓</p>',
    }),
  })

  const body = await res.json().catch(() => ({}))

  return NextResponse.json({
    ok: res.ok,
    status: res.status,
    resendResponse: body,
    diagnosis: res.ok
      ? 'Email enviado correctamente. Revisa tu bandeja (y spam).'
      : 'Resend rechazó el envío. Mira "resendResponse" para el motivo exacto (API key inválida, remitente no verificado, etc.).',
    config,
  })
}
