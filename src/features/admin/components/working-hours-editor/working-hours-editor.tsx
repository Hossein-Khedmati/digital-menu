"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { RestaurantFormValues, DayKey } from "../../schemas";
import { DAYS, DEFAULT_FROM, DEFAULT_TO } from "./constants";
import { PersianTimePicker } from "@/components/shared/persian-time-picker";

export function WorkingHoursEditor() {
  const { watch, setValue } = useFormContext<RestaurantFormValues>();
  const workingHours = watch("working_hours");

  const toggleDay = (key: DayKey, checked: boolean) => {
    setValue(
      `working_hours.${key}`,
      {
        open: checked,
        from: checked ? DEFAULT_FROM : "",
        to: checked ? DEFAULT_TO : "",
      },
      { shouldDirty: true },
    );
  };

  const setTime = (key: DayKey, field: "from" | "to", value: string) => {
    setValue(`working_hours.${key}.${field}`, value, { shouldDirty: true });
  };

  return (
    <div className="space-y-2">
      {DAYS.map(({ key, label }) => {
        const day = workingHours?.[key];
        const isOpen = day?.open ?? false;

        return (
          <div
            key={key}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3",
              "border transition-all duration-200",
              isOpen
                ? "border-brand/30 bg-brand/5"
                : "border-ui-border bg-ui-surface",
            )}
          >
            {/* ── checkbox + label ── */}
            <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
              <div
                onClick={() => toggleDay(key, !isOpen)}
                className={cn(
                  "h-5 w-5 rounded-md border-2 cursor-pointer",
                  "flex items-center justify-center",
                  "transition-all duration-150",
                  isOpen
                    ? "bg-brand border-brand"
                    : "bg-ui-surface border-ui-border hover:border-brand/50",
                )}
              >
                {isOpen && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <polyline points="1.5,6 4.5,9 10.5,3" />
                  </svg>
                )}
              </div>
              <span
                className={cn(
                  "text-sm font-medium w-16 select-none",
                  isOpen ? "text-ui-text" : "text-ui-text-muted",
                )}
              >
                {label}
              </span>
            </label>

            {/* ── time inputs ── */}
            {isOpen ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-ui-text-muted shrink-0">
                    از
                  </span>
                  <PersianTimePicker
                    value={day?.from ?? "09:00"}
                    onChange={(v) => setTime(key, "from", v)}
                  />
                </div>

                <span className="text-ui-text-muted text-xs shrink-0">—</span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-ui-text-muted shrink-0">
                    تا
                  </span>
                  <PersianTimePicker
                    value={day?.to ?? "22:00"}
                    onChange={(v) => setTime(key, "to", v)}
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-ui-text-muted flex-1">تعطیل</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
