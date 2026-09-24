/**
 * Browser-chrome tint for <meta name="theme-color">, mirroring the
 * `--background` token per theme in globals.css (canvas-soft / ink).
 *
 * Consumed in two places:
 * - layout.tsx `viewport` export: static, media-scoped tags for the first
 *   paint (before JS runs), which follow the OS preference.
 * - components/theme-color-meta.tsx: takes over after hydration so the tag
 *   follows next-themes' resolved theme, including the in-app toggle.
 */
export const THEME_COLORS: Record<"light" | "dark", string> = {
  light: "#e8ebe6",
  dark: "#0e0f0c",
} as const;
