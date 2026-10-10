import "server-only";
import { and, desc, eq, isNull } from "drizzle-orm";
import { requireDb } from "@/db";
import { addresses, orderItems, orders } from "@/db/schema";
import type { SessionUser } from "@/lib/session";

/**
 * Links guest orders placed with the same email to this account, but ONLY when the account's
 * email is verified (otherwise anyone could sign up with someone else's address and read their orders).
 */
export async function linkGuestOrders(user: SessionUser) {
  if (!user.emailVerified) return;
  await requireDb()
    .update(orders)
    .set({ userId: user.id })
    .where(and(isNull(orders.userId), eq(orders.email, user.email.toLowerCase())));
}

export async function getUserOrders(userId: string) {
  return requireDb()
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

/** Returns the order only if it belongs to this user. */
export async function getUserOrder(userId: string, orderId: string) {
  const db = requireDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .limit(1);
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getUserAddresses(userId: string) {
  return requireDb().select().from(addresses).where(eq(addresses.userId, userId));
}
