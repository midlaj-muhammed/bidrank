import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Megaphone,
  Plus,
  Shield,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how the BidRank SaaS auction leaderboard works: list your product, pay opening bids, climb rankings in real time, and pay only the difference to raise.",
  openGraph: {
    title: "How It Works | BidRank",
    description:
      "Learn how the BidRank SaaS auction leaderboard works: list your product, pay opening bids, climb rankings in real time, and pay only the difference to raise.",
  },
};

const STEPS = [
  {
    step: "Step 1",
    icon: Megaphone,
    title: "List your SaaS",
    description:
      "Submit your product details, logo, website URL, and opening bid (minimum ₹10). Your draft is saved instantly.",
  },
  {
    step: "Step 2",
    icon: CreditCard,
    title: "Pay to go live",
    description:
      "Pay your opening bid securely via Razorpay. Your product immediately appears on the live leaderboard.",
  },
  {
    step: "Step 3",
    icon: Trophy,
    title: "Take your position",
    description:
      "Your rank is determined strictly by your total cumulative bid. Higher bid = higher position = more clicks and visibility.",
  },
  {
    step: "Step 4",
    icon: Zap,
    title: "Outbid anyone, anytime",
    description:
      "When someone outbids you, raise your bid at any moment. Your rank updates in real-time across all visitors.",
  },
];

const RULES = [
  "Minimum opening bid is ₹10.",
  "Bids are cumulative — you only pay the incremental difference to raise.",
  "All payments are non-refundable once applied to the board.",
  "No recurring subscriptions — you decide when and how much to bid.",
  "Clicks are tracked transparently and displayed publicly for every product.",
];

const BENEFITS = [
  "High-intent founder & buyer discovery in your category.",
  "Direct do-follow link attribution and public click analytics.",
  "Permanent product profile page with full bid & movement history.",
  "Instant realtime rank updates across the board on confirmation.",
  "Public proof of launch traction and founder commitment.",
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 lg:py-20">
      {/* Hero Title */}
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-foreground">
          How BidRank works
        </h1>
        <p className="mx-auto max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          A transparent pay-to-rank leaderboard for SaaS products. Founders compete for visibility by placing bids.
        </p>
      </div>

      {/* 2x2 Steps Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="rounded-3xl border border-border/70 bg-card p-6 sm:p-7 shadow-xs transition-all hover:shadow-md hover:border-foreground/20"
          >
            <div className="flex items-center justify-between pb-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-foreground shadow-xs">
                <s.icon className="size-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {s.step}
              </span>
            </div>
            <h2 className="font-display text-xl font-black tracking-tight text-foreground">
              {s.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.description}
            </p>
          </div>
        ))}
      </div>

      {/* Highlight Section: The Math */}
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xs grid lg:grid-cols-[1.1fr_0.9fr] items-stretch">
        <div className="flex flex-col justify-center p-7 sm:p-10 space-y-3">
          <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            You only pay the difference
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            You never pay from scratch. If your current bid is ₹2,500 and you want to raise to ₹4,000, you only pay ₹1,500 today. Every rupee you&apos;ve ever spent counts towards your permanent standing.
          </p>
        </div>

        <div className="p-3 sm:p-4 flex items-center">
          <div className="w-full rounded-2xl sm:rounded-3xl bg-primary text-primary-foreground p-6 sm:p-7 shadow-sm space-y-5 relative overflow-hidden">
            {/* Subtle dark overlay circle */}
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-black/10 blur-xl pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold opacity-90 pb-2 border-b border-black/10">
                <span>Current bid</span>
                <span className="font-bold tabular-nums">₹2,500</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold opacity-90">
                <span>New bid</span>
                <span className="font-bold tabular-nums">₹4,000</span>
              </div>
            </div>

            <div className="relative z-10 pt-3 border-t border-black/15">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                You pay today
              </p>
              <p className="font-display text-4xl sm:text-5xl font-black tabular-nums tracking-tight mt-0.5">
                ₹1,500
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid: Rules & Benefits */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* The Rules */}
        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-muted">
            <h2 className="font-display text-xl font-black tracking-tight text-foreground">
              The rules
            </h2>
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
              <Shield className="size-4 text-primary" />
            </span>
          </div>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            {RULES.map((r) => (
              <li key={r} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground" />
                <span className="leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You Get */}
        <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-muted">
            <h2 className="font-display text-xl font-black tracking-tight text-foreground">
              What you get
            </h2>
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground">
              <Sparkles className="size-4 text-primary" />
            </span>
          </div>
          <ul className="mt-5 space-y-3.5 text-sm text-muted-foreground">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Call to Action Group */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
        <Link
          href="/submit"
          className={buttonVariants({ size: "lg", variant: "dark" })}
        >
          <Plus className="size-4" /> List your SaaS
        </Link>
        <Link
          href="/"
          className={buttonVariants({ size: "lg", variant: "secondary" })}
        >
          View leaderboard <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
