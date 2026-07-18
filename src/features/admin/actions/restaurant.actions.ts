"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { restaurantSchema } from "../schemas";
import type { Tables } from "@/types/database.types";

export async function updateRestaurantAction(
  restaurantId: string,
  formData: unknown,
  logoUrl?: string | null,
  bannerUrl?: string | null,
): Promise<{
  success: boolean;
  error?: string;
  data?: Tables<"restaurants">;
}> {
  const parsed = restaurantSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "دسترسی غیرمجاز." };

  const payload = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    phone: parsed.data.phone || null,
    address: parsed.data.address || null,
    social_links: parsed.data.social_links ?? {},
    is_active: parsed.data.is_active,
    brand_color: parsed.data.brand_color,
    ...(logoUrl !== undefined && { logo_url: logoUrl }),
    ...(bannerUrl !== undefined && { banner_url: bannerUrl }),
  };

  const { data, error } = await supabase
    .from("restaurants")
    .update(payload)
    .eq("id", restaurantId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("[updateRestaurant]", error);
    return { success: false, error: "خطا در ذخیره‌سازی. دوباره تلاش کنید." };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/[slug]", "layout");
  return { success: true, data };
}

export async function uploadRestaurantAsset(
  file: File,
  restaurantId: string,
  type: "logo" | "banner",
  oldUrl?: string | null,
): Promise<{ url: string | null; error: string | null }> {
  const supabase = await createClient();

  if (oldUrl) {
    const oldPath = oldUrl.split("/restaurant-assets/")[1];
    if (oldPath) {
      await supabase.storage.from("restaurant-assets").remove([oldPath]);
    }
  }

  const ext = file.name.split(".").pop();
  const fileName = `${restaurantId}/${type}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("restaurant-assets")
    .upload(fileName, file, { upsert: true });

  if (uploadError) return { url: null, error: "خطا در آپلود تصویر." };

  const { data } = supabase.storage
    .from("restaurant-assets")
    .getPublicUrl(fileName);

  return { url: data.publicUrl, error: null };
}
