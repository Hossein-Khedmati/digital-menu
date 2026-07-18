"use client";

import { useState, useRef, useEffect } from "react";
import { IconClock, IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import { cn, toPersianNumber } from "@/lib/utils";

type Props = {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};


function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseTime(val: string): { hour: number; minute: number } {
  const [h, m] = val.split(":").map(Number);
  return {
    hour: isNaN(h) ? 9 : Math.min(23, Math.max(0, h)),
    minute: isNaN(m) ? 0 : Math.min(59, Math.max(0, m)),
  };
}

export function PersianTimePicker({
  value,
  onChange,
  placeholder = "انتخاب ساعت",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const { hour, minute } = parseTime(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── close on outside click ──
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const setHour = (h: number) => onChange(`${pad(h)}:${pad(minute)}`);
  const setMinute = (m: number) => onChange(`${pad(hour)}:${pad(m)}`);

  const incrementHour = () => setHour((hour + 1) % 24);
  const decrementHour = () => setHour((hour + 23) % 24);
  const incrementMinute = () => setMinute((minute + 5) % 60);
  const decrementMinute = () =>
    setMinute(
      Math.floor(minute / 5) * 5 === minute
        ? (minute + 55) % 60
        : Math.floor(minute / 5) * 5,
    );

  const displayValue = value
    ? `${toPersianNumber(hour)}:${toPersianNumber(minute).padStart(2, "۰")}`
    : "";

  return (
    <div ref={containerRef} className="relative">
      {/* ── trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-xl",
          "border border-ui-border bg-ui-surface",
          "text-sm text-ui-text tabular-nums",
          "transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent",
          open && "ring-2 ring-brand border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          !value && "text-ui-text-muted",
        )}
      >
        <IconClock size={14} className="text-ui-text-muted shrink-0" />
        <span className="font-medium min-w-12 text-center">
          {displayValue || placeholder}
        </span>
      </button>

      {/* ── dropdown ── */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2",
            "rounded-2xl border border-ui-border",
            "bg-ui-surface shadow-xl shadow-black/10",
            "p-4",
            "animate-in fade-in slide-in-from-top-2 duration-150",
          )}
          style={{ minWidth: "10rem" }}
        >
          {/* ── label ── */}
          <p className="text-xs text-ui-text-muted text-center mb-3">
            انتخاب ساعت
          </p>

          <div className="flex items-center gap-3 justify-center" dir="ltr">
            {/* ── hour column ── */}
            <SpinnerColumn
              label="ساعت"
              value={hour}
              display={toPersianNumber(hour).padStart(2, "۰")}
              onIncrement={incrementHour}
              onDecrement={decrementHour}
              onScroll={(delta) =>
                delta > 0 ? decrementHour() : incrementHour()
              }
            />

            {/* ── separator ── */}
            <span className="text-2xl font-bold text-ui-text-muted mb-6">
              :
            </span>

            {/* ── minute column ── */}
            <SpinnerColumn
              label="دقیقه"
              value={minute}
              display={toPersianNumber(minute).padStart(2, "۰")}
              onIncrement={incrementMinute}
              onDecrement={decrementMinute}
              onScroll={(delta) =>
                delta > 0 ? decrementMinute() : incrementMinute()
              }
            />
          </div>

          {/* ── quick presets ── */}
          <div className="mt-4 pt-3 border-t border-ui-border">
            <p className="text-[10px] text-ui-text-muted mb-2 text-center">
              انتخاب سریع
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                "08:00",
                "10:00",
                "12:00",
                "13:00",
                "22:00",
                "23:00",
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    onChange(preset);
                    setOpen(false);
                  }}
                  className={cn(
                    "text-xs px-2 py-1 rounded-lg",
                    "border transition-all duration-100",
                    value === preset
                      ? "bg-brand text-white border-brand"
                      : "border-ui-border text-ui-text-muted hover:border-brand hover:text-brand",
                  )}
                >
                  {parseTime(preset).hour}:{pad(parseTime(preset).minute)}
                </button>
              ))}
            </div>
          </div>

          {/* ── confirm ── */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={cn(
              "mt-3 w-full rounded-xl py-2 text-sm font-medium",
              "bg-brand text-white",
              "hover:brightness-110 transition-all duration-150",
            )}
          >
            تأیید
          </button>
        </div>
      )}
    </div>
  );
}

// ── Spinner Column ──
type SpinnerProps = {
  label: string;
  value: number;
  display: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onScroll: (delta: number) => void;
};

function SpinnerColumn({
  label,
  display,
  onIncrement,
  onDecrement,
  onScroll,
}: SpinnerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      onScroll(e.deltaY);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [onScroll]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-ui-text-muted mb-1">{label}</span>

      {/* up */}
      <button
        type="button"
        onClick={onIncrement}
        className={cn(
          "flex h-7 w-10 items-center justify-center rounded-lg",
          "text-ui-text-muted hover:text-brand",
          "hover:bg-ui-bg-muted transition-all duration-100",
        )}
      >
        <IconChevronUp size={16} stroke={2} />
      </button>

      {/* value */}
      <div
        ref={ref}
        className={cn(
          "flex h-12 w-10 items-center justify-center rounded-xl",
          "border-2 border-brand bg-brand/5",
          "text-xl font-bold text-brand tabular-nums",
          "cursor-ns-resize select-none",
        )}
      >
        {display}
      </div>

      {/* down */}
      <button
        type="button"
        onClick={onDecrement}
        className={cn(
          "flex h-7 w-10 items-center justify-center rounded-lg",
          "text-ui-text-muted hover:text-brand",
          "hover:bg-ui-bg-muted transition-all duration-100",
        )}
      >
        <IconChevronDown size={16} stroke={2} />
      </button>
    </div>
  );
}
