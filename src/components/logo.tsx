import { cn } from "@/lib/utils";

/**
 * BidRank brand mark: ink rounded square with Wise-green bar-chart glyph.
 * The green IS the brand CTA color (#9fe870); the deep bar is ink-deep.
 * The chip uses `bg-brand-ink` — the theme-stable ink — because `bg-ink`
 * polarity-flips to near-white in dark mode, making the green bars invisible.
 * A brand mark should not flip with the theme.
 */
export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[9px] bg-brand-ink",
        className,
      )}
    >
      <svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <rect x="1" y="6.5" width="2.4" height="4.5" rx="0.8" fill="#9fe870" />
        <rect x="4.8" y="3.5" width="2.4" height="7.5" rx="0.8" fill="#cdffad" />
        <rect x="8.6" y="1" width="2.4" height="10" rx="0.8" fill="#9fe870" />
      </svg>
    </span>
  );
}
