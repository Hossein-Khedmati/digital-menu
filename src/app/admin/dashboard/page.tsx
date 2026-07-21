import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/shared/logout-button";
import { ProfileForm } from "@/features/admin/components/profile-form/profile-form";
import { QRCodeCanvas } from "@/components/shared/qr-code";
import { SortableCategoryList } from "@/features/admin/components/sortable-category-list/sortable-category-list";
import { SortableMenuItemList } from "@/features/admin/components/sortable-menu-item-list/sortable-menu-item-list";
import {
  IconToolsKitchen3,
  IconBuildingStore,
  IconLayoutGrid,
  IconExternalLink,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { cn, toPersianNumber } from "@/lib/utils";
import Link from "next/link";
import { ThemeSwitcher, ThemeToggle } from "@/components/shared/theme-switcher";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DashboardTabs } from "../../../features/admin/components/dashboard-tabs/dashboard-tabs";

type Tab = "profile" | "categories" | "items" | "qrcode";
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

  const qrCodeValue = `${process.env.NEXT_PUBLIC_BASE_URL}/${restaurant.slug}`;

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
                  "flex size-9 items-center justify-center overflow-hidden",
                  "rounded-xl bg-brand",
                )}
              >
                {restaurant.logo_url ? (
                  <Image
                    src={restaurant.logo_url}
                    alt={restaurant.name}
                    width={1000}
                    height={1000}
                    className="h-full w-full"
                  />
                ) : (
                  <IconToolsKitchen2
                    size={50}
                    stroke={1.5}
                    className="text-white/85"
                  />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-ui-text">
                  {restaurant.name}
                </p>
                <p className="text-xs text-ui-text-muted">/{restaurant.slug}</p>
              </div>
            </div>
            <ThemeSwitcher className="max-md:hidden" />
            {/* ── Actions ── */}
            <div className="flex items-center gap-3">
              <ThemeToggle className="md:hidden" />
              <Button
                variant="default"
                size="sm"
                className="max-md:p-0 max-md:size-10"
              >
                <Link
                  href={`/${restaurant.slug}`}
                  target="_blank"
                  className={cn(
                    "flex items-center gap-1.5",
                    "text-xs",
                    "transition-colors",
                  )}
                >
                  <span className="hidden md:inline">مشاهده منو</span>
                  <IconExternalLink
                    size={12}
                    stroke={2}
                    className="max-md:size-5"
                  />
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {/* ── Tabs ── */}
        <DashboardTabs currentTab={tab}>
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
                  <h2 className="text-lg font-bold text-ui-text">
                    دسته‌بندی‌ها
                  </h2>
                  <p className="text-sm text-ui-text-muted mt-0.5">
                    برای تغییر ترتیب، ردیف‌ها را drag کنید
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs text-brand",
                    "rounded-lg px-2.5 py-1",
                    "border border-brand",
                  )}
                >
                  {toPersianNumber(categories?.length)} دسته
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
                  <h2 className="text-lg font-bold text-ui-text">
                    آیتم‌های منو
                  </h2>
                  <p className="text-sm text-ui-text-muted mt-0.5">
                    برای تغییر ترتیب، ردیف‌ها را drag کنید
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs text-brand",
                    "rounded-lg px-2.5 py-1",
                    "border border-brand",
                  )}
                >
                  {toPersianNumber(menuItems?.length)} آیتم
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
          {tab === "qrcode" && qrCodeValue && (
            <div className="flex items-center justify-center rounded-2xl border border-ui-border bg-ui-surface p-6 shadow-sm">
              <QRCodeCanvas
                value={qrCodeValue}
              />
            </div>
          )}
        </DashboardTabs>
      </div>
    </div>
  );
}
