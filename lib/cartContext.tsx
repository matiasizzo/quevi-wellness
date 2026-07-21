'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type CartItem = {
  id: string
  slug: string
  name: string
  price: number
  vol: string
  image_url: string | null
  stripe: string
  quantity: number
  /** Nº de sesiones que incluye (bonos). Por defecto 1. Usado en vales regalo. */
  sessions?: number
}

export type Coupon = {
  code: string
  percent: number
  /** Ámbito del cupón: toda la web ('all') o solo productos ('products'). */
  scope?: 'all' | 'products'
}

type CartContextType = {
  items: CartItem[]
  count: number
  total: number
  coupon: Coupon | null
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setCoupon: (coupon: Coupon | null) => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'quevi-cart'

const COUPON_KEY = 'quevi-coupon'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCouponState] = useState<Coupon | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
      const storedCoupon = localStorage.getItem(COUPON_KEY)
      if (storedCoupon) setCouponState(JSON.parse(storedCoupon))
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // ignore
    }
  }, [items, hydrated])

  useEffect(() => {
    if (!hydrated) return
    try {
      if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon))
      else localStorage.removeItem(COUPON_KEY)
    } catch {
      // ignore
    }
  }, [coupon, hydrated])

  const setCoupon = useCallback((c: Coupon | null) => setCouponState(c), [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.id !== id))
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
    }
  }, [])

  const clearCart = useCallback(() => { setItems([]); setCouponState(null) }, [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, total, coupon, isOpen, openCart, closeCart, addItem, removeItem, updateQty, clearCart, setCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
