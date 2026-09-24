"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useMemo } from "react";
import { ThemeColorMeta } from "./theme-color-meta";

export function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(
    () =>
      new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string),
    [],
  );
  return (
    <ConvexAuthProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ThemeColorMeta />
        {children}
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
