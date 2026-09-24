import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List your SaaS",
  description:
    "Submit your SaaS product to the live BidRank auction leaderboard. Set your opening bid from ₹10 and start getting discovered.",
  openGraph: {
    title: "List your SaaS | BidRank",
    description:
      "Submit your SaaS product to the live BidRank auction leaderboard. Set your opening bid from ₹10 and start getting discovered.",
  },
};

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
