"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  getLatestRecommendation,
  getPlot,
  plots,
  supportedCrops,
} from "@/lib/data";

export default function CropHealthPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
          Crop Health
        </h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Suitability rankings and fertilizer guidance from your on-device model — the website
          displays what the ESP32 already computed.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {plots.map((plot) => {
            const rec = getLatestRecommendation(plot.id);
            if (!rec) return null;
            const top = rec.rankedCrops[0];
            const drivers = rec.insight;
            return (
              <div key={plot.id} className="sakasense-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">{plot.name}</h2>
                    <p className="text-sm text-sakasense-muted">
                      Growing now: {plot.cropCurrent}
                    </p>
                  </div>
                  <Link
                    href={`/farm/${plot.farmId}/plot/${plot.id}`}
                    className="text-sm font-semibold text-sakasense-green"
                  >
                    Plot details
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-sakasense-muted">
                      Best suited right now
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-sakasense-green-dark">
                      {top.crop}{" "}
                      <span className="text-base text-sakasense-muted">({top.score}%)</span>
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {rec.rankedCrops.map((c) => (
                        <li key={c.crop} className="flex items-center justify-between text-sm">
                          <span>{c.crop}</span>
                          <span className="font-semibold">{c.score}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-sakasense-cream p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-sakasense-muted">
                      Why
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{drivers}</p>
                    <p className="mt-3 text-xs text-sakasense-muted">
                      Guidebook{" "}
                      <Link
                        href={`/guidebook?code=${rec.guidebookCode}`}
                        className="font-semibold text-sakasense-green"
                      >
                        {rec.guidebookCode}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="sakasense-card h-fit p-5">
          <h2 className="font-semibold">Supported crops</h2>
          <p className="mt-1 text-xs text-sakasense-muted">
            Eastern Visayas field crops + common urban crops in the training set.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {supportedCrops.map((crop) => (
              <li
                key={crop}
                className="rounded-full border border-sakasense-border bg-sakasense-surface-2 px-3 py-1 text-xs font-medium"
              >
                {crop}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-sakasense-muted">
            Active plots: {plots.map((p) => getPlot(p.id)?.cropCurrent).filter(Boolean).join(", ")}
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
