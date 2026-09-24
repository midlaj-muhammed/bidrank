"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { useConvexAuth } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Loader2, Rocket, TrendingUp } from "lucide-react";
import { api } from "../../convex/_generated/api";
import { formatBid, rupeesToPaise, MIN_INITIAL_BID_PAISE } from "@/lib/format";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ProductLogo, type RankedProduct } from "./product-card";
import { cn } from "@/lib/utils";
import type { Id } from "../../convex/_generated/dataModel";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BidDialog({
  target,
  onClose,
}: {
  target: RankedProduct | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const myProducts = useQuery(
    api.products.myProducts,
    isAuthenticated && target ? {} : "skip",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bidInput, setBidInput] = useState("");
  const [paying, setPaying] = useState(false);
  const createOrder = useAction(api.razorpay.createOrder);

  const mine = useMemo(() => myProducts ?? [], [myProducts]);
  const eligible = useMemo(
    () =>
      mine.filter(
        (p) => p.status === "active" || p.status === "awaiting_payment",
      ),
    [mine],
  );
  const selected =
    eligible.find((p) => p._id === selectedId) ??
    eligible.find((p) => target && p._id === target._id) ??
    eligible[0] ??
    null;

  const minOpening = selected?.currentBid === 0 ? MIN_INITIAL_BID_PAISE : (selected?.currentBid ?? 0) + 100;
  const minRequired = target && target._id !== selected?._id && target.currentBid > 0
    ? Math.max(target.currentBid + 100, minOpening)
    : minOpening;

  const newBidPaise = rupeesToPaise(bidInput);
  const preview = useQuery(
    api.products.previewBid,
    selected && newBidPaise !== null && newBidPaise >= minOpening
      ? { productId: selected._id, newBid: newBidPaise }
      : "skip",
  );

  async function pay() {
    if (!selected || newBidPaise === null || !preview) return;
    setPaying(true);
    try {
      const order = await createOrder({
        productId: selected._id as Id<"products">,
        newBid: newBidPaise,
      });
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Could not load Razorpay.");
      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "BidRank",
        description: `${selected.name} → ${formatBid(newBidPaise)}`,
        order_id: order.orderId,
        theme: { color: "#0e0f0c" },
        handler: () => {
          toast.success("Payment received! Your rank updates automatically.");
          onClose();
        },
        modal: { ondismiss: () => setPaying(false) },
      }).open();
    } catch (e) {
      toast.error((e as Error).message);
      setPaying(false);
    }
  }

  return (
    <Dialog open={target !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent onClose={onClose}>
        {!target ? null : !isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle>Sign in to outbid</DialogTitle>
              <DialogDescription>
                You need an account to bid on BidRank.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => router.push("/signin")} size="lg">
              Sign in
            </Button>
          </>
        ) : myProducts === undefined ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading</DialogTitle>
              <DialogDescription>Fetching your listings…</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading your products…
            </div>
          </>
        ) : eligible.length === 0 ? (
          <>
            <DialogHeader>
              <DialogTitle>List a SaaS first</DialogTitle>
              <DialogDescription>
                To take #{target.rank} from {target.name} (
                {formatBid(target.currentBid)}), list your own SaaS and bid
                higher.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => router.push("/submit")} size="lg">
              <Rocket /> List my SaaS
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Rocket className="size-4" />
                </span>
                Outbid {target.name}
              </DialogTitle>
              <DialogDescription className="leading-relaxed">
                Pass them on the leaderboard by bidding higher. You only pay the
                difference on your own listing.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-muted/60 p-3.5">
              <ProductLogo name={target.name} logoUrl={target.logoUrl} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{target.name}</p>
                <p className="text-xs text-muted-foreground">
                  Currently #{target.rank}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-black tabular-nums tracking-tight">
                  {formatBid(target.currentBid)}
                </div>
                <div className="text-[11px] text-muted-foreground">their bid</div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <Label className="text-[13px] font-bold">Bid with</Label>
              <div className="space-y-2">
                {eligible.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    aria-pressed={selected?._id === p._id}
                    onClick={() => setSelectedId(p._id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-card p-3 text-left transition-colors",
                      selected?._id === p._id
                        ? "border-primary ring-2 ring-primary/40"
                        : "border-border/70 hover:bg-muted/60",
                    )}
                  >
                    <ProductLogo name={p.name} logoUrl={p.logoUrl} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {p.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {formatBid(p.currentBid)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="newBid" className="text-[13px] font-bold">
                  Your bid
                </Label>
                <span className="text-xs text-muted-foreground">
                  Minimum {formatBid(Math.max(minRequired, (selected?.currentBid ?? 0) + 100))}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-4 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
                <span className="text-lg font-semibold text-muted-foreground">₹</span>
                <input
                  id="newBid"
                  name="newBid"
                  autoComplete="off"
                  inputMode="decimal"
                  data-autofocus
                  placeholder={String(Math.ceil(minRequired / 100))}
                  value={bidInput}
                  onChange={(e) => setBidInput(e.target.value)}
                  className="h-12 w-full bg-transparent text-lg font-black tabular-nums tracking-tight outline-none placeholder:text-muted-foreground/50"
                />
              </div>
            </div>

            {selected && newBidPaise !== null && preview && (
              <div aria-live="polite" className="mt-4 overflow-hidden rounded-2xl border border-border/70">
                <div className="space-y-1.5 bg-muted/70 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current bid</span>
                    <span className="font-bold tabular-nums">{formatBid(preview.currentBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">New bid</span>
                    <span className="font-bold tabular-nums">{formatBid(newBidPaise)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated new rank</span>
                    <span className="flex items-center gap-1 font-bold tabular-nums">
                      <TrendingUp className="size-3.5 text-primary" /> #{preview.estimatedRank}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
                  <span className="text-sm font-bold">
                    You pay today
                  </span>
                  <span className="text-xl font-black tabular-nums tracking-tight">
                    {formatBid(preview.amountDue)}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button variant="ghost" size="lg" onClick={onClose} disabled={paying}>
                Cancel
              </Button>
              <Button size="lg" disabled={!preview || paying} onClick={pay}>
                {paying ? (
                  <>
                    <Loader2 className="animate-spin" /> Opening payment…
                  </>
                ) : preview ? (
                  <>
                    Pay {formatBid(preview.amountDue)} and move to #
                    {preview.estimatedRank}
                  </>
                ) : (
                  "Enter a higher bid"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
