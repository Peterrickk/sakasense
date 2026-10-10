import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env", () => ({
  getEnv: () => ({ PAYMONGO_WEBHOOK_SECRET: "pm_secret", STRIPE_WEBHOOK_SECRET: "whsec" }),
}));

import { paymongo } from "@/lib/payments/paymongo";
import { stripe } from "@/lib/payments/stripe";
import { hmacSha256Hex } from "@/lib/payments/signature";
import { WebhookSignatureError } from "@/lib/payments/types";

const pmBody = JSON.stringify({
  data: {
    attributes: { type: "checkout_session.payment.paid", livemode: false, data: { id: "cs_123" } },
  },
});
const req = (headers: Record<string, string>, body: string) =>
  new Request("http://x/webhook", { method: "POST", headers, body });

describe("PayMongo webhook", () => {
  it("accepts a correctly signed paid event", async () => {
    const t = "1700000000";
    const sig = `t=${t},te=${hmacSha256Hex("pm_secret", `${t}.${pmBody}`)},li=`;
    expect(await paymongo.verifyWebhook(req({ "paymongo-signature": sig }, pmBody))).toEqual({
      ref: "cs_123",
      status: "paid",
    });
  });
  it("rejects bad or missing signatures", async () => {
    await expect(
      paymongo.verifyWebhook(req({ "paymongo-signature": "t=1,te=deadbeef,li=" }, pmBody)),
    ).rejects.toBeInstanceOf(WebhookSignatureError);
    await expect(paymongo.verifyWebhook(req({}, pmBody))).rejects.toBeInstanceOf(
      WebhookSignatureError,
    );
  });
});

describe("Stripe webhook", () => {
  const body = JSON.stringify({
    type: "checkout.session.completed",
    data: { object: { id: "cs_9", payment_status: "paid" } },
  });
  it("accepts a fresh, correctly signed event", async () => {
    const t = String(Math.floor(Date.now() / 1000));
    const sig = `t=${t},v1=${hmacSha256Hex("whsec", `${t}.${body}`)}`;
    expect(await stripe.verifyWebhook(req({ "stripe-signature": sig }, body))).toEqual({
      ref: "cs_9",
      status: "paid",
    });
  });
  it("rejects stale timestamps and wrong signatures", async () => {
    const old = "1000";
    const staleSig = `t=${old},v1=${hmacSha256Hex("whsec", `${old}.${body}`)}`;
    await expect(
      stripe.verifyWebhook(req({ "stripe-signature": staleSig }, body)),
    ).rejects.toBeInstanceOf(WebhookSignatureError);
    const t = String(Math.floor(Date.now() / 1000));
    await expect(
      stripe.verifyWebhook(req({ "stripe-signature": `t=${t},v1=abcd` }, body)),
    ).rejects.toBeInstanceOf(WebhookSignatureError);
  });
});
