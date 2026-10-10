"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { guidebook, getGuidebookEntry } from "@/lib/data";

function GuidebookInner() {
  const params = useSearchParams();
  const initial = params.get("code") ?? "";
  const [query, setQuery] = useState(initial);
  const [code, setCode] = useState(initial);

  const entry = useMemo(() => getGuidebookEntry(code.trim()), [code]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guidebook;
    return guidebook.filter(
      (g) =>
        g.code.includes(q) ||
        g.crop.toLowerCase().includes(q) ||
        g.soilCondition.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
          Digital Guidebook
        </h1>
        <p className="mt-1 text-sm text-sakasense-muted">
          Type the 4-digit code from your sensor screen for full cultivation guidance when the
          printed book isn’t at hand.
        </p>
      </div>

      <div className="sakasense-card mb-5 flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium">
          Unique code or search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 4821 or eggplant"
            className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
          />
        </label>
        <button
          type="button"
          onClick={() => setCode(query.trim())}
          className="rounded-full bg-sakasense-green px-5 py-2.5 text-sm font-semibold text-sakasense-on-green"
        >
          Look up code
        </button>
      </div>

      {code ? (
        <div className="sakasense-card mb-5 p-6">
          {entry ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-sakasense-muted">
                Code {entry.code}
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold">
                {entry.crop}
              </h2>
              <p className="mt-2 text-sm text-sakasense-muted">{entry.soilCondition}</p>
              <h3 className="mt-5 font-semibold">Cultivation steps</h3>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                {entry.cultivationSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <h3 className="mt-5 font-semibold">Fertilizer notes</h3>
              <p className="mt-2 text-sm leading-relaxed">{entry.fertilizerNotes}</p>
            </>
          ) : (
            <p className="text-sm text-sakasense-danger">
              No Guidebook entry for code “{code}”. Check the digits on your OLED/LCD.
            </p>
          )}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((g) => (
          <button
            key={g.code}
            type="button"
            onClick={() => {
              setQuery(g.code);
              setCode(g.code);
            }}
            className="sakasense-card p-4 text-left transition hover:border-sakasense-green/40"
          >
            <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-sakasense-green-dark">
              {g.code}
            </p>
            <p className="mt-1 font-semibold">{g.crop}</p>
            <p className="mt-1 text-xs text-sakasense-muted">{g.soilCondition}</p>
          </button>
        ))}
      </div>
    </>
  );
}

export default function GuidebookPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sakasense-muted">Loading guidebook…</p>}>
        <GuidebookInner />
      </Suspense>
    </AppShell>
  );
}
