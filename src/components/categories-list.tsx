"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatBid } from "@/lib/format";
import { ArrowRight } from "lucide-react";
import { getCategoryIcon } from "./category-dropdown";

export function CategoriesList() {
  const cats = useQuery(api.products.topBidsByCategory);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(cats ?? Array.from({ length: 6 }, (_, i) => ({ name: "", count: 0, topBid: 0, key: i }))).map(
        (c, i) => {
          if (c.name === "") {
            return <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />;
          }
          const Icon = getCategoryIcon(c.name);
          return (
            <Link
              key={c.name}
              href={`/categories/${encodeURIComponent(c.name)}`}
              className="group block rounded-2xl border border-border/70 bg-card p-5 transition-all duration-200 hover:shadow-md hover:border-foreground/20"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-foreground shadow-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="size-5.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-display text-lg font-black tracking-tight">{c.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {c.count} product{c.count === 1 ? "" : "s"}
                  </div>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-muted pt-3 text-sm">
                <span className="text-muted-foreground">Top bid</span>
                <span className="font-black tabular-nums tracking-tight">
                  {c.count > 0 ? formatBid(c.topBid) : "—"}
                </span>
              </div>
            </Link>
          );
        },
      )}
    </div>
  );
}
