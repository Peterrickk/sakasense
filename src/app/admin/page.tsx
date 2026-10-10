import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { requireDb } from "@/db";
import { inquiries, orders, products } from "@/db/schema";
import { GlassCard } from "@/components/ui/glass-card";
import { formatPHP } from "@/lib/money";
import { requireAdminPage } from "@/lib/session";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdminPage();
  const db = requireDb();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [[todayOrders], [revenue], lowStock, [newInquiries]] = await Promise.all([
    db.select({ n: count() }).from(orders).where(gte(orders.createdAt, startOfDay)),
    db
      .select({ total: sql<number>`coalesce(sum(${orders.totalCentavos}), 0)::float8` })
      .from(orders)
      .where(sql`${orders.status} in ('paid','processing','shipped','delivered')`),
    db
      .select()
      .from(products)
      .where(and(eq(products.isActive, true), lte(products.stock, 5))),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "new")),
  ]);

  const stats = [
    { label: "Orders today", value: String(todayOrders.n) },
    { label: "Revenue (paid, all time)", value: formatPHP(revenue.total) },
    { label: "New inquiries", value: String(newInquiries.n), href: "/admin/inquiries" },
    { label: "Low-stock products", value: String(lowStock.length), href: "/admin/products" },
  ];
  return (
    <div className="space-y-8">
      <h1 className="text-h2">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label}>
            <p className="text-text-muted font-mono text-xs uppercase">{s.label}</p>
            <p className="font-display mt-2 text-3xl font-bold">
              {s.href ? (
                <Link href={s.href} className="hover:text-primary">
                  {s.value}
                </Link>
              ) : (
                s.value
              )}
            </p>
          </GlassCard>
        ))}
      </div>
      {lowStock.length > 0 ? (
        <GlassCard>
          <h2 className="text-h3 mb-3">Low stock (5 or fewer)</h2>
          <ul className="space-y-1 text-sm">
            {lowStock.map((p) => (
              <li key={p.id}>
                <Link className="hover:text-primary" href={`/admin/products/${p.id}`}>
                  {p.name}
                </Link>{" "}
                — <strong>{p.stock}</strong> left
              </li>
            ))}
          </ul>
        </GlassCard>
      ) : null}
    </div>
  );
}
