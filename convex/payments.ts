import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { rankForBid } from "./products";

/**
 * Provider-agnostic payment application.
 * Razorpay, Dodo, or any future provider funnels through here so ranking
 * logic never needs to change when the payment provider does.
 */

export const createPending = internalMutation({
  args: {
    productId: v.id("products"),
    userId: v.id("users"),
    newBid: v.number(),
    amountPaid: v.number(),
    provider: v.union(v.literal("razorpay"), v.literal("dodo")),
    providerPaymentId: v.string(),
    providerOrderId: v.optional(v.string()),
    currency: v.string(),
    type: v.union(v.literal("initial"), v.literal("topup")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const paymentId = await ctx.db.insert("payments", {
      userId: args.userId,
      productId: args.productId,
      provider: args.provider,
      providerPaymentId: args.providerPaymentId,
      providerOrderId: args.providerOrderId,
      amount: args.amountPaid,
      currency: args.currency,
      status: "pending",
      type: args.type,
      createdAt: now,
    });
    const product = await ctx.db.get(args.productId);
    const bidId = await ctx.db.insert("bids", {
      productId: args.productId,
      userId: args.userId,
      previousBid: product?.currentBid ?? 0,
      newBid: args.newBid,
      amountPaid: args.amountPaid,
      paymentId,
      status: "pending",
      createdAt: now,
    });
    return { bidId, paymentId };
  },
});

export const getPendingByOrder = internalQuery({
  args: {
    providerOrderId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("payments")
      .withIndex("by_provider_order", (q) =>
        q.eq("provider", "razorpay").eq("providerOrderId", args.providerOrderId),
      )
      .unique();
  },
});

/**
 * Apply a verified provider payment. Idempotent on provider payment id:
 * calling twice (webhook retries or client + webhook) applies the bid exactly once.
 */
export const applyProviderPayment = internalMutation({
  args: {
    provider: v.union(v.literal("razorpay"), v.literal("dodo")),
    providerOrderId: v.optional(v.string()),
    providerPaymentId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    let payment = null;
    if (args.providerOrderId) {
      payment = await ctx.db
        .query("payments")
        .withIndex("by_provider_order", (q) =>
          q.eq("provider", args.provider).eq("providerOrderId", args.providerOrderId),
        )
        .unique();
    }
    payment ??= await ctx.db
      .query("payments")
      .withIndex("by_provider_payment", (q) =>
        q.eq("provider", args.provider).eq("providerPaymentId", args.providerPaymentId),
      )
      .unique();
    if (!payment) throw new Error("Unknown payment.");

    if (payment.status === "completed") {
      return { deduped: true as const, productId: payment.productId };
    }

    if (payment.amount !== args.amount) {
      await ctx.db.patch(payment._id, { status: "failed" });
      throw new Error("Amount mismatch — payment rejected.");
    }

    const product = await ctx.db.get(payment.productId);
    if (!product) throw new Error("Product not found.");

    const bid = await ctx.db
      .query("bids")
      .withIndex("by_payment", (q) => q.eq("paymentId", payment!._id))
      .unique();

    const previousRank = await rankForBid(
      ctx,
      product.currentBid,
      product.bidUpdatedAt,
    );
    const now = Date.now();
    const newBid = bid ? bid.newBid : product.currentBid + payment.amount;

    await ctx.db.patch(product._id, {
      currentBid: newBid,
      lifetimeAmountPaid: product.lifetimeAmountPaid + payment.amount,
      bidUpdatedAt: now,
      status: "active",
      updatedAt: now,
    });
    const newRank = await rankForBid(ctx, newBid, now);

    await ctx.db.patch(payment._id, {
      status: "completed",
      providerPaymentId: args.providerPaymentId,
    });
    if (bid) await ctx.db.patch(bid._id, { status: "completed" });
    await ctx.db.insert("bidEvents", {
      productId: product._id,
      previousRank,
      newRank,
      previousBid: product.currentBid,
      newBid,
      createdAt: now,
    });
    return { deduped: false as const, productId: product._id };
  },
});

export const markPaymentFailed = internalMutation({
  args: {
    provider: v.union(v.literal("razorpay"), v.literal("dodo")),
    providerOrderId: v.optional(v.string()),
    providerPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    let payment = null;
    if (args.providerOrderId) {
      payment = await ctx.db
        .query("payments")
        .withIndex("by_provider_order", (q) =>
          q.eq("provider", args.provider).eq("providerOrderId", args.providerOrderId),
        )
        .unique();
    }
    payment ??= await ctx.db
      .query("payments")
      .withIndex("by_provider_payment", (q) =>
        q.eq("provider", args.provider).eq("providerPaymentId", args.providerPaymentId),
      )
      .unique();
    if (!payment || payment.status !== "pending") return;
    await ctx.db.patch(payment._id, { status: "failed" });
    const bid = await ctx.db
      .query("bids")
      .withIndex("by_payment", (q) => q.eq("paymentId", payment!._id))
      .unique();
    if (bid && bid.status === "pending") {
      await ctx.db.patch(bid._id, { status: "failed" });
    }
  },
});
