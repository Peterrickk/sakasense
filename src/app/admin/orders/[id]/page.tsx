import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPHP } from "@/lib/money";
import { requireAdminPage } from "@/lib/session";
import { updateOrder } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Order" };

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export default async function AdminOrder({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = requireDb();
  const [o] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!o) notFound();
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
  const a = o.shippingAddress;

  return (
    <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <h1 className="text-h2 font-mono">{o.orderNumber}</h1>
        <GlassCard className="space-y-1 text-sm">
          <p>
            {o.email} · {o.phone}
          </p>
          <p>
            {a.fullName}, {a.line1}
            {a.line2 ? `, ${a.line2}` : ""}, {a.barangay}, {a.city}, {a.province}, {a.region}{" "}
            {a.postalCode}
          </p>
          <p className="text-text-muted">
            Payment: {o.paymentProvider} {o.paymentRef ? `(${o.paymentRef})` : ""}
          </p>
        </GlassCard>
        <GlassCard>
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.quantity} × {i.nameSnapshot}
                </span>
                <span>{formatPHP(i.lineTotalCentavos)}</span>
              </li>
            ))}
          </ul>
          <p className="border-border mt-4 flex justify-between border-t pt-3 text-lg">
            <span>Total</span>
            <strong className="font-display">{formatPHP(o.totalCentavos)}</strong>
          </p>
        </GlassCard>
      </div>
      <GlassCard className="h-fit">
        <form action={updateOrder} className="space-y-4">
          <input type="hidden" name="id" value={o.id} />
          <div>
            <Label htmlFor="status">Status</Label>
            <Select id="status" name="status" defaultValue={o.status}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="courier">Courier</Label>
            <Input id="courier" name="courier" defaultValue={o.courier ?? ""} />
          </div>
          <div>
            <Label htmlFor="trackingNumber">Tracking number</Label>
            <Input
              id="trackingNumber"
              name="trackingNumber"
              defaultValue={o.trackingNumber ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="notes">Internal notes</Label>
            <Textarea id="notes" name="notes" defaultValue={o.notes ?? ""} className="min-h-24" />
          </div>
          <p className="text-text-muted text-xs">
            Setting status to “shipped” emails the customer their tracking details.
          </p>
          <Button type="submit">Update order</Button>
        </form>
      </GlassCard>
    </div>
  );
}
