import { useSortable } from "@dnd-kit/sortable";
import { RowProps, RowPropsWithoutSearch } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconTag,
} from "@tabler/icons-react";
import { CategoryModal } from "../category-modal/category-modal";
import { DeleteBtn } from "../delete-button/delete-button";
import { deleteCategoryAction } from "../../actions/category.actions";

export function SortableCategoryRow({
  category,
  restaurantId,
  isSearching,
  onUpdated,
  onDeleted,
}: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: isSearching });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
        title={isSearching ? "برای drag، سرچ را پاک کنید" : "drag برای جابجایی"}
      >
        <IconGripVertical size={16} stroke={2} />
      </button>

      {/* ── آیکون + نام ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="h-10 w-10 rounded-xl bg-ui-bg-muted
                        flex items-center justify-center shrink-0"
        >
          {category.icon ? (
            <span className="text-xl leading-none">{category.icon}</span>
          ) : (
            <IconTag size={18} stroke={1.5} className="text-ui-text-muted" />
          )}
        </div>
        <p className="font-medium text-ui-text text-sm truncate">
          {category.name}
        </p>
      </div>

      {/* ── badge وضعیت ── */}
      <span
        className={cn(
          "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0",
          category.is_active
            ? "bg-green-100 text-green-700"
            : "bg-ui-bg-muted text-ui-text-muted",
        )}
      >
        {category.is_active ? (
          <>
            <IconEye size={11} />
            فعال
          </>
        ) : (
          <>
            <IconEyeOff size={11} />
            غیرفعال
          </>
        )}
      </span>

      {/* ── اکشن‌ها ── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <CategoryModal
          restaurantId={restaurantId}
          category={category}
          onUpdated={onUpdated}
        />
        <DeleteBtn
          action={deleteCategoryAction.bind(null, category.id, restaurantId)}
          onDeleted={() => onDeleted(category.id)}
          title={`حذف آیتم "${category.name}"`}
        />
      </div>
    </div>
  );
}

export function StaticCategoryRow({
  category,
  restaurantId,
  onUpdated,
  onDeleted,
}: RowPropsWithoutSearch) {
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

      {/* آیکون + نام */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="h-10 w-10 rounded-xl bg-ui-bg-muted
                        flex items-center justify-center shrink-0"
        >
          {category.icon ? (
            <span className="text-xl leading-none">{category.icon}</span>
          ) : (
            <IconTag size={18} stroke={1.5} className="text-ui-text-muted" />
          )}
        </div>
        <p className="font-medium text-ui-text text-sm truncate">
          {category.name}
        </p>
      </div>

      {/* badge وضعیت */}
      <span
        className={cn(
          "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0",
          category.is_active
            ? "bg-green-100 text-green-700"
            : "bg-ui-bg-muted text-ui-text-muted",
        )}
      >
        {category.is_active ? (
          <>
            <IconEye size={11} /> فعال
          </>
        ) : (
          <>
            <IconEyeOff size={11} /> غیرفعال
          </>
        )}
      </span>

      {/* اکشن‌ها */}
      <div className="flex items-center gap-1.5 shrink-0">
        <CategoryModal
          restaurantId={restaurantId}
          category={category}
          onUpdated={onUpdated}
        />
        <DeleteBtn
          action={deleteCategoryAction.bind(null, category.id, restaurantId)}
          onDeleted={() => onDeleted(category.id)}
          title="حذف دسته‌بندی"
          description={`دسته‌بندی «${category.name}» برای همیشه حذف می‌شود.`}
        />
      </div>
    </div>
  );
}
