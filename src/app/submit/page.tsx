"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAction, useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "@convex-dev/auth/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Rocket,
  Zap,
} from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { formatBid, rupeesToPaise, MIN_INITIAL_BID_PAISE } from "@/lib/format";
import { normalizeUrlInput } from "@/lib/urls";
import { CATEGORIES } from "@/lib/categories";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LogoMark } from "@/components/logo";
import { ProductLogo } from "@/components/product-card";
import type { Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Stepper({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold">
      <span
        className={
          step === 1
            ? "flex size-7 items-center justify-center rounded-full bg-primary text-[13px] text-primary-foreground"
            : "flex size-7 items-center justify-center rounded-full bg-accent text-accent-foreground"
        }
      >
        {step === 1 ? "1" : <Check className="size-3.5" />}
      </span>
      <span className={step === 1 ? "" : "text-muted-foreground"}>Details</span>
      <span className="h-px w-10 bg-ink/30" />
      <span
        className={
          step === 2
            ? "flex size-7 items-center justify-center rounded-full bg-primary text-[13px] text-primary-foreground"
            : "flex size-7 items-center justify-center rounded-full border border-ink bg-card text-[13px] text-muted-foreground"
        }
      >
        2
      </span>
      <span className={step === 2 ? "" : "text-muted-foreground"}>
        Opening bid
      </span>
    </div>
  );
}

export default function SubmitPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const submit = useMutation(api.products.submit);
  const createOrder = useAction(api.razorpay.createOrder);

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    name: "",
    websiteUrl: "",
    logoUrl: "",
    tagline: "",
    description: "",
    category: "",
    founderName: "",
    twitterUrl: "",
    demoUrl: "",
  });
  const [bid, setBid] = useState("");
  const [productId, setProductId] = useState<Id<"products"> | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleUrlBlur =
    (k: keyof typeof form) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      const val = e.target.value.trim();
      if (val && !/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(val)) {
        setForm((f) => ({ ...f, [k]: `https://${val}` }));
      }
    };

  // Step 2: quote for the opening bid (server validates + ranks it).
  // Only run when the bid clears the ₹10 minimum, since the server rejects lower bids.
  const bidPaise = useMemo(() => rupeesToPaise(bid), [bid]);
  const bidValid = bidPaise !== null && bidPaise >= MIN_INITIAL_BID_PAISE;
  const preview = useQuery(
    api.products.previewBid,
    step === 2 && productId && bidValid ? { productId, newBid: bidPaise! } : "skip",
  );

  async function continueToBid(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const norm = (v: string) => {
        return normalizeUrlInput(v);
      };
      const websiteUrl = norm(form.websiteUrl);
      const logoUrl = norm(form.logoUrl) || undefined;
      const twitterUrl = norm(form.twitterUrl) || undefined;
      const demoUrl = norm(form.demoUrl) || undefined;

      setForm((f) => ({
        ...f,
        websiteUrl,
        logoUrl: logoUrl ?? "",
        twitterUrl: twitterUrl ?? "",
        demoUrl: demoUrl ?? "",
      }));

      const id = await submit({
        ...form,
        websiteUrl,
        logoUrl,
        twitterUrl,
        demoUrl,
        category: form.category || CATEGORIES[0],
      });
      setProductId(id);
      setStep(2);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    if (!productId || bidPaise === null) {
      toast.error("Enter a valid bid amount.");
      return;
    }
    setBusy(true);
    try {
      const order = await createOrder({ productId, newBid: bidPaise });
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Could not load Razorpay.");
      new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "BidRank",
        description: `${form.name} opening bid`,
        order_id: order.orderId,
        theme: { color: "#0e0f0c" },
        handler: () => {
          setDone(true);
          toast.success("Payment received! Your listing goes live automatically.");
        },
        modal: { ondismiss: () => setBusy(false) },
      }).open();
    } catch (err) {
      toast.error((err as Error).message);
      setBusy(false);
    }
  }

  if (isLoading)
    return <p className="pt-12 text-center text-muted-foreground">Loading…</p>;

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md pt-16">
        <div className="rounded-xl bg-card p-8 text-center">
          <LogoMark size={40} className="mx-auto rounded-[11px]" />
          <h1 className="mt-5 font-display text-display-xs font-black tracking-tight">
            Sign in to list your SaaS
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Only members can submit products and bid.
          </p>
          <Link href="/signin" className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}>
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md space-y-4 pt-24 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary">
          <Check className="size-7 text-primary-foreground" />
        </span>
        <h1 className="font-display text-display-md font-black tracking-tight">
          You&apos;re on the board! 🎉
        </h1>
        <p className="text-muted-foreground">
          Payment confirmed — your listing is live and ranking now.
        </p>
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pt-10">
      <div>
        <h1 className="font-display text-display-md font-black tracking-tight">
          {step === 1 ? "List your SaaS" : "Place your opening bid"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {step === 1
            ? "Tell people what you built. You'll set your bid on the next step."
            : "Your listing goes live the moment payment is confirmed."}
        </p>
        <div className="mt-5">
          <Stepper step={step} />
        </div>
      </div>

      {step === 1 ? (
        <form
          onSubmit={continueToBid}
          className="space-y-5 rounded-xl bg-card p-6 sm:p-7"
        >
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="name">SaaS name</Label>
              <span className="text-xs text-muted-foreground">2–60 characters</span>
            </div>
            <Input
              id="name"
              required
              minLength={2}
              maxLength={60}
              value={form.name}
              onChange={set("name")}
              placeholder="Acme Analytics"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                required
                inputMode="url"
                value={form.websiteUrl}
                onChange={set("websiteUrl")}
                onBlur={handleUrlBlur("websiteUrl")}
                placeholder="acme.com"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <span className="text-xs text-muted-foreground">
                  A square image works best
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="logoUrl"
                  inputMode="url"
                  value={form.logoUrl}
                  onChange={set("logoUrl")}
                  onBlur={handleUrlBlur("logoUrl")}
                  placeholder="acme.com/logo.png"
                />
                {normalizeUrlInput(form.logoUrl) && (
                  <ProductLogo
                    name={form.name || "Preview"}
                    logoUrl={normalizeUrlInput(form.logoUrl)}
                    size="sm"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="tagline">Tagline</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {form.tagline.length}/120 (min 5)
              </span>
            </div>
            <Input
              id="tagline"
              required
              minLength={5}
              maxLength={120}
              value={form.tagline}
              onChange={set("tagline")}
              placeholder="Product analytics you can explain to your CEO"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="description">Description</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {form.description.length} chars (min 20)
              </span>
            </div>
            <Textarea
              id="description"
              required
              minLength={20}
              value={form.description}
              onChange={set("description")}
              placeholder="What does it do, who is it for, and why is it better than the alternative?"
              rows={4}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select id="category" required value={form.category} onChange={set("category")}>
                <option value="" disabled>
                  Choose a category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="founderName">Founder name</Label>
              <Input
                id="founderName"
                required
                minLength={2}
                value={form.founderName}
                onChange={set("founderName")}
                placeholder="Alex Rivera"
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="twitterUrl">X / Twitter URL</Label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <Input
                id="twitterUrl"
                inputMode="url"
                value={form.twitterUrl}
                onChange={set("twitterUrl")}
                onBlur={handleUrlBlur("twitterUrl")}
                placeholder="x.com/yourhandle"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <Input
                id="demoUrl"
                inputMode="url"
                value={form.demoUrl}
                onChange={set("demoUrl")}
                onBlur={handleUrlBlur("demoUrl")}
                placeholder="acme.com/demo"
              />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : null}
            Continue to bidding
            <ArrowRight />
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl bg-card p-6">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="bid" className="text-[15px] font-bold">
                Your opening bid
              </Label>
              <span className="text-xs text-muted-foreground">Minimum ₹10</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-md border border-ink bg-card px-4 focus-within:ring-2 focus-within:ring-ring/60">
              <span className="text-lg font-semibold text-muted-foreground">₹</span>
              <input
                id="bid"
                inputMode="decimal"
                placeholder="10"
                value={bid}
                onChange={(e) => setBid(e.target.value)}                 className="h-14 w-full bg-transparent text-2xl font-black tabular-nums tracking-tight outline-none placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-md">
              <div className="border-r border-muted bg-muted p-4">
                <div className="text-xs font-medium text-muted-foreground">Estimated rank</div>                 <div className="mt-1 text-2xl font-black tabular-nums tracking-tight">
                  {preview ? `#${preview.estimatedRank}` : "—"}
                </div>
              </div>
              <div className="bg-muted p-4">
                <div className="text-xs font-medium text-muted-foreground">You pay today</div>                 <div className="mt-1 text-2xl font-black tabular-nums tracking-tight">
                  {preview ? formatBid(preview.amountDue) : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-xl bg-card p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Rocket className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-bold">
                {form.name || "Your SaaS"} is saved as a draft
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                It won&apos;t appear on the leaderboard until your payment is
                confirmed by our payment provider.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              className="sm:w-auto"
              onClick={() => setStep(1)}
              disabled={busy}
            >
              <ArrowLeft /> Back
            </Button>
            <Button
              size="lg"
              className="flex-1"
              disabled={busy || !preview || !bidValid}
              onClick={pay}
            >
              {busy ? <Loader2 className="animate-spin" /> : <Zap />}
              List my SaaS{preview ? ` — ${formatBid(preview.amountDue)}` : ""}
            </Button>
          </div>
          <p className="text-center text-[13px] text-muted-foreground">
            Changed your mind?{" "}
            <Link
              href="/dashboard"
              className="font-semibold text-foreground underline underline-offset-4"
            >
              Manage it from your dashboard
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
