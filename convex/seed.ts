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
  bidPaise: number;
  clicks: number;
};

const SEED: SeedProduct[] = [
  { name: "Pulseboard", tagline: "Realtime analytics your team will actually open", description: "Pulseboard plugs into your product database and streams live dashboards, funnels, and alerts to Slack. No ETL pipelines, no stale screenshots — every chart updates the moment your data changes, with anomaly detection built in.", category: "Analytics", founderName: "Aarav Mehta", websiteUrl: "https://pulseboard.example.com", bidPaise: 1250000, clicks: 18420 },
  { name: "Ghostwrite AI", tagline: "Your entire content pipeline on autopilot", description: "Ghostwrite AI researches, drafts, and schedules SEO briefs, blogs, and LinkedIn posts in your brand voice. Human-in-the-loop approvals, plagiarism checks, and one-click publishing to every major CMS.", category: "AI", founderName: "Sara Thomas", websiteUrl: "https://ghostwriteai.example.com", bidPaise: 810000, clicks: 15230 },
  { name: "Shipfast CI", tagline: "Preview environments for every pull request", description: "Shipfast CI spins up isolated preview environments with seeded data for every PR. Comment-driven tear-down, cost caps per team, and first-class monorepo support keep velocity high and cloud bills low.", category: "Developer Tools", founderName: "Rohan Iyer", websiteUrl: "https://shipfastci.example.com", bidPaise: 525000, clicks: 12110 },
  { name: "Calendlyzer", tagline: "Meetings that schedule themselves", description: "Calendlyzer negotiates meeting times across time zones over email, books rooms, and auto-generates agendas from your docs. It even declines conflicts politely on your behalf.", category: "Productivity", founderName: "Priya Nair", websiteUrl: "https://calendlyzer.example.com", bidPaise: 390000, clicks: 9840 },
  { name: "AdOrbit", tagline: "Launch profitable ads in 10 minutes", description: "AdOrbit generates creatives, picks audiences, and reallocates budget across Meta and Google automatically. Kill losers fast, scale winners faster — with plain-English explanations for every move.", category: "Marketing", founderName: "Kabir Shah", websiteUrl: "https://adorbit.example.com", bidPaise: 210000, clicks: 8730 },
  { name: "FigmaFlow", tagline: "Design-to-code without the handoff tax", description: "FigmaFlow converts Figma frames into clean, responsive React + Tailwind components with your design tokens baked in. Version diffs, Storybook export, and accessibility linting included.", category: "Design", founderName: "Ananya Rao", websiteUrl: "https://figmaflow.example.com", bidPaise: 150000, clicks: 7910 },
  { name: "Ledgerly", tagline: "Bookkeeping founders don't dread", description: "Ledgerly categorizes transactions, chases invoices, and closes your monthly books with a single review screen. GST-ready reports and a CA hotline when you need a human.", category: "Finance", founderName: "Vikram Menon", websiteUrl: "https://ledgerly.example.com", bidPaise: 90000, clicks: 6420 },
  { name: "Standupbot", tagline: "Async standups that take 60 seconds", description: "Standupbot collects updates in Slack, summarizes blockers with AI, and posts a digest before your coffee cools. Jira and Linear sync keeps tickets honest without nagging.", category: "Productivity", founderName: "Divya Krishnan", websiteUrl: "https://standupbot.example.com", bidPaise: 50000, clicks: 5210 },
  { name: "PromptVault", tagline: "Version control for LLM prompts", description: "PromptVault tracks every prompt change, A/B tests variants in production, and rolls back bad generations like code. Eval dashboards show quality drift before users notice.", category: "AI", founderName: "Arjun Pillai", websiteUrl: "https://promptvault.example.com", bidPaise: 30000, clicks: 4380 },
  { name: " salestack".trim(), tagline: "Pipeline reviews that run themselves", description: "Salestack scores every deal, flags stalled opportunities, and drafts follow-ups from call transcripts. Managers get a Monday briefing; reps get their evenings back.", category: "Sales", founderName: "Neha Gupta", websiteUrl: "https://salestack.example.com", bidPaise: 15000, clicks: 3150 },
  { name: "Habitloop", tagline: "Tiny habits, streaks that stick", description: "Habitloop turns goals into 2-minute daily actions with smart reminders and streak insurance. Friends can cheer you on — or steal your streak crown.", category: "Consumer", founderName: "Aditya Verma", websiteUrl: "https://habitloop.example.com", bidPaise: 12000, clicks: 2870 },
  { name: "Loglens", tagline: "Search terabytes of logs in milliseconds", description: "Loglens ingests structured logs at any scale and answers questions in plain English. One-click retention policies and usage-based pricing that won't ambush you.", category: "Developer Tools", founderName: "Karthik Nair", websiteUrl: "https://loglens.example.com", bidPaise: 8000, clicks: 2140 },
  { name: "Brandkit", tagline: "Every asset on-brand, every time", description: "Brandkit locks logos, colors, and templates into a shared workspace with approval flows. Marketing ships faster; brand police can finally retire.", category: "Design", founderName: "Meera Joshi", websiteUrl: "https://brandkit.example.com", bidPaise: 5000, clicks: 1690 },
  { name: "Churnguard", tagline: "Catch cancellations before they happen", description: "Churnguard scores at-risk accounts from usage signals and triggers save plays automatically — win-back offers, founder emails, or concierge calls at exactly the right moment.", category: "Sales", founderName: "Farhan Khan", websiteUrl: "https://churnguard.example.com", bidPaise: 2500, clicks: 1210 },
  { name: "Notewise", tagline: "Meeting notes you'll actually revisit", description: "Notewise joins your calls, captures decisions and owners, and files everything searchable by project. Weekly recaps write themselves.", category: "Productivity", founderName: "Lakshmi Anand", websiteUrl: "https://notewise.example.com", bidPaise: 1000, clicks: 860 },
];

function avatar(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;
}

/** Dev seed: realistic leaderboard. Admin only, skips existing slugs. */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in first.");
    const me = await ctx.db.get(userId);
    if (!isAdminEmail(me?.email)) throw new Error("Admin only.");

    let created = 0;
    const now = Date.now();
    for (let i = 0; i < SEED.length; i++) {
      const s = SEED[i];
      const slug = slugify(s.name);
      const existing = await ctx.db
        .query("products")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) continue;
      // Stagger timestamps so ties (none here) and "New" ordering look real.
      const ts = now - (SEED.length - i) * 36 * 60 * 1000;
      const id = await ctx.db.insert("products", {
        userId,
        name: s.name,
        slug,
        websiteUrl: s.websiteUrl,
        logoUrl: avatar(s.name),
        tagline: s.tagline,
        description: s.description,
        category: s.category,
        founderName: s.founderName,
        twitterUrl: undefined,
        demoUrl: undefined,
        currentBid: s.bidPaise,
        lifetimeAmountPaid: s.bidPaise,
        clickCount: s.clicks,
        bidUpdatedAt: ts,
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      });
      const paymentId = await ctx.db.insert("payments", {
        userId,
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
        userId,
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
