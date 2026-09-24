import { v } from "convex/values";
import {
  internalQuery,
  mutation,
  query,
  type QueryCtx,
} from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { CATEGORIES } from "./schema";
import {
  MIN_INITIAL_BID,
  normalizeHttpUrl,
  slugify,
} from "./validate";
import type { Doc, Id } from "./_generated/dataModel";

export type LeaderboardTab = "all" | "today" | "week" | "new";

export type RankedProduct = Doc<"products"> & {
  rank: number;
  ownerName: string;
  windowSpend?: number;
};

function compareRanked(
  a: { currentBid: number; bidUpdatedAt: number },
  b: { currentBid: number; bidUpdatedAt: number },
) {
  if (b.currentBid !== a.currentBid) return b.currentBid - a.currentBid;
  return a.bidUpdatedAt - b.bidUpdatedAt;
}

async function ownerName(ctx: QueryCtx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  return user?.name ?? user?.email?.split("@")[0] ?? "Founder";
}

/** Rank (1-based) a bid would achieve among active products. */
export async function rankForBid(
  ctx: QueryCtx,
  bid: number,
  bidUpdatedAt: number,
  excludeProductId?: Id<"products">,
): Promise<number> {
  const actives = await ctx.db
    .query("products")
    .withIndex("by_status_bid", (q) => q.eq("status", "active"))
    .collect();
  let rank = 1;
  for (const p of actives) {
    if (excludeProductId && p._id === excludeProductId) continue;
    if (
      p.currentBid > bid ||
      (p.currentBid === bid && p.bidUpdatedAt < bidUpdatedAt)
    ) {
      rank += 1;
    }
  }
  return rank;
}

async function withRanks(
  ctx: QueryCtx,
  products: Doc<"products">[],
): Promise<RankedProduct[]> {
  const sorted = [...products].sort(compareRanked);
  return Promise.all(
    sorted.map(async (p, i) => ({
      ...p,
      rank: i + 1,
      ownerName: await ownerName(ctx, p.userId),
    })),
  );
}

export const leaderboard = query({
  args: {
    tab: v.union(
      v.literal("all"),
      v.literal("today"),
      v.literal("week"),
      v.literal("new"),
    ),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<RankedProduct[]> => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    const matchesCategory = (p: Doc<"products">) =>
      !args.category || args.category === "All" || p.category === args.category;

    if (args.tab === "new") {
      const products = await ctx.db
        .query("products")
        .withIndex("by_status_created", (q) => q.eq("status", "active"))
        .order("desc")
        .take(limit * 2);
      const filtered = products.filter(matchesCategory).slice(0, limit);
      return Promise.all(
        filtered.map(async (p) => ({
          ...p,
          rank: await rankForBid(ctx, p.currentBid, p.bidUpdatedAt),
          ownerName: await ownerName(ctx, p.userId),
        })),
      );
    }

    if (args.tab === "today" || args.tab === "week") {
      const windowMs =
        args.tab === "today" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
      const since = Date.now() - windowMs;
      const recentBids = await ctx.db
        .query("bids")
        .withIndex("by_created", (q) => q.gte("createdAt", since))
        .collect();
      const spend = new Map<string, number>();
      for (const b of recentBids) {
        if (b.status !== "completed") continue;
        const key = b.productId as unknown as string;
        spend.set(key, (spend.get(key) ?? 0) + b.amountPaid);
      }
      const out: RankedProduct[] = [];
      for (const [productId, windowSpend] of spend) {
        const p = await ctx.db.get(productId as unknown as Id<"products">);
        if (!p || p.status !== "active" || !matchesCategory(p)) continue;
        out.push({
          ...p,
          rank: 0,
          ownerName: await ownerName(ctx, p.userId),
          windowSpend,
        });
      }
      out.sort((a, b) => (b.windowSpend ?? 0) - (a.windowSpend ?? 0));
      out.forEach((p, i) => (p.rank = i + 1));
      return out.slice(0, limit);
    }

    const products = await ctx.db
      .query("products")
      .withIndex("by_status_bid", (q) => q.eq("status", "active"))
      .collect();
    return (await withRanks(ctx, products.filter(matchesCategory))).slice(
      0,
      limit,
    );
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!product) return null;
    const rank = await rankForBid(
      ctx,
      product.currentBid,
      product.bidUpdatedAt,
    );
    const history = await ctx.db
      .query("bidEvents")
      .withIndex("by_product", (q) => q.eq("productId", product._id))
      .order("desc")
      .take(20);
    return {
      ...product,
      rank,
      ownerName: await ownerName(ctx, product.userId),
      history,
    };
  },
});

export const getById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;
    return {
      ...product,
      rank: await rankForBid(
        ctx,
        product.currentBid,
        product.bidUpdatedAt,
      ),
      ownerName: await ownerName(ctx, product.userId),
    };
  },
});

export const myProducts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const products = await ctx.db
      .query("products")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return Promise.all(
      products.map(async (p) => ({
        ...p,
        rank:
          p.status === "active"
            ? await rankForBid(ctx, p.currentBid, p.bidUpdatedAt)
            : null,
      })),
    );
  },
});

export const categories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_status_bid", (q) => q.eq("status", "active"))
      .collect();
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return CATEGORIES.map((name) => ({ name, count: counts.get(name) ?? 0 }));
  },
});

export const topBidsByCategory = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_status_bid", (q) => q.eq("status", "active"))
      .collect();
    const stats = new Map<string, { count: number; topBid: number }>();
    for (const p of products) {
      const s = stats.get(p.category) ?? { count: 0, topBid: 0 };
      s.count += 1;
      if (p.currentBid > s.topBid) s.topBid = p.currentBid;
      stats.set(p.category, s);
    }
    return CATEGORIES.map((name) => ({
      name,
      count: stats.get(name)?.count ?? 0,
      topBid: stats.get(name)?.topBid ?? 0,
    }));
  },
});

export const submit = mutation({
  args: {
    name: v.string(),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    tagline: v.string(),
    description: v.string(),
    category: v.string(),
    founderName: v.string(),
    twitterUrl: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in to list your SaaS.");

    const name = args.name.trim();
    if (name.length < 2 || name.length > 60) {
      throw new Error("Name must be 2–60 characters.");
    }
    if (!CATEGORIES.includes(args.category as (typeof CATEGORIES)[number])) {
      throw new Error("Please choose a valid category.");
    }
    const websiteUrl = normalizeHttpUrl(args.websiteUrl, "Website URL");
    const logoUrl = args.logoUrl
      ? normalizeHttpUrl(args.logoUrl, "Logo URL")
      : undefined;
    const twitterUrl = args.twitterUrl
      ? normalizeHttpUrl(args.twitterUrl, "X/Twitter URL")
      : undefined;
    const demoUrl = args.demoUrl
      ? normalizeHttpUrl(args.demoUrl, "Demo URL")
      : undefined;
    const tagline = args.tagline.trim();
    if (tagline.length < 5 || tagline.length > 120) {
      throw new Error("Tagline must be 5–120 characters.");
    }
    if (args.description.trim().length < 20) {
      throw new Error("Description must be at least 20 characters.");
    }
    if (args.founderName.trim().length < 2) {
      throw new Error("Founder name is required.");
    }

    let slug = slugify(name);
    let candidate = slug;
    for (let i = 2; i < 100; i++) {
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", candidate))
        .unique();
      if (!existing) break;
      candidate = `${slug}-${i}`;
    }
    slug = candidate;

    const now = Date.now();
    return await ctx.db.insert("products", {
      userId,
      name,
      slug,
      websiteUrl,
      logoUrl,
      tagline,
      description: args.description.trim(),
      category: args.category,
      founderName: args.founderName.trim(),
      twitterUrl,
      demoUrl,
      currentBid: 0,
      lifetimeAmountPaid: 0,
      clickCount: 0,
      bidUpdatedAt: now,
      status: "awaiting_payment",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.string(),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    tagline: v.string(),
    description: v.string(),
    category: v.string(),
    founderName: v.string(),
    twitterUrl: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated.");
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");
    if (product.userId !== userId) throw new Error("Not your product.");
    const websiteUrl = normalizeHttpUrl(args.websiteUrl, "Website URL");
    const logoUrl = args.logoUrl
      ? normalizeHttpUrl(args.logoUrl, "Logo URL")
      : undefined;
    const twitterUrl = args.twitterUrl
      ? normalizeHttpUrl(args.twitterUrl, "X/Twitter URL")
      : undefined;
    const demoUrl = args.demoUrl
      ? normalizeHttpUrl(args.demoUrl, "Demo URL")
      : undefined;
    const { productId, ...fields } = args;
    await ctx.db.patch(productId, {
      ...fields,
      websiteUrl,
      logoUrl,
      twitterUrl,
      demoUrl,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated.");
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");
    if (product.userId !== userId) throw new Error("Not your product.");
    if (product.status === "active") {
      throw new Error("Active listings cannot be deleted directly while live.");
    }
    const bids = await ctx.db
      .query("bids")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    for (const b of bids) {
      await ctx.db.delete(b._id);
    }
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    for (const pay of payments) {
      await ctx.db.delete(pay._id);
    }
    const bidEvents = await ctx.db
      .query("bidEvents")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    for (const be of bidEvents) {
      await ctx.db.delete(be._id);
    }
    const clicks = await ctx.db
      .query("clicks")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    for (const c of clicks) {
      await ctx.db.delete(c._id);
    }
    await ctx.db.delete(args.productId);
  },
});

/** Server-side quote: how much a new bid costs and what rank it earns. */
export const previewBid = query({
  args: {
    productId: v.id("products"),
    newBid: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in to bid.");
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");
    if (product.userId !== userId) throw new Error("You can only bid on your own product.");
    if (!Number.isInteger(args.newBid) || args.newBid <= product.currentBid) {
      throw new Error("New bid must be higher than the current bid.");
    }
    if (product.currentBid === 0 && args.newBid < MIN_INITIAL_BID) {
      throw new Error(`Minimum initial bid is ₹${MIN_INITIAL_BID / 100}.`);
    }
    const amountDue = args.newBid - product.currentBid;
    const estimatedRank = await rankForBid(
      ctx,
      args.newBid,
      Date.now(),
      product._id,
    );
    return { currentBid: product.currentBid, amountDue, estimatedRank };
  },
});

export const internalGetForBilling = internalQuery({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => ctx.db.get(args.productId),
});
