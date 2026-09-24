import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { ProductDetailView } from "@/components/product-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const product = await client.query(api.products.getBySlug, { slug });
    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested SaaS listing could not be found on BidRank.",
      };
    }

    const title = `${product.name} — ${product.tagline}`;
    const description = product.description.slice(0, 160);
    const images = product.logoUrl ? [product.logoUrl] : [];

    return {
      title,
      description,
      openGraph: {
        title: `${product.name} (Rank #${product.rank}) | BidRank`,
        description: `${product.tagline} — listed by ${product.founderName}`,
        images,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} (Rank #${product.rank}) | BidRank`,
        description: product.tagline,
        images,
      },
    };
  } catch {
    return {
      title: "SaaS Listing",
      description: "Discover top SaaS products on BidRank.",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
