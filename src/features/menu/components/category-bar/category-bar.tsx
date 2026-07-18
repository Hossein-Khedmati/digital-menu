"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Props } from "./types";

export function CategoryBar({
  categories,
  activeCategory,
  slug,
  searchParams,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
    direction: "rtl",
  });

  if (categories.length === 0) return null;

  const buildUrl = (categoryId: string | null) => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.sort) params.set("sort", searchParams.sort);
    if (categoryId) params.set("cat", categoryId);
    const qs = params.toString();
    return `/${slug}/menu${qs ? `?${qs}` : ""}`;
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex gap-2">
          {/* همه */}
          <div className="shrink-0">
            <Link
              href={buildUrl(null)}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-4 py-2.5",
                "text-sm font-medium whitespace-nowrap",
                "border-2 transition-all duration-200",
                !activeCategory
                  ? "border-brand bg-brand text-white shadow-md"
                  : "border-ui-border bg-ui-surface text-ui-text-soft hover:border-ui-text-muted",
              )}
            >
              🍽️ همه
            </Link>
          </div>

          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;

            return (
              <div key={cat.id} className="shrink-0">
                <Link
                  href={buildUrl(cat.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl px-4 py-2.5",
                    "text-sm font-medium whitespace-nowrap",
                    "border-2 transition-all duration-200",
                    isActive
                      ? "border-brand bg-brand text-white shadow-md"
                      : "border-ui-border bg-ui-surface text-ui-text-soft hover:border-ui-text-muted",
                  )}
                >
                  {cat.icon && <span className="text-base">{cat.icon}</span>}
                  {cat.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
