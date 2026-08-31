'use client'

import { useEffect } from 'react'
import { CONSENT_EVENT, currentConsent, type StoredConsent } from '@/lib/consent'

/**
 * Microsoft Clarity (mapas de calor + grabaciones de sesión).
 * Se inicializa SOLO si el usuario aceptó las cookies analíticas, para cumplir
 * con el RGPD. El ID del proyecto se pone en la variable de entorno
 * NEXT_PUBLIC_CLARITY_PROJECT_ID (Vercel), así no queda escrito en el código.
 */

export default function ClarityAnalytics() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    if (!projectId) {
      console.warn('[Clarity] NEXT_PUBLIC_CLARITY_PROJECT_ID no está definida — Clarity no cargará.')
      return
    }

    let started = false

    async function start() {
      if (started) return
      started = true
      try {
        const Clarity = (await import('@microsoft/clarity')).default
        Clarity.init(projectId!)
        console.info('[Clarity] Inicializado con proyecto', projectId)
      } catch (e) {
        console.error('[Clarity] Error al inicializar:', e)
      }
    }

    // Arranca si ya había consentimiento analítico previo
    if (currentConsent().analytics) {
      start()
      return
    }

    // Si aún no ha decidido, esperamos a que acepte (evento del banner de cookies)
    function onConsent(e: Event) {
      const detail = (e as CustomEvent).detail as StoredConsent | undefined
      if (detail?.analytics) start()
    }
    window.addEventListener(CONSENT_EVENT, onConsent)
    return () => window.removeEventListener(CONSENT_EVENT, onConsent)
  }, [])

  return null
}
