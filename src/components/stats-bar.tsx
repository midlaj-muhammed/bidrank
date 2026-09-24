"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatBid } from "@/lib/format";
import { MousePointerClick, Layers, IndianRupee } from "lucide-react";

export function StatsBar() {
  const stats = useQuery(api.stats.overview);
  const items = [
    {
      icon: IndianRupee,
      label: "Total bid volume",
      value: stats ? formatBid(stats.totalBidPaise) : "—",
      primaryBadge: true,
    },
    {
      icon: Layers,
      label: "Products listed",
      value: stats ? String(stats.productCount) : "—",
      primaryBadge: false,
    },
    {
      icon: MousePointerClick,
      label: "Clicks delivered",
      value: stats ? stats.clickCount.toLocaleString("en-IN") : "—",
      primaryBadge: false,
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid -translate-y-8 grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {it.label}
              </span>
              <span
                className={
                  it.primaryBadge
                    ? "flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                    : "flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border/60"
                }
              >
                <it.icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-3xl font-black tabular-nums tracking-tight">
              {it.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
