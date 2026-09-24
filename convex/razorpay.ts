"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import Razorpay from "razorpay";
import {
  CURRENCY,
  MIN_CHARGE,
  MIN_INCREMENT,
  MIN_INITIAL_BID,
} from "./validate";

type OrderResult = {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  productName: string;
};

/**
 * Razorpay order creation. Creates a Razorpay order for the DIFFERENCE
 * between the requested bid and the current bid, then records pending
 * bid + payment rows. The leaderboard only changes in the verified
 * webhook (see razorpayWebhook.ts).
 */
export const createOrder = action({
  args: {
    productId: v.id("products"),
    newBid: v.number(),
  },
  handler: async (ctx, args): Promise<OrderResult> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in to bid.");

    const product: Doc<"products"> | null = await ctx.runQuery(
      internal.products.internalGetForBilling,
      { productId: args.productId },
    );
    if (!product) throw new Error("Product not found.");
    if (product.userId !== userId) {
      throw new Error("You can only bid on products you own.");
    }
    if (product.status !== "awaiting_payment" && product.status !== "active") {
      throw new Error("This listing cannot accept bids right now.");
    }
    if (!Number.isInteger(args.newBid) || args.newBid <= product.currentBid) {
      throw new Error("New bid must be higher than the current bid.");
    }
    if (product.currentBid === 0 && args.newBid < MIN_INITIAL_BID) {
      throw new Error(`Minimum initial bid is ₹${MIN_INITIAL_BID / 100}.`);
    }
    const amountDue: number = args.newBid - product.currentBid;
    if (amountDue < MIN_INCREMENT) {
      throw new Error(
        `Raise the bid by at least ₹${MIN_INCREMENT / 100} more.`,
      );
    }
    if (amountDue < MIN_CHARGE) {
      throw new Error("Amount too small to charge.");
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error(
        "Payments are not configured yet. Add Razorpay keys to the deployment.",
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const receipt = `br${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`.slice(
      0,
      40,
    );
    const order: { id: string } = await razorpay.orders.create({
      amount: amountDue,
      currency: CURRENCY,
      receipt,
      notes: {
        productId: args.productId as unknown as string,
        newBid: String(args.newBid),
      },
    });

    await ctx.runMutation(internal.payments.createPending, {
      productId: args.productId as Id<"products">,
      userId,
      newBid: args.newBid,
      amountPaid: amountDue,
      provider: "razorpay",
      providerPaymentId: order.id,
      providerOrderId: order.id,
      currency: CURRENCY,
      type: product.currentBid === 0 ? "initial" : "topup",
    });

    return {
      keyId,
      orderId: order.id,
      amount: amountDue,
      currency: CURRENCY,
      productName: product.name,
    };
  },
});
