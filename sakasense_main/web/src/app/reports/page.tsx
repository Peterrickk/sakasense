"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { farms, getPlotsForFarm, getReadingsForPlot, getRecommendationHistory } from "@/lib/data";

export default function ReportsPage() {
  const [farmId, setFarmId] = useState(farms[0].id);
  const [plotId, setPlotId] = useState("all");
  const [days, setDays] = useState(30);
  const [message, setMessage] = useState("");

  const farmPlots = useMemo(() => getPlotsForFarm(farmId), [farmId]);

  function exportCsv() {
    const targetPlots =
      plotId === "all" ? farmPlots : farmPlots.filter((p) => p.id === plotId);
    const rows = [["plot", "timestamp", "pH", "N", "P", "K", "source"]];
    for (const plot of targetPlots) {
      for (const r of getReadingsForPlot(plot.id, days)) {
        rows.push([
          plot.name,
          r.timestamp,
          String(r.pH),
          String(r.N),
          String(r.P),
          String(r.K),
          r.source,
        ]);
      }
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sakasense-report-${farmId}-${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("CSV downloaded. PDF export ships in Phase 3 (print-ready layout available via browser print).");
  }

  function printReport() {
    window.print();
    setMessage("Use your browser print dialog to save as PDF.");
  }

  const previewPlots =
    plotId === "all" ? farmPlots : farmPlots.filter((p) => p.id === plotId);

  return (
    <AppShell>
      <div className="mb-6 print:hidden">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Reports</h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Export readings, charts summary, and recommendation logs for cooperatives, lenders, or
          agri offices.
        </p>
      </div>

      <div className="sakasense-card mb-5 grid gap-4 p-5 print:hidden sm:grid-cols-3">
        <label className="text-sm font-medium">
          Farm
          <select
            value={farmId}
            onChange={(e) => {
              setFarmId(e.target.value);
              setPlotId("all");
            }}
            className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3 py-2.5"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Plot
          <select
            value={plotId}
            onChange={(e) => setPlotId(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3 py-2.5"
          >
            <option value="all">All plots</option>
            {farmPlots.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Date range
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3 py-2.5"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Season (90 days)</option>
          </select>
        </label>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-full bg-sakasense-green px-5 py-2.5 text-sm font-semibold text-sakasense-on-green"
        >
          <Download className="size-4" /> Download CSV
        </button>
        <button
          type="button"
          onClick={printReport}
          className="inline-flex items-center gap-2 rounded-full border border-sakasense-border bg-sakasense-surface-2 px-5 py-2.5 text-sm font-semibold"
        >
          Print / Save PDF
        </button>
      </div>
      {message ? <p className="mb-4 text-sm text-sakasense-muted print:hidden">{message}</p> : null}

      <div className="sakasense-card p-6 print:border-0 print:shadow-none">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
          SakaSense Soil Report
        </h2>
        <p className="text-sm text-sakasense-muted">
          {farms.find((f) => f.id === farmId)?.name} · last {days} days · generated{" "}
          {new Date().toLocaleDateString("en-PH")}
        </p>

        {previewPlots.map((plot) => {
          const readings = getReadingsForPlot(plot.id, days);
          const recs = getRecommendationHistory(plot.id).slice(0, 3);
          return (
            <section key={plot.id} className="mt-8 border-t border-sakasense-border pt-6">
              <h3 className="font-semibold">{plot.name}</h3>
              <p className="text-sm text-sakasense-muted">
                {plot.cropCurrent} · {readings.length} readings
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-sakasense-border text-sakasense-muted">
                      <th className="py-2 pr-3 font-medium">Time</th>
                      <th className="py-2 pr-3 font-medium">pH</th>
                      <th className="py-2 pr-3 font-medium">N</th>
                      <th className="py-2 pr-3 font-medium">P</th>
                      <th className="py-2 pr-3 font-medium">K</th>
                      <th className="py-2 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.slice(-8).map((r) => (
                      <tr key={r.id} className="border-b border-sakasense-border/60">
                        <td className="py-2 pr-3">{new Date(r.timestamp).toLocaleDateString()}</td>
                        <td className="py-2 pr-3">{r.pH.toFixed(2)}</td>
                        <td className="py-2 pr-3">{r.N}</td>
                        <td className="py-2 pr-3">{r.P}</td>
                        <td className="py-2 pr-3">{r.K}</td>
                        <td className="py-2 capitalize">{r.source.replace("_", " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sakasense-muted">
                  Recommendation log
                </p>
                <ul className="mt-2 space-y-2 text-sm">
                  {recs.map((r) => (
                    <li key={r.id}>
                      {new Date(r.timestamp).toLocaleDateString()} — {r.insight} (code{" "}
                      {r.guidebookCode})
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
