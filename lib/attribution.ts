// ─────────────────────────────────────────────────────────────────────────────
// ATRIBUCIÓN — de qué anuncio viene cada solicitud de cita
//
// Google Ads entrega el identificador del clic en la URL de destino (`gclid`, o
// `wbraid` / `gbraid` cuando el usuario viene de iOS sin cookies). Guardamos ese
// identificador y lo enviamos junto con la reserva, de modo que la clínica pueda
// subir después la conversión OFFLINE: "esta paciente vino de verdad".
//
// Es la pieza que permite optimizar hacia pacientes reales en lugar de hacia
// formularios rellenados. La ventana de Google para importar conversiones es de
// 90 días, así que ese es el tiempo que se conserva.
//
// No se guarda ningún dato personal aquí: solo identificadores de campaña.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = 'quevi-attribution'
const MAX_AGE_DAYS = 90

/** Identificadores de clic de Google Ads, por orden de preferencia. */
const CLICK_IDS = ['gclid', 'wbraid', 'gbraid'] as const
const UTMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export type Attribution = {
  gclid?: string
  wbraid?: string
  gbraid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  /** Primera página de la sesión atribuida */
  landing_page?: string
  /** Referente externo, solo host */
  referrer?: string
  /** ISO de cuando se capturó */
  captured_at?: string
}

function isFresh(a: Attribution): boolean {
  if (!a.captured_at) return false
  const age = Date.now() - new Date(a.captured_at).getTime()
  return age < MAX_AGE_DAYS * 24 * 60 * 60 * 1000
}

/** Lee la atribución guardada, si no ha caducado. */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Attribution
    return isFresh(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Captura los parámetros de la URL actual. Se llama en cada navegación.
 *
 * Un clic de anuncio nuevo pisa al anterior (último clic manda, que es el modelo
 * con el que Google atribuye). Una navegación normal sin parámetros no borra
 * nada: el identificador sobrevive mientras el usuario navega por la web.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {}

  let params: URLSearchParams
  try {
    params = new URLSearchParams(window.location.search)
  } catch {
    return getAttribution()
  }

  const incomingClickId = CLICK_IDS.find((id) => params.get(id))
  const hasUtm = UTMS.some((u) => params.get(u))
  if (!incomingClickId && !hasUtm) return getAttribution()

  const next: Attribution = {
    landing_page: window.location.pathname,
    captured_at: new Date().toISOString(),
  }

  for (const id of CLICK_IDS) {
    const value = params.get(id)
    if (value) next[id] = value.slice(0, 512)
  }
  for (const utm of UTMS) {
    const value = params.get(utm)
    if (value) next[utm] = value.slice(0, 256)
  }

  try {
    // Solo el host del referente: la URL completa puede llevar datos de terceros
    if (document.referrer) {
      const host = new URL(document.referrer).host
      if (host && host !== window.location.host) next.referrer = host
    }
  } catch {
    // Referente ilegible: no es crítico
  }

  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Almacenamiento bloqueado: la atribución vale solo para esta página
  }
  return next
}

/** Ventana para seguir considerando "de pago" la navegación tras el clic. */
const PAID_SESSION_MINUTES = 30

/**
 * `true` si la visita actual viene de un anuncio de pago.
 *
 * Mira la URL y, si no trae parámetros (el usuario ya ha navegado a otra página
 * dentro del sitio), el clic guardado durante la última media hora. Deliberadamente
 * NO usa la ventana de 90 días de la atribución: esa sirve para la conversión
 * offline, y aquí solo queremos saber si estamos dentro de la visita que hemos
 * pagado.
 */
export function isPaidTraffic(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const params = new URLSearchParams(window.location.search)
    if (CLICK_IDS.some((id) => params.get(id))) return true
    const medium = params.get('utm_medium')?.toLowerCase()
    if (medium === 'cpc' || medium === 'ppc' || medium === 'paid') return true
  } catch {
    return false
  }

  const stored = getAttribution()
  if (!stored.gclid && !stored.wbraid && !stored.gbraid) return false
  if (!stored.captured_at) return false
  const minutesAgo = (Date.now() - new Date(stored.captured_at).getTime()) / 60000
  return minutesAgo < PAID_SESSION_MINUTES
}
