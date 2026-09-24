import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Create an account on BidRank to list your SaaS and place bids.",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
