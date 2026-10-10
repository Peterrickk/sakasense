"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Plot } from "@/lib/types";
import { getCropVisual, statusAccent, statusRing } from "@/lib/crops";
import { StatusPill } from "./StatusPill";
import { cn } from "@/lib/utils";

export function PlotRectangle({
  plot,
  farmId,
  selected,
  onSelect,
}: {
  plot: Plot;
  farmId: string;
  selected?: boolean;
  onSelect?: (plotId: string) => void;
}) {
  const visual = getCropVisual(plot.cropCurrent);
  const [imgOk, setImgOk] = useState(true);
  const zoneLabel = plot.name.split("—")[0].trim();

  const { col, row, colSpan = 1, rowSpan = 1 } = plot.layout;

  return (
    <Link
      href={`/farm/${farmId}/plot/${plot.id}`}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(plot.id);
        }
      }}
      // Placement applies from `sm` up; on phones tiles stack (see FarmPlanVisual).
      style={
        {
          "--plot-col": `${col} / span ${colSpan}`,
          "--plot-row": `${row} / span ${rowSpan}`,
        } as CSSProperties
      }
      className={cn(
        "group relative min-h-[130px] overflow-hidden rounded-2xl ring-2 transition duration-300 sm:[grid-column:var(--plot-col)] sm:[grid-row:var(--plot-row)]",
        "hover:brightness-110 focus-visible:outline-none focus-visible:ring-sakasense-green",
        statusRing(plot.status),
        selected && "brightness-110 ring-4",
      )}
    >
      {/* Crop photo */}
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={visual.image}
          alt={visual.label}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div
          className={cn("absolute inset-0", visual.patternClass)}
          style={{ backgroundImage: visual.field }}
          aria-hidden
        />
      )}

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
      <div className={cn("absolute inset-x-0 top-0 h-1.5", statusAccent(plot.status))} />

      <div className="relative flex h-full flex-col justify-between p-3 sm:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="rounded-lg bg-black/35 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {zoneLabel}
          </span>
          {/* Solid backing so the pill stays readable on any photo. */}
          <span className="rounded-full bg-sakasense-surface shadow-md">
            <StatusPill status={plot.status} />
          </span>
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-white drop-shadow sm:text-2xl">
            {plot.cropCurrent}
          </p>
          <p className="text-xs font-medium text-white/85 sm:text-sm">{plot.areaLabel}</p>
        </div>
      </div>
    </Link>
  );
}
