"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconLoader2,
} from "@tabler/icons-react";
import { DashboardTabsProps, Tab } from "./types";
import { tabs } from "./constants";


export function DashboardTabs({ currentTab, children }: DashboardTabsProps) {
  const router = useRouter();
  const [loadingTab, setLoadingTab] = useState<Tab | null>(null);

  useEffect(() => {
    setLoadingTab(null);
  }, [currentTab]);

  const handleTabClick = (key: Tab) => {
    if (key === currentTab || loadingTab !== null) return;
    setLoadingTab(key);
    router.push(`/admin/dashboard?tab=${key}`);
  };

  const isLoading = loadingTab !== null;

  return (
    <>
      {/* ── Tabs Nav ── */}
      <nav
        className={cn(
          "flex gap-1 mb-8",
          "rounded-2xl p-1",
          "bg-ui-bg-muted",
          "border border-ui-border",
        )}
      >
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = currentTab === key;
          const isTabLoading = loadingTab === key;

          return (
            <button
              key={key}
              onClick={() => handleTabClick(key)}
              disabled={isLoading}
              className={cn(
                "flex flex-1 items-center justify-center gap-2",
                "rounded-xl px-4 py-2.5",
                "text-sm font-medium",
                "transition-all duration-200",
                "disabled:cursor-not-allowed",
                isActive
                  ? "bg-brand text-brand-subtle shadow-sm border border-ui-border"
                  : "text-ui-text-muted hover:text-ui-text transition-colors duration-300 cursor-pointer",
              )}
            >
              {isTabLoading ? (
                <IconLoader2 size={16} stroke={2} className="animate-spin" />
              ) : (
                <Icon size={16} stroke={2} />
              )}
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Tab Content ── */}
      <div className="relative">
        {isLoading && (
          <div
            className={cn(
              "absolute inset-0 z-10",
              "rounded-2xl border border-ui-border",
              "bg-ui-surface/80 backdrop-blur-sm",
              "flex flex-col items-center justify-start pt-10 gap-3",
            )}
          >
            <IconLoader2
              size={28}
              stroke={2}
              className="text-brand animate-spin"
            />
            <p className="text-sm text-ui-text-muted">در حال بارگذاری...</p>
          </div>
        )}
        <div
          className={cn(
            isLoading && "pointer-events-none select-none opacity-50",
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}