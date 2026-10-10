import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { orderItems, orders, products, type Order, type OrderItem } from "@/db/schema";
import { siteConfig } from "@/config/site";
import { sendEmail, teamInbox } from "@/lib/email/send";
import { InternalAlertEmail, OrderConfirmationEmail, ShippedEmail } from "@/lib/email/templates";
import { formatPHP } from "@/lib/money";

/**
 * Marks an order paid exactly once. Idempotent: the UPDATE only matches a `pending` order, so a
 * replayed webhook (or two racing ones) changes nothing and returns null, and stock is only
 * decremented by the call that actually flipped the status.
 */
export async function markOrderPaid(
  paymentRef: string,
): Promise<{ order: Order; items: OrderItem[] } | null> {
  const db = requireDb();
  return db.transaction(async (tx) => {
    const [order] = await tx
      .update(orders)
      .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
      .where(and(eq(orders.paymentRef, paymentRef), eq(orders.status, "pending")))
      .returning();
    if (!order) return null;

    const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    for (const it of items) {
      await tx
        .update(products)
        .set({ stock: sql`GREATEST(${products.stock} - ${it.quantity}, 0)` })
        .where(eq(products.id, it.productId));
    }
    return { order, items };
  });
}

export async function sendPaidEmails(order: Order, items: OrderItem[]) {
  await sendEmail({
    to: order.email,
    subject: `Order ${order.orderNumber} confirmed`,
    react: OrderConfirmationEmail({
      orderNumber: order.orderNumber,
      lines: items.map((i) => ({
        name: i.nameSnapshot,
        quantity: i.quantity,
        lineTotalCentavos: i.lineTotalCentavos,
      })),
      totalCentavos: order.totalCentavos,
      trackUrl: `${siteConfig.url}/orders/track`,
      guideUrl: siteConfig.links.guidebook,
    }),
  });
  const team = teamInbox();
  if (team) {
    await sendEmail({
      to: team,
      subject: `New order ${order.orderNumber}`,
      react: InternalAlertEmail({
        title: `New order ${order.orderNumber}`,
        rows: [
          ["Total", formatPHP(order.totalCentavos)],
          ["Items", items.map((i) => `${i.quantity}× ${i.nameSnapshot}`).join(", ")],
          ["Ship to", `${order.shippingAddress.city}, ${order.shippingAddress.province}`],
        ],
      }),
    });
  }
}

export async function sendShippedEmail(order: Order) {
  await sendEmail({
    to: order.email,
    subject: `Order ${order.orderNumber} has shipped`,
    react: ShippedEmail({
      orderNumber: order.orderNumber,
      courier: order.courier,
      trackingNumber: order.trackingNumber,
      trackUrl: `${siteConfig.url}/orders/track`,
    }),
  });
}
