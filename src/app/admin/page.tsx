"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { Loader2, Sprout } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { formatBid } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const admin = useQuery(api.admin.isAdmin, isAuthenticated ? {} : "skip");
  const data = useQuery(api.admin.overview, admin ? {} : "skip");
  const products = useQuery(api.admin.allProducts, admin ? {} : "skip");
  const setStatus = useMutation(api.admin.setStatus);
  const seed = useMutation(api.seed.seed);
  const [seeding, setSeeding] = useState(false);

  if (isLoading) return <p className="pt-12 text-center text-muted-foreground">Loading…</p>;
  if (!isAuthenticated || admin === false) {
    return <p className="pt-12 text-center text-muted-foreground">Admin only.</p>;
  }
  if (!data || !products) return <p className="pt-12 text-center text-muted-foreground">Loading…</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 lg:py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-display-md font-black tracking-tight">Admin</h1>
        <Button
          variant="outline"
          size="sm"
          disabled={seeding}
          onClick={async () => {
            setSeeding(true);
            try {
              const r = await seed({});
              toast.success(`Seeded ${r.created} products.`);
            } catch (e) {
              toast.error((e as Error).message);
            } finally {
              setSeeding(false);
            }
          }}
        >
          {seeding ? <Loader2 className="animate-spin" /> : <Sprout />}
          Seed demo data
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Revenue", value: formatBid(data.revenue) },
          { label: "Active", value: `${data.active}/${data.total}` },
          { label: "Clicks", value: data.totalClicks.toLocaleString("en-IN") },
          { label: "Users", value: String(data.recentUsers) },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="text-xs font-semibold text-muted-foreground">{c.label}</div>
              <div className="mt-2 font-display text-2xl font-black leading-8 tabular-nums tracking-tight">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>All products</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="flex flex-wrap items-center gap-2 rounded-md bg-muted p-3 text-sm">
              <Link href={`/product/${p.slug}`} className="font-bold hover:underline">
                {p.rank ? `#${p.rank} ` : ""}{p.name}
              </Link>
              <Badge variant="secondary">{p.category}</Badge>
              <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
              <span className="text-muted-foreground">{formatBid(p.currentBid)} · {p.ownerEmail}</span>
              <span className="ml-auto flex gap-1">
                {p.status === "active" ? (
                  <Button size="sm" variant="outline" onClick={() => setStatus({ productId: p._id, status: "suspended" })}>
                    Suspend
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setStatus({ productId: p._id, status: "active" })}>
                    Restore
                  </Button>
                )}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent payments</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {data.recentPayments.length === 0 && (
            <p className="text-muted-foreground">No payments yet.</p>
          )}
          {data.recentPayments.map((pay) => (
            <div key={pay._id} className="flex flex-wrap gap-2 rounded-md bg-muted p-3">
              <Badge variant={pay.status === "completed" ? "default" : "secondary"}>{pay.status}</Badge>
              <span className="font-semibold">{formatBid(pay.amount)}</span>
              <span className="text-muted-foreground">{pay.provider} · {pay.type} · {pay.providerPaymentId.slice(0, 20)}…</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
