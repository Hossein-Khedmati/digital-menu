"use client";

import { useState } from "react";
import Image from "next/image";
import {
  IconShoppingBag,
  IconPlus,
  IconMinus,
  IconTrash,
  IconToolsKitchen2,
  IconClipboardList,
} from "@tabler/icons-react";
import { useCartStore } from "../../../store/cart-store";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { formatPrice, toPersianNumber, cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { ClearCartDialog } from "./clear-cart-modal";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const isMounted = useIsMounted();

  const {
    items,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  const count = isMounted ? totalItems() : 0;
  const total = isMounted ? totalPrice() : 0;

  return (
    <>
      {/* ── دکمه شناور سبد خرید ── */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-40",
          "flex items-center gap-3 rounded-2xl bg-ui-bg-soft hover:bg-brand-light dark:hover:bg-ui-bg-muted",
          count > 0 ? "px-5 py-3.5" : "h-14 w-14 justify-center",
        )}
      >
        <IconShoppingBag size={20} stroke={2} className="shrink-0" />

        {count > 0 && (
          <>
            <div className="h-full w-px bg-brand" />
            <span className="text-sm font-semibold text-brand">
              {formatPrice(total)}
            </span>
          </>
        )}

        {/* ── نشان تعداد ── */}
        {count > 0 && (
          <span
            className={cn(
              "absolute -top-2 -right-2",
              "flex h-5 w-5 items-center justify-center",
              "rounded-full text-[10px] font-bold",
              "bg-red-500 text-white shadow-lg",
              "ring-2 ring-white dark:ring-ui-surface",
            )}
          >
            {toPersianNumber(count)}
          </span>
        )}
      </Button>

      {/* ── Drawer ── */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={`سبد سفارش (${toPersianNumber(count)} آیتم)`}
        footer={
          count > 0 ? (
            <div className="space-y-3">
              {/* جمع کل */}
              <div
                className={cn(
                  "flex items-center justify-between",
                  "rounded-2xl px-4 py-3",
                  "bg-ui-bg-muted border border-ui-border",
                )}
              >
                <span className="text-sm text-ui-text-muted">جمع کل:</span>
                <span className="text-base font-bold text-brand">
                  {formatPrice(total)}
                </span>
              </div>

              {/* دکمه ثبت سفارش */}
              <Button className="w-full h-12 rounded-2xl text-sm">
                <IconClipboardList size={24} stroke={2} />
                برای ثبت سفارش به گارسون اطلاع دهید .
              </Button>

              {/* پاک کردن */}
              <ClearCartDialog onConfirm={clearCart} />
            </div>
          ) : null
        }
      >
        {count === 0 ? (
          /* ── حالت خالی ── */
          <div
            className="flex flex-col items-center justify-center
                          h-full py-20 text-center"
          >
            <div
              className={cn(
                "h-20 w-20 rounded-3xl mb-4",
                "flex items-center justify-center",
                "bg-ui-bg-muted",
              )}
            >
              <IconShoppingBag
                size={40}
                stroke={1.5}
                className="text-ui-text-muted"
              />
            </div>
            <p className="font-semibold text-ui-text-soft">سبد شما خالی است</p>
            <p className="text-sm text-ui-text-muted mt-1">
              از منو آیتم اضافه کنید
            </p>
          </div>
        ) : (
          /* ── لیست آیتم‌ها ── */
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onIncrease={() => increaseQty(item.id)}
                onDecrease={() => decreaseQty(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
}

// ── آیتم درون سبد ──
type CartItemRowProps = {
  item: {
    id: string;
    name: string;
    base_price: number;
    discounted_price: number | null;
    image_url: string | null;
    quantity: number;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const price = item.discounted_price ?? item.base_price;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl p-3",
        "border border-ui-border bg-ui-bg-muted",
      )}
    >
      {/* ── تصویر ── */}
      <div
        className={cn(
          "relative h-14 w-14 rounded-xl overflow-hidden shrink-0",
          "bg-ui-surface",
        )}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <IconToolsKitchen2
              size={20}
              stroke={1.5}
              className="text-ui-text-muted"
            />
          </div>
        )}
      </div>

      {/* ── اطلاعات ── */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ui-text truncate">
          {item.name}
        </p>
        <p className="text-xs text-brand font-medium mt-0.5">
          {formatPrice(price)}
        </p>
      </div>

      {/* ── کنترل‌ها ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* کاهش / حذف */}
        <button
          onClick={onDecrease}
          className={cn(
            "flex h-7 w-7 items-center justify-center",
            "rounded-lg border transition-all duration-150",
            "border-ui-border bg-ui-surface",
            "text-ui-text-muted",
            "hover:border-red-300 hover:text-red-500",
            "dark:hover:border-red-500/50 dark:hover:text-red-400",
          )}
          aria-label="کاهش"
        >
          {item.quantity === 1 ? (
            <IconTrash size={12} stroke={2} />
          ) : (
            <IconMinus size={12} stroke={2} />
          )}
        </button>

        {/* تعداد */}
        <span
          className="w-5 text-center text-sm font-bold
                       text-ui-text tabular-nums"
        >
          {toPersianNumber(item.quantity)}
        </span>

        {/* افزایش */}
        <button
          onClick={onIncrease}
          className={cn(
            "flex h-7 w-7 items-center justify-center",
            "rounded-lg transition-all duration-150",
            "bg-brand text-white",
            "hover:brightness-110",
          )}
          aria-label="افزایش"
        >
          <IconPlus size={12} stroke={2} />
        </button>
      </div>
    </div>
  );
}
