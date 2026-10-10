import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { SensorReadout } from "@/components/brand/sensor-readout";
import { DevNote } from "@/components/placeholder";
import { GlassCard } from "@/components/ui/glass-card";
import { metrics } from "@/content/metrics";

export function WhatItMeasures() {
  return (
    <section className="bg-surface/50 py-14 md:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="What it measures"
          title="Four readings. One clear picture."
          subtitle="Each reading explained in plain language. Sample values shown are illustrative."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <Reveal key={m.key} index={i % 4}>
              <GlassCard hover className="flex h-full flex-col gap-3">
                <m.icon className="text-primary size-7" aria-hidden="true" />
                <h3 className="text-h3">{m.name}</h3>
                <p className="text-text-muted text-sm">{m.explainer}</p>
                <SensorReadout
                  className="mt-auto self-start"
                  label={m.sample.label}
                  value={m.sample.value}
                  unit={m.sample.unit}
                  decimals={m.sample.decimals}
                />
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center font-mono">
          <DevNote>[PLACEHOLDER — confirm accuracy ranges and units]</DevNote>
        </p>
      </div>
    </section>
  );
}
