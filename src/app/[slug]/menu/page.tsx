import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryBar } from "@/features/menu/components/category-bar/category-bar";
import { SearchAndSort } from "@/features/menu/components/search-and-sort/search-and-sort";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { ThemeToggle } from "@/components/shared/theme-switcher";
import { IconHome } from "@tabler/icons-react";
import Image from "next/image";
import { Suspense } from "react";

import { MenuGrid } from "@/features/menu/components/menu-grid/menu-grid";
import { MenuGridSkeleton } from "@/features/menu/components/menu-grid/menu-grid-skeleton";
import { toPersianNumber } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    q?: string;
    sort?: string;
    cat?: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("restaurants")
    .select("name")
    .eq("slug", slug)
    .single();

  return { title: data ? `منوی ${data.name}` : "منو" };
}

export default async function MenuPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q, sort, cat } = await searchParams;

  const supabase = await createClient();

  // ── دریافت رستوران ──
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name, slug, logo_url")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!restaurant) notFound();

  // ── دریافت دسته‌بندی‌ها ──
  const { data: categoriesData = [] } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = categoriesData ?? [];

  const currentParams: Record<string, string | undefined> = { q, sort, cat };

  return (
    <div className=" bg-ui-bg">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 border-b border-ui-border backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-3 py-3 justify-between">
            {/* دکمه برگشت */}
            <Link
              href={`/${slug}`}
              aria-label="صفحه اصلی"
              className="flex justify-center items-center text-sm gap-2 bg-brand hover:bg-brand-dark transition duration-200 size-10 rounded-xl"
            >
              <IconHome size={20} color="white" />
            </Link>

            {/* نام یا لوگو رستوران */}
            <div className="flex items-center gap-2 bg-brand p-1.5 rounded-xl">
              {restaurant.logo_url && (
                <div className="size-8 overflow-hidden rounded-lg">
                  <Image
                    src={restaurant.logo_url}
                    width={1000}
                    height={1000}
                    alt="logo"
                    className="size-8"
                  />
                </div>
              )}
              <p className="text-sm font-bold text-white truncate">
                {restaurant.name}
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="min-h-[calc(100vh-187px)] mx-auto max-w-7xl px-4 py-5 space-y-5">
        <SearchAndSort />

        <CategoryBar
          categories={categories}
          activeCategory={cat ?? null}
          slug={slug}
          searchParams={currentParams}
        />

        {q && (
          <p className="text-sm text-gray-500">
            نتایج جستجو برای «{toPersianNumber(q)}»
          </p>
        )}

        <Suspense key={`${q}-${sort}-${cat}`} fallback={<MenuGridSkeleton />}>
          <MenuGrid
            restaurantId={restaurant.id}
            slug={slug}
            q={q}
            sort={sort}
            cat={cat}
          />
        </Suspense>
      </div>

      <CartDrawer />
      <footer className="border-t border-ui-border mt-8 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center gap-1">
            <p className="text-center text-xs text-ui-text-muted">
              تمامی حقوق مادی و معنوی این سایت متعلق به{" "}
              <span className="font-semibold text-ui-text">
                {restaurant.name}
              </span>{" "}
              می‌باشد.
            </p>

            <p className="text-center text-[11px] text-ui-text-muted/70">
              توسعه داده شده توسط{" "}
              <Link
                href="https://menuvita.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:text-brand-dark transition-colors duration-200 hover:underline"
              >
                منوویتا
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
