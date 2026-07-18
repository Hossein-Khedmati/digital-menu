"use client";

import Image from "next/image";
import { IconPlus, IconMinus, IconToolsKitchen2 } from "@tabler/icons-react";
import { useCartStore } from "@/features/cart/store/cart-store";
import { formatPrice, cn, toPersianNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Props } from "./types";


export function MenuItemCard({ item }: Props) {
  const { items, addItem, increaseQty, decreaseQty } = useCartStore();

  const cartItem = items.find((i) => i.id === item.id);
  const qty = cartItem?.quantity ?? 0;
  const hasDiscount = item.discounted_price != null;
  const effectivePrice = item.discounted_price ?? item.base_price;

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      base_price: item.base_price,
      discounted_price: item.discounted_price,
      image_url: item.image_url,
    });
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl overflow-hidden",
        "border border-ui-border bg-ui-surface",
        "shadow-sm hover:shadow-lg transition-all duration-300",
        !item.is_available && "opacity-60",
      )}
    >
      {/* تصویر */}
      <div className="relative h-44 w-full bg-ui-bg-muted overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105
                       transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <IconToolsKitchen2 className="size-16 text-ui-text-muted" />
          </div>
        )}

        {/* نشان تخفیف */}
        {hasDiscount && (
          <Badge
          variant="destructive"
            className="absolute top-3 right-3"
          >
            تخفیف %
          </Badge>
        )}

        {/* ناموجود */}
        {!item.is_available && (
          <div
            className="absolute inset-0 flex items-center justify-center
                          bg-black/30 backdrop-blur-[2px]"
          >
            <span
              className="rounded-2xl bg-ui-surface/90 px-4 py-2
                             text-sm font-semibold text-ui-text shadow"
            >
              موجود نیست
            </span>
          </div>
        )}
      </div>

      {/* اطلاعات */}
      <div className="flex flex-col flex-1 p-4 gap-3 bg-brand dark:bg-transparent">
        <div className="flex-1">
          <h3 className="font-bold text-ui-text text-sm leading-snug line-clamp-1.5">
            {item.name}
          </h3>
          {item.description && (
            <p
              className="mt-1 text-xs text-ui-text/80
                          leading-relaxed line-clamp-3"
            >
              {item.description}
            </p>
          )}
        </div>

        {/* قیمت + کنترل */}
        <div className="flex items-center justify-between gap-2 max-sm:flex-col max-sm:items-start">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-ui-text/50 line-through">
                {formatPrice(item.base_price)}
              </span>
            )}
            <span className="text-sm font-bold text-ui-text">
              {formatPrice(effectivePrice)}
            </span>
          </div>

          {item.is_available &&
            (qty === 0 ? (
              <Button
                onClick={handleAdd}
                variant="ghost"
                className="p-0 flex h-9 w-9 items-center justify-center
                           rounded-xl bg-brand-dark text-white
                           hover:scale-110 active:scale-95
                           transition-all duration-250 shadow-md border border-brand-light dark:border-none"
                aria-label={`افزودن ${item.name}`}
              >
                <IconPlus className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => decreaseQty(item.id)}
                  variant="outline"
                  className="p-0 flex h-8 w-8 items-center justify-center
                  bg-ui-surface
                             rounded-xl border-2 border-brand-dark text-brand-dark
                             active:scale-95
                             transition-all duration-250"
                >
                  <IconMinus className="h-3.5 w-3.5" />
                </Button>
                <span
                  className="w-5 text-center text-sm font-bold
                                 text-ui-text tabular-nums"
                >
                  {toPersianNumber(qty)}
                </span>
                <Button
                  onClick={() => increaseQty(item.id)}
                  variant="ghost"
                  className="p-0 flex h-8 w-8 items-center justify-center
                           rounded-xl bg-brand-dark text-white
                            active:scale-95
                           transition-all duration-250 shadow-md border border-brand-light dark:border-none"
                >
                  <IconPlus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
