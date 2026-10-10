import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/brand/misc";
import { OrderTimeline } from "@/components/shop/order-timeline";
import { GlassCard } from "@/components/ui/glass-card";
import { formatPHP } from "@/lib/money";
import { getCurrentUser } from "@/lib/session";
import { getUserOrder } from "@/server/queries/account";

export const metadata: Metadata = { title: "Order details", robots: { index: false } };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function OrderDetailPage({ params }: PageProps<"/account/orders/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!UUID.test(id)) notFound();
  const found = await getUserOrder(user.id, id);
  if (!found) notFound();
  const { order, items } = found;
  const a = order.shippingAddress;

  return (
    <div className="container-page max-w-3xl space-y-6 py-14">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: order.orderNumber }]} />
      <h1 className="text-h2 font-mono">{order.orderNumber}</h1>
      <GlassCard className="space-y-5">
        <OrderTimeline status={order.status} />
        {order.trackingNumber ? (
          <p className="text-sm">
            {order.courier}: <strong className="font-mono">{order.trackingNumber}</strong>
          </p>
        ) : null}
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
        <dl className="border-border mt-4 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">Subtotal</dt>
            <dd>{formatPHP(order.subtotalCentavos)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Shipping</dt>
            <dd>{formatPHP(order.shippingCentavos)}</dd>
          </div>
          <div className="flex justify-between text-lg">
            <dt>Total</dt>
            <dd className="font-display font-bold">{formatPHP(order.totalCentavos)}</dd>
          </div>
        </dl>
      </GlassCard>
      <GlassCard className="text-sm">
        <h2 className="mb-2 font-medium">Ship to</h2>
        <p>
          {a.fullName} · {a.phone}
        </p>
        <p className="text-text-muted">
          {a.line1}
          {a.line2 ? `, ${a.line2}` : ""}, {a.barangay}, {a.city}, {a.province} {a.postalCode}
        </p>
      </GlassCard>
    </div>
  );
}
