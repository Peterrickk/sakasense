"use server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders, type Order } from "@/db/schema";
import { rateLimitIp } from "@/lib/rate-limit";
import { fieldErrors, trackOrderSchema } from "@/lib/validators";

export type TrackedOrder = {
  orderNumber: string;
  status: Order["status"];
  createdAt: string;
  paidAt: string | null;
  courier: string | null;
  trackingNumber: string | null;
  items: { name: string; quantity: number }[];
};

export type TrackState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  order?: TrackedOrder;
};

/** Order number + email must both match. Exposes no address or payment details. */
export async function trackOrder(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const parsed = trackOrderSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  if (!(await rateLimitIp("track", 10, 10 * 60_000))) {
    return { ok: false, message: "Too many lookups. Please try again in a few minutes." };
  }
  const db = getDb();
  if (!db) return { ok: false, message: "Order tracking is not available right now." };

  const { orderNumber, email } = parsed.data;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderNumber, orderNumber), eq(orders.email, email)))
    .limit(1);
  // Same message whether the number or the email was wrong, so lookups reveal nothing.
  if (!order) return { ok: false, message: "We couldn't find an order matching those details." };

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return {
    ok: true,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      paidAt: order.paidAt?.toISOString() ?? null,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
      items: items.map((i) => ({ name: i.nameSnapshot, quantity: i.quantity })),
    },
  };
}
