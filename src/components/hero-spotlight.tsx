"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { ArrowUpRight, Gavel, MousePointerClick } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { formatBid } from "@/lib/format";
import { ProductLogo, type RankedProduct } from "./product-card";
import { BidDialog } from "./bid-dialog";
import { buttonVariants } from "./ui/button";

/**
 * Hero spotlight — the #1 product on the board, hosted on the brand-green
 * card (the Wise hero-widget moment). Shows who currently holds the top
 * spot, the money behind it, and invites the raise.
 */
export function HeroSpotlight() {
  const products = useQuery(api.products.leaderboard, {
    tab: "all",
    category: "All",
    limit: 2,
  });
  const [bidTarget, setBidTarget] = useState<RankedProduct | null>(null);

  const top = products?.[0];
  const runnerUp = products?.[1];
  const gap = top && runnerUp ? top.currentBid - runnerUp.currentBid : null;

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-[0_24px_60px_-24px_rgba(14,15,12,0.35)] sm:p-8">
        {/* Subtle decorative dark overlay shape */}
        <div className="absolute -right-12 -top-12 size-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0e0f0c]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              Current #1
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0e0f0c]/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <MousePointerClick className="size-3.5" />
              {top ? `${top.clickCount.toLocaleString("en-IN")} clicks` : "—"}
            </span>
          </div>

          {products === undefined ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-12 animate-pulse rounded-2xl bg-ink/15" />
                <div className="space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded-full bg-ink/15" />
                  <div className="h-3 w-28 animate-pulse rounded-full bg-ink/15" />
                </div>
              </div>
              <div className="h-9 w-44 animate-pulse rounded-full bg-ink/15" />
            </div>
          ) : !top ? (
            <div className="py-8">
              <p className="font-display text-2xl font-black tracking-tight">
                The throne is empty.
              </p>
              <p className="mt-1 text-sm opacity-90">
                Be the first name on the board — opening bids from ₹10.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-center gap-3.5">
                <ProductLogo name={top.name} logoUrl={top.logoUrl} size="md" />
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-black tracking-tight">
                    {top.name}
                  </p>
                  <p className="truncate text-sm opacity-90">{top.tagline}</p>
                </div>
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-wider opacity-80">Holding the spot at</p>
              <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
                <div>
                  <p className="font-display text-4xl font-black tabular-nums tracking-tight sm:text-5xl sm:leading-[1.05]">
                    {formatBid(top.currentBid)}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {gap !== null && gap > 0
                      ? `${formatBid(gap)} ahead of #2`
                      : "The closest race on the board"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/go/${top._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${top.name}`}
                    className={buttonVariants({
                      size: "icon",
                      variant: "inverse",
                    })}
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                  <button
                    onClick={() => setBidTarget(top)}
                    className={buttonVariants({ variant: "dark", size: "sm" })}
                  >
                    <Gavel className="size-3.5" /> Outbid
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <BidDialog target={bidTarget} onClose={() => setBidTarget(null)} />
    </>
  );
}
