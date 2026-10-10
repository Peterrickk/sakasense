import "server-only";
import { getDb } from "@/db";
import { markOrderPaid, sendPaidEmails } from "@/server/orders";
import { WebhookSignatureError, type PaymentProvider } from "./types";

/**
 * Shared webhook route logic. 400 on a bad signature, 200 for everything else (including
 * replays and events we ignore) so providers do not keep retrying.
 */
export async function handlePaymentWebhook(req: Request, provider: PaymentProvider) {
  let result: Awaited<ReturnType<PaymentProvider["verifyWebhook"]>>;
  try {
    result = await provider.verifyWebhook(req);
  } catch (err) {
    if (err instanceof WebhookSignatureError)
      return new Response("Invalid signature", { status: 400 });
    throw err;
  }
  if (!result || result.status !== "paid") return new Response("ok", { status: 200 });
  if (!getDb()) return new Response("Database unavailable", { status: 503 });

  const paid = await markOrderPaid(result.ref);
  // null = already processed (idempotent replay) or unknown ref: do nothing.
  if (paid) await sendPaidEmails(paid.order, paid.items);
  return new Response("ok", { status: 200 });
}
