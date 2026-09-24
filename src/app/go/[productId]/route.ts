import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const home = new URL("/", req.url);
  try {
    const { productId } = await params;
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const { websiteUrl } = await client.mutation(api.clicks.record, {
      productId: productId as Id<"products">,
      referrer: req.headers.get("referer") ?? undefined,
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: websiteUrl,
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch {
    return new Response(null, {
      status: 302,
      headers: {
        Location: home.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }
}
