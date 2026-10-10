import "server-only";
import { paymongo } from "./paymongo";
import { stripe } from "./stripe";
import type { PaymentMethodChoice, PaymentProvider } from "./types";

export type { PaymentMethodChoice, PaymentProvider } from "./types";

/** Maps a checkout payment method to the provider that handles it. */
export function providerFor(method: PaymentMethodChoice): {
  name: "paymongo" | "stripe";
  impl: PaymentProvider;
} {
  return method === "stripe"
    ? { name: "stripe", impl: stripe }
    : { name: "paymongo", impl: paymongo };
}

export { paymongo, stripe };
