import "server-only";
import { siteConfig } from "@/config/site";
import { getEnv } from "@/lib/env";
import { hmacSha256Hex, parseSignatureHeader, safeEqualHex } from "./signature";
import { WebhookSignatureError, type PaymentMethodChoice, type PaymentProvider } from "./types";

const API = "https://api.paymongo.com/v1";

const methodMap: Record<PaymentMethodChoice, string[]> = {
  gcash: ["gcash"],
  maya: ["paymaya"],
  card: ["card"],
  stripe: ["card"],
};

type PaymongoEvent = {
  data?: {
    attributes?: {
      type?: string;
      livemode?: boolean;
      data?: { id?: string };
    };
  };
};

/** PayMongo Checkout Sessions API. https://developers.paymongo.com/reference/checkout-session-resource */
export const paymongo: PaymentProvider = {
  async createCheckout(order, items, method) {
    const key = getEnv().PAYMONGO_SECRET_KEY;
    if (!key) throw new Error("PAYMONGO_SECRET_KEY is not set");

    const lineItems = items.map((i) => ({
      currency: "PHP",
      amount: i.unitPriceCentavos, // PayMongo amounts are in centavos
      name: i.nameSnapshot,
      quantity: i.quantity,
    }));
    if (order.shippingCentavos > 0) {
      lineItems.push({
        currency: "PHP",
        amount: order.shippingCentavos,
        name: "Shipping",
        quantity: 1,
      });
    }

    const res = await fetch(`${API}/checkout_sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: lineItems,
            payment_method_types: methodMap[method],
            reference_number: order.orderNumber,
            description: `SakaSense order ${order.orderNumber}`,
            send_email_receipt: false,
            show_description: true,
            show_line_items: true,
            billing: {
              name: order.shippingAddress.fullName,
              email: order.email,
              phone: order.phone ?? undefined,
            },
            success_url: `${siteConfig.url}/checkout/success?order=${encodeURIComponent(order.orderNumber)}`,
            cancel_url: `${siteConfig.url}/checkout?cancelled=1`,
            metadata: { orderNumber: order.orderNumber },
          },
        },
      }),
    });
    if (!res.ok) throw new Error(`PayMongo checkout failed (${res.status})`);
    const json = (await res.json()) as {
      data: { id: string; attributes: { checkout_url: string } };
    };
    return { url: json.data.attributes.checkout_url, ref: json.data.id };
  },

  async verifyWebhook(req) {
    const secret = getEnv().PAYMONGO_WEBHOOK_SECRET;
    const header = req.headers.get("paymongo-signature");
    if (!secret || !header) throw new WebhookSignatureError();
    const raw = await req.text();

    const sig = parseSignatureHeader(header);
    if (!sig.t) throw new WebhookSignatureError();
    const expected = hmacSha256Hex(secret, `${sig.t}.${raw}`);

    let event: PaymongoEvent;
    try {
      event = JSON.parse(raw) as PaymongoEvent;
    } catch {
      throw new WebhookSignatureError("Malformed webhook body");
    }
    const attrs = event.data?.attributes;
    // PayMongo sends `te` for test-mode events and `li` for live-mode events.
    const provided = attrs?.livemode ? sig.li : sig.te;
    if (!provided || !safeEqualHex(expected, provided)) throw new WebhookSignatureError();

    if (attrs?.type === "checkout_session.payment.paid" && attrs.data?.id) {
      return { ref: attrs.data.id, status: "paid" };
    }
    return null;
  },
};
