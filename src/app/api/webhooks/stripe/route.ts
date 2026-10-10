import { stripe } from "@/lib/payments";
import { handlePaymentWebhook } from "@/lib/payments/webhook-handler";

export async function POST(req: Request) {
  return handlePaymentWebhook(req, stripe);
}
