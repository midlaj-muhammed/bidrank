/** Minimum opening bid in minor units (paise): ₹10. */
export const MIN_INITIAL_BID_PAISE = 1000;

/** Minor units (paise) -> ₹12,500 */
export function formatBid(paise: number): string {
  return (
    "₹" +
    (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })
  );
}

/** Rupees input string -> paise int, or null if invalid. */
export function rupeesToPaise(input: string): number | null {
  const n = Number(input.trim().replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100);
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
