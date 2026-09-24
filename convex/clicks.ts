import { v } from "convex/values";
import { mutation } from "./_generated/server";

/** Record a click and bump the denormalized counter in one transaction. */
export const record = mutation({
  args: {
    productId: v.id("products"),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found.");
    await ctx.db.insert("clicks", {
      productId: args.productId,
      timestamp: Date.now(),
      referrer: args.referrer?.slice(0, 500),
    });
    await ctx.db.patch(args.productId, {
      clickCount: product.clickCount + 1,
    });
    return { websiteUrl: product.websiteUrl };
  },
});
