export const SHIPPING_CENTS = 495
export const FREE_SHIPPING_THRESHOLD_CENTS = 8000

export function getShippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS
}
