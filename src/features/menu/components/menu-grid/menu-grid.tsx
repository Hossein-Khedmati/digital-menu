import Link from "next/link";
import { IconToolsKitchen2Off } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import { MenuItemCard } from "@/features/menu/components/menu-item-card/menu-item-card";
import { Props } from "./types";

export async function MenuGrid({ restaurantId, slug, q, sort, cat }: Props) {
  const supabase = await createClient();

  let query = supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true);

  if (cat) {
    query = query.eq("category_id", cat);
  }

  if (q?.trim()) {
    query = query.ilike("name", `%${q.trim()}%`);
  }

  if (sort === "price_asc") {
    query = query.order("base_price", { ascending: true });
  } else if (sort === "price_desc") {
    query = query.order("base_price", { ascending: false });
  } else {
    query = query.order("display_order", { ascending: true });
  }

  const { data = [] } = await query;

  if (data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <IconToolsKitchen2Off className="h-12 w-12 text-gray-200 mb-4" />

        <p className="font-medium text-gray-400">
          {q ? "آیتمی با این مشخصات یافت نشد" : "آیتمی در این دسته وجود ندارد"}
        </p>

        {q && (
          <Link
            href={`/${slug}/menu`}
            className="mt-3 text-sm text-brand hover:underline"
          >
            پاک کردن جستجو
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-28">
      {data?.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
