'use server'

import { revalidatePath } from 'next/cache'
import { createClient }   from '@/lib/supabase/server'
import { menuItemSchema } from '../schemas'
import type { Tables  }  from '@/types/database.types'

export async function upsertMenuItemAction(
  restaurantId: string,
  formData:     unknown,
  imageUrl:     string | null,
  menuItemId?:  string
): Promise<{
  success: boolean
  error?:  string
  data?:   Tables<"menu_items">
}> {
  const parsed = menuItemSchema.safeParse(formData)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return { success: false, error: firstError.message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'دسترسی غیرمجاز.' }

  const payload = {
    restaurant_id:    restaurantId,
    category_id:      parsed.data.category_id,
    name:             parsed.data.name,
    description:      parsed.data.description   || null,
    base_price:       parsed.data.base_price,
    discounted_price: parsed.data.discounted_price ?? null,
    display_order:    parsed.data.display_order,
    is_active:        parsed.data.is_active,
    is_available:     parsed.data.is_available,
    ...(imageUrl !== undefined && { image_url: imageUrl }),
  }

  if (menuItemId) {
    const { data, error } = await supabase
      .from('menu_items')
      .update(payload)
      .eq('id', menuItemId)
      .eq('restaurant_id', restaurantId)
      .select()
      .single()

    if (error) return { success: false, error: 'خطا در ویرایش آیتم.' }

    revalidatePath('/admin/dashboard')
    return { success: true, data }

  } else {
    const { data, error } = await supabase
      .from('menu_items')
      .insert(payload)
      .select()
      .single()

    if (error) return { success: false, error: 'خطا در ایجاد آیتم.' }

    revalidatePath('/admin/dashboard')
    return { success: true, data }
  }
}

export async function deleteMenuItemAction(
  menuItemId:   string,
  restaurantId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'دسترسی غیرمجاز.' }

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', menuItemId)
    .eq('restaurant_id', restaurantId)

  if (error) return { success: false, error: 'خطا در حذف آیتم.' }

  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function uploadMenuItemImage(
  file:        File,
  userId:      string,
  oldImageUrl?: string | null
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient()

  if (oldImageUrl) {
    const oldPath = oldImageUrl.split('/menu-item-images/')[1]
    if (oldPath) {
      await supabase.storage.from('menu-item-images').remove([oldPath])
    }
  }

  const ext      = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('menu-item-images')
    .upload(fileName, file, { upsert: true })

  if (uploadError) return { url: null, error: 'خطا در آپلود تصویر.' }

  const { data } = supabase.storage
    .from('menu-item-images')
    .getPublicUrl(fileName)

  return { url: data.publicUrl, error: null }
}