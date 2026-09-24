import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const CATEGORIES = [
  "AI",
  "Developer Tools",
  "Productivity",
  "Marketing",
  "Sales",
  "Design",
  "Finance",
  "Analytics",
  "Consumer",
  "Other",
] as const;

export const PRODUCT_STATUSES = [
  "draft",
  "awaiting_payment",
  "active",
  "suspended",
  "archived",
] as const;

const productStatus = v.union(
  v.literal("draft"),
  v.literal("awaiting_payment"),
  v.literal("active"),
  v.literal("suspended"),
  v.literal("archived"),
);

export default defineSchema({
  ...authTables,

  products: defineTable({
    userId: v.id("users"),
    name: v.string(),
    slug: v.string(),
    websiteUrl: v.string(),
    logoUrl: v.optional(v.string()),
    tagline: v.string(),
    description: v.string(),
    category: v.string(),
    founderName: v.string(),
    twitterUrl: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
    // Minor currency units (paise). Integer only.
    currentBid: v.number(),
    lifetimeAmountPaid: v.number(),
    // Denormalized click counter (incremented in the same mutation as clicks).
    clickCount: v.number(),
    // When currentBid last changed — tie-break: earliest wins.
    bidUpdatedAt: v.number(),
    status: productStatus,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_user", ["userId"])
    .index("by_status_bid", ["status", "currentBid"])
    .index("by_status_created", ["status", "createdAt"]),

  bids: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    // Minor units.
    previousBid: v.number(),
    newBid: v.number(),
    amountPaid: v.number(),
    paymentId: v.optional(v.id("payments")),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_created", ["createdAt"])
    .index("by_payment", ["paymentId"])
    .index("by_product_created", ["productId", "createdAt"]),

  payments: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    provider: v.union(v.literal("razorpay"), v.literal("dodo")),
    // Razorpay order id at creation, replaced/kept alongside payment id.
    // Unique per provider for idempotent webhooks.
    providerPaymentId: v.string(),
    providerOrderId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    type: v.union(v.literal("initial"), v.literal("topup")),
    createdAt: v.number(),
  })
    .index("by_provider_payment", ["provider", "providerPaymentId"])
    .index("by_provider_order", ["provider", "providerOrderId"])
    .index("by_product", ["productId"])
    .index("by_user", ["userId"]),

  clicks: defineTable({
    productId: v.id("products"),
    timestamp: v.number(),
    referrer: v.optional(v.string()),
  })
    .index("by_product", ["productId"])
    .index("by_product_time", ["productId", "timestamp"]),

  bidEvents: defineTable({
    productId: v.id("products"),
    previousRank: v.optional(v.number()),
    newRank: v.number(),
    previousBid: v.number(),
    newBid: v.number(),
    createdAt: v.number(),
  }).index("by_product", ["productId"]),
});
