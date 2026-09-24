import type { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { CATEGORIES } from "@/lib/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bidrank.io";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${siteUrl}/categories/${encodeURIComponent(c)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (convexUrl) {
      const client = new ConvexHttpClient(convexUrl);
      const products = await client.query(api.products.leaderboard, {
        tab: "all",
        limit: 100,
      });
      if (products) {
        productRoutes = products.map((p) => ({
          url: `${siteUrl}/product/${p.slug}`,
          lastModified: new Date(p.updatedAt || p.createdAt),
          changeFrequency: "daily",
          priority: 0.9,
        }));
      }
    }
  } catch {
    // If convex fetch is unavailable during build-time evaluation, continue with static routes
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
