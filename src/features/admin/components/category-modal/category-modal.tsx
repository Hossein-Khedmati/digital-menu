"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconPencil, IconAlertCircle } from "@tabler/icons-react";
import toast from "react-hot-toast";

import { categorySchema, type CategoryFormValues } from "../../schemas";
import { upsertCategoryAction } from "../../actions/category.actions";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { EMOJI_PRESETS } from "./constants";
import type { Props } from "./types";

export function CategoryModal({
  restaurantId,
  category,
  onCreated,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      icon: category?.icon ?? "",
      display_order: category?.display_order ?? 0,
      is_active: category?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        name: category?.name ?? "",
        icon: category?.icon ?? "",
        display_order: category?.display_order ?? 0,
        is_active: category?.is_active ?? true,
      });
    }
  }, [open, reset, category]);

  const selectedIcon = watch("icon");
  const isActive = watch("is_active");

  const onSubmit = async (values: CategoryFormValues) => {
    const result = await upsertCategoryAction(
      restaurantId,
      values,
      category?.id,
    );

    if (result.success && result.data) {
      toast.success(
        isEdit ? "دسته‌بندی با موفقیت ویرایش شد" : "دسته‌بندی جدید ایجاد شد",
      );
      isEdit ? onUpdated?.(result.data) : onCreated?.(result.data);
      setOpen(false);
    } else {
      toast.error(result.error ?? "خطایی رخ داد");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            دسته‌بندی جدید
          </>
        )}
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="catName">
                نام دسته‌بندی
                <span className="text-red-500 mr-1">*</span>
              </Label>
              <Input
                placeholder="مثال: پیش‌غذا"
                error={!!errors.name}
                {...register("name")}
                id="catName"
              />
              {errors.name && <ErrorMsg>{errors.name.message}</ErrorMsg>}
            </div>

            <div className="space-y-2">
              <Label>آیکون (اختیاری)</Label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_PRESETS.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setValue("icon", selectedIcon === emoji ? "" : emoji, {
                        shouldDirty: true,
                      })
                    }
                    className={cn(
                      "h-10 w-10 rounded-xl text-xl",
                      "border-2 transition-all duration-150",
                      "hover:scale-110 active:scale-95",
                      selectedIcon === emoji
                        ? "shadow-md bg-brand-light hover:bg-brand-light"
                        : "border-ui-border bg-ui-surface hover:border-ui-text-muted",
                    )}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
              <Input
                placeholder="یا آیکون دلخواه وارد کنید..."
                className="mt-1"
                {...register("icon")}
                error={!!errors.icon}
              />
              {errors.icon && <ErrorMsg>{errors.icon.message}</ErrorMsg>}
            </div>

            <div
              className={cn(
                "flex items-center justify-between",
                "rounded-xl border border-ui-border",
                "bg-ui-bg-soft px-4 py-3",
              )}
            >
              <div>
                <p className="text-sm font-medium text-ui-text">وضعیت نمایش</p>
                <p className="text-xs text-ui-text-muted mt-0.5">
                  {isActive
                    ? "این دسته در منو نمایش داده می‌شود"
                    : "این دسته مخفی است"}
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(v) =>
                  setValue("is_active", v, { shouldDirty: true })
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
              {isEdit ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
