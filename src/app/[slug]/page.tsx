import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Circle,
  Send,
  MessageCircle,
  ArrowLeft,
  UtensilsCrossed,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  WorkingHoursBadge,
  WorkingHoursTable,
} from "@/features/restaurant/components/working-hours-badge";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ slug: string }>;
};

// ── Dynamic Metadata ──
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("restaurants")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) return { title: "رستوران یافت نشد" };

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

  if (!restaurant) notFound();

  const social = (restaurant.social_links as Record<string, string>) ?? {};
  const hours = (restaurant.working_hours as Record<string, unknown>) ?? {};

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero / Banner ── */}
      <div
        className="relative h-56 sm:h-72 w-full bg-gradient-to-br
                      from-brand-600 to-purple-700 overflow-hidden"
      >
        {restaurant.banner_url && (
          <Image
            src={restaurant.banner_url}
            alt={restaurant.name}
            fill
            priority
            className="object-cover opacity-60"
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-linear-to-t
                        from-black/60 via-black/20 to-transparent"
        />
      </div>

      {/* ── محتوای اصلی ── */}
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* ── کارت اطلاعات رستوران ── */}
        <div
          className="relative -mt-20 rounded-3xl border border-gray-100
                        bg-white shadow-xl shadow-gray-100 p-6 mb-6"
        >
          {/* لوگو + اطلاعات */}
          <div className="flex items-start gap-4">
            {/* لوگو */}
            <div
              className="relative h-20 w-20 rounded-2xl border-4
                            border-white shadow-lg overflow-hidden
                            bg-brand-50 shrink-0"
            >
              {restaurant.logo_url ? (
                <Image
                  src={restaurant.logo_url}
                  alt={`لوگوی ${restaurant.name}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <UtensilsCrossed className="h-8 w-8 text-brand-400" />
                </div>
              )}
            </div>

            {/* نام و وضعیت */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {restaurant.name}
                </h1>
                <WorkingHoursBadge workingHours={hours} />
              </div>
              {restaurant.description && (
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {restaurant.description}
                </p>
              )}
            </div>
          </div>

          {/* خط جداکننده */}
          <div className="my-5 border-t border-gray-100" />

          {/* اطلاعات تماس */}
          <div className="space-y-3">
            {restaurant.address && (
              <ContactRow
                icon={<MapPin className="h-4 w-4 text-brand-500" />}
                text={restaurant.address}
              />
            )}
            {restaurant.phone && (
              <a
                href={`tel:${restaurant.phone}`}
                className="flex items-center gap-3 group"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center
                                rounded-xl bg-brand-50 group-hover:bg-brand-100
                                transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-500" />
                </div>
                <span
                  className="text-sm text-gray-600 group-hover:text-brand-600
                                 transition-colors"
                  dir="ltr"
                >
                  {restaurant.phone}
                </span>
              </a>
            )}
          </div>

          {/* شبکه‌های اجتماعی */}
          {Object.keys(social).some((k) => social[k]) && (
            <>
              <div className="my-5 border-t border-gray-100" />
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 ml-1">
                  ما را دنبال کنید:
                </span>
                {social.instagram && (
                  <SocialLink
                    href={social.instagram}
                    icon={<Circle className="h-4 w-4" />}
                    label="اینستاگرام"
                    color="bg-pink-50 text-pink-500 hover:bg-pink-100"
                  />
                )}
                {social.telegram && (
                  <SocialLink
                    href={social.telegram}
                    icon={<Send className="h-4 w-4" />}
                    label="تلگرام"
                    color="bg-blue-50 text-blue-500 hover:bg-blue-100"
                  />
                )}
                {social.whatsapp && (
                  <SocialLink
                    href={`https://wa.me/${social.whatsapp}`}
                    icon={<MessageCircle className="h-4 w-4" />}
                    label="واتساپ"
                    color="bg-green-50 text-green-500 hover:bg-green-100"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* ── ساعات کاری ── */}
        {Object.keys(hours).length > 0 && (
          <div className="mb-6">
            <WorkingHoursTable workingHours={hours} />
          </div>
        )}

        {/* ── CTA دکمه منو ── */}
        <div className="pb-10">
          <Link
            href={`/${slug}/menu`}
            className="flex w-full items-center justify-center gap-3
             h-14 rounded-2xl text-base font-medium
             bg-brand-600 text-white
             hover:bg-brand-700 active:scale-[0.98]
             shadow-lg shadow-brand-200
             transition-all duration-200 bg-amber-400 p-4" 
          >
            <UtensilsCrossed className="h-5 w-5" />
            مشاهده منو
            <ArrowLeft className="h-4 w-4 mr-auto" />
          </Link>
        </div>
      </div>
    </main>
  );
}

// ── Helper Components ──
function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 items-center justify-center
                      rounded-xl bg-brand-50 shrink-0"
      >
        {icon}
      </div>
      <span className="text-sm text-gray-600 leading-relaxed pt-1.5">
        {text}
      </span>
    </div>
  );
}

function SocialLink({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center
                  rounded-xl transition-colors duration-150 ${color}`}
    >
      {icon}
    </a>
  );
}
