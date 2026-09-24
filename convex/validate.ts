export const MIN_INITIAL_BID = 1000; // paise (₹10)
export const MIN_INCREMENT = 100; // paise (₹1)
export const MIN_CHARGE = 100; // paise — Razorpay minimum
export const CURRENCY = "INR";

export function assertPositiveInt(value: number, field: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer.`);
  }
}

export function assertHttpUrl(value: string, field: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} must be a valid URL.`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${field} must start with http(s)://.`);
  }
}

/**
 * Forgiving URL normalization: trims whitespace and prepends https://
 * when the user omitted the scheme ("acme.com" -> "https://acme.com").
 * Still throws on genuinely invalid URLs.
 */
export function normalizeHttpUrl(value: string, field: string): string {
  let v = value.trim();
  if (v.startsWith("//")) {
    v = `https:${v}`;
  } else if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(v)) {
    v = `https://${v}`;
  }
  assertHttpUrl(v, field);
  return v;
}

export function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "product";
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS ?? "";
  const allowed = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
