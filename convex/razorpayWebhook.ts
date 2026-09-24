import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

function toHex(bytes: ArrayBuffer): string {
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifySignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const expected = toHex(mac);
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Razorpay webhook. Verifies the HMAC signature, then applies payment
 * through the provider-agnostic mutation (idempotent — safe to retry).
 */
export const handleRazorpayWebhook = httpAction(async (ctx, req) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 500 });

  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const rawBody = await req.text();
  if (!(await verifySignature(rawBody, signature, secret))) {
    return new Response("Bad signature", { status: 400 });
  }

  let event: {
    event?: string;
    payload?: {
      payment?: { entity?: { id?: string; order_id?: string; amount?: number } };
      order?: { entity?: { id?: string; amount?: number } };
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Bad payload", { status: 400 });
  }

  try {
    if (
      event.event === "payment.captured" ||
      event.event === "order.paid"
    ) {
      const entity: { id?: string; order_id?: string; amount?: number } | undefined =
        event.event === "order.paid"
          ? event.payload?.order?.entity
          : event.payload?.payment?.entity;
      const orderId =
        event.event === "order.paid"
          ? entity?.id
          : entity?.order_id;
      const paymentId = entity?.id ?? "";
      const amount = entity?.amount ?? 0;
      if (!orderId) return new Response("Missing order id", { status: 400 });
      await ctx.runMutation(internal.payments.applyProviderPayment, {
        provider: "razorpay",
        providerOrderId: orderId,
        providerPaymentId: paymentId,
        amount,
      });
    } else if (event.event === "payment.failed") {
      const entity = event.payload?.payment?.entity;
      await ctx.runMutation(internal.payments.markPaymentFailed, {
        provider: "razorpay",
        providerOrderId: entity?.order_id,
        providerPaymentId: entity?.id ?? "",
      });
    }
  } catch (e) {
    return new Response(`Handler error: ${(e as Error).message}`, {
      status: 400,
    });
  }
  return new Response("OK", { status: 200 });
});
