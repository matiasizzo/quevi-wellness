import type { CartItem } from './cartContext'

/** Ámbito de un cupón: toda la web o solo productos de la tienda. */
export type CouponScope = 'all' | 'products'

/**
 * Un ítem es "producto" si NO es un ritual. Los rituales se añaden al carrito
 * con id prefijado por 'ritual-' (ver Rituales.tsx); los productos llevan su
 * UUID de Supabase. Los tratamientos no se venden online (solo reserva).
 */
export function isProductItem(item: { id: string }): boolean {
  return !item.id.startsWith('ritual-')
}

/**
 * Ítems sobre los que aplica un cupón.
 * Si `onlySlugs` trae valores, el cupón se restringe a esos slugs concretos
 * (ej. una promo válida solo para dos rituales); si no, manda el ámbito.
 */
export function eligibleItems(
  items: CartItem[],
  scope: CouponScope,
  onlySlugs?: string[] | null,
): CartItem[] {
  if (onlySlugs && onlySlugs.length > 0) {
    const set = new Set(onlySlugs.map((s) => s.toLowerCase()))
    return items.filter((i) => set.has(i.slug.toLowerCase()))
  }
  return scope === 'products' ? items.filter(isProductItem) : items
}

/** Subtotal en euros de los ítems elegibles. */
export function eligibleSubtotal(
  items: CartItem[],
  scope: CouponScope,
  onlySlugs?: string[] | null,
): number {
  return eligibleItems(items, scope, onlySlugs).reduce((s, i) => s + i.price * i.quantity, 0)
}

/** Subtotal en céntimos de los ítems elegibles (usado en servidor). */
export function eligibleSubtotalCents(
  items: CartItem[],
  scope: CouponScope,
  onlySlugs?: string[] | null,
): number {
  return Math.round(
    eligibleItems(items, scope, onlySlugs).reduce(
      (sum, i) => sum + Math.round((Number(i.price) || 0) * 100) * (Number(i.quantity) || 1),
      0,
    ),
  )
}

/** Descuento en euros que aplica un cupón sobre el carrito. */
export function couponDiscount(
  items: CartItem[],
  coupon: { percent: number; scope?: CouponScope; appliesTo?: string[] | null } | null,
): number {
  if (!coupon) return 0
  return (eligibleSubtotal(items, coupon.scope ?? 'all', coupon.appliesTo) * coupon.percent) / 100
}

/** Descuento en céntimos que aplica un cupón sobre el carrito (servidor). */
export function couponDiscountCents(
  items: CartItem[],
  percent: number,
  scope: CouponScope,
  onlySlugs?: string[] | null,
): number {
  return Math.round((eligibleSubtotalCents(items, scope, onlySlugs) * percent) / 100)
}
