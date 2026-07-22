"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionTemplate,
  AnimatePresence,
  Variants,
} from "framer-motion";
import {
  IconArrowLeft,
  IconLayoutGrid,
  IconPhoto,
  IconDeviceMobile,
  IconBolt,
  IconShieldCheck,
  IconChartBar,
  IconQrcode,
  IconLanguage,
  IconBuildingStore,
  IconSend,
  IconCheck,
  IconMail,
  IconUser,
  IconMessage,
  IconSparkles,
  IconStar,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/shared/theme-switcher";

// ─── Framer Motion Variants ──────────────────────────────────────────────────
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const spotlightBackground = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgba(147,51,234,0.10), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("relative", className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 overflow-hidden"
        style={{ background: spotlightBackground }}
      />
      {children}
    </motion.div>
  );
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <TiltCard className="h-full rounded-[28px]">
      <motion.div
        variants={fadeInUp}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "group relative h-full rounded-[28px] p-7 overflow-hidden",
          // Light: white card with subtle border | Dark: near-transparent glass
          "bg-ui-surface dark:bg-white/3",
          "border border-ui-border dark:border-white/8",
          "shadow-sm dark:shadow-xl",
          "hover:border-brand/30 dark:hover:border-white/15",
          "hover:shadow-lg hover:shadow-brand/5 dark:hover:shadow-none",
          "backdrop-blur-xl transition-all duration-500",
          "flex flex-col gap-5",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient blob */}
        <div
          className={cn(
            "absolute -top-16 -right-16 size-48 rounded-full blur-3xl",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-700",
            gradient,
          )}
        />

        {/* Top stripe accent */}
        <div
          className={cn(
            "absolute top-0 left-8 right-8 h-px",
            "opacity-0 group-hover:opacity-100 transition-all duration-500",
            "bg-gradient-to-r from-transparent via-brand/40 to-transparent",
            "dark:via-white/30",
          )}
        />

        {/* Icon */}
        <div style={{ transform: "translateZ(24px)" }}>
          <div
            className={cn(
              "size-14 rounded-2xl flex items-center justify-center shadow-inner",
              "bg-brand/8 border border-brand/15",
              "dark:bg-white/5 dark:border-white/10",
              "group-hover:border-brand/30 group-hover:bg-brand/12",
              "dark:group-hover:border-white/20 dark:group-hover:bg-white/8",
              "transition-all duration-300",
            )}
          >
            <Icon
              size={26}
              className={cn(
                "transition-colors duration-300",
                "text-brand/60 group-hover:text-brand",
                "dark:text-white/60 dark:group-hover:text-white",
              )}
              stroke={1.6}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ transform: "translateZ(18px)" }} className="flex-1">
          <h3
            className={cn(
              "text-base font-bold mb-2.5 tracking-tight",
              "text-ui-text dark:text-white",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed",
              "text-ui-text-soft dark:text-white/50",
            )}
          >
            {description}
          </p>
        </div>
      </motion.div>
    </TiltCard>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400 }}
      className={cn(
        "relative rounded-3xl p-6 text-center overflow-hidden",
        "backdrop-blur-xl transition-all duration-300 group",
        // Light
        "bg-ui-surface border border-ui-border shadow-sm",
        "hover:border-brand/30 hover:shadow-lg hover:shadow-brand/8",
        // Dark
        "dark:bg-white/[0.03] dark:border-white/[0.08]",
        "dark:hover:border-white/[0.16]",
      )}
    >
      {/* Top shine */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b to-transparent",
          "from-brand/[0.02] dark:from-white/[0.04]",
        )}
      />
      {/* Glow blob */}
      <div className="absolute -bottom-6 -right-6 size-24 bg-brand/10 rounded-full blur-2xl group-hover:bg-brand/20 transition-all duration-500" />

      <p
        className={cn(
          "relative text-3xl sm:text-4xl font-black mb-1 bg-clip-text text-transparent",
          // Light: brand gradient | Dark: white gradient
          "bg-gradient-to-b from-brand to-brand-dark",
          "dark:from-white dark:to-white/60",
        )}
      >
        {value}
      </p>
      <p
        className={cn(
          "relative text-xs font-medium",
          "text-ui-text-soft dark:text-white/40",
        )}
      >
        {label}
      </p>
    </motion.div>
  );
}

// ─── Floating Orbs ────────────────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Orb 1 — top right */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute -top-64 -right-64 w-[900px] h-[900px] rounded-full",
          "bg-brand/[0.07] blur-[200px]",
          "dark:bg-brand/[0.18] dark:blur-[180px]",
        )}
      />
      {/* Orb 2 — mid left */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute top-1/3 -left-64 w-[700px] h-[700px] rounded-full",
          "bg-violet-500/[0.05] blur-[180px]",
          "dark:bg-violet-600/[0.12] dark:blur-[160px]",
        )}
      />
      {/* Orb 3 — bottom right */}
      <motion.div
        animate={{ x: [0, -40, 60, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute -bottom-32 right-1/4 w-[800px] h-[800px] rounded-full",
          "bg-indigo-400/[0.04] blur-[190px]",
          "dark:bg-indigo-500/[0.1] dark:blur-[170px]",
        )}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Dot grid — light uses dark dots, dark uses white dots */}
      <div
        className="absolute inset-0 opacity-[0.07] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating geometric shapes */}
      <motion.div
        animate={{ rotate: 360, y: [-20, 20, -20] }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className={cn(
          "absolute top-32 right-[8%] size-20 rounded-3xl hidden lg:block backdrop-blur-sm",
          "border border-brand/10 bg-brand/[0.02]",
          "dark:border-white/10 dark:bg-transparent",
        )}
      />
      <motion.div
        animate={{ rotate: -360, y: [25, -25, 25] }}
        transition={{
          rotate: { duration: 50, repeat: Infinity, ease: "linear" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        className={cn(
          "absolute top-80 left-[6%] size-28 rounded-full hidden lg:block",
          "border border-brand/[0.08]",
          "dark:border-white/[0.06]",
        )}
      />
      <motion.div
        animate={{ rotate: 360, y: [15, -15, 15] }}
        transition={{
          rotate: { duration: 35, repeat: Infinity, ease: "linear" },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        className={cn(
          "absolute bottom-48 left-[14%] size-12 rounded-xl hidden lg:block",
          "border border-brand/10",
          "dark:border-white/10",
        )}
      />
    </div>
  );
}

// ─── Section Divider ──────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ui-border to-transparent dark:via-white/10" />
  );
}

// ─── Section Badge ────────────────────────────────────────────────────────────
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]",
        "px-4 py-1.5 rounded-full border",
        "text-brand border-brand/25 bg-brand/[0.06]",
        "dark:text-brand/80 dark:border-brand/20 dark:bg-brand/[0.08]",
      )}
    >
      {children}
    </span>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
    return () => unsub();
  }, [scrollY]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", contact: "", message: "" });
  };

  const features = [
    {
      icon: IconLayoutGrid,
      title: "دسته‌بندی هوشمند",
      description: "آیتم‌های منو را در دسته‌بندی‌های جذاب سازماندهی کنید.",
      gradient: "bg-violet-500/20",
    },
    {
      icon: IconPhoto,
      title: "گالری تصاویر",
      description: "با تصاویر باکیفیت اشتهای مشتریان را تحریک کنید.",
      gradient: "bg-blue-500/20",
    },
    {
      icon: IconDeviceMobile,
      title: "موبایل‌فرست",
      description: "نمایش فوق‌العاده روان در تمامی دستگاه‌ها.",
      gradient: "bg-cyan-500/20",
    },
    {
      icon: IconQrcode,
      title: "QR Code اختصاصی",
      description: "کد QR با لوگو و استایل برند رستوران شما.",
      gradient: "bg-emerald-500/20",
    },
    {
      icon: IconBolt,
      title: "بارگذاری برق‌آسا",
      description: "زیر یک ثانیه با کمترین مصرف اینترنت.",
      gradient: "bg-amber-500/20",
    },
    {
      icon: IconLanguage,
      title: "RTL بومی",
      description: "رابط کاربری کاملاً فارسی با فونت‌های زیبا.",
      gradient: "bg-rose-500/20",
    },
    {
      icon: IconShieldCheck,
      title: "امنیت سطح بالا",
      description: "میزبانی ابری با پایداری ۹۹.۹ درصدی.",
      gradient: "bg-purple-500/20",
    },
    {
      icon: IconChartBar,
      title: "پنل مدیریت ساده",
      description: "تغییر قیمت‌ها در چند ثانیه بدون دانش فنی.",
      gradient: "bg-teal-500/20",
    },
  ];

  const stats = [
    { value: "۵۰۰+", label: "رستوران و کافه فعال" },
    { value: "۱۰۰K+", label: "اسکن ماهانه" },
    { value: "۹۹.۹٪", label: "پایداری سرور" },
    { value: "۴.۹★", label: "رضایت مشتریان" },
  ];

  const [restaurants, setRestaurants] = useState<
    {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      logo_url: string | null;
    }[]
  >([]);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, slug, description, logo_url")
        .eq("is_active", true)
        .limit(6);
      if (!error && data) setRestaurants(data);
      setIsLoadingRestaurants(false);
    };
    fetchRestaurants();
  }, []);

  // ── Shared input style ────────────────────────────────────────────────────
  const inputCls = cn(
    "w-full px-4 py-3.5 rounded-2xl text-sm outline-none transition-all duration-200",
    // Light
    "bg-ui-bg-soft border border-ui-border text-ui-text placeholder:text-ui-text-muted",
    "focus:border-brand/50 focus:bg-ui-surface focus:ring-2 focus:ring-brand/10",
    // Dark
    "dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/20",
    "dark:focus:border-brand/50 dark:focus:bg-white/[0.06] dark:focus:ring-brand/10",
  );

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-x-hidden dir-rtl transition-colors duration-300",
        "bg-ui-bg-landing text-ui-text dark:text-white",
      )}
    >
      <FloatingOrbs />

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-100 transition-all duration-500 border-b border-ui-border",
          scrolled
            ? [
                // Light scrolled
                "bg-ui-bg/85 backdrop-blur-2xl",
                "shadow-lg shadow-black/5",
                // Dark scrolled
                "dark:bg-ui-bg-landing/85 dark:shadow-black/50",
              ]
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-[72px] items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 8 }}
                whileTap={{ scale: 0.93 }}
                className={cn(
                  "relative flex size-12 items-center justify-center rounded-2xl",
                  "transition-all duration-300",
                )}
              >
                <Image
                  src="/logo.png"
                  alt="منوویتا"
                  width={1000}
                  height={1000}
                  className="object-contain drop-shadow-sm"
                />
                <div className="absolute inset-0 rounded-2xl bg-brand/20 blur-sm -z-10" />
              </motion.div>
              <div className="flex flex-col leading-none gap-2">
                <span
                  className={cn(
                    "text-[15px] font-black tracking-tight",
                    "text-ui-text dark:text-white",
                  )}
                >
                  منوویتا
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-brand/70 uppercase mt-0.5">
                  Menu Vita
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { href: "#features", label: "امکانات" },
                { href: "#showcase", label: "نمونه‌ها" },
                { href: "#contact", label: "تماس با ما" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    // Light
                    "text-ui-text-soft hover:text-ui-text hover:bg-ui-bg-muted",
                    // Dark
                    "dark:text-white/50 dark:hover:text-white dark:hover:bg-white/[0.06]",
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle />

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  href="/admin/login"
                  className={cn(
                    "hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl",
                    "bg-brand text-white text-sm font-bold",
                    "shadow-lg shadow-brand/30 hover:shadow-brand/50",
                    "border border-brand/50 hover:border-brand",
                    "transition-all duration-200 relative overflow-hidden group",
                  )}
                >
                  <span className="relative z-10">ورود به پنل</span>
                  <IconArrowLeft
                    size={15}
                    className="relative z-10 group-hover:-translate-x-0.5 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </motion.div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(
                  "md:hidden size-10 rounded-xl flex items-center justify-center transition-colors",
                  "bg-ui-bg-muted border border-ui-border text-ui-text-soft hover:text-ui-text",
                  "dark:bg-white/[0.06] dark:border-white/[0.08] dark:text-white/70 dark:hover:text-white",
                )}
              >
                {mobileMenuOpen ? <IconX size={20} /> : <IconMenu2 size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "md:hidden border-t overflow-hidden backdrop-blur-2xl",
                "border-ui-border bg-ui-bg/95",
                "dark:border-white/[0.06] dark:bg-ui-bg-landing/95",
              )}
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {[
                  { href: "#features", label: "امکانات" },
                  { href: "#showcase", label: "نمونه‌ها" },
                  { href: "#contact", label: "تماس با ما" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      "text-ui-text-soft hover:text-ui-text hover:bg-ui-bg-muted",
                      "dark:text-white/60 dark:hover:text-white dark:hover:bg-white/[0.06]",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  href="/admin/login"
                  className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand text-white text-sm font-bold shadow-lg shadow-brand/25"
                >
                  ورود به پنل <IconArrowLeft size={15} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="relative z-10">
        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20">
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[400px] bg-brand/[0.05] dark:bg-brand/[0.08] rounded-full blur-[120px] dark:blur-[120px]" />
          </div>

          <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10",
                "border backdrop-blur-xl text-xs font-semibold",
                // Light
                "border-brand/20 bg-brand/[0.06] text-brand/80 shadow-inner shadow-brand/5",
                // Dark
                "dark:border-white/[0.12] dark:bg-white/[0.04] dark:text-white/70 dark:shadow-white/5",
              )}
            >
              <span className="flex size-1.5 rounded-full bg-brand animate-pulse" />
              نسل جدید منوی دیجیتال QR Code برای کافه‌ها و رستوران‌ها
              <IconSparkles size={13} className="text-brand/80" />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-3 mb-8"
            >
              <motion.h1
                variants={fadeInUp}
                className={cn(
                  "text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.03em] leading-[1.08]",
                  "text-ui-text dark:text-white",
                )}
              >
                منوی دیجیتال
              </motion.h1>
              <motion.h1
                variants={fadeInUp}
                className="text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.03em] leading-[1.08]"
              >
                <span className="bg-gradient-to-r from-brand via-violet-500 to-brand-dark bg-clip-text text-transparent">
                  مدرن و هوشمند
                </span>
              </motion.h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className={cn(
                "text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-14 font-medium",
                "text-ui-text-soft dark:text-white/40",
              )}
            >
              تجربه سفارش‌گیری رستوران خود را متحول کنید. منوی زیبا بسازید،
              قیمت‌ها را آنی تغییر دهید و بدون نیاز به دانلود برنامه، منو را روی
              گوشی مشتریان بیاورید.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Primary */}
              <motion.a
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                className={cn(
                  "relative w-full sm:w-auto overflow-hidden",
                  "px-8 py-4 rounded-2xl font-bold text-[15px] text-white",
                  "bg-brand border border-brand/60",
                  "shadow-xl shadow-brand/30 hover:shadow-brand/50",
                  "flex items-center justify-center gap-2.5",
                  "transition-all duration-200 group",
                )}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">درخواست مشاوره رایگان</span>
                <IconArrowLeft
                  size={18}
                  className="relative z-10 group-hover:-translate-x-1 transition-transform"
                />
              </motion.a>

              {/* Secondary */}
              <motion.a
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                href="#features"
                className={cn(
                  "w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-[15px]",
                  "backdrop-blur-xl transition-all duration-200",
                  "flex items-center justify-center gap-2",
                  // Light
                  "border border-ui-border bg-ui-surface text-ui-text-soft",
                  "hover:bg-ui-bg-muted hover:text-ui-text hover:border-brand/30",
                  // Dark
                  "dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-white/70",
                  "dark:hover:bg-white/[0.08] dark:hover:text-white dark:hover:border-white/[0.15]",
                )}
              >
                بررسی امکانات
              </motion.a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className={cn(
                "mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs",
                "text-ui-text-muted dark:text-white/30",
              )}
            >
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "size-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white",
                      "bg-gradient-to-br from-brand/50 to-violet-600/50",
                      "border-ui-bg-landing",
                    )}
                  >
                    {["ع", "م", "ف", "ر", "ح"][i]}
                  </div>
                ))}
              </div>
              <span>+۵۰۰ رستوران و کافه به ما اعتماد کرده‌اند</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <IconStar
                    key={i}
                    size={12}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="mr-1">۴.۹</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" className="py-32 relative">
          <SectionDivider />

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-20"
            >
              <motion.div variants={fadeInUp}>
                <SectionBadge>قابلیت‌های کلیدی</SectionBadge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className={cn(
                  "text-3xl sm:text-5xl font-black mt-6 mb-5 tracking-tight",
                  "text-ui-text dark:text-white",
                )}
              >
                چرا منوویتا؟
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className={cn(
                  "max-w-md mx-auto text-[15px] leading-relaxed",
                  "text-ui-text-soft dark:text-white/40",
                )}
              >
                ابزارهایی طراحی‌شده برای افزایش فروش، راحتی مشتری و مدیریت
                بی‌دردسر.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              style={{ perspective: "1200px" }}
            >
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SHOWCASE ────────────────────────────────────────────────────── */}
        <section id="showcase" className="py-28 relative">
          <SectionDivider />

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <SectionBadge>ویترین کسب‌وکارها</SectionBadge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className={cn(
                  "text-3xl sm:text-4xl font-black mt-6 mb-3 tracking-tight",
                  "text-ui-text dark:text-white",
                )}
              >
                رستوران‌ها و کافه‌های برتر
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-sm text-ui-text-soft dark:text-white/40"
              >
                مجموعه‌هایی که به منوویتا اعتماد کرده‌اند
              </motion.p>
            </motion.div>

            {isLoadingRestaurants ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-28 rounded-3xl animate-pulse",
                      "bg-ui-bg-muted border border-ui-border",
                      "dark:bg-white/[0.03] dark:border-white/[0.06]",
                    )}
                  />
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <p className="text-center text-sm py-12 text-ui-text-muted dark:text-white/30">
                هنوز رستورانی ثبت نشده است.
              </p>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              >
                {restaurants.map((r) => (
                  <motion.div
                    key={r.id}
                    variants={fadeInUp}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "group relative p-5 rounded-3xl overflow-hidden",
                      "backdrop-blur-xl transition-all duration-300",
                      "flex items-center gap-4",
                      // Light
                      "bg-ui-surface border border-ui-border shadow-sm",
                      "hover:border-brand/30 hover:shadow-xl hover:shadow-brand/8",
                      // Dark
                      "dark:bg-white/[0.03] dark:border-white/[0.06]",
                      "dark:hover:border-white/[0.12]",
                    )}
                  >
                    {/* Hover gradient overlay */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br to-transparent",
                        "from-brand/[0.03] opacity-0 group-hover:opacity-100",
                        "transition-opacity duration-500",
                      )}
                    />

                    {/* Logo */}
                    <div
                      className={cn(
                        "relative size-14 rounded-2xl overflow-hidden shrink-0",
                        "flex items-center justify-center",
                        "bg-brand/[0.06] border border-brand/[0.12]",
                        "dark:bg-white/[0.06] dark:border-white/[0.08]",
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
                          size={28}
                          className="text-brand/40 dark:text-white/30"
                          stroke={1.4}
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 relative">
                      <h4
                        className={cn(
                          "font-bold text-[15px] truncate",
                          "text-ui-text dark:text-white",
                        )}
                      >
                        {r.name}
                      </h4>
                      {r.description && (
                        <p
                          className={cn(
                            "text-xs mt-1 line-clamp-1",
                            "text-ui-text-muted dark:text-white/35",
                          )}
                        >
                          {r.description}
                        </p>
                      )}
                      <Link
                        href={`/${r.slug}`}
                        className="text-[11px] text-brand/70 hover:text-brand mt-1.5 inline-flex items-center gap-1 font-semibold transition-colors group/link"
                      >
                        مشاهده منو
                        <IconArrowLeft
                          size={11}
                          className="group-hover/link:-translate-x-0.5 transition-transform"
                        />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ── CONTACT ─────────────────────────────────────────────────────── */}
        <section id="contact" className="py-32 relative">
          <SectionDivider />

          {/* Section glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] bg-brand/[0.04] dark:bg-brand/[0.06] rounded-full blur-[100px]" />
          </div>

          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.div variants={fadeInUp}>
                <SectionBadge>ارتباط با ما</SectionBadge>
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className={cn(
                  "text-3xl sm:text-5xl font-black mt-6 mb-4 tracking-tight",
                  "text-ui-text dark:text-white",
                )}
              >
                بیایید شروع کنیم
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-[15px] leading-relaxed text-ui-text-soft dark:text-white/40"
              >
                اطلاعات خود را ثبت کنید؛ کارشناسان ما در کوتاه‌ترین زمان با شما
                تماس می‌گیرند.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="rounded-4xl">
                <div
                  className={cn(
                    "relative p-8 sm:p-10 rounded-4xl overflow-hidden",
                    "backdrop-blur-2xl shadow-2xl",
                    // Light
                    "bg-ui-surface border border-ui-border shadow-black/5",
                    // Dark
                    "dark:bg-white/3 dark:border-white/8 dark:shadow-black/50",
                  )}
                >
                  {/* Top glow line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/20 to-transparent dark:via-white/20" />
                  {/* Top blur blob */}
                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand/5 dark:bg-brand/10 rounded-full blur-3xl" />

                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-12"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 18,
                          }}
                          className="size-20 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20"
                        >
                          <IconCheck size={38} stroke={2.5} />
                        </motion.div>
                        <h3
                          className={cn(
                            "text-xl font-bold mb-2",
                            "text-ui-text dark:text-white",
                          )}
                        >
                          درخواست ثبت شد!
                        </h3>
                        <p className="text-sm mb-8 text-ui-text-soft dark:text-white/40">
                          همکاران ما به زودی با شما تماس می‌گیرند.
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="text-xs font-bold text-brand/70 hover:text-brand transition-colors"
                        >
                          ارسال درخواست جدید
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Name */}
                          <div className="space-y-2">
                            <label
                              className={cn(
                                "flex items-center gap-2 text-xs font-bold",
                                "text-ui-text-soft dark:text-white/50",
                              )}
                            >
                              <IconUser size={13} className="text-brand/70" />
                              نام و نام مجموعه
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  name: e.target.value,
                                })
                              }
                              placeholder="علی محمدی (کافه آریا)"
                              className={inputCls}
                            />
                          </div>

                          {/* Contact */}
                          <div className="space-y-2">
                            <label
                              className={cn(
                                "flex items-center gap-2 text-xs font-bold",
                                "text-ui-text-soft dark:text-white/50",
                              )}
                            >
                              <IconMail size={13} className="text-brand/70" />
                              شماره یا ایمیل
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.contact}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  contact: e.target.value,
                                })
                              }
                              placeholder="09123456789"
                              className={cn(inputCls, "dir-ltr text-right")}
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <label
                            className={cn(
                              "flex items-center gap-2 text-xs font-bold",
                              "text-ui-text-soft dark:text-white/50",
                            )}
                          >
                            <IconMessage size={13} className="text-brand/70" />
                            توضیحات (اختیاری)
                          </label>
                          <textarea
                            rows={4}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            placeholder="تعداد شعب، نوع مجموعه‌تان یا هر سوالی که دارید..."
                            className={cn(inputCls, "resize-none")}
                          />
                        </div>

                        {/* Submit */}
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={cn(
                            "relative w-full overflow-hidden py-4 rounded-2xl font-bold text-sm text-white",
                            "bg-brand border border-brand/60",
                            "shadow-xl shadow-brand/25 hover:shadow-brand/40",
                            "flex items-center justify-center gap-2.5",
                            "transition-all duration-200 group",
                            isSubmitting && "opacity-60 cursor-not-allowed",
                          )}
                        >
                          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          {isSubmitting ? (
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <span className="relative z-10">
                                ثبت و ارسال درخواست
                              </span>
                              <IconSend size={17} className="relative z-10" />
                            </>
                          )}
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer
        className={cn(
          "relative z-10 py-10 border-t",
          "border-ui-border dark:border-white/[0.06]",
        )}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl p-1",
                  "bg-brand/[0.06] border border-brand/[0.12]",
                  "dark:bg-white/[0.04] dark:border-white/[0.08]",
                )}
              >
                <Image
                  src="/logo.png"
                  alt="منوویتا"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-black text-ui-text dark:text-white/80">
                منوویتا
              </span>
            </div>

            <p className="text-xs text-center text-ui-text-muted dark:text-white/20">
              ©{" "}
              {new Intl.DateTimeFormat("fa-IR", {
                year: "numeric",
              }).format(new Date())}{" "}
              منوویتا — سیستم هوشمند منوی دیجیتال. تمامی حقوق محفوظ است.
            </p>

            <div className="flex gap-6 text-xs text-ui-text-muted dark:text-white/30">
              {[
                { href: "#contact", label: "پشتیبانی" },
                { href: "#features", label: "امکانات" },
                { href: "/admin/login", label: "ورود به سامانه" },
              ].map((link) =>
                link.href.startsWith("#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hover:text-ui-text dark:hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="hover:text-ui-text dark:hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
