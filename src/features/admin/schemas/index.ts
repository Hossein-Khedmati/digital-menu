import { z } from "zod";

const daySchema = z.object({
  open: z.boolean(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const restaurantSchema = z.object({
  name: z
    .string({ message: "نام رستوران الزامی است" })
    .min(2, "نام رستوران باید حداقل ۲ کاراکتر باشد")
    .max(100, "نام رستوران نباید بیشتر از ۱۰۰ کاراکتر باشد"),
  description: z
    .string()
    .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "شماره تلفن معتبر نیست")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(300, "آدرس نباید بیشتر از ۳۰۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
  brand_color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "رنگ باید فرمت HEX معتبر باشد (مثال: #9333ea)"),
  social_links: z
    .object({
      instagram: z
        .string()
        .url("لینک اینستاگرام معتبر نیست")
        .optional()
        .or(z.literal("")),
      telegram: z
        .string()
        .url("لینک تلگرام معتبر نیست")
        .optional()
        .or(z.literal("")),
      whatsapp: z.string().optional().or(z.literal("")),
    })
    .optional(),
  working_hours: z
    .object({
      saturday: daySchema,
      sunday: daySchema,
      monday: daySchema,
      tuesday: daySchema,
      wednesday: daySchema,
      thursday: daySchema,
      friday: daySchema,
    })
    .optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
export type DaySchedule = z.infer<typeof daySchema>;
export type WorkingHours = NonNullable<RestaurantFormValues["working_hours"]>;
export type DayKey = keyof WorkingHours;

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),

  icon: z
    .string()
    .max(10, "آیکون نباید بیشتر از ۱۰ کاراکتر باشد")
    .optional()
    .or(z.literal("")),
  display_order: z.number().int().min(0).optional(),

  is_active: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

// ─────────────────────────────────────────
// ✅ Menu Item Schema اصلاح‌شده
// ─────────────────────────────────────────
export const menuItemSchema = z
  .object({
    name: z
      .string({ required_error: "نام آیتم الزامی است" })
      .min(2, "نام باید حداقل ۲ کاراکتر باشد")
      .max(100, "نام نباید بیشتر از ۱۰۰ کاراکتر باشد"),

    description: z
      .string()
      .max(500, "توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد")
      .optional()
      .or(z.literal("")),

    base_price: z
      .number({
        required_error: "قیمت الزامی است",
        invalid_type_error: "قیمت باید عدد باشد",
      })
      .int("قیمت باید عدد صحیح باشد")
      .min(0, "قیمت نمی‌تواند منفی باشد"),

    // ✅ فقط number | null | undefined - بدون string
    discounted_price: z
      .number({ invalid_type_error: "قیمت تخفیف باید عدد باشد" })
      .int("قیمت تخفیف باید عدد صحیح باشد")
      .min(0, "قیمت تخفیف نمی‌تواند منفی باشد")
      .nullable()
      .optional(),

    category_id: z
      .string({ required_error: "انتخاب دسته‌بندی الزامی است" })
      .uuid("دسته‌بندی انتخاب‌شده معتبر نیست"),

    display_order: z.number().int().min(0),
    is_active: z.boolean(),
    is_available: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.discounted_price == null) return true;
      return data.discounted_price < data.base_price;
    },
    {
      message: "قیمت تخفیف باید کمتر از قیمت اصلی باشد",
      path: ["discounted_price"],
    },
  );

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
