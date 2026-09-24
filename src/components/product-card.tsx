"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, ExternalLink, MousePointerClick, Zap } from "lucide-react";
import { formatBid } from "@/lib/format";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import type { Doc } from "../../convex/_generated/dataModel";

export type RankedProduct = Doc<"products"> & {
  rank: number;
  ownerName: string;
  windowSpend?: number;
};

const RANK_BADGE = [
  "bg-primary text-primary-foreground font-black shadow-xs",
  "bg-secondary text-secondary-foreground font-extrabold",
  "bg-secondary text-secondary-foreground font-extrabold",
];

export function ProductLogo({
  name,
  logoUrl,
  size = "md",
  className,
}: {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-10 text-xs rounded-xl",
    md: "size-12 text-sm rounded-2xl",
    lg: "size-16 text-xl rounded-2xl",
  }[size];

  const [imgError, setImgError] = useState(false);
  const [prevLogoUrl, setPrevLogoUrl] = useState(logoUrl);

  if (prevLogoUrl !== logoUrl) {
    setPrevLogoUrl(logoUrl);
    setImgError(false);
  }

  if (logoUrl && !imgError) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-muted/60 shadow-xs shrink-0 flex items-center justify-center border border-border/80",
          sizeClasses,
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={logoUrl}
          src={logoUrl}
          alt={`${name} logo`}
          className="size-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {/* Dark overlay & subtle inset ring for visual depth */}
        <div className="absolute inset-0 bg-black/[0.04] dark:bg-black/30 pointer-events-none ring-1 ring-inset ring-black/10 dark:ring-white/15" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#0e0f0c] dark:bg-secondary font-black text-white dark:text-foreground shrink-0 flex items-center justify-center border border-border/60 shadow-xs",
        sizeClasses,
        className,
      )}
    >
      <span>{name.trim().slice(0, 2).toUpperCase() || "??"}</span>
      <div className="absolute inset-0 bg-white/5 dark:bg-black/20 pointer-events-none ring-1 ring-inset ring-white/10 dark:ring-white/15" />
    </div>
  );
}

export function ProductCard({
  product,
  leadText,
  onOutbid,
}: {
  product: RankedProduct;
  leadText?: string;
  onOutbid: (p: RankedProduct) => void;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:shadow-[0_16px_32px_-16px_rgba(14,15,12,0.15)] sm:p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex w-9 shrink-0 flex-col items-center gap-1">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-xl bg-muted text-xs sm:text-sm font-black tabular-nums",
              product.rank <= 3 && RANK_BADGE[product.rank - 1],
            )}
          >
            {product.rank}
          </span>
          {product.rank === 1 && <Crown className="size-3.5 text-warning" />}
        </div>
        <ProductLogo name={product.name} logoUrl={product.logoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="truncate text-[15px] font-bold tracking-tight hover:underline sm:text-base"
            >
              {product.name}
            </Link>
            <Badge variant="secondary" className="font-medium text-[11px]">
              {product.category}
            </Badge>
          </div>
          <p className="truncate text-[13px] text-muted-foreground">{product.tagline}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            by {product.founderName} · {product.clickCount.toLocaleString("en-IN")} clicks
            {product.windowSpend !== undefined && (
              <> · <span className="font-semibold text-success">{formatBid(product.windowSpend)}</span> this period</>
            )}
          </p>
          {leadText && (
            <p className="mt-0.5 text-xs font-semibold text-success">
              {leadText}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xl font-black tabular-nums tracking-tight">
            {formatBid(product.currentBid)}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">bid</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 border-t border-muted pt-3">
        <a
          href={`/go/${product._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ExternalLink /> Visit
        </a>
        <Button size="sm" onClick={() => onOutbid(product)}>
          <Zap /> Outbid
        </Button>
        <span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <MousePointerClick className="size-3.5" />
          Outbid from {formatBid(product.currentBid + 100)}
        </span>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return <div className="h-36 animate-pulse rounded-xl bg-muted" />;
}
