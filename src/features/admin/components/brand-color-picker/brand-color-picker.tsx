"use client";

import { useRef } from "react";
import { IconAlertCircle, IconReload } from "@tabler/icons-react";
import { generateBrandShades } from "@/lib/theme/brand-color";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (color: string) => void;
  onReset: () => void;
  isDirty: boolean;
};

export function BrandColorPicker({ value, onChange, onReset, isDirty }: Props) {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const isValidHex = (hex: string) => /^#[0-9A-Fa-f]{6}$/.test(hex);
  const shades = generateBrandShades(value);

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    applyColorPreview(val);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // always call onChange so RHF tracks the value
    onChange(val);
    if (isValidHex(val)) {
      applyColorPreview(val);
    }
  };

  // show error only when hex input is invalid
  const hexError =
    !isValidHex(value) && value !== ""
      ? "فرمت HEX صحیح نیست. مثال: #9333ea"
      : null;

  return (
    <div className="space-y-6">
      {/* ── color picker + hex input ── */}
      <div className="flex items-start gap-4 flex-wrap">
        {/* color swatch */}
        <div className="flex flex-col items-center gap-2">
          <div
            onClick={() => colorInputRef.current?.click()}
            className={cn(
              "relative h-16 w-16 rounded-2xl cursor-pointer",
              "border-4 border-ui-surface shadow-lg",
              "transition-transform duration-200",
              "hover:scale-105 active:scale-95",
              "ring-2 ring-ui-border ring-offset-2",
            )}
            style={{ backgroundColor: isValidHex(value) ? value : "#9333ea" }}
          >
            <input
              ref={colorInputRef}
              type="color"
              value={isValidHex(value) ? value : "#9333ea"}
              onChange={handleColorPickerChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              aria-label="انتخاب رنگ"
            />
          </div>
          <span className="text-xs text-ui-text-muted">کلیک کنید</span>
        </div>

        {/* hex input */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-40">
          <label className="text-xs font-medium text-ui-text-soft">
            کد HEX
          </label>
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-xl border border-ui-border shrink-0
                         transition-colors duration-200"
              style={{
                backgroundColor: isValidHex(value) ? value : "#9333ea",
              }}
            />
            <input
              type="text"
              value={value}
              onChange={handleHexInputChange}
              placeholder="#9333ea"
              maxLength={7}
              dir="ltr"
              className={cn(
                "flex h-9 flex-1 rounded-xl border px-3",
                "bg-ui-surface text-ui-text text-sm font-mono",
                "placeholder:text-ui-text-muted",
                "focus:outline-none focus:ring-2 focus:ring-brand",
                "focus:border-transparent transition-all duration-200",
                hexError ? "border-red-400" : "border-ui-border",
              )}
            />
          </div>

          {hexError && (
            <p
              className="flex items-center gap-1.5 text-xs text-red-500
                          animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <IconAlertCircle size={12} />
              {hexError}
            </p>
          )}
        </div>
      </div>

      {/* ── shade preview ── */}
      <div className="space-y-2">
        <p className="text-xs text-ui-text-muted">پیش‌نمایش شیدها</p>
        <div className="flex gap-3">
          {(
            [
              { shade: shades.subtle, label: "subtle" },
              { shade: shades.light, label: "light" },
              { shade: shades.main, label: "main" },
              { shade: shades.dark, label: "dark" },
            ] as const
          ).map(({ shade, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="h-10 w-10 rounded-xl border border-ui-border
                           transition-colors duration-200"
                style={{ backgroundColor: shade }}
              />
              <span className="text-[10px] text-ui-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── UI preview ── */}
      <div className="rounded-2xl border border-ui-border bg-ui-bg-soft p-4 space-y-3">
        <p className="text-xs text-ui-text-muted">پیش‌نمایش UI</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-medium
                       text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: shades.main }}
          >
            مشاهده منو
          </button>
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ backgroundColor: shades.subtle, color: shades.dark }}
          >
            اکنون باز است
          </span>
          <button
            type="button"
            className="rounded-xl px-4 py-2 text-sm font-medium
                       border-2 transition-opacity hover:opacity-80"
            style={{ borderColor: shades.main, color: shades.main }}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}

function applyColorPreview(hex: string) {
  if (typeof window === "undefined") return;
  import("@/lib/theme/brand-color").then(({ generateBrandShades }) => {
    const shades = generateBrandShades(hex);
    const root = document.documentElement;
    root.style.setProperty("--brand-color", shades.main);
    root.style.setProperty("--brand-color-light", shades.light);
    root.style.setProperty("--brand-color-dark", shades.dark);
    root.style.setProperty("--brand-color-subtle", shades.subtle);
  });
}
