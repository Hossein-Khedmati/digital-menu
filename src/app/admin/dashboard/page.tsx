import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { ProfileForm } from "@/features/admin/components/profile-form/profile-form";
import { SortableCategoryList } from "@/features/admin/components/sortable-category-list/sortable-category-list";
import { SortableMenuItemList } from "@/features/admin/components/sortable-menu-item-list/sortable-menu-item-list";
import {
  IconToolsKitchen3,
  IconBuildingStore,
  IconLayoutGrid,
  IconExternalLink,
} from "@tabler/icons-react";
import { cn, toPersianNumber } from "@/lib/utils";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Button } from "@/components/ui/button";

type Tab = "profile" | "categories" | "items";
type PageProps = { searchParams: Promise<{ tab?: Tab }> };

export default async function DashboardPage({ searchParams }: PageProps) {
  const { tab = "profile" } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) redirect("/admin/login");

  const { data: categoriesData = [] } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });
  const categories = categoriesData ?? [];
  const { data: menuItemsData = [] } = await supabase
    .from("menu_items")
    .select("*, categories(name, icon)")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: true });
  const menuItems = menuItemsData ?? [];
  const tabs = [
    { key: "profile", label: "پروفایل", icon: IconBuildingStore },
    { key: "categories", label: "دسته‌بندی‌ها", icon: IconLayoutGrid },
    { key: "items", label: "آیتم‌های منو", icon: IconToolsKitchen3 },
  ] as const;

  return (
    <div className="min-h-screen bg-ui-bg">
      {/* ── Header ── */}
      <header
        className={cn(
          "sticky top-0 z-40",
          "border-b border-ui-border",
          "bg-ui-surface/80 backdrop-blur-md",
        )}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* ── Brand ── */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center",
                  "rounded-xl bg-brand",
                )}
              >
                <IconToolsKitchen3
                  size={18}
                  stroke={2}
                  className="text-white"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-ui-text">
                  {restaurant.name}
                </p>
                <p className="text-xs text-ui-text-muted">/{restaurant.slug}</p>
              </div>
            </div>
            <ThemeSwitcher />
            {/* ── Actions ── */}
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm">
                <Link
                  href={`/${restaurant.slug}`}
                  target="_blank"
                  className={cn(
                    "hidden sm:flex items-center gap-1.5",
                    "text-xs",
                    " transition-colors",
                  )}
                >
                  مشاهده منو
                  <IconExternalLink size={12} stroke={2} />
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* ── Tabs ── */}
        <nav
          className={cn(
            "flex gap-1 mb-8",
            "rounded-2xl p-1",
            "bg-ui-bg-muted",
            "border border-ui-border",
          )}
        >
          {tabs.map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              href={`/admin/dashboard?tab=${key}`}
              className={cn(
                "flex flex-1 items-center justify-center gap-2",
                "rounded-xl px-4 py-2.5",
                "text-sm font-medium",
                "transition-all duration-200",
                tab === key
                  ? "bg-brand text-brand-subtle shadow-sm border border-ui-border"
                  : "text-ui-text-muted hover:text-ui-text transition-colors duration-300",
              )}
            >
              <Icon size={16} stroke={2} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        {/* ── Tab: پروفایل ── */}
        {tab === "profile" && (
          <div
            className={cn(
              "rounded-2xl border border-ui-border",
              "bg-ui-surface p-6 shadow-sm",
            )}
          >
            <h2 className="text-lg font-bold text-ui-text mb-6">
              اطلاعات رستوران
            </h2>
            <ProfileForm restaurant={restaurant} />
          </div>
        )}

        {/* ── Tab: دسته‌بندی‌ها ── */}
        {tab === "categories" && (
          <div
            className={cn(
              "rounded-2xl border border-ui-border",
              "bg-ui-surface p-6 shadow-sm",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-ui-text">دسته‌بندی‌ها</h2>
                <p className="text-sm text-ui-text-muted mt-0.5">
                  برای تغییر ترتیب، ردیف‌ها را drag کنید
                </p>
              </div>
              <span
                className={cn(
                  "text-xs text-brand",
                  " rounded-lg px-2.5 py-1",
                  "border border-brand",
                )}
              >
                {toPersianNumber(categories?.length)}  دسته
              </span>
            </div>

            <SortableCategoryList
              categories={categories}
              restaurantId={restaurant.id}
            />
          </div>
        )}

        {/* ── Tab: آیتم‌های منو ── */}
        {tab === "items" && (
          <div
            className={cn(
              "rounded-2xl border border-ui-border",
              "bg-ui-surface p-6 shadow-sm",
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-ui-text">آیتم‌های منو</h2>
                <p className="text-sm text-ui-text-muted mt-0.5">
                  برای تغییر ترتیب، ردیف‌ها را drag کنید
                </p>
              </div>
              <span
                className={cn(
                  "text-xs text-brand",
                  " rounded-lg px-2.5 py-1",
                  "border border-brand",
                )}
              >
                {toPersianNumber(menuItems?.length)}  دسته
              </span>
            </div>

            <SortableMenuItemList
              items={menuItems as any}
              categories={categories}
              restaurantId={restaurant.id}
              userId={user.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}
