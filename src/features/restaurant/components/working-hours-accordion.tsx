// features/restaurant/components/working-hours-accordion.tsx
"use client";

import { useState } from "react";
import { IconClock, IconChevronDown } from "@tabler/icons-react";
import { cn, toPersianNumber } from "@/lib/utils";

const DAY_KEYS = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

const DAY_LABELS: Record<string, string> = {
  saturday:  "شنبه",
  sunday:    "یکشنبه",
  monday:    "دوشنبه",
  tuesday:   "سه‌شنبه",
  wednesday: "چهارشنبه",
  thursday:  "پنجشنبه",
  friday:    "جمعه",
};

type DaySchedule = {
  open: boolean;
  from: string;
  to:   string;
};

type Props = {
  hours:    Record<string, DaySchedule>;
  todayKey: string;
  openNow:  boolean;
};

export function WorkingHoursAccordion({ hours, todayKey, openNow }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const today    = hours[todayKey];
  const isActive = today?.open && today.from && today.to;

  return (
    <div
      className={cn(
        "rounded-3xl border border-ui-border bg-ui-surface",
        "shadow-sm mb-4 overflow-hidden",
      )}
    >
      {/* ── trigger ── */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "w-full flex items-center justify-between",
          "px-5 py-4 text-right",
          "hover:bg-ui-bg-muted/50 transition-colors duration-150",
        )}
      >
        {/* left side */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center
                         rounded-xl bg-ui-bg-muted shrink-0"
          >
            <IconClock size={15} stroke={2} className="text-brand" />
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-ui-text">ساعات کاری</p>
            {/* today's hours summary */}
            <p className="text-xs text-ui-text-muted mt-0.5">
              {isActive
                ? `امروز: ${toPersianNumber(today.from)} – ${toPersianNumber(today.to)}`
                : "امروز تعطیل"}
            </p>
          </div>
        </div>

        {/* right side */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full",
              openNow
                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400",
            )}
          >
            {openNow ? "باز" : "بسته"}
          </span>

          <IconChevronDown
            size={16}
            stroke={2}
            className={cn(
              "text-ui-text-muted transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* ── content ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-5 pb-4 space-y-1.5 border-t border-ui-border pt-3">
          {DAY_KEYS.map((key) => {
            const day     = hours[key];
            const isToday = key === todayKey;
            const dayOpen = day?.open && day.from && day.to;

            return (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between",
                  "rounded-xl px-3 py-2",
                  isToday
                    ? "bg-brand/8 border border-brand/20"
                    : "hover:bg-ui-bg-muted/50 transition-colors",
                )}
              >
                {/* day name */}
                <div className="flex items-center gap-2">
                  {isToday && (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-brand
                                   animate-pulse shrink-0"
                    />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isToday ? "text-brand" : "text-ui-text",
                    )}
                  >
                    {DAY_LABELS[key]}
                    {isToday && (
                      <span className="text-xs text-brand/70 mr-1.5">
                        (امروز)
                      </span>
                    )}
                  </span>
                </div>

                {/* hours or closed */}
                {dayOpen ? (
                  <span
                    className={cn(
                      "text-sm",
                      isToday
                        ? "text-brand font-semibold"
                        : "text-ui-text-muted",
                    )}
                    dir="ltr"
                  >
                    {toPersianNumber(day.from)} – {toPersianNumber(day.to)}
                  </span>
                ) : (
                  <span className="text-xs text-red-500">تعطیل</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}