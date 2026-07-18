import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ── Types ──
export type CartItem = {
  id:               string
  name:             string
  base_price:       number
  discounted_price: number | null
  image_url:        string | null
  quantity:         number
}

type CartStore = {
  items:       CartItem[]
  restaurantSlug: string | null

  // actions
  addItem:       (item: Omit<CartItem, 'quantity'>) => void
  removeItem:    (id: string) => void
  increaseQty:   (id: string) => void
  decreaseQty:   (id: string) => void
  clearCart:     () => void
  setSlug:       (slug: string) => void

  // computed (selectors)
  totalItems:    () => number
  totalPrice:    () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items:          [],
      restaurantSlug: null,

      // ── اضافه کردن آیتم ──
      addItem: (newItem) => {
        const { items, restaurantSlug } = get()

        // اگر رستوران عوض شد، سبد را خالی کن
        if (restaurantSlug && restaurantSlug !== newItem.id.split('_')[0]) {
          // نگه داشتن slug جداگانه هست - فقط چک می‌کنیم
        }

        const exists = items.find((i) => i.id === newItem.id)

        if (exists) {
          set({
            items: items.map((i) =>
              i.id === newItem.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] })
        }
      },

      // ── حذف کامل آیتم ──
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      // ── افزایش تعداد ──
      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      // ── کاهش تعداد (حذف اگر به صفر رسید) ──
      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      // ── خالی کردن سبد ──
      clearCart: () => set({ items: [] }),

      // ── ست کردن slug رستوران ──
      setSlug: (slug) => set({ restaurantSlug: slug }),

      // ── محاسبه تعداد کل ──
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      // ── محاسبه قیمت کل ──
      totalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.discounted_price ?? i.base_price
          return sum + price * i.quantity
        }, 0),
    }),
    {
      name:    'digital-menu-cart',
      storage: createJSONStorage(() => localStorage),
      // فقط items و slug را persist کن
      partialize: (state) => ({
        items:          state.items,
        restaurantSlug: state.restaurantSlug,
      }),
    }
  )
)