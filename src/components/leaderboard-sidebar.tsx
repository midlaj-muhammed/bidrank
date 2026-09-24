"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatBid, timeAgo } from "@/lib/format";
import { ArrowRight, Layers } from "lucide-react";
import { ProductLogo } from "./product-card";

export function LeaderboardSidebar() {
  const activity = useQuery(api.stats.recentActivity);

  return (
    <aside className="space-y-6">
      {/* Live Activity Widget */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-muted">
          <div className="flex items-center gap-2 font-display text-base font-black tracking-tight">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            Live activity
          </div>
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Realtime
          </span>
        </div>

        <div className="mt-4 space-y-3.5">
          {activity === undefined ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-8 animate-pulse rounded-lg bg-muted" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-16 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">
              No recent bids yet. Place the first bid!
            </p>
          ) : (
            activity.map((a) => (
              <Link
                key={a._id}
                href={`/product/${a.productSlug}`}
                className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60"
              >
                <ProductLogo name={a.productName} logoUrl={a.logoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-xs font-bold text-foreground group-hover:underline">
                      {a.productName}
                    </span>
                    <span className="text-[11px] font-bold tabular-nums text-foreground">
                      {formatBid(a.newBid)}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">
                      {a.previousRank ? `#${a.previousRank} → #${a.newRank}` : `Rank #${a.newRank}`}
                    </span>
                    <span className="shrink-0">{timeAgo(a.createdAt)}</span>
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* How It Works Card */}
      <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 font-display text-base font-black tracking-tight pb-3 border-b border-muted">
          <Layers className="size-4 text-primary" />
          How it works
        </div>

        <ol className="mt-4 space-y-3.5 text-xs">
          <li className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0e0f0c] dark:bg-foreground font-display text-[11px] font-black text-white dark:text-background">
              1
            </span>
            <div className="pt-0.5">
              <span className="font-bold text-foreground">List your SaaS:</span>{" "}
              <span className="text-muted-foreground">
                Submit product info and set opening bid from ₹10.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0e0f0c] dark:bg-foreground font-display text-[11px] font-black text-white dark:text-background">
              2
            </span>
            <div className="pt-0.5">
              <span className="font-bold text-foreground">Pay & rank live:</span>{" "}
              <span className="text-muted-foreground">
                Your rank updates immediately across the board on confirmation.
              </span>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0e0f0c] dark:bg-foreground font-display text-[11px] font-black text-white dark:text-background">
              3
            </span>
            <div className="pt-0.5">
              <span className="font-bold text-foreground">Climb to #1:</span>{" "}
              <span className="text-muted-foreground">
                Outbid rivals by paying only the bid difference anytime.
              </span>
            </div>
          </li>
        </ol>

        <div className="mt-5 pt-3 border-t border-muted">
          <Link
            href="/how-it-works"
            className="flex items-center justify-between text-xs font-bold text-foreground transition-colors hover:text-primary"
          >
            <span>Read full rules</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
