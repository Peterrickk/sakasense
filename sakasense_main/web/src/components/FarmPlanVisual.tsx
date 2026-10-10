"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Boxes, Map as MapIcon } from "lucide-react";
import type { Plot } from "@/lib/types";
import { getFarm } from "@/lib/data";
import { getGoogleMapsApiKey } from "@/lib/googleMaps";
import { cn } from "@/lib/utils";
import { FarmMap3D } from "./FarmMap3D";
import { PlotRectangle } from "./PlotRectangle";

type ViewMode = "plots" | "map3d";

export function FarmPlanVisual({
  plots,
  farmId,
  selectedPlotId,
  onSelectPlot,
}: {
  plots: Plot[];
  farmId: string;
  selectedPlotId?: string;
  onSelectPlot?: (plotId: string) => void;
}) {
  const farm = getFarm(farmId);
  const hasMapsKey = Boolean(getGoogleMapsApiKey());
  const [mode, setMode] = useState<ViewMode>("plots");

  // The farm's real layout grid is used from the `sm` breakpoint up. On phones the plots stack
  // in one column so narrow tiles never crush their labels.
  const gridVars = useMemo(() => {
    const maxCol = Math.max(...plots.map((p) => p.layout.col + (p.layout.colSpan ?? 1) - 1), 1);
    const maxRow = Math.max(...plots.map((p) => p.layout.row + (p.layout.rowSpan ?? 1) - 1), 1);
    return {
      "--farm-cols": `repeat(${maxCol}, minmax(0, 1fr))`,
      "--farm-rows": `repeat(${maxRow}, minmax(130px, 1fr))`,
    } as CSSProperties;
  }, [plots]);

  const tabClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
      active
        ? "bg-sakasense-green-soft text-sakasense-green-dark ring-1 ring-sakasense-green/40"
        : "text-sakasense-muted hover:text-sakasense-ink",
    );

  return (
    <div className="sakasense-card overflow-hidden animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sakasense-border px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
            Farm layout
          </h3>
          <p className="text-xs text-sakasense-muted">
            {mode === "plots"
              ? "Crop plots with live status colors"
              : "Google Maps photorealistic 3D"}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-sakasense-border bg-sakasense-cream p-1">
          <button
            type="button"
            onClick={() => setMode("plots")}
            aria-pressed={mode === "plots"}
            className={tabClass(mode === "plots")}
          >
            <Boxes className="size-3.5" />
            Plots
          </button>
          <button
            type="button"
            onClick={() => setMode("map3d")}
            aria-pressed={mode === "map3d"}
            className={tabClass(mode === "map3d")}
            title={hasMapsKey ? "Open Google Maps 3D" : "Needs NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"}
          >
            <MapIcon className="size-3.5" />
            3D Map
          </button>
        </div>
      </div>

      {mode === "plots" ? (
        <div className="farm-plan-board p-3 sm:p-4">
          <div
            className="grid auto-rows-[150px] grid-cols-1 gap-3 sm:auto-rows-auto sm:[grid-template-columns:var(--farm-cols)] sm:[grid-template-rows:var(--farm-rows)]"
            style={gridVars}
          >
            {plots.map((plot) => (
              <PlotRectangle
                key={plot.id}
                plot={plot}
                farmId={farmId}
                selected={plot.id === selectedPlotId}
                onSelect={onSelectPlot}
              />
            ))}
          </div>
        </div>
      ) : farm ? (
        <div className="aspect-[4/5] min-h-[280px] w-full sm:aspect-[16/10]">
          <FarmMap3D
            farm={farm}
            plots={plots}
            selectedPlotId={selectedPlotId}
            onSelectPlot={onSelectPlot}
            onFallbackToPlots={() => setMode("plots")}
          />
        </div>
      ) : (
        <div className="grid min-h-[240px] place-items-center text-sm text-sakasense-muted">
          Farm not found.
        </div>
      )}
    </div>
  );
}
