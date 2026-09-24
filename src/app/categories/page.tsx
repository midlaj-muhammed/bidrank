import type { Metadata } from "next";
import { CategoriesList } from "@/components/categories-list";

export const metadata: Metadata = {
  title: "SaaS Categories",
  description:
    "Explore SaaS products ranked by live community bids across AI, Developer Tools, Productivity, Marketing, and more.",
  openGraph: {
    title: "SaaS Categories | BidRank",
    description:
      "Explore SaaS products ranked by live community bids across AI, Developer Tools, Productivity, Marketing, and more.",
  },
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 lg:py-16">
      <div>
        <h1 className="font-display text-display-md font-black tracking-tight">
          Categories
        </h1>
        <p className="mt-2 text-lg text-ink-soft">
          Browse the leaderboard by category.
        </p>
      </div>
      <CategoriesList />
    </div>
  );
}
