import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { handleRazorpayWebhook } from "./razorpayWebhook";

const http = httpRouter();

auth.addHttpRoutes(http);

// Razorpay payment webhook (signature verified inside the handler).
http.route({
  path: "/razorpay/webhook",
  method: "POST",
  handler: handleRazorpayWebhook,
});

export default http;
