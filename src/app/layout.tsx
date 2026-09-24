import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { THEME_COLORS } from "@/lib/theme-colors";

// Wise-style two-face ladder: Manrope 800/900 for hero displays (Wise Sans
// substitute), Inter for sub-displays, body, and labels.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  // Static, OS-scoped tint for the first paint. After hydration,
  // ThemeColorMeta replaces these with a single tag that follows the
  // in-app theme toggle.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bidrank.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BidRank — Pay your way to the top",
    template: "%s | BidRank",
  },
  description:
    "The SaaS leaderboard where founders compete for attention. Bid higher, rank higher, get discovered.",
  keywords: [
    "SaaS leaderboard",
    "product launch",
    "founder directory",
    "SaaS auction",
    "discover startups",
    "b2b software",
    "startup discovery",
  ],
  authors: [{ name: "BidRank" }],
  openGraph: {
    title: "BidRank — Pay your way to the top",
    description:
      "The SaaS leaderboard where founders compete for attention. Bid higher, rank higher, get discovered.",
    url: siteUrl,
    siteName: "BidRank",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BidRank — Pay your way to the top",
    description:
      "The SaaS leaderboard where founders compete for attention. Bid higher, rank higher, get discovered.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} min-h-screen bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
