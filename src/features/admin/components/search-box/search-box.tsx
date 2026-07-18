"use client";

import { IconSearch , IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Props } from "./types";

export function SearchBox({
  value,
  onChange,
  placeholder = "جستجو...",
  className,
}: Props) {
  return (
    <div className={cn("relative", className)}>
      <IconSearch
        className="absolute right-3 top-1/2 -translate-y-1/2
                   h-4 w-4 text-gray-400 pointer-events-none"
      />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      {value && (
        <Button
          onClick={() => onChange("")}
          variant="default"
          className="absolute left-1.5 top-1/2 -translate-y-1/2 size-7 p-0 opacity-85"
          aria-label="پاک کردن"
        >
          <IconX size={16} />
        </Button>
      )}
    </div>
  );
}
