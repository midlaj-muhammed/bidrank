"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "@convex-dev/auth/react";
import { toast } from "sonner";
import { ExternalLink, Loader2, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { formatBid } from "@/lib/format";
import { normalizeUrlInput } from "@/lib/urls";
import { CATEGORIES } from "@/lib/categories";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductLogo, type RankedProduct } from "@/components/product-card";
import { BidDialog } from "@/components/bid-dialog";

function EditForm({
  product,
  onDone,
}: {
  product: RankedProduct;
  onDone: () => void;
}) {
  const update = useMutation(api.products.update);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    websiteUrl: product.websiteUrl,
    logoUrl: product.logoUrl ?? "",
    tagline: product.tagline,
    description: product.description,
    category: product.category,
    founderName: product.founderName,
    twitterUrl: product.twitterUrl ?? "",
    demoUrl: product.demoUrl ?? "",
  });
  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleUrlBlur = (k: keyof typeof form) => (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (val && !/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(val)) {
      setForm((f) => ({ ...f, [k]: `https://${val}` }));
    }
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const norm = (v: string) => {
        return normalizeUrlInput(v);
      };
      const websiteUrl = norm(form.websiteUrl);
      const logoUrl = norm(form.logoUrl) || undefined;
      const twitterUrl = norm(form.twitterUrl) || undefined;
      const demoUrl = norm(form.demoUrl) || undefined;

      setForm((f) => ({
        ...f,
        websiteUrl,
        logoUrl: logoUrl ?? "",
        twitterUrl: twitterUrl ?? "",
        demoUrl: demoUrl ?? "",
      }));

      await update({
        productId: product._id,
        ...form,
        websiteUrl,
        logoUrl,
        twitterUrl,
        demoUrl,
      });
      toast.success("Saved.");
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-3 space-y-3 rounded-xl bg-muted p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Name (2–60 chars)</Label>
          <Input value={form.name} minLength={2} maxLength={60} onChange={set("name")} required />
        </div>
        <div className="space-y-1">
          <Label>Website</Label>
          <Input
            value={form.websiteUrl}
            inputMode="url"
            onChange={set("websiteUrl")}
            onBlur={handleUrlBlur("websiteUrl")}
            placeholder="acme.com"
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <Label>Tagline</Label>
          <span className="text-xs text-muted-foreground">{form.tagline.length}/120 (min 5)</span>
        </div>
        <Input value={form.tagline} minLength={5} maxLength={120} onChange={set("tagline")} required />
      </div>
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
          <Label>Description</Label>
          <span className="text-xs text-muted-foreground">{form.description.length} chars (min 20)</span>
        </div>
        <Textarea value={form.description} minLength={20} onChange={set("description")} rows={3} required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1"><Label>Category</Label>
          <Select value={form.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Founder</Label>
          <Input value={form.founderName} minLength={2} onChange={set("founderName")} required />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label>Logo URL</Label>
          <Input
            value={form.logoUrl}
            inputMode="url"
            onChange={set("logoUrl")}
            onBlur={handleUrlBlur("logoUrl")}
            placeholder="acme.com/logo.png"
          />
        </div>
        <div className="space-y-1">
          <Label>X URL</Label>
          <Input
            value={form.twitterUrl}
            inputMode="url"
            onChange={set("twitterUrl")}
            onBlur={handleUrlBlur("twitterUrl")}
            placeholder="x.com/yourhandle"
          />
        </div>
        <div className="space-y-1">
          <Label>Demo URL</Label>
          <Input
            value={form.demoUrl}
            inputMode="url"
            onChange={set("demoUrl")}
            onBlur={handleUrlBlur("demoUrl")}
            placeholder="demo.acme.com"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={busy}>{busy && <Loader2 className="animate-spin" />} Save</Button>
        <Button size="sm" variant="ghost" type="button" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const products = useQuery(api.products.myProducts, isAuthenticated ? {} : "skip");
  const removeProduct = useMutation(api.products.remove);
  const [editing, setEditing] = useState<string | null>(null);
  const [bidTarget, setBidTarget] = useState<RankedProduct | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(productId: Id<"products">, name: string) {
    if (!confirm(`Delete draft "${name}"? This cannot be undone.`)) return;
    setDeletingId(productId);
    try {
      await removeProduct({ productId });
      toast.success("Draft deleted.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading) return <p className="pt-12 text-center text-muted-foreground">Loading…</p>;
  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md pt-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">Sign in to view your dashboard</h1>
        <Link href="/signin" className={buttonVariants({})}>Sign in</Link>
      </div>
    );
  }
  if (products === undefined) return <p className="pt-12 text-center text-muted-foreground">Loading…</p>;

  const totalSpent = products.reduce((s, p) => s + p.lifetimeAmountPaid, 0);
  const totalClicks = products.reduce((s, p) => s + p.clickCount, 0);
  const activeProducts = products.filter((p) => p.status === "active");
  const bestProduct = [...activeProducts]
    .filter((p) => p.rank !== null)
    .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))[0];
  const bestRank = bestProduct?.rank;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 lg:py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-display-md font-black tracking-tight">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Your bids, clicks and rank at a glance.</p>
        </div>
        <Link href="/submit" className={buttonVariants({ size: "sm" })}>
          <Plus /> Add another SaaS
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "SaaS products", value: String(products.length) },
          { label: "Bids spent", value: formatBid(totalSpent) },
          { label: "Clicks received", value: totalClicks.toLocaleString("en-IN") },
          { label: "Best rank", value: bestRank ? `#${bestRank}` : "—" },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="text-xs font-semibold text-muted-foreground">{c.label}</div>
              <div className="mt-2 font-display text-2xl font-black leading-8 tabular-nums tracking-tight">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            No products yet.{" "}
            <Link href="/submit" className="font-semibold text-primary hover:underline">
              List your first SaaS
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle>Your products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-muted">
              {products.map((p) => (
                <div key={p._id}>
                  <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
                    <ProductLogo name={p.name} logoUrl={p.logoUrl} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold">{p.name}</span>
                        <Badge
                          variant={p.status === "active" ? "positive" : "secondary"}
                          className="text-[11px] font-medium"
                        >
                          {p.rank ? `#${p.rank}` : p.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                        {formatBid(p.currentBid)} bid · {p.clickCount.toLocaleString("en-IN")} clicks ·{" "}
                        {formatBid(p.lifetimeAmountPaid)} spent
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <div className="text-[15px] font-black tabular-nums tracking-tight">{formatBid(p.currentBid)}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(editing === p._id ? null : p._id)}>
                        <Pencil />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          setBidTarget({ ...p, rank: p.rank ?? 999, ownerName: "" })
                        }
                      >
                        <Zap />
                        <span className="hidden sm:inline">
                          {p.status === "awaiting_payment" ? "Place Opening Bid" : "Increase Bid"}
                        </span>
                      </Button>
                      {p.status === "active" && (
                        <Link href={`/product/${p.slug}`} className={buttonVariants({ size: "sm", variant: "ghost" })}>
                          <ExternalLink />
                        </Link>
                      )}
                      {p.status !== "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive-bg hover:text-destructive"
                          disabled={deletingId === p._id}
                          onClick={() => handleDelete(p._id, p.name)}
                          aria-label={`Delete ${p.name}`}
                          title="Delete draft"
                        >
                          {deletingId === p._id ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        </Button>
                      )}
                    </div>
                  </div>
                  {editing === p._id && (
                    <div className="border-t border-muted bg-muted/50 px-4 py-4 sm:px-5">
                      <EditForm
                        product={{ ...p, rank: p.rank ?? 999, ownerName: "" }}
                        onDone={() => setEditing(null)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <BidDialog target={bidTarget} onClose={() => setBidTarget(null)} />
    </div>
  );
}
