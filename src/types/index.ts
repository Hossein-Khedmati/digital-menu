export interface Restaurant {
  id: string
  owner_id: string
  name: string
  slug: string
  logo_url: string | null
  background_image_url: string | null
  description: string | null
  address: string | null
  phone: string | null
  social_media: Record<string, string> | null
  theme: Record<string, string> | null
  is_open: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  restaurant_id: string
  name: string
  icon_url: string | null
  sort_order: number
  is_visible: boolean
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  sort_order: number
  category?: Category
}

export interface CartItem extends MenuItem {
  quantity: number
}

export type SortOption = 'default' | 'price_asc' | 'price_desc'
