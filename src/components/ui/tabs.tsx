"use client";

import { cn } from "@/lib/utils";

/** Wise pill tabs — sage track, green active pill. */
export function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-secondary/80 p-1 border border-border/50">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all",
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
