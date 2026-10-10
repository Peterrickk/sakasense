import type { Order, OrderItem } from "@/db/schema";

export type PaymentMethodChoice = "gcash" | "maya" | "card" | "stripe";

/** Thrown by verifyWebhook when the signature is missing or wrong (respond 400). */
export class WebhookSignatureError extends Error {
  constructor(message = "Invalid webhook signature") {
    super(message);
    this.name = "WebhookSignatureError";
  }
}

export interface PaymentProvider {
  createCheckout(
    order: Order,
    items: OrderItem[],
    method: PaymentMethodChoice,
  ): Promise<{ url: string; ref: string }>;
  /**
   * Verifies the webhook signature (throws WebhookSignatureError if invalid) and returns the
   * payment outcome, or null for validly-signed events we do not act on.
   */
  verifyWebhook(req: Request): Promise<{ ref: string; status: "paid" | "failed" } | null>;
}
