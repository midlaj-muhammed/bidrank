/** Mirror of the backend normalizer (convex/validate.ts) for instant UI feedback. */
export function normalizeUrlInput(value: string): string {
  const v = value.trim();
  if (!v) return v;
  if (v.startsWith("//")) return `https:${v}`;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(v)) return `https://${v}`;
  return v;
}

export function autoFixLabel(original: string, normalized: string): string | null {
  if (!original.trim() || original.trim() === normalized) return null;
  return normalized;
}
