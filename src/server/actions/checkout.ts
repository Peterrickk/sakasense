"use server";
import { eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders, products, type Order } from "@/db/schema";
import { siteConfig } from "@/config/site";
import { computeTotals, generateOrderNumber, priceLines, type PricingError } from "@/lib/order";
import { providerFor } from "@/lib/payments";
import { rateLimitIp } from "@/lib/rate-limit";
import { getCurrentUser } from "@/lib/session";
import { checkoutSchema, fieldErrors } from "@/lib/validators";
import { sendPaidEmails } from "@/server/orders";

export type CheckoutResult =
  { ok: true; url: string } | { ok: false; message?: string; errors?: Record<string, string> };

function pricingMessage(e: PricingError): string {
  switch (e.code) {
    case "unknown_product":
      return "An item in your cart is no longer available. Please refresh your cart.";
    case "unavailable":
      return `${e.name ?? "An item"} is not available for purchase right now.`;
    case "out_of_stock":
      return `${e.name ?? "An item"} does not have enough stock for your quantity.`;
  }
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}

/**
 * Creates a pending order and returns the payment redirect URL.
 * Only product ids and quantities are trusted from the client: every price is re-fetched from
 * the database and recomputed here.
 */
export async function createOrder(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const data = parsed.data;

  if (!(await rateLimitIp("checkout", 10, 10 * 60_000))) {
    return { ok: false, message: "Too many attempts. Please wait a few minutes and try again." };
  }
  if (data.paymentMethod === "cod" && !siteConfig.cod.enabled) {
    return { ok: false, message: "Cash on delivery is not available." };
  }
  if (data.paymentMethod === "stripe" && !siteConfig.features.stripe) {
    return { ok: false, message: "That payment method is not available." };
  }

  const db = getDb();
  if (!db) return { ok: false, message: "Checkout is not available right now." };

  // 1. Re-fetch products and recompute prices server-side; check stock.
  const ids = [...new Set(data.items.map((i) => i.productId))];
  const catalog = await db.select().from(products).where(inArray(products.id, ids));
  const priced = priceLines(data.items, catalog);
  if (!priced.ok) return { ok: false, message: pricingMessage(priced.error) };

  const totals = computeTotals(priced.lines, data.shippingMethod);
  const user = await getCurrentUser();
  const method = data.paymentMethod;
  // null = cash on delivery (nothing to pay online).
  const online = method === "cod" ? null : { method, ...providerFor(method) };
  const isCod = online === null;

  // 2. Create order + items in one transaction (retrying if the random order number collides).
  let order: Order | undefined;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    try {
      order = await db.transaction(async (tx) => {
        const [o] = await tx
          .insert(orders)
          .values({
            orderNumber: generateOrderNumber(),
            userId: user?.id ?? null,
            email: data.email,
            phone: data.phone,
            status: isCod ? "processing" : "pending",
            ...totals,
            currency: "PHP",
            shippingAddress: data.address,
            shippingMethod: data.shippingMethod,
            paymentProvider: online ? online.name : "cod",
            notes: data.notes,
          })
          .returning();
        await tx.insert(orderItems).values(
          priced.lines.map((l) => ({
            orderId: o.id,
            productId: l.productId,
            nameSnapshot: l.name,
            unitPriceCentavos: l.unitPriceCentavos,
            quantity: l.quantity,
            lineTotalCentavos: l.lineTotalCentavos,
          })),
        );
        if (isCod) {
          for (const l of priced.lines) {
            await tx
              .update(products)
              .set({ stock: sql`GREATEST(${products.stock} - ${l.quantity}, 0)` })
              .where(eq(products.id, l.productId));
          }
        }
        return o;
      });
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
    }
  }
  if (!order) return { ok: false, message: "We couldn't create your order. Please try again." };

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  // 3. Cash on delivery: nothing to pay online.
  if (!online) {
    await sendPaidEmails(order, items);
    return { ok: true, url: `/checkout/success?order=${encodeURIComponent(order.orderNumber)}` };
  }

  // 4. Create the payment checkout session and return its redirect URL.
  try {
    const { url, ref } = await online.impl.createCheckout(order, items, online.method);
    await db
      .update(orders)
      .set({ paymentRef: ref, updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return { ok: true, url };
  } catch (err) {
    console.error(
      "[checkout] payment provider error",
      err instanceof Error ? err.message : "unknown",
    );
    await db
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, order.id));
    return { ok: false, message: "We couldn't start the payment. Please try again." };
  }
}
