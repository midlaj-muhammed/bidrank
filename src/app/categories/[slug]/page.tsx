import type { Metadata } from "next";
import Link from "next/link";
import { Leaderboard } from "@/components/leaderboard";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  return {
    title: `${category} SaaS Leaderboard`,
    description: `Browse top ${category} SaaS products ranked by bids on BidRank.`,
    openGraph: {
      title: `${category} SaaS Leaderboard | BidRank`,
      description: `Browse top ${category} SaaS products ranked by bids on BidRank.`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 lg:py-16">
      <div>
        <Link href="/categories" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          ← All categories
        </Link>
        <h1 className="mt-2 font-display text-display-md font-black tracking-tight">{category}</h1>
      </div>
      <Leaderboard initialCategory={category} />
    </div>
  );
}
