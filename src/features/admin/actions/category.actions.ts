"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorySchema } from "../schemas";
import type { Tables } from "@/types/database.types";

export async function upsertCategoryAction(
  restaurantId: string,
  formData: unknown,
  categoryId?: string,
): Promise<{
  success: boolean;
  error?: string;
  data?: Tables<"categories">;
}> {
  const parsed = categorySchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "اطلاعات وارد شده معتبر نیست." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "دسترسی غیرمجاز." };

  const payload = {
    restaurant_id: restaurantId,
    name: parsed.data.name,
    icon: parsed.data.icon || null,
    display_order: parsed.data.display_order,
    is_active: parsed.data.is_active,
  };

  if (categoryId) {
    // ── UPDATE ──
    const { data, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", categoryId)
      .eq("restaurant_id", restaurantId)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          error: "این نام دسته‌بندی قبلاً ثبت شده است.",
        };
      }
      return { success: false, error: "خطا در ویرایش دسته‌بندی." };
    }

    revalidatePath("/admin/dashboard");
    return { success: true, data };
  } else {
    // ── INSERT ──
    const { data, error } = await supabase
      .from("categories")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          success: false,
          error: "این نام دسته‌بندی قبلاً ثبت شده است.",
        };
      }
      return { success: false, error: "خطا در ایجاد دسته‌بندی." };
    }

    revalidatePath("/admin/dashboard");
    return { success: true, data };
  }
}

export async function deleteCategoryAction(
  categoryId: string,
  restaurantId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "دسترسی غیرمجاز." };

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId)
    .eq("restaurant_id", restaurantId);

  if (error) return { success: false, error: "خطا در حذف دسته‌بندی." };

  revalidatePath("/admin/dashboard");
  return { success: true };
}
