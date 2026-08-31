'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { captureAttribution } from '@/lib/attribution'
import { CONSENT_EVENT, currentConsent, type StoredConsent } from '@/lib/consent'
import { gtag, pageview, trackPhoneClick, trackWhatsAppClick } from '@/lib/gtag'

/**
 * Tres trabajos silenciosos, sin pintar nada:
 *
 *  1. Sincroniza el consentimiento del banner con Consent Mode v2.
 *  2. Guarda el identificador de clic de Google Ads (`gclid`) que trae la URL,
 *     para poder importar después la conversión offline.
 *  3. Mide los clics de contacto (WhatsApp y teléfono) en toda la web con un
 *     único listener delegado, en lugar de tocar cada componente.
 */
export default function TrackingProvider() {
  const pathname = usePathname()
  const firstRender = useRef(true)

  // ─── 1. Consentimiento ─────────────────────────────────────────────────────
  useEffect(() => {
    const push = (consent: { analytics: boolean; ads: boolean }) => {
      gtag('consent', 'update', {
        ad_storage: consent.ads ? 'granted' : 'denied',
        ad_user_data: consent.ads ? 'granted' : 'denied',
        ad_personalization: consent.ads ? 'granted' : 'denied',
        analytics_storage: consent.analytics ? 'granted' : 'denied',
      })
    }

    // El script del <head> ya restauró la decisión previa; esto cubre el caso de
    // que gtag.js todavía no estuviera listo en ese momento.
    push(currentConsent())

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent).detail as StoredConsent | string | undefined
      if (detail && typeof detail === 'object') {
        push({ analytics: detail.analytics, ads: detail.ads })
      } else {
        push(currentConsent())
      }
    }

    window.addEventListener(CONSENT_EVENT, onConsent)
    return () => window.removeEventListener(CONSENT_EVENT, onConsent)
  }, [])

  // ─── 2. Atribución + vista de página en navegación cliente ─────────────────
  useEffect(() => {
    captureAttribution()
    if (firstRender.current) {
      // La primera vista la envía `config`, no hay que duplicarla
      firstRender.current = false
      return
    }
    pageview(pathname ?? '/')
  }, [pathname])

  // ─── 3. Clics de contacto en toda la web ───────────────────────────────────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const link = target?.closest?.('a')
      if (!link) return
      const href = link.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) {
        trackPhoneClick(window.location.pathname)
      } else if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
        trackWhatsAppClick(window.location.pathname)
      }
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
