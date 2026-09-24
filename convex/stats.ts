import { query } from "./_generated/server";

export const overview = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_status_bid", (q) => q.eq("status", "active"))
      .take(2000);
    let totalPaid = 0;
    let totalClicks = 0;
    for (const p of products) {
      totalPaid += p.lifetimeAmountPaid;
      totalClicks += p.clickCount;
    }
    return {
      totalBidPaise: totalPaid,
      productCount: products.length,
      clickCount: totalClicks,
    };
  },
});

export const recentActivity = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("bidEvents")
      .order("desc")
      .take(8);
    const results = await Promise.all(
      events.map(async (e) => {
        const product = await ctx.db.get(e.productId);
        if (!product) return null;
        return {
          _id: e._id,
          productId: product._id,
          productName: product.name,
          productSlug: product.slug,
          logoUrl: product.logoUrl,
          founderName: product.founderName,
          previousBid: e.previousBid,
          newBid: e.newBid,
          previousRank: e.previousRank,
          newRank: e.newRank,
          createdAt: e.createdAt,
        };
      }),
    );
    return results.filter((r): r is NonNullable<typeof r> => r !== null);
  },
});
