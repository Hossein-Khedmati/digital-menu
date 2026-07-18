import { useSortable } from "@dnd-kit/sortable";
import { ItemRowProps, ItemRowPropsWithoutSearch } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { cn, formatPrice } from "@/lib/utils";
import {
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconToolsKitchen2,
} from "@tabler/icons-react";
import { MenuItemModal } from "../menu-item-modal/menuItem-modal";
import { DeleteBtn } from "../delete-button/delete-button";
import { deleteMenuItemAction } from "../../actions/menu-item.actions";
import Image from "next/image";

export function SortableMenuItemRow({
  item,
  restaurantId,
  userId,
  categories,
  isSearching,
  onUpdated,
  onDeleted,
}: ItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: isSearching });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasDiscount = item.discounted_price != null;
  const effectivePrice = item.discounted_price ?? item.base_price;
  const cat = item.categories;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-2xl",
        "border border-ui-border bg-ui-surface",
        "px-4 py-3 shadow-sm",
        "transition-all duration-200",
        isDragging
          ? "shadow-xl border-brand bg-brand-subtle/30 z-50 scale-[1.01]"
          : "hover:shadow-md",
      )}
    >
      {/* ── دستگیره Drag ── */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "flex h-8 w-8 items-center justify-center",
          "rounded-lg shrink-0 text-ui-text-muted",
          "transition-colors",
          isSearching
            ? "cursor-not-allowed opacity-30"
            : [
                "cursor-grab active:cursor-grabbing",
                "hover:text-ui-text hover:bg-ui-bg-muted",
              ],
        )}
        title={
          isSearching ? "برای drag، فیلتر را پاک کنید" : "drag برای جابجایی"
        }
      >
        <IconGripVertical size={16} stroke={2} />
      </button>

      {/* ── تصویر ── */}
      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-ui-bg-muted shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
            width={1000}
            height={1000}
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
        <p className="font-medium text-ui-text text-sm truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {cat && (
            <span className="text-xs text-ui-text-muted">
              {cat.icon} {cat.name}
            </span>
          )}
          {cat && <span className="text-ui-border">·</span>}
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-xs line-through text-ui-text-muted">
                {formatPrice(item.base_price)}
              </span>
            )}
            <span
              className={cn(
                "text-xs font-semibold",
                hasDiscount ? "text-brand" : "text-ui-text",
              )}
            >
              {formatPrice(effectivePrice)}
            </span>
          </div>
        </div>
      </div>

      {/* ── badge وضعیت ── */}
      <div className="flex flex-col gap-1 shrink-0">
        <span
          className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
            item.is_active
              ? "bg-green-100 text-green-700"
              : "bg-ui-bg-muted text-ui-text-muted",
          )}
        >
          {item.is_active ? (
            <>
              <IconEye size={11} />
              نمایش
            </>
          ) : (
            <>
              <IconEyeOff size={11} />
              مخفی
            </>
          )}
        </span>
        <span
          className={cn(
            "flex items-center justify-center gap-1",
            "text-xs px-2 py-0.5 rounded-full",
            item.is_available
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-600",
          )}
        >
          {item.is_available ? "موجود" : "ناموجود"}
        </span>
      </div>

      {/* ── اکشن‌ها ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <MenuItemModal
          restaurantId={restaurantId}
          userId={userId}
          categories={categories}
          item={item}
          onUpdated={onUpdated}
        />
        <DeleteBtn
          action={deleteMenuItemAction.bind(null, item.id, restaurantId)}
          onDeleted={() => onDeleted(item.id)}
          title={`حذف آیتم "${item.name}"`}
        />
      </div>
    </div>
  );
}

export function StaticMenuItemRow({
  item,
  restaurantId,
  userId,
  categories,
  onUpdated,
  onDeleted,
}: ItemRowPropsWithoutSearch) {
  const hasDiscount = item.discounted_price != null;
  const effectivePrice = item.discounted_price ?? item.base_price;
  const cat = item.categories;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl",
        "border border-ui-border bg-ui-surface",
        "px-4 py-3 shadow-sm",
      )}
    >
      {/* drag handle — inert */}
      <div
        className="flex h-8 w-8 items-center justify-center
                     rounded-lg shrink-0 text-ui-text-muted opacity-30"
      >
        <IconGripVertical size={16} stroke={2} />
      </div>

      {/* ── تصویر ── */}
      <div
        className="relative h-12 w-12 rounded-xl overflow-hidden
                      bg-ui-bg-muted shrink-0"
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            className="h-full w-full object-cover"
            width={1000}
            height={1000}
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
        <p className="font-medium text-ui-text text-sm truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {cat && (
            <span className="text-xs text-ui-text-muted">
              {cat.icon} {cat.name}
            </span>
          )}
          {cat && <span className="text-ui-border">·</span>}
          <div className="flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-xs line-through text-ui-text-muted">
                {formatPrice(item.base_price)}
              </span>
            )}
            <span
              className={cn(
                "text-xs font-semibold",
                hasDiscount ? "text-brand" : "text-ui-text",
              )}
            >
              {formatPrice(effectivePrice)}
            </span>
          </div>
        </div>
      </div>

      {/* ── badge وضعیت ── */}
      <div className="flex flex-col gap-1 shrink-0">
        <span
          className={cn(
            "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
            item.is_active
              ? "bg-green-100 text-green-700"
              : "bg-ui-bg-muted text-ui-text-muted",
          )}
        >
          {item.is_active ? (
            <>
              <IconEye size={11} />
              نمایش
            </>
          ) : (
            <>
              <IconEyeOff size={11} />
              مخفی
            </>
          )}
        </span>
        <span
          className={cn(
            "flex items-center justify-center gap-1",
            "text-xs px-2 py-0.5 rounded-full",
            item.is_available
              ? "bg-blue-100 text-blue-700"
              : "bg-red-100 text-red-600",
          )}
        >
          {item.is_available ? "موجود" : "ناموجود"}
        </span>
      </div>

      {/* ── اکشن‌ها ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <MenuItemModal
          restaurantId={restaurantId}
          userId={userId}
          categories={categories}
          item={item}
          onUpdated={onUpdated}
        />
        <DeleteBtn
          action={deleteMenuItemAction.bind(null, item.id, restaurantId)}
          onDeleted={() => onDeleted(item.id)}
          title="حذف آیتم منو"
          description={`آیتم «${item.name}» برای همیشه حذف می‌شود.`}
        />
      </div>
    </div>
  );
}
