// ─────────────────────────────────────────────────────────────────────────────
// CONSENTIMIENTO DE COOKIES — fuente única de verdad
//
// El banner guarda dos categorías independientes (analíticas y publicitarias)
// porque el RGPD no admite un "aceptar todo" implícito, y Google Consent Mode v2
// necesita saber por separado si puede usar cookies de medición y de publicidad.
//
// Compatibilidad: la versión anterior guardaba la cadena 'accepted' | 'rejected'
// en `quevi-cookie-consent`. Ese valor solo cubría la analítica (Clarity), nunca
// se pidió consentimiento publicitario, así que a quien lo tenga se le vuelve a
// preguntar — pero arrancamos las casillas con su decisión previa.
// ─────────────────────────────────────────────────────────────────────────────

export type ConsentCategories = {
  /** Microsoft Clarity y Google Analytics 4 */
  analytics: boolean
  /** Google Ads: medición de conversiones y remarketing */
  ads: boolean
}

export type StoredConsent = ConsentCategories & {
  v: 2
  ts: string
}

/** Clave nueva (categorías separadas). */
const KEY = 'quevi-consent'
/** Clave antigua (binaria). Se sigue escribiendo para no romper nada existente. */
const LEGACY_KEY = 'quevi-cookie-consent'

/** Evento que se dispara al guardar. Lo escuchan Clarity y las etiquetas de Google. */
export const CONSENT_EVENT = 'quevi-cookie-consent'

export const DENY_ALL: ConsentCategories = { analytics: false, ads: false }

/** Lee el consentimiento guardado. `null` = todavía no ha decidido. */
export function readConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredConsent>
    if (parsed.v !== 2) return null
    return {
      v: 2,
      analytics: parsed.analytics === true,
      ads: parsed.ads === true,
      ts: typeof parsed.ts === 'string' ? parsed.ts : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

/**
 * Decisión anterior con el banner binario, para preseleccionar las casillas.
 * No cuenta como consentimiento: si devuelve algo, el banner se muestra igual.
 */
export function readLegacyConsent(): 'accepted' | 'rejected' | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    return raw === 'accepted' || raw === 'rejected' ? raw : null
  } catch {
    return null
  }
}

/** Guarda la decisión, avisa a quien esté escuchando y devuelve lo guardado. */
export function saveConsent(categories: ConsentCategories): StoredConsent {
  const stored: StoredConsent = { v: 2, ...categories, ts: new Date().toISOString() }
  try {
    localStorage.setItem(KEY, JSON.stringify(stored))
    // La clave antigua sigue mandando sobre Clarity mientras quede código que la lea
    localStorage.setItem(LEGACY_KEY, categories.analytics ? 'accepted' : 'rejected')
  } catch {
    // Almacenamiento bloqueado: el consentimiento vale solo para esta página
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: stored }))
  }
  return stored
}

/** Consentimiento efectivo ahora mismo. Sin decisión = todo denegado. */
export function currentConsent(): ConsentCategories {
  const stored = readConsent()
  if (!stored) return DENY_ALL
  return { analytics: stored.analytics, ads: stored.ads }
}
