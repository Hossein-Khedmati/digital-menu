"use client";

import { useTheme } from "@/lib/theme/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    setTheme(
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light",
    );
  };

  const Icon =
    theme === "dark"
      ? IconMoon
      : theme === "system"
        ? IconDeviceDesktop
        : IconSun;

  const label =
    theme === "dark" ? "تم تاریک" : theme === "system" ? "تم سیستم" : "تم روشن";

  return (
    <Button onClick={cycle} size="icon" aria-label={label} variant="default">
      <Icon className="size-5" />
    </Button>
  );
}

// ── سه‌گانه برای صفحه تنظیمات ──
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "روشن", icon: IconSun },
    { value: "system", label: "سیستم", icon: IconDeviceDesktop },
    { value: "dark", label: "تاریک", icon: IconMoon },
  ] as const;

  return (
    <div
      className={cn(
        "inline-flex gap-1 rounded-xl p-1",
        "bg-ui-bg-muted border border-ui-border",
        className,
      )}
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer",
            "text-xs font-medium transition-all duration-200",
            theme === value
              ? "bg-ui-surface text-ui-text shadow-sm"
              : "text-ui-text-soft hover:text-ui-text",
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" />
          {label}
        </button>
      ))}
    </div>
  );
}
