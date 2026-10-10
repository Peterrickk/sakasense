import "server-only";
import { siteConfig } from "@/config/site";
import { getEnv } from "@/lib/env";
import { hmacSha256Hex, parseSignatureHeader, safeEqualHex } from "./signature";
import { WebhookSignatureError, type PaymentProvider } from "./types";

const TOLERANCE_SECONDS = 300;

type StripeEvent = {
  type?: string;
  data?: { object?: { id?: string; payment_status?: string } };
};

/** Stripe Checkout Sessions over plain REST (no SDK needed). Optional, for international orders. */
export const stripe: PaymentProvider = {
  async createCheckout(order, items) {
    const key = getEnv().STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");

    const body = new URLSearchParams({
      mode: "payment",
      success_url: `${siteConfig.url}/checkout/success?order=${encodeURIComponent(order.orderNumber)}`,
      cancel_url: `${siteConfig.url}/checkout?cancelled=1`,
      customer_email: order.email,
      client_reference_id: order.orderNumber,
      "metadata[orderNumber]": order.orderNumber,
    });
    const lines = items.map((i) => ({
      name: i.nameSnapshot,
      amount: i.unitPriceCentavos,
      qty: i.quantity,
    }));
    if (order.shippingCentavos > 0) {
      lines.push({ name: "Shipping", amount: order.shippingCentavos, qty: 1 });
    }
    lines.forEach((l, idx) => {
      body.set(`line_items[${idx}][quantity]`, String(l.qty));
      body.set(`line_items[${idx}][price_data][currency]`, "php");
      body.set(`line_items[${idx}][price_data][unit_amount]`, String(l.amount));
      body.set(`line_items[${idx}][price_data][product_data][name]`, l.name);
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) throw new Error(`Stripe checkout failed (${res.status})`);
    const json = (await res.json()) as { id: string; url: string };
    return { url: json.url, ref: json.id };
  },

  async verifyWebhook(req) {
    const secret = getEnv().STRIPE_WEBHOOK_SECRET;
    const header = req.headers.get("stripe-signature");
    if (!secret || !header) throw new WebhookSignatureError();
    const raw = await req.text();

    const sig = parseSignatureHeader(header);
    const t = Number(sig.t);
    if (!sig.t || !sig.v1 || !Number.isFinite(t)) throw new WebhookSignatureError();
    if (Math.abs(Date.now() / 1000 - t) > TOLERANCE_SECONDS) throw new WebhookSignatureError();
    if (!safeEqualHex(hmacSha256Hex(secret, `${sig.t}.${raw}`), sig.v1))
      throw new WebhookSignatureError();

    let event: StripeEvent;
    try {
      event = JSON.parse(raw) as StripeEvent;
    } catch {
      throw new WebhookSignatureError("Malformed webhook body");
    }
    const obj = event.data?.object;
    if (event.type === "checkout.session.completed" && obj?.id && obj.payment_status === "paid") {
      return { ref: obj.id, status: "paid" };
    }
    return null;
  },
};
