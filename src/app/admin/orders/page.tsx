import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { orders } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPHP } from "@/lib/money";
import { requireAdminPage } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export default async function AdminOrders({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdminPage();
  const { status } = await searchParams;
  const filter = STATUSES.find((s) => s === status);
  const db = requireDb();
  const list = await (
    filter ? db.select().from(orders).where(eq(orders.status, filter)) : db.select().from(orders)
  )
    .orderBy(desc(orders.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-h2">Orders</h1>
      <nav aria-label="Filter by status" className="flex flex-wrap gap-2 text-sm">
        {[undefined, ...STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={cn(
              "rounded-full border px-3 py-1",
              filter === s ? "border-primary text-primary" : "border-border text-text-muted",
            )}
          >
            {s ?? "all"}
          </Link>
        ))}
      </nav>
      <Table>
        <THead>
          <TR>
            <TH>Order</TH>
            <TH>Date</TH>
            <TH>Email</TH>
            <TH>Status</TH>
            <TH>Total</TH>
          </TR>
        </THead>
        <tbody>
          {list.map((o) => (
            <TR key={o.id}>
              <TD>
                <Link className="hover:text-primary font-mono" href={`/admin/orders/${o.id}`}>
                  {o.orderNumber}
                </Link>
              </TD>
              <TD>{o.createdAt.toLocaleDateString("en-PH")}</TD>
              <TD>{o.email}</TD>
              <TD>
                <Badge>{o.status}</Badge>
              </TD>
              <TD>{formatPHP(o.totalCentavos)}</TD>
            </TR>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
