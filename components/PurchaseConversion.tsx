'use client'

import { useEffect, useRef } from 'react'
import { trackPurchase } from '@/lib/gtag'

/**
 * Dispara la conversión de compra una sola vez al montar, desde una página de
 * confirmación que es server component.
 *
 * `transactionId` evita el duplicado clásico: si la paciente recarga la página
 * de confirmación, Google descarta la segunda conversión por llevar el mismo
 * identificador de transacción.
 */
export default function PurchaseConversion({
  value,
  transactionId,
}: {
  value: number
  transactionId?: string
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    trackPurchase({ value, transactionId })
  }, [value, transactionId])

  return null
}
