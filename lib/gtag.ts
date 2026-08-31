// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE ANALYTICS 4 + GOOGLE ADS — disparadores de conversión
//
// Todo pasa por aquí para que ningún componente tenga que saber de `gtag`. Si
// las variables de entorno no están puestas (por ejemplo en desarrollo), las
// funciones no hacen nada y no rompen la página.
//
// Los identificadores de conversión se copian tal cual desde Google Ads
// (Objetivos → Conversiones → la conversión → "Etiqueta de conversión"), con el
// formato completo `AW-1234567890/AbCdEfGhIjK`.
// ─────────────────────────────────────────────────────────────────────────────

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? ''
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? ''

/** Etiquetas completas `AW-XXXX/YYYY` de cada conversión. */
export const CONVERSIONS = {
  lead: process.env.NEXT_PUBLIC_GADS_CONV_LEAD ?? '',
  whatsapp: process.env.NEXT_PUBLIC_GADS_CONV_WHATSAPP ?? '',
  phone: process.env.NEXT_PUBLIC_GADS_CONV_PHONE ?? '',
  purchase: process.env.NEXT_PUBLIC_GADS_CONV_PURCHASE ?? '',
} as const

/**
 * Valores de conversión. No son el precio: son lo que vale para el negocio cada
 * acción, y sirven para que Google sepa hacia qué optimizar. Una solicitud de
 * cita vale más que un clic de WhatsApp aunque ninguna de las dos haya cobrado
 * todavía un euro.
 */
export const CONVERSION_VALUES = {
  lead: 40,
  whatsapp: 8,
  phone: 8,
} as const

type GtagArgs =
  | ['js', Date]
  | ['config', string, Record<string, unknown>?]
  | ['event', string, Record<string, unknown>?]
  | ['set', string, Record<string, unknown>]
  | ['consent', 'default' | 'update', Record<string, string>]

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const isTaggingEnabled = Boolean(GA4_ID || GOOGLE_ADS_ID)

/** Llama a `gtag` solo si existe. En desarrollo no existe y no pasa nada. */
export function gtag(...args: GtagArgs): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

// ─── Normalización para conversiones mejoradas ───────────────────────────────

/** Teléfono en formato E.164, que es el único que acepta Google. */
function toE164(phone?: string | null): string | undefined {
  if (!phone) return undefined
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (!cleaned) return undefined
  if (cleaned.startsWith('+')) return cleaned
  // Nueve dígitos sin prefijo: es un número español
  if (cleaned.length === 9) return `+34${cleaned}`
  if (cleaned.startsWith('34') && cleaned.length === 11) return `+${cleaned}`
  if (cleaned.startsWith('00')) return `+${cleaned.slice(2)}`
  return undefined
}

/**
 * Conversiones mejoradas para clientes potenciales: se envían email y teléfono
 * en claro y la propia etiqueta de Google los convierte a hash SHA-256 en el
 * navegador antes de mandarlos. Nunca salen del dispositivo sin cifrar.
 *
 * Recupera entre un 10% y un 20% de conversiones que el navegador pierde, y hay
 * que activarlo también en el panel de Google Ads para que surta efecto.
 */
function setUserData(email?: string | null, phone?: string | null): void {
  const userData: Record<string, string> = {}
  const cleanEmail = email?.trim().toLowerCase()
  if (cleanEmail) userData.email = cleanEmail
  const e164 = toE164(phone)
  if (e164) userData.phone_number = e164
  if (Object.keys(userData).length === 0) return
  gtag('set', 'user_data', userData)
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

/** Vista de página en navegación cliente (App Router no recarga la página). */
export function pageview(url: string): void {
  if (!GA4_ID) return
  gtag('event', 'page_view', { page_path: url, page_location: window.location.href })
}

/**
 * Solicitud de cita enviada. Es LA conversión del plan: la única, junto con la
 * cita asistida que se importa offline, marcada como principal en Google Ads.
 */
export function trackLead(params: {
  email?: string | null
  phone?: string | null
  service?: string | null
  language?: 'es' | 'en'
}): void {
  setUserData(params.email, params.phone)

  gtag('event', 'generate_lead', {
    currency: 'EUR',
    value: CONVERSION_VALUES.lead,
    service: params.service ?? undefined,
    language: params.language ?? 'es',
  })

  if (CONVERSIONS.lead) {
    gtag('event', 'conversion', {
      send_to: CONVERSIONS.lead,
      value: CONVERSION_VALUES.lead,
      currency: 'EUR',
    })
  }
}

/** Clic en cualquier enlace de WhatsApp. Se mide, pero no se optimiza hacia él. */
export function trackWhatsAppClick(context?: string): void {
  gtag('event', 'contact', { method: 'whatsapp', context: context ?? 'site' })
  if (CONVERSIONS.whatsapp) {
    gtag('event', 'conversion', {
      send_to: CONVERSIONS.whatsapp,
      value: CONVERSION_VALUES.whatsapp,
      currency: 'EUR',
    })
  }
}

/** Clic en cualquier enlace `tel:`. */
export function trackPhoneClick(context?: string): void {
  gtag('event', 'contact', { method: 'phone', context: context ?? 'site' })
  if (CONVERSIONS.phone) {
    gtag('event', 'conversion', {
      send_to: CONVERSIONS.phone,
      value: CONVERSION_VALUES.phone,
      currency: 'EUR',
    })
  }
}

/** Compra en la tienda o seña de cita pagada. El valor aquí sí es dinero real. */
export function trackPurchase(params: {
  value: number
  transactionId?: string
  email?: string | null
  phone?: string | null
}): void {
  setUserData(params.email, params.phone)

  gtag('event', 'purchase', {
    currency: 'EUR',
    value: params.value,
    transaction_id: params.transactionId,
  })

  if (CONVERSIONS.purchase) {
    gtag('event', 'conversion', {
      send_to: CONVERSIONS.purchase,
      value: params.value,
      currency: 'EUR',
      transaction_id: params.transactionId,
    })
  }
}
