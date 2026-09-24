"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatBid, timeAgo } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductLogo, type RankedProduct } from "@/components/product-card";
import { BidDialog } from "@/components/bid-dialog";
import { ExternalLink, History, MousePointerClick, Zap } from "lucide-react";

export function ProductDetailView({ slug }: { slug: string }) {
  const product = useQuery(api.products.getBySlug, { slug });
  const [bidOpen, setBidOpen] = useState(false);

  if (product === undefined)
    return <p className="pt-12 text-center text-muted-foreground">Loading…</p>;
  if (product === null)
    return (
      <div className="mx-auto max-w-md pt-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold">Product not found</h1>
        <p className="text-sm text-muted-foreground">
          This listing might have been removed or does not exist.
        </p>
        <Link href="/" className={buttonVariants({})}>
          Return to Leaderboard
        </Link>
      </div>
    );

  const target: RankedProduct = product;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 lg:py-16">
      <div className="flex flex-wrap items-start gap-4">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-display-md font-black tracking-tight">{product.name}</h1>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <p className="text-lg text-muted-foreground">{product.tagline}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            by {product.founderName} · listed {timeAgo(product.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-primary">RANK #{product.rank}</div>
          <div className="text-3xl font-black tabular-nums tracking-tight">{formatBid(product.currentBid)}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">current bid</div>
        </div>
      </div>

      <p className="leading-relaxed">{product.description}</p>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: "total spent", value: formatBid(product.lifetimeAmountPaid) },
          { label: "clicks", value: product.clickCount.toLocaleString("en-IN") },
          { label: "rank", value: `#${product.rank}` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs">
            <div className="text-xl font-black tabular-nums tracking-tight">{s.value}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <a
          href={`/go/${product._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "lg", variant: "dark" })}
        >
          <ExternalLink className="size-4" /> Visit website
        </a>
        <button onClick={() => setBidOpen(true)} className={buttonVariants({ size: "lg", variant: "default" })}>
          <Zap className="size-4" /> Outbid
        </button>
        {product.twitterUrl && (
          <a href={product.twitterUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            X profile
          </a>
        )}
        {product.demoUrl && (
          <a href={product.demoUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Live demo
          </a>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MousePointerClick className="size-4 text-primary" /> {product.clickCount.toLocaleString("en-IN")} founders discovered this via BidRank
      </p>

      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-xl font-black font-display tracking-tight">
          <History className="size-5 text-primary" /> Ranking history
        </h2>
        {product.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rank movements yet.</p>
        ) : (
          <ol className="space-y-2.5">
            {product.history.map((h) => (
              <li key={h._id} className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm shadow-xs">
                {h.previousRank ? (
                  <>Moved <b>#{h.previousRank} → #{h.newRank}</b></>
                ) : (
                  <>Entered at <b>#{h.newRank}</b></>
                )}{" "}
                <span className="text-muted-foreground">
                  ({formatBid(h.previousBid)} → {formatBid(h.newBid)} · {timeAgo(h.createdAt)})
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <Link href="/#leaderboard" className={buttonVariants({ variant: "ghost" })}>
        ← Back to leaderboard
      </Link>
      <BidDialog target={bidOpen ? target : null} onClose={() => setBidOpen(false)} />
    </div>
  );
}
