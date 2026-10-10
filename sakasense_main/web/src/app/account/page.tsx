"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { devices, subscription } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

const tierLabels = {
  free: "Free / Basic",
  farmer_pro: "Farmer Pro",
  cooperative: "Cooperative / Multi-Farm",
} as const;

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Account</h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Profile, linked devices, and subscription — the monetized detailed tier.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="sakasense-card p-5">
          <h2 className="font-semibold">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-sakasense-border pb-2">
              <dt className="text-sakasense-muted">Name</dt>
              <dd className="font-medium">{user?.name}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-sakasense-border pb-2">
              <dt className="text-sakasense-muted">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-sakasense-border pb-2">
              <dt className="text-sakasense-muted">Contact</dt>
              <dd className="font-medium">{user?.contact ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-sakasense-muted">Role</dt>
              <dd className="font-medium capitalize">{user?.role.replace("_", " ")}</dd>
            </div>
          </dl>
        </div>

        <div className="sakasense-card p-5">
          <h2 className="font-semibold">Subscription</h2>
          <p className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-sakasense-green-dark">
            {tierLabels[user?.subscriptionTier ?? subscription.tier]}
          </p>
          <p className="mt-1 text-sm capitalize text-sakasense-muted">
            Status: {subscription.status} · renews {formatDateTime(subscription.renewalDate)}
          </p>
          <p className="mt-1 text-sm text-sakasense-muted">
            Payment: {subscription.paymentMethod}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/pricing"
              className="rounded-full bg-sakasense-green px-4 py-2 text-sm font-semibold text-sakasense-on-green"
            >
              Upgrade / change plan
            </Link>
            <button
              type="button"
              className="rounded-full border border-sakasense-border px-4 py-2 text-sm font-semibold text-sakasense-muted"
            >
              Billing history
            </button>
          </div>
          <p className="mt-3 text-xs text-sakasense-muted">
            Payment gateway (GCash / PayMongo / Stripe) — confirm before Phase 4 checkout.
          </p>
        </div>

        <div className="sakasense-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Linked devices</h2>
            <Link
              href="/onboarding"
              className="text-sm font-semibold text-sakasense-green"
            >
              Add device
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-sakasense-border">
            {devices.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold">{d.serialNumber}</p>
                  <p className="text-xs text-sakasense-muted">
                    {d.model} · last seen {formatDateTime(d.lastSeenAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="capitalize text-sakasense-muted">
                    {d.status} · {d.batteryPercent}%
                  </span>
                  <button
                    type="button"
                    className="rounded-full border border-sakasense-border px-3 py-1.5 text-xs font-semibold text-sakasense-danger"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
