"use client";

import { cn } from "@/lib/utils";

/** Wise pill tabs — sage track, green/ink active pill. */
export function Tabs<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar rounded-full bg-secondary/80 p-1 border border-border/50",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all",
            value === o.value
              ? "bg-[#0e0f0c] text-white dark:bg-foreground dark:text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
