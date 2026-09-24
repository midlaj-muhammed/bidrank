import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { isAdminEmail, slugify } from "./validate";

type SeedProduct = {
  name: string;
  tagline: string;
  description: string;
  category: string;
  founderName: string;
  websiteUrl: string;
  logoUrl: string;
  twitterUrl?: string;
  demoUrl?: string;
  bidPaise: number;
  clicks: number;
};

export const POPULAR_BRANDS: SeedProduct[] = [
  {
    name: "OpenAI ChatGPT",
    tagline: "The world's most capable AI conversational model",
    description: "ChatGPT helps you brainstorm, write, learn, code, and automate complex tasks with advanced reasoning capabilities and custom GPTs.",
    category: "AI",
    founderName: "Sam Altman",
    websiteUrl: "https://chatgpt.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    twitterUrl: "https://x.com/OpenAI",
    demoUrl: "https://chatgpt.com",
    bidPaise: 1500000, // ₹15,000
    clicks: 24800,
  },
  {
    name: "Linear",
    tagline: "The issue tracking tool you'll actually enjoy using",
    description: "Linear is a purpose-built tool for planning and building products. Streamline issues, sprints, and product roadmaps with unmatched speed and keyboard navigation.",
    category: "Productivity",
    founderName: "Karri Saarinen",
    websiteUrl: "https://linear.app",
    logoUrl: "https://www.google.com/s2/favicons?domain=linear.app&sz=128",
    twitterUrl: "https://x.com/linear",
    demoUrl: "https://linear.app",
    bidPaise: 1150000, // ₹11,500
    clicks: 19450,
  },
  {
    name: "Vercel",
    tagline: "Build and deploy the modern web at global scale",
    description: "Vercel's Frontend Cloud gives developers the collaborative tools and high-performance serverless infrastructure to build and deploy web applications instantly.",
    category: "Developer Tools",
    founderName: "Guillermo Rauch",
    websiteUrl: "https://vercel.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
    twitterUrl: "https://x.com/vercel",
    demoUrl: "https://vercel.com",
    bidPaise: 890000, // ₹8,900
    clicks: 16320,
  },
  {
    name: "Figma",
    tagline: "How the world designs and builds digital products",
    description: "Figma is the leading collaborative design platform where teams brainstorm, design, prototype, and build digital products in realtime in the browser.",
    category: "Design",
    founderName: "Dylan Field",
    websiteUrl: "https://figma.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
    twitterUrl: "https://x.com/figma",
    demoUrl: "https://figma.com",
    bidPaise: 650000, // ₹6,500
    clicks: 14200,
  },
  {
    name: "Stripe",
    tagline: "Financial infrastructure for the internet economy",
    description: "Millions of companies of all sizes—from startups to Fortune 500s—use Stripe's software and APIs to accept payments, send payouts, and manage their businesses online.",
    category: "Finance",
    founderName: "Patrick Collison",
    websiteUrl: "https://stripe.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    twitterUrl: "https://x.com/stripe",
    demoUrl: "https://stripe.com",
    bidPaise: 480000, // ₹4,800
    clicks: 12800,
  },
  {
    name: "Cursor",
    tagline: "The AI-first code editor built for hyper-productive engineers",
    description: "Cursor is an intelligent fork of VS Code powered by frontier AI models. Generate code diffs, edit multiple files at once, and chat with your entire codebase seamlessly.",
    category: "Developer Tools",
    founderName: "Michael Truell",
    websiteUrl: "https://cursor.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=cursor.com&sz=128",
    twitterUrl: "https://x.com/cursor_ai",
    demoUrl: "https://cursor.com",
    bidPaise: 375000, // ₹3,750
    clicks: 11400,
  },
  {
    name: "PostHog",
    tagline: "The single platform for product analytics, session replay & flags",
    description: "PostHog gives engineering and product teams everything needed to understand user behavior, capture feedback, run A/B experiments, and ship better products.",
    category: "Analytics",
    founderName: "James Hawkins",
    websiteUrl: "https://posthog.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=posthog.com&sz=128",
    twitterUrl: "https://x.com/PostHog",
    demoUrl: "https://posthog.com",
    bidPaise: 290000, // ₹2,900
    clicks: 9750,
  },
  {
    name: "Resend",
    tagline: "Email for developers — modern, fast, and deliverable",
    description: "Resend is the developer-first email platform that turns sending transactional emails into an art form with React Email templates, webhooks, and enterprise deliverability.",
    category: "Marketing",
    founderName: "Zeno Rocha",
    websiteUrl: "https://resend.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=resend.com&sz=128",
    twitterUrl: "https://x.com/resend",
    demoUrl: "https://resend.com",
    bidPaise: 210000, // ₹2,100
    clicks: 8400,
  },
  {
    name: "Supabase",
    tagline: "The open source Firebase alternative with Postgres",
    description: "Supabase provides all the backend features you need to build a product: Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.",
    category: "Developer Tools",
    founderName: "Paul Copplestone",
    websiteUrl: "https://supabase.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=supabase.com&sz=128",
    twitterUrl: "https://x.com/supabase",
    demoUrl: "https://supabase.com",
    bidPaise: 165000, // ₹1,650
    clicks: 7120,
  },
  {
    name: "Notion",
    tagline: "The connected workspace where better, faster work happens",
    description: "Notion is a single space where you can think, write, and plan. Capture thoughts, manage projects, or even run an entire company, exactly the way you want.",
    category: "Productivity",
    founderName: "Ivan Zhao",
    websiteUrl: "https://notion.so",
    logoUrl: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
    twitterUrl: "https://x.com/NotionHQ",
    demoUrl: "https://notion.so",
    bidPaise: 120000, // ₹1,200
    clicks: 6300,
  },
  {
    name: "Perplexity AI",
    tagline: "Where knowledge begins — AI powered conversational search",
    description: "Perplexity provides cited answers to any question in seconds, combining web search with generative AI to make research instant and transparent.",
    category: "AI",
    founderName: "Aravind Srinivas",
    websiteUrl: "https://perplexity.ai",
    logoUrl: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
    twitterUrl: "https://x.com/perplexity_ai",
    demoUrl: "https://perplexity.ai",
    bidPaise: 85000, // ₹850
    clicks: 5420,
  },
  {
    name: "HubSpot",
    tagline: "Customer platform that powers seamless inbound sales & CRM",
    description: "HubSpot connects your data, teams, and customers on one customer platform that grows with your business from lead capture to deal close.",
    category: "Sales",
    founderName: "Dharmesh Shah",
    websiteUrl: "https://hubspot.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=hubspot.com&sz=128",
    twitterUrl: "https://x.com/HubSpot",
    demoUrl: "https://hubspot.com",
    bidPaise: 60000, // ₹600
    clicks: 4890,
  },
  {
    name: "Wise",
    tagline: "Money for here, there, and everywhere",
    description: "Wise is the international account for sending, spending, and receiving currencies at the real mid-market exchange rate without hidden fees.",
    category: "Finance",
    founderName: "Kristo Käärmann",
    websiteUrl: "https://wise.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=wise.com&sz=128",
    twitterUrl: "https://x.com/Wise",
    demoUrl: "https://wise.com",
    bidPaise: 45000, // ₹450
    clicks: 3920,
  },
  {
    name: "Loom",
    tagline: "One video is worth a thousand words",
    description: "Loom is the video messaging tool that helps you get your message across through instantly shareable videos of your screen, camera, and voice.",
    category: "Productivity",
    founderName: "Joe Thomas",
    websiteUrl: "https://loom.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=loom.com&sz=128",
    twitterUrl: "https://x.com/loom",
    demoUrl: "https://loom.com",
    bidPaise: 25000, // ₹250
    clicks: 3100,
  },
  {
    name: "Midjourney",
    tagline: "Expanding human imagination through generative visuals",
    description: "An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species through visual generative AI.",
    category: "Consumer",
    founderName: "David Holz",
    websiteUrl: "https://midjourney.com",
    logoUrl: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
    twitterUrl: "https://x.com/midjourney",
    demoUrl: "https://midjourney.com",
    bidPaise: 10000, // ₹100
    clicks: 2450,
  },
];

/**
 * Clear all database records (products, bids, payments, bidEvents, clicks).
 * Callable from Admin Portal or CLI (`npx convex run seed:clearAll`).
 */
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId) {
      const me = await ctx.db.get(userId);
      if (!isAdminEmail(me?.email)) throw new Error("Admin only.");
    }

    const [products, bids, payments, bidEvents, clicks] = await Promise.all([
      ctx.db.query("products").collect(),
      ctx.db.query("bids").collect(),
      ctx.db.query("payments").collect(),
      ctx.db.query("bidEvents").collect(),
      ctx.db.query("clicks").collect(),
    ]);

    for (const p of products) await ctx.db.delete(p._id);
    for (const b of bids) await ctx.db.delete(b._id);
    for (const pay of payments) await ctx.db.delete(pay._id);
    for (const be of bidEvents) await ctx.db.delete(be._id);
    for (const c of clicks) await ctx.db.delete(c._id);

    return {
      deletedProducts: products.length,
      deletedBids: bids.length,
      deletedPayments: payments.length,
      deletedEvents: bidEvents.length,
      deletedClicks: clicks.length,
    };
  },
});

/** Seed popular, recognizable SaaS brands with real logos. */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    let userId = await getAuthUserId(ctx);
    if (userId) {
      const me = await ctx.db.get(userId);
      if (!isAdminEmail(me?.email)) throw new Error("Admin only.");
    } else {
      // CLI execution fallback: find first registered user or create system seed user
      const firstUser = await ctx.db.query("users").first();
      if (firstUser) {
        userId = firstUser._id;
      } else {
        userId = await ctx.db.insert("users", {
          name: "BidRank System",
          email: "admin@bidrank.io",
        });
      }
    }

    let created = 0;
    const now = Date.now();
    for (let i = 0; i < POPULAR_BRANDS.length; i++) {
      const s = POPULAR_BRANDS[i];
      const slug = slugify(s.name);
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) continue;

      // Stagger timestamps across the past week so "Today" and "This Week" views look authentic
      const ts = now - (POPULAR_BRANDS.length - i) * 6 * 60 * 60 * 1000;
      const id = await ctx.db.insert("products", {
        userId: userId!,
        name: s.name,
        slug,
        websiteUrl: s.websiteUrl,
        logoUrl: s.logoUrl,
        tagline: s.tagline,
        description: s.description,
        category: s.category,
        founderName: s.founderName,
        twitterUrl: s.twitterUrl,
        demoUrl: s.demoUrl,
        currentBid: s.bidPaise,
        lifetimeAmountPaid: s.bidPaise,
        clickCount: s.clicks,
        bidUpdatedAt: ts,
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      });

      const paymentId = await ctx.db.insert("payments", {
        userId: userId!,
        productId: id,
        provider: "razorpay",
        providerPaymentId: `seed_pay_${i + 1}`,
        providerOrderId: `seed_order_${i + 1}`,
        amount: s.bidPaise,
        currency: "INR",
        status: "completed",
        type: "initial",
        createdAt: ts,
      });

      await ctx.db.insert("bids", {
        productId: id,
        userId: userId!,
        previousBid: 0,
        newBid: s.bidPaise,
        amountPaid: s.bidPaise,
        paymentId,
        status: "completed",
        createdAt: ts,
      });

      await ctx.db.insert("bidEvents", {
        productId: id,
        previousRank: undefined,
        newRank: i + 1,
        previousBid: 0,
        newBid: s.bidPaise,
        createdAt: ts,
      });

      created += 1;
    }
    return { created };
  },
});
