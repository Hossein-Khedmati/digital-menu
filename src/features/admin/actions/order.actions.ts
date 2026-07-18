'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateCategoriesOrderAction(
  items: { id: string; display_order: number }[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'دسترسی غیرمجاز.' }

  const promises = items.map(({ id, display_order }) =>
    supabase
      .from('categories')
      .update({ display_order })
      .eq('id', id)
  )

  const results = await Promise.all(promises)
  const hasError = results.some((r) => r.error)

  if (hasError) return { success: false, error: 'خطا در ذخیره ترتیب.' }

  revalidatePath('/admin/dashboard')
  return { success: true }
}

export async function updateMenuItemsOrderAction(
  items: { id: string; display_order: number }[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'دسترسی غیرمجاز.' }

  const promises = items.map(({ id, display_order }) =>
    supabase
      .from('menu_items')
      .update({ display_order })
      .eq('id', id)
  )

  const results = await Promise.all(promises)
  const hasError = results.some((r) => r.error)

  if (hasError) return { success: false, error: 'خطا در ذخیره ترتیب.' }

  revalidatePath('/admin/dashboard')
  return { success: true }
}