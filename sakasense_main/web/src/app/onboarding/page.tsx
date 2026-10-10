"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CheckCircle2, QrCode, Wifi } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [serial, setSerial] = useState("");
  const [farmName, setFarmName] = useState("");
  const [location, setLocation] = useState("");
  const [plotName, setPlotName] = useState("");
  const [crop, setCrop] = useState("");
  const [done, setDone] = useState(false);

  function next(e: FormEvent) {
    e.preventDefault();
    if (step < 3) setStep((s) => s + 1);
    else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 900);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
          Link your SakaSense device
        </h1>
        <p className="mt-2 text-sakasense-muted">
          Enter the serial on your unit. If the ESP32 is offline, sync first via the mobile app —
          the website will show last-synced history.
        </p>

        <div className="mt-6 flex gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-sakasense-green" : "bg-sakasense-border"}`}
            />
          ))}
        </div>

        {done ? (
          <div className="sakasense-card mt-8 flex items-center gap-3 p-6 text-sakasense-healthy">
            <CheckCircle2 className="size-6" />
            <p className="font-semibold">Device linked — opening your dashboard…</p>
          </div>
        ) : (
          <form onSubmit={next} className="sakasense-card mt-8 space-y-4 p-6">
            {step === 1 && (
              <>
                <h2 className="font-semibold">Device ID / serial</h2>
                <label className="block text-sm">
                  Serial number
                  <input
                    required
                    placeholder="KS-ESP32-004821"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
                  />
                </label>
                <div className="flex gap-3 text-sm text-sakasense-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <QrCode className="size-4" /> Or scan QR on the unit
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Wifi className="size-4" /> Pair on same Wi‑Fi when available
                  </span>
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="font-semibold">Your farm</h2>
                <label className="block text-sm">
                  Farm name
                  <input
                    required
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
                  />
                </label>
                <label className="block text-sm">
                  Location
                  <input
                    required
                    placeholder="Barangay, City / Municipality"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
                  />
                </label>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="font-semibold">First plot / zone</h2>
                <label className="block text-sm">
                  Plot name
                  <input
                    required
                    placeholder="Zone A — Potato, 0.5 ha"
                    value={plotName}
                    onChange={(e) => setPlotName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
                  />
                </label>
                <label className="block text-sm">
                  Current crop
                  <input
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-sakasense-border px-3.5 py-2.5 outline-none focus:border-sakasense-green focus:ring-2 focus:ring-sakasense-green/20"
                  />
                </label>
              </>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-sakasense-green py-3 text-sm font-semibold text-sakasense-on-green hover:bg-sakasense-green-dark"
            >
              {step < 3 ? "Continue" : "Finish setup"}
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
