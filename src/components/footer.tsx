import Link from "next/link";
import { LogoMark } from "./logo";

const FOOTER_LINKS = [
  { href: "/", label: "Leaderboard" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/submit", label: "List your SaaS" },
];

/** Wise footer: dark ink band with sage text. */
export function Footer() {
  return (
    <footer className="bg-brand-ink text-[#c7cac3]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="max-w-xs space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-lg font-black tracking-tight text-[#f5f7f4]"
          >
            <LogoMark size={30} />
            BidRank
          </Link>
          <p className="text-sm leading-relaxed">
            The SaaS leaderboard where founders compete for attention. Bid
            higher, rank higher, get discovered.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-10 gap-y-2 text-sm">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-semibold text-[#f5f7f4] transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
