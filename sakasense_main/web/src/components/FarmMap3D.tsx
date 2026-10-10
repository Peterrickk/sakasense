"use client";

import { useEffect, useRef, useState } from "react";
import type { Farm, Plot } from "@/lib/types";
import { getGoogleMapsApiKey, importMaps3d, loadGoogleMaps } from "@/lib/googleMaps";
import { statusLabel } from "@/lib/utils";

export function FarmMap3D({
  farm,
  plots,
  selectedPlotId,
  onSelectPlot,
  onFallbackToPlots,
}: {
  farm: Farm;
  plots: Plot[];
  selectedPlotId?: string;
  onSelectPlot?: (plotId: string) => void;
  onFallbackToPlots?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      setError("missing-key");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        await loadGoogleMaps(apiKey);
        if (cancelled) return;

        const { Map3DElement, Marker3DInteractiveElement } = await importMaps3d();
        if (cancelled) return;

        host.replaceChildren();

        const map = new Map3DElement({
          center: {
            lat: farm.lat,
            lng: farm.lng,
            altitude: farm.altitude ?? 40,
          },
          range: farm.type === "urban_container" ? 350 : 900,
          tilt: 55,
          heading: 20,
          mode: "HYBRID",
          gestureHandling: "COOPERATIVE",
        });
        map.style.width = "100%";
        map.style.height = "100%";
        map.style.display = "block";

        for (const plot of plots) {
          const marker = new Marker3DInteractiveElement({
            position: {
              lat: farm.lat + plot.latOffset,
              lng: farm.lng + plot.lngOffset,
              altitude: 30,
            },
            altitudeMode: "RELATIVE_TO_GROUND",
            extruded: true,
            label: `${plot.name.split("—")[0].trim()} · ${statusLabel(plot.status)}`,
            title: `${plot.name} — ${plot.cropCurrent}`,
          });
          marker.addEventListener("gmp-click", () => {
            onSelectPlot?.(plot.id);
          });
          map.append(marker);
        }

        host.append(map);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("load-failed");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [farm, plots, onSelectPlot, selectedPlotId]);

  if (error === "missing-key") {
    return (
      <div className="grid h-full min-h-[280px] place-items-center bg-sakasense-soil-soft px-6 text-center">
        <div className="max-w-md space-y-2">
          <p className="font-semibold text-sakasense-ink">Google Maps 3D needs an API key</p>
          <p className="text-sm text-sakasense-muted">
            Add <code className="rounded bg-sakasense-surface-2 px-1.5 py-0.5 text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>{" "}
            to <code className="rounded bg-sakasense-surface-2 px-1.5 py-0.5 text-xs">web/.env.local</code>, enable the
            Maps JavaScript API, then restart the dev server. Plot rectangles stay available without a
            key.
          </p>
        </div>
      </div>
    );
  }

if (error === "load-failed") {
    return (
      <div className="grid h-full min-h-[280px] place-items-center bg-sakasense-soil-soft px-6 text-center">
        <div className="max-w-md space-y-2">
          <p className="text-sm font-semibold text-sakasense-danger">
            Couldn&#x27;t load Google Maps 3D
          </p>
          <p className="text-sm text-sakasense-muted">
            Check the API key, billing/free credit, and that Maps JavaScript API is enabled.
          </p>
          {onFallbackToPlots && (
            <button
              type="button"
              onClick={onFallbackToPlots}
              className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full bg-sakasense-green px-4 py-2 text-sm font-semibold text-sakasense-on-green"
            >
              Switch back to Plot view
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[280px] w-full">
      {loading ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-sakasense-cream/80 text-sm text-sakasense-muted">
          Loading 3D map…
        </div>
      ) : null}
      <div ref={hostRef} className="h-full min-h-[280px] w-full [&_gmp-map-3d]:h-full [&_gmp-map-3d]:w-full" />
    </div>
  );
}
