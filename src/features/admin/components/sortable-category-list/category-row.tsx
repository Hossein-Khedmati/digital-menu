import { useRef, useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
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
import { RowProps, RowPropsWithoutSearch } from "./types";

export function SortableCategoryRow({
  category,
  restaurantId,
  index,
  isSearching,
  onUpdated,
  onDeleted,
}: RowProps & { index: number }) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);

  const { isDragging } = useSortable({
    id: category.id,
    index,
    element,
    handle: handleRef,
    disabled: isSearching,
  });

  return (
    <div
      ref={setElement}
      className={cn(
        "flex items-center gap-2 rounded-2xl",
        "border border-ui-border bg-ui-surface",
        "px-3 py-3 shadow-sm",
        "transition-all duration-200",
        isDragging
          ? "shadow-xl border-brand bg-brand-subtle/30 z-50 scale-[1.01]"
          : "hover:shadow-md",
      )}
    >
      {/* Drag Handle */}
      <button
        ref={handleRef}
        className={cn(
          "flex h-8 w-6 items-center justify-center",
          "rounded-lg shrink-0 text-ui-text-muted",
          "transition-colors select-none",
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

      {/* Icon + Name + Badge (mobile: badge under name) */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-ui-bg-muted flex items-center justify-center shrink-0">
          {category.icon ? (
            <span className="text-lg sm:text-xl leading-none">
              {category.icon}
            </span>
          ) : (
            <IconTag size={16} stroke={1.5} className="text-ui-text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <p className="font-medium text-ui-text text-sm truncate">
            {category.name}
          </p>

          {/* Status badge — mobile only (under name) */}
          <span
            className={cn(
              "sm:hidden self-start",
              "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full",
              category.is_active
                ? "bg-green-100 text-green-700"
                : "bg-ui-bg-muted text-ui-text-muted",
            )}
          >
            {category.is_active ? (
              <>
                <IconEye size={10} />
                فعال
              </>
            ) : (
              <>
                <IconEyeOff size={10} />
                غیرفعال
              </>
            )}
          </span>
        </div>
      </div>

      {/* Status Badge — sm and above */}
      <span
        className={cn(
          "hidden sm:flex items-center gap-1 w-fit",
          "text-xs px-2 py-0.5 rounded-full shrink-0",
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

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
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
        "flex items-center gap-2 rounded-2xl",
        "border border-ui-border bg-ui-surface",
        "px-3 py-3 shadow-sm",
      )}
    >
      {/* Inert drag handle */}
      <div
        className="flex h-8 w-6 items-center justify-center
                     rounded-lg shrink-0 text-ui-text-muted opacity-30"
      >
        <IconGripVertical size={16} stroke={2} />
      </div>

      {/* Icon + Name + Badge (mobile: badge under name) */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-ui-bg-muted flex items-center justify-center shrink-0">
          {category.icon ? (
            <span className="text-lg sm:text-xl leading-none">
              {category.icon}
            </span>
          ) : (
            <IconTag size={16} stroke={1.5} className="text-ui-text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <p className="font-medium text-ui-text text-sm truncate">
            {category.name}
          </p>

          {/* Status badge — mobile only */}
          <span
            className={cn(
              "sm:hidden self-start",
              "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full",
              category.is_active
                ? "bg-green-100 text-green-700"
                : "bg-ui-bg-muted text-ui-text-muted",
            )}
          >
            {category.is_active ? (
              <>
                <IconEye size={10} />
                فعال
              </>
            ) : (
              <>
                <IconEyeOff size={10} />
                غیرفعال
              </>
            )}
          </span>
        </div>
      </div>

      {/* Status Badge — sm and above */}
      <span
        className={cn(
          "hidden sm:flex items-center gap-1 w-fit",
          "text-xs px-2 py-0.5 rounded-full shrink-0",
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

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
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
