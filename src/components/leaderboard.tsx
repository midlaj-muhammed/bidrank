"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatBid } from "@/lib/format";
import { Tabs } from "./ui/tabs";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { CategoryDropdown } from "./category-dropdown";
import {
  ProductCard,
  ProductCardSkeleton,
  type RankedProduct,
} from "./product-card";
import { BidDialog } from "./bid-dialog";
import { LeaderboardSidebar } from "./leaderboard-sidebar";

export type Tab = "all" | "today" | "week" | "new";

export function Leaderboard({
  initialCategory,
  showSidebar = true,
}: {
  initialCategory?: string;
  showSidebar?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [category, setCategory] = useState(initialCategory ?? "All");
  const [limit, setLimit] = useState(25);
  const [outbidTarget, setOutbidTarget] = useState<RankedProduct | null>(null);
  const cats = useQuery(api.products.categories);
  const products = useQuery(api.products.leaderboard, {
    tab,
    category,
    limit,
  });

  const content = (
    <div className="space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "new", label: "New" },
          ]}
        />
        <CategoryDropdown
          value={category}
          onChange={setCategory}
          categories={cats}
        />
      </div>

      {products === undefined ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 p-12 text-center text-muted-foreground">
          <p className="font-semibold text-foreground">
            {tab === "all" || tab === "new"
              ? "No products here yet."
              : "No bids in this period yet."}
          </p>
          <p className="mt-1 text-sm">
            {tab === "all" || tab === "new"
              ? "Be the first founder to list your SaaS."
              : "Your bid could claim the #1 spot on this board."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {products.map((p, i) => {
              let leadText: string | undefined;
              if (tab === "all" && i === 0 && products[1]) {
                const gap = p.currentBid - products[1].currentBid;
                if (gap > 0)
                  leadText = `🔥 ${formatBid(gap)} ahead of #2`;
              }
              return (
                <ProductCard
                  key={p._id}
                  product={p}
                  leadText={leadText}
                  onOutbid={setOutbidTarget}
                />
              );
            })}
          </div>
          {products.length >= limit && limit < 100 && (
            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit((l) => Math.min(l + 25, 100))}
              >
                <ChevronDown className="size-4" /> Show more products
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      {showSidebar ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_340px] items-start">
          {content}
          <LeaderboardSidebar />
        </div>
      ) : (
        content
      )}
      <BidDialog target={outbidTarget} onClose={() => setOutbidTarget(null)} />
    </>
  );
}
