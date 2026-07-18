"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: DrawerProps) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
          "transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm",
          "flex flex-col shadow-2xl",
          // ✅ theme-aware
          "bg-ui-surface border-l border-ui-border",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* هدر */}
        <div
          className="flex items-center justify-between
                        border-b border-ui-border px-5 py-4 shrink-0"
        >
          <h2 className="text-base font-bold text-ui-text">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center
                       rounded-xl text-ui-text-muted
                       hover:text-ui-text hover:bg-ui-bg-muted
                       transition-all duration-150"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* فوتر */}
        {footer && (
          <div className="shrink-0 border-t border-ui-border px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
