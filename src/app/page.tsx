import Link from "next/link";
import { ArrowRight, Gavel, MousePointerClick, Trophy, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatsBar } from "@/components/stats-bar";
import { Leaderboard } from "@/components/leaderboard";
import { HeroSpotlight } from "@/components/hero-spotlight";

export default function Home() {
  return (
    <div>
      {/* hero-band: sage canvas, Wise display headline, live product preview */}
      <section className="overflow-hidden bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-24 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pb-32 lg:pt-20">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-semibold">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              Live auction for the #1 spot
            </span>
            <h1 className="font-display text-display-xl font-black tracking-tight">
              Pay your way
              <br />
              to the top.
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-ink-soft">
              The SaaS leaderboard where founders compete for attention. Bid
              higher, rank higher, get discovered.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/submit" className={buttonVariants({ size: "lg", variant: "dark" })}>
                List your SaaS
              </Link>
              <Link
                href="#leaderboard"
                className={buttonVariants({ size: "lg", variant: "tertiary" })}
              >
                View leaderboard <ArrowRight />
              </Link>
            </div>
          </div>

          <HeroSpotlight />
        </div>
      </section>

      <StatsBar />

      {/* content-band: leaderboard */}
      <section id="leaderboard" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-12 lg:py-20">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
              <Trophy className="size-4.5" />
            </span>
            <h2 className="font-display text-display-md font-black tracking-tight">
              Leaderboard
            </h2>
          </div>
          <Leaderboard />
        </div>
      </section>

      {/* feature-band: sage surface with clean cards */}
      <section className="border-t border-muted bg-secondary/50 py-12 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
          {[
            {
              icon: Gavel,
              title: "Bid for position",
              text: "List your SaaS from ₹10. Highest bid takes #1 — you only ever pay the difference to raise.",
            },
            {
              icon: Zap,
              title: "Ranks update live",
              text: "Every confirmed payment re-ranks the board instantly for everyone watching. No refresh needed.",
            },
            {
              icon: MousePointerClick,
              title: "Get discovered",
              text: "Top-ranked products earn the clicks. Every visit is tracked and shown publicly.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl bg-card p-6 text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <f.icon className="size-5" />
              </span>
              <h3 className="font-display text-lg font-black tracking-tight text-foreground">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
