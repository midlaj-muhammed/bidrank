import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { isAdminEmail } from "./validate";
import { rankForBid } from "./products";

async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated.");
  const user = await ctx.db.get(userId);
  if (!isAdminEmail(user?.email)) throw new Error("Admin only.");
  return userId;
}

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;
    const user = await ctx.db.get(userId);
    return isAdminEmail(user?.email);
  },
});

export const overview = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [products, payments, users] = await Promise.all([
      ctx.db.query("products").order("desc").take(200),
      ctx.db.query("payments").order("desc").take(50),
      ctx.db.query("users").order("desc").take(5),
    ]);
    let revenue = 0;
    for (const p of payments) {
      if (p.status === "completed") revenue += p.amount;
    }
    const active = products.filter((p) => p.status === "active").length;
    const totalClicks = products.reduce((s, p) => s + p.clickCount, 0);
    return {
      revenue,
      active,
      total: products.length,
      totalClicks,
      recentPayments: payments,
      recentUsers: users.length,
      products,
    };
  },
});

export const allProducts = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const products = await ctx.db.query("products").order("desc").take(200);
    return Promise.all(
      products.map(async (p) => {
        const owner = await ctx.db.get(p.userId);
        return {
          ...p,
          ownerEmail: owner?.email ?? "?",
          rank:
            p.status === "active"
              ? await rankForBid(ctx, p.currentBid, p.bidUpdatedAt)
              : null,
        };
      }),
    );
  },
});

export const setStatus = mutation({
  args: {
    productId: v.id("products"),
    status: v.union(
      v.literal("active"),
      v.literal("suspended"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");
    await ctx.db.patch(args.productId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const getAwaitingAndPending = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_status_bid", (q) => q.eq("status", "awaiting_payment"))
      .collect();
    const payments = await ctx.db
      .query("payments")
      .order("desc")
      .take(50);
    return { products, payments };
  },
});

export const manuallyActivateProduct = mutation({
  args: {
    productId: v.id("products"),
    bidPaise: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");
    const now = Date.now();
    const bid = args.bidPaise ?? (product.currentBid > 0 ? product.currentBid : 1600000);
    await ctx.db.patch(args.productId, {
      status: "active",
      currentBid: bid,
      lifetimeAmountPaid: product.lifetimeAmountPaid > 0 ? product.lifetimeAmountPaid : bid,
      bidUpdatedAt: now,
      updatedAt: now,
    });
    const newRank = await rankForBid(ctx, bid, now);
    await ctx.db.insert("bidEvents", {
      productId: product._id,
      previousRank: undefined,
      newRank,
      previousBid: 0,
      newBid: bid,
      createdAt: now,
    });
    return { success: true, rank: newRank };
  },
});
