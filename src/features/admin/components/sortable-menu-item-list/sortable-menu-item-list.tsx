"use client";

import { useState, useTransition, useRef } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import {
  IconGripVertical,
  IconEye,
  IconEyeOff,
  IconToolsKitchen2,
  IconArrowBackUp,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { updateMenuItemsOrderAction } from "../../actions/order.actions";
import { deleteMenuItemAction } from "../../actions/menu-item.actions";
import { MenuItemModal } from "../menu-item-modal/menuItem-modal";
import { SearchBox } from "../search-box/search-box";
import { DeleteBtn } from "../delete-button/delete-button";
import { FilterChips } from "@/features/admin/components/filter-chips/filter-chips";
import { FilterChipOption } from "@/features/admin/components/filter-chips/types";
import { useSearch } from "../../hooks/use-search";
import { useIsMounted } from "../../../../hooks/use-is-mounted";
import { Button } from "@/components/ui/button";
import { formatPrice, cn, toPersianNumber } from "@/lib/utils";
import type { Tables } from "@/types/database.types";
import { SortableMenuItemRow, StaticMenuItemRow } from "./menu-item-row";

// ── Types ──
type MenuItemWithCategory = Tables<"menu_items"> & {
  categories: { name: string; icon: string | null } | null;
};

type Props = {
  items: MenuItemWithCategory[];
  categories: Tables<"categories">[];
  restaurantId: string;
  userId: string;
};

export function SortableMenuItemList({
  items: initialItems,
  categories,
  restaurantId,
  userId,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isMounted = useIsMounted();

  // ── فیلتر دسته‌بندی ──
  const [activeCatFilter, setActiveCatFilter] = useState<string>("all");

  // ── سرچ ──
  const { query, setQuery, filtered: searchFiltered } = useSearch(items);

  // ── فیلتر دسته روی نتایج سرچ ──
  const filtered = searchFiltered.filter((item) =>
    activeCatFilter === "all" ? true : item.category_id === activeCatFilter,
  );

  const isSearching = !!query || activeCatFilter !== "all";

  const handleDragEnd = (event: any) => {
    setItems((prev) => {
      const next = move(prev, event);

      const orderChanged = next.some(
        (item, index) => item.id !== prev[index].id,
      );
      if (orderChanged) {
        setIsDirty(true);
      }

      return next;
    });
  };
  // ── ذخیره ترتیب ──
  const handleSaveOrder = () => {
    startTransition(async () => {
      const payload = items.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));
      const result = await updateMenuItemsOrderAction(payload);
      if (result.success) {
        toast.success("ترتیب آیتم‌ها با موفقیت ذخیره شد");
        setIsDirty(false);
      } else {
        toast.error(result.error ?? "خطا در ذخیره ترتیب");
      }
    });
  };

  // ── discard ترتیب ──
  const handleDiscardOrder = () => {
    setItems(initialItems);
    setIsDirty(false);
    toast("ترتیب به حالت قبل برگشت", { icon: "↩️" });
  };

  // ── callbacks ──
  const handleCreated = (newItem: Tables<"menu_items">) => {
    setItems((prev) => [...prev, newItem as MenuItemWithCategory]);
  };

  const handleUpdated = (updatedItem: Tables<"menu_items">) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === updatedItem.id
          ? { ...updatedItem, categories: i.categories }
          : i,
      ),
    );
  };

  const handleDeleted = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // ── filter options ──
  const filterOptions: FilterChipOption[] = [
    { value: "all", label: "🍽️ همه" },
    ...categories.map((cat) => ({
      value: cat.id,
      label: `${cat.icon ?? ""} ${cat.name}`.trim(),
    })),
  ];

  // ── shared row props ──
  const rowProps = (item: MenuItemWithCategory, index: number) => ({
    item,
    restaurantId,
    userId,
    categories,
    index,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
  });

  return (
    <div className="space-y-4">
      {/* ── نوار ابزار ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBox
          value={query}
          onChange={(v) => {
            setQuery(v);
            setActiveCatFilter("all");
          }}
          placeholder="جستجو در آیتم‌های منو..."
          className="flex-1 min-w-[200px]"
        />
        <MenuItemModal
          restaurantId={restaurantId}
          userId={userId}
          categories={categories}
          onCreated={handleCreated}
        />
      </div>

      {/* ── فیلتر دسته‌بندی ── */}
      {categories.length > 0 && (
        <FilterChips
          options={filterOptions}
          value={activeCatFilter}
          onChange={(val) => {
            setActiveCatFilter(val);
            setQuery("");
          }}
        />
      )}

      {/* ── پیام تغییر ترتیب ── */}
      {isDirty && (
        <div
          className={cn(
            "flex items-center justify-between",
            "rounded-xl border border-amber-200 bg-amber-50",
            "px-4 py-2.5",
            "animate-in fade-in slide-in-from-top-1 duration-300",
          )}
        >
          <p className="text-sm text-amber-700 flex items-center gap-2">
            <IconGripVertical size={16} />
            ترتیب تغییر کرده
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDiscardOrder}
              disabled={isPending}
              className="text-amber-700 hover:bg-amber-100 hover:text-amber-800 h-8 px-3"
            >
              <IconArrowBackUp size={15} stroke={2} />
              انصراف
            </Button>
            <Button
              type="button"
              size="sm"
              loading={isPending}
              onClick={handleSaveOrder}
              className="h-8 px-3 bg-amber-500 hover:bg-amber-600"
            >
              <IconDeviceFloppy size={15} stroke={2} />
              {isPending ? "ذخیره..." : "ذخیره ترتیب"}
            </Button>
          </div>
        </div>
      )}

      {/* ── آمار ── */}
      <div className="flex items-center justify-between text-xs text-ui-text-muted">
        <span>
          {toPersianNumber(filtered.length)} آیتم
          {isSearching && ` از ${toPersianNumber(items.length)}`}
        </span>
        {isSearching && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCatFilter("all");
            }}
            className="text-brand hover:underline transition-colors"
          >
            پاک کردن فیلترها
          </button>
        )}
      </div>

      {/* ── لیست ── */}
      {items.length === 0 ? (
        <EmptyState message="هنوز آیتمی ندارید" />
      ) : filtered.length === 0 ? (
        <EmptyState message="آیتمی با این مشخصات یافت نشد" />
      ) : !isMounted ? (
        <div className="space-y-2">
          {filtered.map((item) => (
            <StaticMenuItemRow key={item.id} {...rowProps(item, 0)} />
          ))}
        </div>
      ) : (
        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className="space-y-2">
            {filtered.map((item, index) => (
              <SortableMenuItemRow
                key={item.id}
                {...rowProps(item, index)}
                isSearching={isSearching}
              />
            ))}
          </div>
        </DragDropProvider>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-dashed",
        "border-ui-border bg-ui-surface",
        "p-12 text-center",
      )}
    >
      <IconToolsKitchen2
        size={40}
        stroke={1.5}
        className="mx-auto text-ui-text-muted mb-3"
      />
      <p className="text-ui-text-muted text-sm">{message}</p>
    </div>
  );
}
