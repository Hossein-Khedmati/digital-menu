'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, MenuItem } from '@/types'

interface CartStore {
  items: CartItem[]
  restaurantSlug: string | null
  addItem: (item: MenuItem, restaurantSlug: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantSlug: null,

      addItem: (item: MenuItem, restaurantSlug: string) => {
        const { items, restaurantSlug: currentSlug } = get()

        // If different restaurant, clear cart
        if (currentSlug && currentSlug !== restaurantSlug) {
          set({ items: [], restaurantSlug })
        }

        const existing = items.find((i) => i.id === item.id)
        if (existing) {
          set({
            restaurantSlug,
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({
            restaurantSlug,
            items: [...items, { ...item, quantity: 1 }],
          })
        }
      },

      removeItem: (itemId: string) => {
        set({ items: get().items.filter((i) => i.id !== itemId) })
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [], restaurantSlug: null }),

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    {
      name: 'online-menu-cart',
    }
  )
)
