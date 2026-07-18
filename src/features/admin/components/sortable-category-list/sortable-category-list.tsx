"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import {
  IconGripVertical,
  IconTag,
  IconArrowBackUp,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { updateCategoriesOrderAction } from "../../actions/order.actions";
import { CategoryModal } from "../category-modal/category-modal";
import { SearchBox } from "../search-box/search-box";
import { useSearch } from "../../hooks/use-search";
import { useIsMounted } from "../../../../hooks/use-is-mounted";
import { Button } from "@/components/ui/button";
import { cn, toPersianNumber } from "@/lib/utils";
import type { Tables } from "@/types/database.types";
import { Props } from "./types";
import { SortableCategoryRow, StaticCategoryRow } from "./category-row";

export function SortableCategoryList({ categories, restaurantId }: Props) {
  const [items, setItems] = useState(categories);
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isMounted = useIsMounted();

  const { query, setQuery, filtered } = useSearch(items);
  const isSearching = !!query;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id);
      const newIndex = prev.findIndex((i) => i.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    setIsDirty(true);
  };

  const handleSaveOrder = () => {
    startTransition(async () => {
      const payload = items.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));
      const result = await updateCategoriesOrderAction(payload);
      if (result.success) {
        toast.success("ترتیب دسته‌بندی‌ها با موفقیت ذخیره شد");
        setIsDirty(false);
      } else {
        toast.error(result.error ?? "خطا در ذخیره ترتیب");
      }
    });
  };

  const handleDiscardOrder = () => {
    setItems(categories);
    setIsDirty(false);
    toast("ترتیب به حالت قبل برگشت", { icon: "↩️" });
  };

  const handleCreated = (newCategory: Tables<"categories">) => {
    setItems((prev) => [...prev, newCategory]);
  };

  const handleUpdated = (updatedCategory: Tables<"categories">) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedCategory.id ? updatedCategory : item,
      ),
    );
  };

  const handleDeleted = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── shared row props ──
  const rowProps = (cat: Tables<"categories">) => ({
    category: cat,
    restaurantId,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
  });

  return (
    <div className="space-y-4">
      {/* ── نوار ابزار ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder="جستجو در دسته‌بندی‌ها..."
          className="flex-1 min-w-[200px]"
        />
        <CategoryModal restaurantId={restaurantId} onCreated={handleCreated} />
      </div>

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
          {toPersianNumber(filtered.length)} دسته‌بندی
          {isSearching && ` از ${toPersianNumber(items.length)}`}
        </span>
        {isSearching && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-brand hover:underline transition-colors"
          >
            پاک کردن فیلترها
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState message="هنوز دسته‌بندی ندارید" />
      ) : filtered.length === 0 ? (
        <EmptyState message={`نتیجه‌ای برای «${query}» یافت نشد`} />
      ) : !isMounted ? (
        <div className="space-y-2">
          {filtered.map((cat) => (
            <StaticCategoryRow key={cat.id} {...rowProps(cat)} />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {filtered.map((cat) => (
                <SortableCategoryRow
                  key={cat.id}
                  {...rowProps(cat)}
                  isSearching={isSearching}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
      <IconTag
        size={40}
        stroke={1.5}
        className="mx-auto text-ui-text-muted mb-3"
      />
      <p className="text-ui-text-muted text-sm">{message}</p>
    </div>
  );
}
