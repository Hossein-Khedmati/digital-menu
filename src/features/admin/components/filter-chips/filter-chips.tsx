"use client";

import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Props } from "./types";

export function FilterChips({ options, value, onChange, className }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    dragFree: true,
    containScroll: "keepSnaps",
    direction: "rtl",
  });

  return (
    <div className={cn("relative flex items-center gap-1", className)}>
      <div
        ref={emblaRef}
        className="overflow-hidden"
        style={{ direction: "rtl" }}
      >
        <div className="flex gap-2">
          {options.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              active={value === option.value}
              onClick={() => onChange(option.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-2xl px-4 py-2.5",
        "text-sm font-medium whitespace-nowrap snap-start shrink-0",
        "border-2 transition-all duration-200 shadow-none",
        active
          ? "border-brand bg-brand hover:bg-brand text-ui-bg-soft hover:text-ui-bg-soft shadow-md"
          : "border-ui-border bg-ui-surface text-ui-text-soft hover:border-ui-text-muted",
      )}
      variant="ghost"
    >
      {label}
    </Button>
  );
}
