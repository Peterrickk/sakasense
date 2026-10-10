"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  Battery,
  CalendarClock,
  Droplets,
  FlaskConical,
  Leaf,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AIInsightCard } from "@/components/AIInsightCard";
import { FarmPlanVisual } from "@/components/FarmPlanVisual";
import { MetricTile } from "@/components/MetricTile";
import { SoilHealthGauge } from "@/components/SoilHealthGauge";
import { StatusPill } from "@/components/StatusPill";
import {
  farms,
  getDeviceForPlot,
  getLatestReading,
  getLatestRecommendation,
  getPlotsForFarm,
} from "@/lib/data";
import {
  computeSoilHealthIndex,
  daysBetween,
  formatRelativeTime,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [farmId, setFarmId] = useState(farms[0].id);
  const [selectedPlotId, setSelectedPlotId] = useState(
    getPlotsForFarm(farms[0].id)[0]?.id ?? "",
  );

  const farm = farms.find((f) => f.id === farmId)!;
  const farmPlots = useMemo(() => getPlotsForFarm(farmId), [farmId]);

  const activePlot =
    farmPlots.find((p) => p.id === selectedPlotId) ?? farmPlots[0];
  const reading = activePlot ? getLatestReading(activePlot.id) : undefined;
  const device = activePlot ? getDeviceForPlot(activePlot.id) : undefined;
  const rec = activePlot ? getLatestRecommendation(activePlot.id) : undefined;
  const health = reading ? computeSoilHealthIndex(reading) : 0;

  function switchFarm(id: string) {
    setFarmId(id);
    const first = getPlotsForFarm(id)[0];
    setSelectedPlotId(first?.id ?? "");
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            Overview
          </h1>
          <p className="mt-1 text-sm text-sakasense-muted">
            Multi-plot soil health for {farm.name} · {farm.location}
          </p>
        </div>
        <label className="text-sm font-medium text-sakasense-muted">
          Farm / zone
          <select
            value={farmId}
            onChange={(e) => switchFarm(e.target.value)}
            className="mt-1 block w-full min-w-[240px] rounded-xl border border-sakasense-border bg-sakasense-surface-2 px-3.5 py-2.5 text-sakasense-ink outline-none focus:border-sakasense-green sm:w-auto"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.type === "rural_field" ? "Field" : "Urban"})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        {/* Zone list */}
        <aside className="sakasense-card h-fit p-3 animate-fade-up">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-sakasense-muted">
            Plots / zones
          </p>
          <ul className="space-y-1">
            {farmPlots.map((plot) => (
              <li key={plot.id}>
                <button
                  type="button"
                  onClick={() => setSelectedPlotId(plot.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-xl px-3 py-3 text-left transition",
                    plot.id === activePlot?.id
                      ? "bg-sakasense-green-soft"
                      : "hover:bg-sakasense-cream",
                  )}
                >
                  <span className="text-sm font-semibold">{plot.name}</span>
                  <span className="text-xs text-sakasense-muted">
                    {plot.cropCurrent} · {plot.areaLabel}
                  </span>
                  <StatusPill status={plot.status} className="mt-1 w-fit" />
                </button>
              </li>
            ))}
          </ul>
          <Link
            href={`/farm/${farmId}`}
            className="mt-3 block rounded-xl px-3 py-2 text-center text-sm font-semibold text-sakasense-green hover:bg-sakasense-green-soft"
          >
            Open farm view
          </Link>
        </aside>

        {/* Center */}
        <div className="space-y-5">
          {farmPlots.length > 0 ? (
            <FarmPlanVisual
              plots={farmPlots}
              farmId={farmId}
              selectedPlotId={activePlot?.id}
              onSelectPlot={setSelectedPlotId}
            />
          ) : null}

          {rec && activePlot ? (
            <AIInsightCard
              insight={rec.insight}
              guidebookCode={rec.guidebookCode}
              href={`/guidebook?code=${rec.guidebookCode}`}
            />
          ) : null}
        </div>

        {/* Summary panel */}
        <aside className="space-y-4 animate-fade-up-delay-2">
          <div className="sakasense-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{activePlot?.name ?? "No plot"}</h3>
              {device ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                    device.status === "online"
                      ? "bg-sakasense-healthy/15 text-sakasense-healthy"
                      : device.status === "syncing"
                        ? "bg-sakasense-warn/20 text-sakasense-warn-ink"
                        : "bg-sakasense-danger/10 text-sakasense-danger",
                  )}
                >
                  {device.status === "online"
                    ? "Live"
                    : device.status === "syncing"
                      ? "Syncing"
                      : "Last synced"}
                </span>
              ) : null}
            </div>
            <SoilHealthGauge value={health} />
            {reading ? (
              <p className="mt-1 text-center text-xs text-sakasense-muted">
                Last reading {formatRelativeTime(reading.timestamp)}
                {reading.source === "synced_sd_card" ? " · SD card sync" : " · live"}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricTile
              label="pH"
              value={reading?.pH.toFixed(2) ?? "—"}
              icon={FlaskConical}
            />
            <MetricTile label="N" value={reading?.N ?? "—"} unit="mg/kg" icon={Leaf} />
            <MetricTile label="P" value={reading?.P ?? "—"} unit="mg/kg" icon={Droplets} />
            <MetricTile label="K" value={reading?.K ?? "—"} unit="mg/kg" icon={Activity} />
          </div>

          <div className="grid gap-3">
            <MetricTile
              label="Days since reading"
              value={reading ? daysBetween(reading.timestamp) : "—"}
              icon={CalendarClock}
              hint={reading ? formatRelativeTime(reading.timestamp) : undefined}
            />
            <MetricTile
              label="Device / battery"
              value={device ? `${device.batteryPercent}%` : "—"}
              icon={Battery}
              hint={device ? device.serialNumber : "No device linked"}
            />
            <MetricTile
              label="Next check-in"
              value={activePlot?.status === "action_required" ? "ASAP" : "5 days"}
              icon={CalendarClock}
              hint="Based on on-device recommendation cadence"
            />
          </div>

          {activePlot ? (
            <Link
              href={`/farm/${farmId}/plot/${activePlot.id}`}
              className="flex w-full items-center justify-center rounded-full bg-sakasense-green py-3 text-sm font-semibold text-sakasense-on-green hover:bg-sakasense-green-dark"
            >
              Open soil health details
            </Link>
          ) : null}
        </aside>
      </div>
    </AppShell>
  );
}
