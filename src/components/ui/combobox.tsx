"use client";

import { useState, useRef, useEffect } from "react";
import { Command as CommandPrimitive } from "cmdk";
import {
  IconCheck,
  IconChevronDown,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
  icon?: string;
};

type Props = {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید...",
  searchPlaceholder = "جستجو...",
  emptyMessage = "نتیجه‌ای یافت نشد",
  error,
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // ── بستن با کلیک بیرون ──
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── بستن با Escape ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // ── focus روی input هنگام باز شدن ──
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  // ── فیلتر options ──
  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* ── Trigger ── */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-11 w-full items-center justify-between",
          "rounded-xl border px-4 py-2 text-sm text-right",
          "bg-ui-surface text-ui-text border-ui-border",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-brand",
          "focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-brand border-transparent",
          error && "border-red-400 focus:ring-red-400",
        )}
      >
        {/* مقدار انتخاب‌شده */}
        <span
          className={cn(
            "flex items-center gap-2 truncate",
            !selected && "text-ui-text-muted",
          )}
        >
          {selected ? (
            <>
              {selected.icon && (
                <span className="text-base leading-none shrink-0">
                  {selected.icon}
                </span>
              )}
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>

        {/* آیکون‌های سمت چپ */}
        <span className="flex items-center gap-1 shrink-0 mr-2">
          {/* دکمه پاک کردن */}
          {selected && !disabled && (
            <span
              role="button"
              onClick={handleClear}
              className="flex h-5 w-5 items-center justify-center
                         rounded-full text-ui-text-muted
                         hover:text-ui-text hover:bg-ui-bg-muted
                         transition-colors"
            >
              <IconX size={12} stroke={2.5} />
            </span>
          )}
          <IconChevronDown
            size={16}
            stroke={2}
            className={cn(
              "text-ui-text-muted transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </span>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-1",
            "rounded-2xl border border-ui-border bg-ui-surface shadow-lg",
            "overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          <CommandPrimitive
            filter={() => 1} // فیلتر دستی انجام می‌دهیم
            className="flex flex-col"
          >
            {/* ── Search Input ── */}
            <div
              className="flex items-center gap-2 border-b
                            border-ui-border px-3 py-2.5"
            >
              <IconSearch size={15} className="text-ui-text-muted shrink-0" />
              <CommandPrimitive.Input
                ref={inputRef}
                value={search}
                onValueChange={setSearch}
                placeholder={searchPlaceholder}
                className={cn(
                  "flex-1 bg-transparent text-sm text-ui-text",
                  "placeholder:text-ui-text-muted",
                  "outline-none border-none",
                  "text-right",
                )}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-ui-text-muted hover:text-ui-text
                             transition-colors"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>

            {/* ── لیست گزینه‌ها ── */}
            <CommandPrimitive.List className="max-h-56 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <CommandPrimitive.Empty className="py-8 text-center text-sm text-ui-text-muted">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : (
                filtered.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <CommandPrimitive.Item
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "relative flex items-center gap-2.5",
                        "rounded-xl px-3 py-2.5 text-sm cursor-pointer",
                        "transition-colors duration-100",
                        "outline-none select-none",
                        isSelected
                          ? "bg-brand-subtle text-brand-dark font-medium"
                          : "text-ui-text hover:bg-ui-bg-muted",
                      )}
                    >
                      {/* آیکون گزینه */}
                      {option.icon && (
                        <span className="text-base leading-none shrink-0">
                          {option.icon}
                        </span>
                      )}

                      {/* نام گزینه */}
                      <span className="flex-1 truncate">{option.label}</span>

                      {/* تیک انتخاب */}
                      {isSelected && (
                        <IconCheck
                          size={15}
                          stroke={2.5}
                          className="text-brand shrink-0"
                        />
                      )}
                    </CommandPrimitive.Item>
                  );
                })
              )}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </div>
      )}
    </div>
  );
}
