"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconPlus,
  IconPencil,
  IconAlertCircle,
  IconCurrencyDollar,
  IconTag,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { menuItemSchema, type MenuItemFormValues } from "../../schemas";
import {
  upsertMenuItemAction,
  uploadMenuItemImage,
  clearMenuItemImageAction,
} from "../../actions/menu-item.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/shared/image-uploader";
import { cn, formatPrice } from "@/lib/utils";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Props } from "./types";

export function MenuItemModal({
  restaurantId,
  userId,
  categories,
  item,
  onCreated,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [clearImage, setClearImage] = useState(false);
  const isEdit = !!item;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      base_price: item?.base_price ?? 0,
      discounted_price: item?.discounted_price ?? undefined,
      category_id: item?.category_id ?? "",
      display_order: item?.display_order ?? 0,
      is_active: item?.is_active ?? true,
      is_available: item?.is_available ?? true,
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        name: item?.name ?? "",
        description: item?.description ?? "",
        base_price: item?.base_price ?? 0,
        discounted_price: item?.discounted_price ?? undefined,
        category_id: item?.category_id ?? "",
        display_order: item?.display_order ?? 0,
        is_active: item?.is_active ?? true,
        is_available: item?.is_available ?? true,
      });
      setImageFile(null);
      setClearImage(false);
    }
  }, [open, reset, item]);

  const isActive = watch("is_active");
  const isAvailable = watch("is_available");
  const basePrice = watch("base_price");

  // ── submit ──
  const onSubmit = async (values: MenuItemFormValues) => {
    let imageUrl: string | null = item?.image_url ?? null;

    // ── user cleared the image ──
    if (clearImage) {
      imageUrl = null;
      // ✅ delete old image from bucket if exists
      if (item?.image_url && item?.id) {
        await clearMenuItemImageAction(item.image_url, item.id, restaurantId);
      }
    }

    // ── user picked a new image ──
    if (imageFile) {
      const { url, error } = await uploadMenuItemImage(
        imageFile,
        userId,
        // ✅ pass old url so uploadMenuItemImage deletes it before uploading
        clearImage ? null : (item?.image_url ?? null),
      );
      if (error) {
        toast.error(error);
        return;
      }
      imageUrl = url;
    }

    const result = await upsertMenuItemAction(
      restaurantId,
      values,
      imageUrl,
      item?.id,
    );

    if (result.success && result.data) {
      toast.success(isEdit ? "آیتم با موفقیت ویرایش شد" : "آیتم جدید اضافه شد");
      isEdit ? onUpdated?.(result.data) : onCreated?.(result.data);
      setOpen(false);
    } else {
      toast.error(result.error ?? "خطایی رخ داد");
    }
  };

  const categoryOptions: ComboboxOption[] = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    icon: cat.icon ?? undefined,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <Button
        type="button"
        size={isEdit ? "sm" : "default"}
        variant={isEdit ? "outline" : "default"}
        onClick={() => setOpen(true)}
      >
        {isEdit ? (
          <>
            <IconPencil size={16} stroke={2} />
            ویرایش
          </>
        ) : (
          <>
            <IconPlus size={16} stroke={2} />
            آیتم جدید
          </>
        )}
      </Button>

      {/* ── Modal ── */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش آیتم منو" : "افزودن آیتم جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-6">
            {/* ── تصویر ── */}
            <div className="space-y-1.5">
              <Label>تصویر آیتم</Label>
              <ImageUploader
                value={item?.image_url ?? null}
                onChange={(file) => {
                  setImageFile(file);
                  if (file) setClearImage(false);
                }}
                onClear={() => {
                  setClearImage(true);
                  setImageFile(null);
                }}
                maxSizeMB={3}
                placeholder="کلیک کنید یا تصویر را اینجا بکشید"
              />
            </div>

            {/* ── نام ── */}
            <div className="space-y-1.5">
              <Label>
                نام آیتم
                <span className="text-red-500 mr-1">*</span>
              </Label>
              <Input
                placeholder="مثال: پیتزا مارگاریتا"
                error={!!errors.name}
                {...register("name")}
              />
              {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
            </div>

            {/* ── توضیحات ── */}
            <div className="space-y-1.5">
              <Label>توضیحات</Label>
              <Textarea
                placeholder="مواد تشکیل‌دهنده یا توضیح کوتاه..."
                {...register("description")}
              />
            </div>

            {/* ── قیمت‌ها ── */}
            <div className="grid grid-cols-2 gap-4">
              {/* قیمت اصلی */}
              <div className="space-y-1.5">
                <Label>
                  قیمت اصلی (تومان)
                  <span className="text-red-500 mr-1">*</span>
                </Label>
                <div className="relative">
                  <IconCurrencyDollar
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-ui-text-muted pointer-events-none"
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    dir="ltr"
                    className="text-left pr-9"
                    error={!!errors.base_price}
                    {...register("base_price", { valueAsNumber: true })}
                  />
                </div>
                {basePrice > 0 && (
                  <p className="text-xs text-ui-text-muted">
                    {formatPrice(basePrice)}
                  </p>
                )}
                {errors.base_price && (
                  <ErrorMsg>{errors.base_price.message}</ErrorMsg>
                )}
              </div>

              {/* قیمت تخفیف */}
              <div className="space-y-1.5">
                <Label>
                  قیمت با تخفیف
                  <span className="text-xs text-ui-text-muted mr-1">
                    (اختیاری)
                  </span>
                </Label>
                <div className="relative">
                  <IconTag
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-ui-text-muted pointer-events-none"
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="خالی = بدون تخفیف"
                    dir="ltr"
                    className="text-left pr-9"
                    error={!!errors.discounted_price}
                    {...register("discounted_price", {
                      setValueAs: (v) => {
                        if (v === "" || v === null || v === undefined)
                          return undefined;
                        const num = Number(v);
                        return isNaN(num) ? undefined : num;
                      },
                    })}
                  />
                </div>
                {errors.discounted_price && (
                  <ErrorMsg>{errors.discounted_price.message}</ErrorMsg>
                )}
              </div>
            </div>

            {/* ── دسته‌بندی ── */}
            <div className="space-y-1.5">
              <Label>
                دسته‌بندی
                <span className="text-red-500 mr-1">*</span>
              </Label>
              <Combobox
                options={categoryOptions}
                value={watch("category_id")}
                onChange={(val) =>
                  setValue("category_id", val, { shouldDirty: true })
                }
                placeholder="انتخاب دسته‌بندی..."
                searchPlaceholder="جستجوی دسته‌بندی..."
                emptyMessage="دسته‌بندی یافت نشد"
                error={!!errors.category_id}
              />
              {errors.category_id && (
                <ErrorMsg>{errors.category_id.message}</ErrorMsg>
              )}
            </div>

            {/* ── وضعیت‌ها ── */}
            <div className="space-y-3">
              <ToggleRow
                label="نمایش در منو"
                description={
                  isActive
                    ? "این آیتم در منو نمایش داده می‌شود"
                    : "این آیتم مخفی است"
                }
                checked={isActive}
                onChange={(v) =>
                  setValue("is_active", v, { shouldDirty: true })
                }
              />
              <ToggleRow
                label="موجود است"
                description={
                  isAvailable ? "این آیتم قابل سفارش است" : "این آیتم تمام شده"
                }
                checked={isAvailable}
                onChange={(v) =>
                  setValue("is_available", v, { shouldDirty: true })
                }
              />
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isEdit ? "ذخیره تغییرات" : "افزودن آیتم"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
