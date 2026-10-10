"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { alerts, getPlot } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AlertType } from "@/lib/types";

const filters: { label: string; value: AlertType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Deficiency", value: "deficiency" },
  { label: "Device offline", value: "device_offline" },
  { label: "Check-in due", value: "check_in_due" },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState<AlertType | "all">("all");
  const [emailOn, setEmailOn] = useState(true);
  const [smsOn, setSmsOn] = useState(false);
  const [pushOn, setPushOn] = useState(true);

  const list = useMemo(
    () =>
      alerts
        .filter((a) => (filter === "all" ? true : a.type === filter))
        .sort((a, b) => +new Date(b.triggeredAt) - +new Date(a.triggeredAt)),
    [filter],
  );

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Alerts</h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Nutrient and device alerts with a full history — mirrors the mobile app, with filters and
          channel settings.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold",
                  filter === f.value
                    ? "bg-sakasense-green text-sakasense-on-green"
                    : "bg-sakasense-surface-2 text-sakasense-muted border border-sakasense-border",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <ul className="space-y-3">
            {list.map((alert) => {
              const plot = getPlot(alert.plotId);
              return (
                <li key={alert.id} className="sakasense-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{alert.message}</p>
                      <p className="mt-1 text-xs text-sakasense-muted">
                        {plot?.name ?? alert.plotId} · {formatDateTime(alert.triggeredAt)}
                        {alert.resolvedAt
                          ? ` · resolved ${formatDateTime(alert.resolvedAt)}`
                          : " · open"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize",
                        alert.resolvedAt
                          ? "bg-sakasense-cream text-sakasense-muted"
                          : "bg-sakasense-warn/20 text-sakasense-warn-ink",
                      )}
                    >
                      {alert.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-sakasense-muted">
                    Sent via {alert.channelSent.join(", ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="sakasense-card h-fit p-5">
          <h2 className="font-semibold">Notification settings</h2>
          <p className="mt-1 text-xs text-sakasense-muted">
            Channels for Farmer Pro. Thresholds can be tuned per plot later.
          </p>
          <div className="mt-4 space-y-3">
            {[
              { label: "Email", value: emailOn, set: setEmailOn },
              { label: "SMS", value: smsOn, set: setSmsOn },
              { label: "Push", value: pushOn, set: setPushOn },
            ].map((opt) => (
              <label
                key={opt.label}
                className="flex items-center justify-between rounded-xl border border-sakasense-border px-3 py-3 text-sm"
              >
                {opt.label}
                <input
                  type="checkbox"
                  checked={opt.value}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="size-4 accent-sakasense-green"
                />
              </label>
            ))}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
