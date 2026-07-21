import { createClient } from "@/lib/supabase/server";
import {
  IconToolsKitchen2,
  IconArrowLeft,
  IconStar,
  IconLayoutGrid,
  IconPhoto,
  IconPalette,
  IconDeviceMobile,
  IconBolt,
  IconShieldCheck,
  IconChartBar,
  IconQrcode,
  IconLanguage,
  IconCheck,
  IconBuildingStore,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();

  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, slug, logo_url, description")
    .eq("is_active", true)
    .limit(6);

  const features = [
    {
      icon: IconLayoutGrid,
      title: "دسته‌بندی هوشمند",
      description:
        "آیتم‌های منو را در دسته‌بندی‌های مختلف سازماندهی کنید و ترتیب نمایش را با درگ‌اند‌دراپ تغییر دهید.",
    },
    {
      icon: IconPhoto,
      title: "گالری تصاویر",
      description:
        "برای هر آیتم منو تصویر اختصاصی آپلود کنید و تجربه بصری جذابی برای مشتریان بسازید.",
    },
    {
      icon: IconDeviceMobile,
      title: "طراحی موبایل‌فرست",
      description:
        "منوی دیجیتال شما در تمام دستگاه‌ها از موبایل تا دسکتاپ به بهترین شکل نمایش داده می‌شود.",
    },
    {
      icon: IconQrcode,
      title: "QR Code اختصاصی",
      description:
        "یک QR Code منحصربه‌فرد برای رستوران خود دریافت کنید و روی میزها قرار دهید.",
    },
    {
      icon: IconPalette,
      title: "شخصی‌سازی کامل",
      description:
        "لوگو، رنگ و اطلاعات رستوران را کاملاً سفارشی کنید تا با هویت برند شما هماهنگ باشد.",
    },
    {
      icon: IconBolt,
      title: "بارگذاری فوری",
      description:
        "با فناوری‌های مدرن، منوی شما در کمتر از یک ثانیه بارگذاری می‌شود و تجربه کاربری عالی ارائه می‌دهد.",
    },
    {
      icon: IconLanguage,
      title: "پشتیبانی از فارسی",
      description:
        "طراحی کامل راست‌به‌چپ با پشتیبانی کامل از زبان فارسی و اعداد فارسی.",
    },
    {
      icon: IconShieldCheck,
      title: "امنیت بالا",
      description:
        "اطلاعات رستوران شما با بالاترین استانداردهای امنیتی محافظت می‌شود.",
    },
    {
      icon: IconChartBar,
      title: "مدیریت آسان",
      description:
        "پنل مدیریت ساده و کاربرپسند برای به‌روزرسانی سریع منو بدون نیاز به دانش فنی.",
    },
  ];

  const plans = [
    {
      name: "رایگان",
      price: "۰",
      period: "همیشه رایگان",
      description: "برای شروع کافی است",
      features: [
        "تا ۲۰ آیتم منو",
        "۱ دسته‌بندی",
        "QR Code اختصاصی",
        "پشتیبانی ایمیل",
      ],
      cta: "شروع رایگان",
      href: "/admin/login",
      highlighted: false,
    },
    {
      name: "حرفه‌ای",
      price: "۲۹۹,۰۰۰",
      period: "ماهانه",
      description: "برای رستوران‌های فعال",
      features: [
        "آیتم‌های نامحدود",
        "دسته‌بندی نامحدود",
        "آپلود تصویر",
        "شخصی‌سازی کامل",
        "پشتیبانی اولویت‌دار",
        "آمار و گزارش",
      ],
      cta: "شروع کنید",
      href: "/admin/login",
      highlighted: true,
    },
    {
      name: "سازمانی",
      price: "تماس",
      period: "بگیرید",
      description: "برای زنجیره‌های بزرگ",
      features: [
        "چند شعبه",
        "API اختصاصی",
        "پشتیبانی ۲۴/۷",
        "سفارشی‌سازی کامل",
        "مدیر حساب اختصاصی",
        "SLA تضمین‌شده",
      ],
      cta: "تماس با ما",
      href: "/contact",
      highlighted: false,
    },
  ];

  const stats = [
    { value: "۵۰۰+", label: "رستوران فعال" },
    { value: "۱۰۰K+", label: "بازدید ماهانه" },
    { value: "۹۹.۹٪", label: "آپتایم سرور" },
    { value: "۴.۹", label: "امتیاز کاربران" },
  ];

  return (
    <div className="min-h-screen bg-ui-bg" dir="rtl">
      {/* ── Navbar ── */}
      <header
        className={cn(
          "sticky top-0 z-50",
          "border-b border-ui-border",
          "bg-ui-bg/80 backdrop-blur-md",
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-brand">
                <IconToolsKitchen2
                  size={18}
                  stroke={1.5}
                  className="text-white"
                />
              </div>
              <span className="text-base font-bold text-ui-text">منوویتا</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm text-ui-text-muted hover:text-ui-text transition-colors"
              >
                امکانات
              </a>
              <a
                href="#restaurants"
                className="text-sm text-ui-text-muted hover:text-ui-text transition-colors"
              >
                رستوران‌ها
              </a>
              <a
                href="#pricing"
                className="text-sm text-ui-text-muted hover:text-ui-text transition-colors"
              >
                تعرفه‌ها
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/login"
                className="text-sm text-ui-text-muted hover:text-ui-text transition-colors"
              >
                ورود
              </Link>
              <Link
                href="/admin/login"
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-xl",
                  "bg-brand text-white text-sm font-medium",
                  "hover:brightness-110 transition-all duration-150",
                )}
              >
                شروع کنید
                <IconArrowLeft size={14} stroke={2} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand/6 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand/4 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-24 text-center">
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 mb-8",
              "px-4 py-1.5 rounded-full",
              "border border-brand/30 bg-brand/8",
              "text-xs font-medium text-brand",
            )}
          >
            <IconStar size={12} fill="currentColor" />
            جدیدترین راه‌حل منوی دیجیتال برای رستوران‌های ایرانی
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-ui-text leading-tight mb-6">
            منوی دیجیتال
            <br />
            <span className="text-brand">رستوران شما</span>
            <br />
            در چند دقیقه
          </h1>

          <p className="text-base sm:text-lg text-ui-text-muted max-w-xl mx-auto leading-relaxed mb-10">
            با منوویتا، بدون نیاز به دانش فنی یک منوی دیجیتال زیبا و حرفه‌ای برای
            رستوران خود بسازید و با QR Code در اختیار مشتریانتان قرار دهید.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/admin/login"
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-6 py-3 rounded-2xl",
                "bg-brand text-white font-semibold",
                "hover:brightness-110 active:scale-[0.98]",
                "transition-all duration-150 shadow-lg shadow-brand/25",
              )}
            >
              همین الان شروع کنید — رایگان
              <IconArrowLeft size={16} stroke={2} />
            </Link>
            <a
              href="#restaurants"
              className={cn(
                "inline-flex items-center justify-center gap-2",
                "px-6 py-3 rounded-2xl",
                "border border-ui-border bg-ui-surface text-ui-text font-medium",
                "hover:border-brand/40 hover:bg-brand/4",
                "transition-all duration-150",
              )}
            >
              مشاهده نمونه‌ها
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className={cn(
                  "rounded-2xl p-4",
                  "border border-ui-border bg-ui-surface",
                )}
              >
                <p className="text-2xl font-extrabold text-brand">{value}</p>
                <p className="text-xs text-ui-text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 border-t border-ui-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
              امکانات
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ui-text mb-4">
              هر چیزی که نیاز دارید
            </h2>
            <p className="text-ui-text-muted max-w-md mx-auto text-sm leading-relaxed">
              منوویتا با تمام ابزارهایی که برای مدیریت منوی دیجیتال رستوران نیاز
              دارید همراه شماست.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={cn(
                  "group relative rounded-2xl p-6",
                  "border border-ui-border bg-ui-surface",
                  "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5",
                  "transition-all duration-300",
                  // Make first feature card span 2 cols on lg
                  i === 0 && "lg:col-span-2",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-xl mb-4",
                    "bg-brand/10 text-brand",
                    "group-hover:bg-brand group-hover:text-white",
                    "transition-all duration-300",
                  )}
                >
                  <Icon size={20} stroke={1.5} />
                </div>
                <h3 className="text-sm font-bold text-ui-text mb-2">{title}</h3>
                <p className="text-sm text-ui-text-muted leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Restaurants ── */}
      {restaurants && restaurants.length > 0 && (
        <section
          id="restaurants"
          className="py-24 border-t border-ui-border bg-ui-bg-muted"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
                نمونه‌ها
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-ui-text mb-4">
                رستوران‌های فعال
              </h2>
              <p className="text-ui-text-muted max-w-md mx-auto text-sm leading-relaxed">
                این رستوران‌ها از منوویتا برای ارائه منوی دیجیتال به مشتریان خود
                استفاده می‌کنند.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((r) => (
                <Link
                  key={r.id}
                  href={`/${r.slug}`}
                  className={cn(
                    "group flex items-center gap-4 p-5",
                    "rounded-2xl border border-ui-border bg-ui-surface",
                    "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5",
                    "transition-all duration-300",
                  )}
                >
                  {/* Logo */}
                  <div
                    className={cn(
                      "shrink-0 flex size-14 items-center justify-center rounded-2xl overflow-hidden",
                      "bg-brand/10",
                      "group-hover:bg-brand/15 transition-colors duration-300",
                    )}
                  >
                    {r.logo_url ? (
                      <Image
                        src={r.logo_url}
                        alt={r.name}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <IconBuildingStore
                        size={24}
                        stroke={1.5}
                        className="text-brand"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ui-text text-sm truncate">
                      {r.name}
                    </p>
                    {r.description && (
                      <p className="text-xs text-ui-text-muted mt-0.5 line-clamp-2 leading-relaxed">
                        {r.description}
                      </p>
                    )}
                    <p className="text-xs text-brand mt-1.5 font-medium">
                      مشاهده منو ←
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 border-t border-ui-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
              تعرفه‌ها
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ui-text mb-4">
              شفاف و مقرون‌به‌صرفه
            </h2>
            <p className="text-ui-text-muted max-w-md mx-auto text-sm leading-relaxed">
              بدون هزینه پنهان. هر زمان که خواستید ارتقا دهید یا لغو کنید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-2xl p-6",
                  "border transition-all duration-300",
                  plan.highlighted
                    ? "border-brand bg-brand shadow-xl shadow-brand/20 scale-[1.02]"
                    : "border-ui-border bg-ui-surface hover:border-brand/30",
                )}
              >
                {plan.highlighted && (
                  <div
                    className={cn(
                      "absolute -top-3 right-1/2 translate-x-1/2",
                      "px-3 py-1 rounded-full",
                      "bg-white text-brand text-xs font-bold",
                      "shadow-md",
                    )}
                  >
                    محبوب‌ترین
                  </div>
                )}

                <div className="mb-6">
                  <p
                    className={cn(
                      "text-sm font-bold mb-1",
                      plan.highlighted ? "text-white/80" : "text-ui-text-muted",
                    )}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={cn(
                        "text-3xl font-extrabold",
                        plan.highlighted ? "text-white" : "text-ui-text",
                      )}
                    >
                      {plan.price}
                    </span>
                    {plan.price !== "تماس" && (
                      <span
                        className={cn(
                          "text-xs",
                          plan.highlighted
                            ? "text-white/60"
                            : "text-ui-text-muted",
                        )}
                      >
                        تومان
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      plan.highlighted ? "text-white/60" : "text-ui-text-muted",
                    )}
                  >
                    {plan.period}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full",
                          plan.highlighted ? "bg-white/20" : "bg-brand/10",
                        )}
                      >
                        <IconCheck
                          size={10}
                          stroke={3}
                          className={
                            plan.highlighted ? "text-white" : "text-brand"
                          }
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs",
                          plan.highlighted ? "text-white/80" : "text-ui-text",
                        )}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "flex items-center justify-center gap-2",
                    "py-2.5 rounded-xl text-sm font-semibold",
                    "transition-all duration-150 active:scale-[0.98]",
                    plan.highlighted
                      ? "bg-white text-brand hover:bg-white/90"
                      : "bg-brand text-white hover:brightness-110",
                  )}
                >
                  {plan.cta}
                  <IconArrowLeft size={14} stroke={2} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 border-t border-ui-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={cn(
              "relative overflow-hidden",
              "rounded-3xl p-10 text-center",
              "bg-brand",
            )}
          >
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                آماده‌اید شروع کنید؟
              </h2>
              <p className="text-white/70 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                همین الان یک حساب رایگان بسازید و ظرف چند دقیقه منوی دیجیتال
                رستوران خود را راه‌اندازی کنید.
              </p>
              <Link
                href="/admin/login"
                className={cn(
                  "inline-flex items-center gap-2",
                  "px-6 py-3 rounded-2xl",
                  "bg-white text-brand font-semibold text-sm",
                  "hover:bg-white/90 active:scale-[0.98]",
                  "transition-all duration-150 shadow-lg",
                )}
              >
                شروع رایگان
                <IconArrowLeft size={16} stroke={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-ui-border py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-brand">
                <IconToolsKitchen2
                  size={14}
                  stroke={1.5}
                  className="text-white"
                />
              </div>
              <span className="text-sm font-bold text-ui-text">منوویتا</span>
            </div>
            <p className="text-xs text-ui-text-muted">
              © ۱۴۰۴ منوویتا — تمامی حقوق محفوظ است
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-ui-text-muted hover:text-ui-text transition-colors"
              >
                حریم خصوصی
              </a>
              <a
                href="#"
                className="text-xs text-ui-text-muted hover:text-ui-text transition-colors"
              >
                شرایط استفاده
              </a>
              <a
                href="#"
                className="text-xs text-ui-text-muted hover:text-ui-text transition-colors"
              >
                تماس با ما
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
