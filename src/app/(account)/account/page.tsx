import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AddressForm, SignOutButton } from "@/components/account/account-bits";
import { EmptyState } from "@/components/brand/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getCurrentUser } from "@/lib/session";
import { formatPHP } from "@/lib/money";
import { deleteAddress } from "@/server/actions/account";
import { getUserAddresses, getUserOrders, linkGuestOrders } from "@/server/queries/account";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  await linkGuestOrders(user);
  const [orders, addrs] = await Promise.all([getUserOrders(user.id), getUserAddresses(user.id)]);

  return (
    <div className="container-page max-w-4xl space-y-10 py-14">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h2">Hi, {user.name}</h1>
          <p className="text-text-muted">
            {user.email}{" "}
            {user.emailVerified ? (
              <Badge variant="primary">Verified</Badge>
            ) : (
              <Badge variant="warning">Unverified</Badge>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          {user.role === "admin" ? (
            <Button href="/admin" variant="secondary">
              Admin
            </Button>
          ) : null}
          <SignOutButton />
        </div>
      </header>

      <section aria-labelledby="orders-h">
        <h2 id="orders-h" className="text-h3 mb-4">
          Order history
        </h2>
        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            action={<Button href="/products">Browse products</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/account/orders/${o.id}`}>
                  <GlassCard
                    hover
                    className="flex flex-wrap items-center justify-between gap-3 p-4"
                  >
                    <span className="font-mono">{o.orderNumber}</span>
                    <span className="text-text-muted text-sm">
                      {o.createdAt.toLocaleDateString("en-PH", { dateStyle: "medium" })}
                    </span>
                    <Badge>{o.status}</Badge>
                    <span className="font-display font-bold">{formatPHP(o.totalCentavos)}</span>
                  </GlassCard>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="addr-h" className="space-y-4">
        <h2 id="addr-h" className="text-h3">
          Saved addresses
        </h2>
        {addrs.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {addrs.map((a) => (
              <li key={a.id}>
                <GlassCard className="space-y-1 p-4 text-sm">
                  <p className="font-medium">{a.fullName}</p>
                  <p className="text-text-muted">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}, {a.barangay}, {a.city}, {a.province}{" "}
                    {a.postalCode}
                  </p>
                  <form action={deleteAddress}>
                    <input type="hidden" name="id" value={a.id} />
                    <button className="text-danger text-sm underline" type="submit">
                      Remove
                    </button>
                  </form>
                </GlassCard>
              </li>
            ))}
          </ul>
        ) : null}
        <GlassCard className="p-6">
          <h3 className="mb-4 font-medium">Add an address</h3>
          <AddressForm />
        </GlassCard>
      </section>
    </div>
  );
}
