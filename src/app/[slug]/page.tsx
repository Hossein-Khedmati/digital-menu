import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconMapPin,
  IconPhone,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconToolsKitchen2,
  IconArrowLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/server";
import { RestaurantLocation } from "@/features/restaurant/components/restaurant-location";
import { WorkingHoursAccordion } from "@/features/restaurant/components/working-hours-accordion";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

type DaySchedule = {
  open: boolean;
  from: string;
  to: string;
};

function getTodayKey(): string {
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Tehran",
    }),
  );

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return days[now.getDay()];
}

function parseWorkingHours(raw: unknown): Record<string, DaySchedule> {
  if (!raw) return {};

  let parsed: unknown = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  return parsed as Record<string, DaySchedule>;
}

function parseSocial(raw: unknown): Record<string, string> {
  if (!raw) return {};

  let parsed: unknown = raw;

  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {};
    }
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  return parsed as Record<string, string>;
}

function isOpenNow(hours: Record<string, DaySchedule>): boolean {
  const todayKey = getTodayKey();
  const today = hours[todayKey];

  if (!today?.open || !today.from || !today.to) {
    return false;
  }

  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Tehran",
    }),
  );

  const [fromHour, fromMinute] = today.from.split(":").map(Number);
  const [toHour, toMinute] = today.to.split(":").map(Number);

  if (
    [fromHour, fromMinute, toHour, toMinute].some((value) =>
      Number.isNaN(value),
    )
  ) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const fromMinutes = fromHour * 60 + fromMinute;
  const toMinutes = toHour * 60 + toMinute;

  if (toMinutes >= fromMinutes) {
    return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
  }

  return currentMinutes >= fromMinutes || currentMinutes <= toMinutes;
}

function getWhatsappUrl(phone: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("restaurants")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) {
    return {
      title: "رستوران یافت نشد",
    };
  }

  return {
    title: data.name,
    description: data.description ?? undefined,
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!restaurant) {
    notFound();
  }

  const social = parseSocial(restaurant.social_links);
  const hours = parseWorkingHours(restaurant.working_hours);

  const todayKey = getTodayKey();
  const openNow = isOpenNow(hours);

  const hasHours = Object.values(hours).some((day) => day?.open);
  const hasSocial = Object.values(social).some(Boolean);

  const hasLocation =
    restaurant.latitude !== null &&
    restaurant.latitude !== undefined &&
    restaurant.longitude !== null &&
    restaurant.longitude !== undefined;

  const hasContactInfo =
    Boolean(restaurant.address) || Boolean(restaurant.phone) || hasLocation;

  return (
    <main dir="rtl" className="relative isolate min-h-screen overflow-x-clip">
      {/* =========================================================
          FIXED / STABLE BACKGROUND BANNER
          This layer never scrolls.
      ========================================================== */}
      <section
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {restaurant.banner_url ? (
          <Image
            src={restaurant.banner_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-brand via-brand to-brand/60" />
        )}

        {/* Dark overlay for readable white hero text */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Top and bottom visual gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/5 to-black/80" />
      </section>

      <div className="relative z-50">
        {/* =========================================================
            HERO / LOGO SECTION
            Uses one full viewport height.
        ========================================================== */}
        <section className="relative flex min-h-svh flex-col items-center justify-center px-5 pb-28 pt-[18svh] text-white">
          <div className="flex w-full max-w-md flex-col items-center text-center">
            {/* Logo */}
            <div
              className={cn(
                "relative grid h-28 w-28 place-items-center overflow-hidden",
                "rounded-4xl border border-white/35",
                "bg-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
                "ring-4 ring-white/15 backdrop-blur-md",
                "sm:h-32 sm:w-32",
              )}
            >
              {restaurant.logo_url ? (
                <Image
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <IconToolsKitchen2
                  size={50}
                  stroke={1.5}
                  className="text-white/85"
                />
              )}
            </div>
            <div
              className={cn(
                "relative grid  place-items-center overflow-hidden mt-6 px-3 py-1",
                "rounded-4xl border border-white/35",
                "bg-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.45)]",
                "ring-4 ring-white/15 backdrop-blur-md",
              )}
            >
              {/* Restaurant name */}
              <h1 className="mt-6 max-w-md text-balance text-4xl font-black tracking-tight text-white drop-shadow-lg sm:text-5xl">
                {restaurant.name}
              </h1>

              {/* Description */}
              {restaurant.description && (
                <p className="mt-4 max-w-sm text-pretty text-sm leading-7 text-white/80 drop-shadow-sm sm:text-base">
                  {restaurant.description}
                </p>
              )}
            </div>

            {/* Open / closed state */}
            <div
              className={cn(
                "mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2",
                "text-xs font-bold shadow-lg backdrop-blur-md",
                openNow
                  ? "border-emerald-300/30 bg-emerald-500/20 text-emerald-100"
                  : "border-rose-300/30 bg-rose-500/20 text-rose-100",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  openNow
                    ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]"
                    : "bg-rose-300 shadow-[0_0_12px_rgba(253,164,175,0.9)]",
                )}
              />
              <span>{openNow ? "اکنون باز هستیم" : "اکنون بسته‌ایم"}</span>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-[10px] font-medium tracking-[0.22em] text-white/55">
              اطلاعات بیشتر
            </span>

            <div className="flex h-10 w-6 justify-center rounded-full border border-white/30 pt-2">
              <span className="h-2.5 w-1 rounded-full bg-white/70 animate-bounce" />
            </div>
          </div>
        </section>

        {/* =========================================================
            CONTENT SHEET
            This scrolls over the stable background image.
        ========================================================== */}
        <section
          className={cn(
            "relative -mt-10 min-h-screen rounded-t-[2.25rem]",
            "border-t border-white/50 bg-ui-bg-muted/20",
            "px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5",
            "shadow-[0_-16px_45px_rgba(0,0,0,0.12)]",
            "dark:border-white/5 backdrop-blur-md",
          )}
        >
          <div className="mx-auto w-full max-w-xl">
            {/* Sheet drag handle */}
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-ui-border/80" />

            {/* Heading */}
            <div className="mb-5 flex items-center justify-center px-1 py-2 bg-brand-dark rounded-2xl">
              <div>
                <p className="text-sm font-medium text-brand-light text-center">
                  خوش آمدید
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-brand-light text-center">
                  اطلاعات {restaurant.name}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {/* Contact card */}
              {hasContactInfo && (
                <div
                  className={cn(
                    "rounded-[1.6rem] border border-ui-border/70 p-4",
                    "bg-white/90 shadow-sm backdrop-blur-xl",
                    "dark:bg-neutral-900/85 ",
                  )}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-brand" />
                    <h3 className="text-sm font-bold text-ui-text">
                      تماس و موقعیت
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* Address */}
                    {restaurant.address && (
                      <div className="rounded-2xl bg-ui-bg-muted/70 p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                            <IconMapPin
                              size={18}
                              stroke={2}
                              className="text-brand"
                            />
                          </div>

                          <div className="min-w-0 flex-1 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-ui-text-muted">
                                آدرس
                              </p>

                              <p className="mt-1 text-sm leading-6 text-ui-text">
                                {restaurant.address}
                              </p>
                            </div>

                            {hasLocation && (
                              <div>
                                <RestaurantLocation
                                  lat={Number(restaurant.latitude)}
                                  lng={Number(restaurant.longitude)}
                                  name={restaurant.name}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location without address */}
                    {!restaurant.address && hasLocation && (
                      <div className="rounded-2xl bg-ui-bg-muted/70 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                            <IconMapPin
                              size={18}
                              stroke={2}
                              className="text-brand"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="mb-2 text-xs font-semibold text-ui-text-muted">
                              موقعیت رستوران
                            </p>

                            <RestaurantLocation
                              lat={Number(restaurant.latitude)}
                              lng={Number(restaurant.longitude)}
                              name={restaurant.name}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    {restaurant.phone && (
                      <a
                        href={`tel:${restaurant.phone}`}
                        className={cn(
                          "group flex items-center gap-3 rounded-2xl p-3",
                          "bg-ui-bg-muted/70 transition-colors",
                          "hover:bg-brand/10",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center",
                            "rounded-xl bg-brand/10 text-brand",
                            "transition-colors group-hover:bg-brand group-hover:text-white",
                          )}
                        >
                          <IconPhone size={18} stroke={2} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-ui-text-muted">
                            شماره تماس
                          </p>

                          <p
                            dir="ltr"
                            className="mt-1 text-sm font-medium text-ui-text"
                          >
                            {restaurant.phone}
                          </p>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Social media card */}
              {hasSocial && (
                <div
                  className={cn(
                    "rounded-[1.6rem] border border-ui-border/70 p-4",
                    "bg-white/90 shadow-sm backdrop-blur-xl",
                    "dark:bg-neutral-900/85",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-ui-text">
                        ما را دنبال کنید
                      </h3>
                      <p className="mt-1 text-xs text-ui-text-muted">
                        در شبکه‌های اجتماعی همراه ما باشید
                      </p>
                    </div>

                    <div className="flex items-center gap-2" dir="ltr">
                      {social.instagram && (
                        <SocialBtn
                          href={social.instagram}
                          label="اینستاگرام"
                          className={cn(
                            "bg-pink-50 text-pink-500 hover:bg-pink-100",
                            "dark:bg-pink-500/10 dark:hover:bg-pink-500/20",
                          )}
                          icon={<IconBrandInstagram size={19} stroke={2} />}
                        />
                      )}

                      {social.telegram && (
                        <SocialBtn
                          href={social.telegram}
                          label="تلگرام"
                          className={cn(
                            "bg-blue-50 text-blue-500 hover:bg-blue-100",
                            "dark:bg-blue-500/10 dark:hover:bg-blue-500/20",
                          )}
                          icon={<IconBrandTelegram size={19} stroke={2} />}
                        />
                      )}

                      {social.whatsapp && (
                        <SocialBtn
                          href={getWhatsappUrl(social.whatsapp)}
                          label="واتساپ"
                          className={cn(
                            "bg-emerald-50 text-emerald-500 hover:bg-emerald-100",
                            "dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20",
                          )}
                          icon={<IconBrandWhatsapp size={19} stroke={2} />}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Working hours card */}
              {hasHours && (
                <WorkingHoursAccordion
                  hours={hours}
                  todayKey={todayKey}
                  openNow={openNow}
                />
              )}

              {/* Menu CTA */}
              <div className="pt-1">
                {restaurant.is_active ? (
                  <Link
                    href={`/${slug}/menu`}
                    className={cn(
                      "group flex h-16 w-full items-center justify-between",
                      "rounded-2xl px-5 text-white",
                      "bg-brand shadow-lg shadow-brand/30",
                      "transition-all duration-200",
                      "hover:brightness-110 active:scale-[0.98]",
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 transition-transform duration-200 group-hover:scale-105">
                      <IconToolsKitchen2 size={21} stroke={2} />
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-base font-bold">
                        مشاهده منوی رستوران
                      </span>
                      <span className="mt-0.5 text-[11px] text-white/70">
                        سفارش و مشاهده غذاها
                      </span>
                    </div>

                    <IconArrowLeft
                      size={21}
                      stroke={2}
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                  </Link>
                ) : (
                  <div
                    className={cn(
                      "flex h-16 w-full items-center justify-between",
                      "rounded-2xl border border-ui-border bg-ui-bg-muted px-5",
                      "text-ui-text-muted",
                    )}
                  >
                    <IconToolsKitchen2 size={21} stroke={2} />
                    <span className="text-sm font-medium">
                      منو در حال حاضر در دسترس نیست
                    </span>
                    <IconChevronRight size={21} stroke={2} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SocialBtn({
  href,
  icon,
  label,
  className,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl",
        "transition-all duration-200 hover:-translate-y-0.5",
        className,
      )}
    >
      {icon}
    </a>
  );
}
