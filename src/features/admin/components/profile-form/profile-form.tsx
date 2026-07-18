"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconAlertCircle,
  IconBrandInstagram,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconPalette,
  IconInfoSquareRounded,
  IconPhotoEdit,
  IconLockOpen,
  IconArrowBackUp,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { restaurantSchema, type RestaurantFormValues } from "../../schemas";
import {
  updateRestaurantAction,
  uploadRestaurantAsset,
} from "../../actions/restaurant.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/ui/image-uploader";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database.types";
import { BrandColorPicker } from "../brand-color-picker/brand-color-picker";

type Props = {
  restaurant: Tables<"restaurants">;
};

function parseSocialLinks(raw: unknown) {
  if (!raw) return { instagram: "", telegram: "", whatsapp: "" };
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }
  return raw as Record<string, string>;
}

// ── moved here so ProfileForm can call it on reset ──
function applyColorPreview(hex: string) {
  if (typeof window === "undefined") return;
  import("@/lib/theme/brand-color").then(({ generateBrandShades }) => {
    const shades = generateBrandShades(hex);
    const root = document.documentElement;
    root.style.setProperty("--brand-color", shades.main);
    root.style.setProperty("--brand-color-light", shades.light);
    root.style.setProperty("--brand-color-dark", shades.dark);
    root.style.setProperty("--brand-color-subtle", shades.subtle);
  });
}

export function ProfileForm({ restaurant }: Props) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [clearLogo, setClearLogo] = useState(false);
  const [clearBanner, setClearBanner] = useState(false);

  const socialLinks = parseSocialLinks(restaurant.social_links);
  const initialColor = restaurant.brand_color ?? "#9333ea";

  // ── build default values once so reset can reuse them ──
  const defaultValues: RestaurantFormValues = {
    name: restaurant.name ?? "",
    description: restaurant.description ?? "",
    address: restaurant.address ?? "",
    phone: restaurant.phone ?? "",
    is_active: restaurant.is_active ?? true,
    brand_color: initialColor,
    social_links: {
      instagram: socialLinks.instagram ?? "",
      telegram: socialLinks.telegram ?? "",
      whatsapp: socialLinks.whatsapp ?? "",
    },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues,
  });

  const isActive = watch("is_active");
  const brandColor = watch("brand_color");

  const hasImageChange = !!logoFile || !!bannerFile || clearLogo || clearBanner;
  const hasAnyChange = isDirty || hasImageChange;

  // ── reset everything ──
  const handleReset = () => {
    reset(defaultValues);
    setLogoFile(null);
    setBannerFile(null);
    setClearLogo(false);
    setClearBanner(false);
    applyColorPreview(initialColor);
    toast("فرم به حالت اولیه برگشت", { icon: <IconArrowBackUp  />});
  };

  // ── submit ──
  const onSubmit = async (values: RestaurantFormValues) => {
    let logoUrl: string | null | undefined = undefined;
    let bannerUrl: string | null | undefined = undefined;

    if (clearLogo) {
      logoUrl = null;
    } else if (logoFile) {
      const { url, error } = await uploadRestaurantAsset(
        logoFile,
        restaurant.id,
        "logo",
        restaurant.logo_url,
      );
      if (error) {
        toast.error(error);
        return;
      }
      logoUrl = url;
    }

    if (clearBanner) {
      bannerUrl = null;
    } else if (bannerFile) {
      const { url, error } = await uploadRestaurantAsset(
        bannerFile,
        restaurant.id,
        "banner",
        restaurant.banner_url,
      );
      if (error) {
        toast.error(error);
        return;
      }
      bannerUrl = url;
    }

    const result = await updateRestaurantAction(
      restaurant.id,
      values,
      logoUrl,
      bannerUrl,
    );

    if (result.success) {
      toast.success("اطلاعات رستوران با موفقیت ذخیره شد");
      reset(values);
      setLogoFile(null);
      setBannerFile(null);
      setClearLogo(false);
      setClearBanner(false);
    } else {
      toast.error(result.error ?? "خطایی رخ داد");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ══ اطلاعات پایه ══ */}
      <section className="space-y-5">
        <SectionTitle icon={<IconInfoSquareRounded size={22} />}>
          اطلاعات پایه
        </SectionTitle>

        <div className="space-y-1.5">
          <Label>
            نام رستوران
            <span className="text-red-500 mr-1">*</span>
          </Label>
          <Input
            placeholder="مثال: کافه رویال"
            error={!!errors.name}
            {...register("name")}
          />
          {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
        </div>

        <div className="space-y-1.5">
          <Label>توضیحات</Label>
          <Textarea
            placeholder="معرفی کوتاه رستوران..."
            {...register("description")}
          />
          {errors.description && (
            <ErrorMsg>{errors.description.message}</ErrorMsg>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>آدرس</Label>
          <Input
            placeholder="تهران، خیابان ولیعصر..."
            {...register("address")}
          />
          {errors.address && <ErrorMsg>{errors.address.message}</ErrorMsg>}
        </div>

        <div className="space-y-1.5">
          <Label>شماره تماس</Label>
          <Input placeholder="02112345678" dir="ltr" {...register("phone")} />
          {errors.phone && <ErrorMsg>{errors.phone.message}</ErrorMsg>}
        </div>
      </section>

      {/* ══ تصاویر ══ */}
      <section className="space-y-5">
        <SectionTitle icon={<IconPhotoEdit size={22} />}>
          تصاویر رستوران
        </SectionTitle>

        <div className="flex items-start justify-between gap-5">
          <div className="w-full space-y-1.5">
            <Label>لوگو رستوران</Label>
            <p className="text-xs text-ui-text-muted">
              لوگو در صفحه منو نمایش داده می‌شود — نسبت ۱:۱ پیشنهاد می‌شود
            </p>
            <ImageUploader
              value={restaurant.logo_url ?? null}
              onChange={(file) => {
                setLogoFile(file);
                if (file) setClearLogo(false);
              }}
              onClear={() => {
                setClearLogo(true);
                setLogoFile(null);
              }}
              maxSizeMB={3}
              placeholder="کلیک کنید یا لوگو را اینجا بکشید"
            />
          </div>

          <div className="w-full space-y-1.5">
            <Label>تصویر بنر</Label>
            <p className="text-xs text-ui-text-muted">
              تصویر پس‌زمینه صفحه منو — نسبت ۳:۱ پیشنهاد می‌شود
            </p>
            <ImageUploader
              value={restaurant.banner_url ?? null}
              onChange={(file) => {
                setBannerFile(file);
                if (file) setClearBanner(false);
              }}
              onClear={() => {
                setClearBanner(true);
                setBannerFile(null);
              }}
              maxSizeMB={5}
              placeholder="کلیک کنید یا بنر را اینجا بکشید"
            />
          </div>
        </div>
      </section>

      {/* ══ شبکه‌های اجتماعی ══ */}
      <section className="space-y-5">
        <SectionTitle icon={<IconBrandInstagram size={22} />}>
          شبکه‌های اجتماعی
        </SectionTitle>

        <div className="space-y-1.5">
          <Label>اینستاگرام</Label>
          <div className="relative">
            <IconBrandInstagram
              size={22}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-ui-text-muted pointer-events-none"
            />
            <Input
              placeholder="https://instagram.com/yourpage"
              dir="ltr"
              className="pr-9"
              error={!!errors.social_links?.instagram}
              {...register("social_links.instagram")}
            />
          </div>
          {errors.social_links?.instagram && (
            <ErrorMsg>{errors.social_links.instagram.message}</ErrorMsg>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>تلگرام</Label>
          <div className="relative">
            <IconBrandTelegram
              size={22}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-ui-text-muted pointer-events-none"
            />
            <Input
              placeholder="https://t.me/yourpage"
              dir="ltr"
              className="pr-9"
              error={!!errors.social_links?.telegram}
              {...register("social_links.telegram")}
            />
          </div>
          {errors.social_links?.telegram && (
            <ErrorMsg>{errors.social_links.telegram.message}</ErrorMsg>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>واتساپ</Label>
          <div className="relative">
            <IconBrandWhatsapp
              size={22}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-ui-text-muted pointer-events-none"
            />
            <Input
              placeholder="989123456789+"
              dir="ltr"
              className="pr-9"
              {...register("social_links.whatsapp")}
            />
          </div>
        </div>
      </section>

      {/* ══ رنگ برند ══ */}
      <section className="space-y-5">
        <SectionTitle icon={<IconPalette size={22} />}>رنگ برند</SectionTitle>
        <BrandColorPicker
          value={brandColor}
          onChange={(color) =>
            setValue("brand_color", color, { shouldDirty: true })
          }
          onReset={() =>
            setValue("brand_color", initialColor, { shouldDirty: false })
          }
          isDirty={brandColor !== initialColor}
        />
      </section>

      {/* ══ وضعیت ══ */}
      <section className="space-y-5">
        <SectionTitle icon={<IconLockOpen size={22} />}>وضعیت</SectionTitle>
        <ToggleRow
          label="رستوران فعال است"
          description={
            isActive
              ? "منوی رستوران برای مشتریان نمایش داده می‌شود"
              : "منوی رستوران مخفی است و مشتریان نمی‌توانند آن را ببینند"
          }
          checked={isActive}
          onChange={(v) => setValue("is_active", v, { shouldDirty: true })}
        />
      </section>

      {/* ══ footer ══ */}
      <div
        className={cn(
          "flex items-center justify-between",
          "pt-4 border-t border-ui-border",
        )}
      >
        {/* ── reset ── */}
        <Button
          type="button"
          variant="ghost"
          onClick={handleReset}
          disabled={!hasAnyChange || isSubmitting}
          className="text-ui-text-muted hover:text-ui-text"
        >
          <IconArrowBackUp size={22} stroke={2} />
          بازگشت به حالت اولیه
        </Button>

        {/* ── submit ── */}
        <Button type="submit" loading={isSubmitting} disabled={!hasAnyChange}>
          <IconDeviceFloppy size={22} stroke={2} />
          ذخیره تغییرات
        </Button>
      </div>
    </form>
  );
}

// ── Section Title ──
function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-ui-text-soft shrink-0">{icon}</span>}
      <h3 className="text-sm font-semibold text-ui-text whitespace-nowrap">
        {children}
      </h3>
      <div className="flex-1 h-px bg-ui-border" />
    </div>
  );
}

// ── Toggle Row ──
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between",
        "rounded-xl border border-ui-border",
        "bg-ui-bg-soft px-4 py-3",
      )}
    >
      <div>
        <p className="text-sm font-medium text-ui-text">{label}</p>
        <p className="text-xs text-ui-text-muted mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

// ── Error Message ──
function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="flex items-center gap-1.5 text-xs text-red-500
                  animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <IconAlertCircle size={12} />
      {children}
    </p>
  );
}
