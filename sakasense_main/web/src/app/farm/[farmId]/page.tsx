"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FarmPlanVisual } from "@/components/FarmPlanVisual";
import { StatusPill } from "@/components/StatusPill";
import { getFarm, getLatestReading, getPlotsForFarm } from "@/lib/data";
import { formatRelativeTime } from "@/lib/utils";

export default function FarmPage() {
  const params = useParams<{ farmId: string }>();
  const farm = getFarm(params.farmId);
  const farmPlots = farm ? getPlotsForFarm(farm.id) : [];

  if (!farm) {
    return (
      <AppShell>
        <p>Farm not found.</p>
        <Link href="/dashboard" className="text-sakasense-green">
          Back to dashboard
        </Link>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm text-sakasense-muted">
          <Link href="/dashboard" className="hover:text-sakasense-ink">
            Overview
          </Link>{" "}
          / Farm
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold">
          {farm.name}
        </h1>
        <p className="text-sm text-sakasense-muted">
          {farm.location} · {farm.type === "rural_field" ? "Rural field" : "Urban container"}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <FarmPlanVisual plots={farmPlots} farmId={farm.id} />
        <div className="sakasense-card p-4">
          <h2 className="mb-3 px-1 font-semibold">Zones</h2>
          <ul className="space-y-2">
            {farmPlots.map((plot) => {
              const reading = getLatestReading(plot.id);
              return (
                <li key={plot.id}>
                  <Link
                    href={`/farm/${farm.id}/plot/${plot.id}`}
                    className="block rounded-xl border border-sakasense-border px-4 py-3 transition hover:border-sakasense-green/40 hover:bg-sakasense-green-soft/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{plot.name}</p>
                        <p className="text-xs text-sakasense-muted">
                          {plot.cropCurrent} · {plot.areaLabel}
                        </p>
                      </div>
                      <StatusPill status={plot.status} />
                    </div>
                    {reading ? (
                      <p className="mt-2 text-xs text-sakasense-muted">
                        Last synced {formatRelativeTime(reading.timestamp)} · pH{" "}
                        {reading.pH.toFixed(2)}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
