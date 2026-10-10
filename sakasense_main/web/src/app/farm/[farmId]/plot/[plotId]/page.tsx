"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Sprout } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { StatusPill } from "@/components/StatusPill";
import { TrendChart } from "@/components/TrendChart";
import {
  getDeviceForPlot,
  getFarm,
  getPlot,
  getReadingsForPlot,
  getRecommendationHistory,
  readingStats,
} from "@/lib/data";
import type { ChartMetric } from "@/lib/types";
import { formatDateTime, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ranges = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "Season", days: 90 },
] as const;

const metrics: ChartMetric[] = ["pH", "N", "P", "K"];

export default function PlotDetailPage() {
  const params = useParams<{ farmId: string; plotId: string }>();
  const farm = getFarm(params.farmId);
  const plot = getPlot(params.plotId);
  const [days, setDays] = useState(30);
  const [metric, setMetric] = useState<ChartMetric>("N");

  const series = useMemo(
    () => (plot ? getReadingsForPlot(plot.id, days) : []),
    [plot, days],
  );
  const stats = plot ? readingStats(plot.id, days) : null;
  const history = plot ? getRecommendationHistory(plot.id) : [];
  const device = plot ? getDeviceForPlot(plot.id) : undefined;
  const latest = series[series.length - 1];

  if (!farm || !plot) {
    return (
      <AppShell>
        <p>Plot not found.</p>
        <Link href="/dashboard" className="text-sakasense-green">
          Back to dashboard
        </Link>
      </AppShell>
    );
  }

  const latestRec = history[0];

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm text-sakasense-muted">
          <Link href="/dashboard" className="hover:text-sakasense-ink">
            Overview
          </Link>{" "}
          /{" "}
          <Link href={`/farm/${farm.id}`} className="hover:text-sakasense-ink">
            {farm.name}
          </Link>{" "}
          / Plot
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            {plot.name}
          </h1>
          <StatusPill status={plot.status} />
        </div>
        <p className="text-sm text-sakasense-muted">
          {plot.cropCurrent} · {plot.areaLabel}
          {latest ? (
            <>
              {" "}
              · Last {latest.source === "synced_sd_card" ? "synced" : "live"}{" "}
              {formatRelativeTime(latest.timestamp)}
            </>
          ) : null}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Soil Health Details card — vegetation-index reference pattern */}
        <div className="sakasense-card overflow-hidden animate-fade-up">
          <div className="relative h-36 bg-gradient-to-br from-[#3d6b3a] via-[#5a8f4d] to-[#c4b48a]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.2),transparent_45%)]" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
              <span className="grid size-10 place-items-center rounded-xl bg-sakasense-surface/20 backdrop-blur">
                <Sprout className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{plot.cropCurrent}</p>
                <p className="text-xs text-white/80">{plot.areaLabel}</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Soil Health Details
            </h2>
            <p className="mb-4 text-xs text-sakasense-muted">Max / Min / Mean over selected range</p>
            {stats ? (
              <dl className="space-y-3">
                {metrics.map((m) => (
                  <div key={m} className="flex items-baseline justify-between gap-3 border-b border-sakasense-border/70 pb-2 last:border-0">
                    <dt className="text-sm text-sakasense-muted">{m}</dt>
                    <dd className="text-right text-sm">
                      <span className="font-bold text-sakasense-ink">
                        {stats[m].max} / {stats[m].min} / {stats[m].mean}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-sakasense-muted">No readings in range.</p>
            )}
            {device ? (
              <p className="mt-4 text-xs text-sakasense-muted">
                Device {device.serialNumber} · battery {device.batteryPercent}% · {device.status}
              </p>
            ) : null}
          </div>
        </div>

        <div className="sakasense-card p-5 animate-fade-up-delay">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
              Trend
            </h2>
            <div className="flex flex-wrap gap-2">
              {ranges.map((r) => (
                <button
                  key={r.days}
                  type="button"
                  onClick={() => setDays(r.days)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold",
                    days === r.days
                      ? "bg-sakasense-green text-sakasense-on-green"
                      : "bg-sakasense-cream text-sakasense-muted",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {metrics.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  metric === m
                    ? "border-sakasense-green bg-sakasense-green-soft text-sakasense-green-dark"
                    : "border-sakasense-border text-sakasense-muted",
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <TrendChart data={series} metric={metric} />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="sakasense-card p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
            Fertilizer prescription
          </h2>
          {latestRec ? (
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="text-sakasense-muted">Product:</span>{" "}
                <strong>{latestRec.fertilizer.product}</strong>
              </p>
              <p>
                <span className="text-sakasense-muted">Amount:</span>{" "}
                <strong>{latestRec.fertilizer.amount}</strong>
              </p>
              <p>
                <span className="text-sakasense-muted">When:</span>{" "}
                <strong>{latestRec.fertilizer.timing}</strong>
              </p>
              <p className="leading-relaxed text-sakasense-muted">{latestRec.fertilizer.notes}</p>
              <Link
                href={`/guidebook?code=${latestRec.guidebookCode}`}
                className="inline-flex rounded-full bg-sakasense-green px-4 py-2 text-sm font-semibold text-sakasense-on-green"
              >
                Open Guidebook {latestRec.guidebookCode}
              </Link>
            </div>
          ) : (
            <p className="mt-3 text-sm text-sakasense-muted">No prescription yet.</p>
          )}
        </div>

        <div className="sakasense-card p-5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
            Recommendation history
          </h2>
          <ol className="mt-4 space-y-4">
            {history.map((rec) => (
              <li key={rec.id} className="relative border-l-2 border-sakasense-green-soft pl-4">
                <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-sakasense-green" />
                <p className="text-xs text-sakasense-muted">{formatDateTime(rec.timestamp)}</p>
                <p className="mt-1 text-sm font-medium">{rec.insight}</p>
                <p className="mt-1 text-xs text-sakasense-muted">
                  Code{" "}
                  <Link
                    href={`/guidebook?code=${rec.guidebookCode}`}
                    className="font-semibold text-sakasense-green"
                  >
                    {rec.guidebookCode}
                  </Link>
                  {rec.generatedOnDevice ? " · on-device" : ""}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
