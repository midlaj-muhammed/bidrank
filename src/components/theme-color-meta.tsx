"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { THEME_COLORS } from "@/lib/theme-colors";

/**
 * Keeps <meta name="theme-color"> in sync with the resolved theme so the
 * browser chrome follows the in-app toggle (and "System"), not just the OS
 * preference.
 *
 * NOTE: We update attributes in-place rather than calling `element.remove()`
 * on React-rendered meta tags to prevent Next.js / React 19 head reconciliation
 * crashes (`Cannot read properties of null (reading 'removeChild')`).
 */
export function ThemeColorMeta() {
  const { resolvedTheme, forcedTheme } = useTheme();

  useEffect(() => {
    const theme = forcedTheme ?? resolvedTheme;
    if (theme !== "light" && theme !== "dark") return;

    const color = THEME_COLORS[theme];
    const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');

    if (metas.length > 0) {
      metas.forEach((meta) => {
        meta.setAttribute("content", color);
      });
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = color;
      document.head.appendChild(meta);
    }
  }, [resolvedTheme, forcedTheme]);

  return null;
}
