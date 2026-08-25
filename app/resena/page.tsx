import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { googleReviewUrl } from '@/content'

export const metadata: Metadata = {
  title: 'Deja tu reseña · QUEVI Wellness Clinic',
  robots: { index: false, follow: false },
}

// Sin caché: si cambia el destino de la reseña, surte efecto al instante.
export const dynamic = 'force-dynamic'

/**
 * Destino del QR impreso (local y envíos de paquetería).
 * Redirige a la ficha de Google para dejar reseña.
 */
export default function ResenaPage() {
  redirect(googleReviewUrl())
}
