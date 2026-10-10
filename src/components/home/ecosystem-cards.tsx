import Image from "next/image";
import { Cpu, LayoutDashboard, Smartphone } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { EcosystemLink } from "@/components/ecosystem/ecosystem-link";
import { StoreBadges } from "@/components/ecosystem/store-badges";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";

/** The three SakaSense products: Device, Mobile App, Web Dashboard. */
export function EcosystemCards() {
  return (
    <section className="bg-surface/50 py-14 md:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="The SakaSense system"
          title="One device. One app. One dashboard."
          subtitle="Read your soil in the field, keep it in your pocket, and track it from anywhere."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal>
            <GlassCard hover className="flex h-full flex-col gap-4 overflow-hidden p-0">
              <Image
                src="/images/products/sakasense-device.webp"
                alt="SakaSense Device"
                width={800}
                height={600}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col gap-3 p-6 pt-2">
                <Cpu className="text-primary size-7" aria-hidden="true" />
                <h3 className="text-h3">SakaSense Device</h3>
                <p className="text-text-muted">
                  Reads pH, N, P, and K and recommends crops and fertilizer on the spot.
                </p>
                <Button href="/products/sakasense-device" variant="secondary" className="mt-auto">
                  View the device
                </Button>
              </div>
            </GlassCard>
          </Reveal>
          <Reveal index={1}>
            <GlassCard hover className="flex h-full flex-col gap-4 overflow-hidden p-0">
              <div className="bg-surface-2 flex aspect-[4/3] items-center justify-center overflow-hidden pt-4">
                <Image
                  src="/images/ecosystem/sakasense-app.webp"
                  alt="SakaSense mobile app showing a soil health score of 78 and live nutrient gauges"
                  width={355}
                  height={763}
                  sizes="200px"
                  className="h-full w-auto object-contain object-top"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 pt-2">
                <Smartphone className="text-primary size-7" aria-hidden="true" />
                <h3 className="text-h3">SakaSense App</h3>
                <p className="text-text-muted">
                  Pair and read your device in the field. Our in-house AI gives you a soil health
                  score and advice.
                </p>
                <StoreBadges className="mt-auto" />
              </div>
            </GlassCard>
          </Reveal>
          <Reveal index={2}>
            <GlassCard hover className="flex h-full flex-col gap-4 overflow-hidden p-0">
              <Image
                src="/images/ecosystem/sakasense-dashboard.webp"
                alt="SakaSense web dashboard showing farm plots, soil health, and pH, N, P, K readings"
                width={1400}
                height={875}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/3] w-full object-cover object-top"
              />
              <div className="flex flex-1 flex-col gap-3 p-6 pt-2">
                <LayoutDashboard className="text-primary size-7" aria-hidden="true" />
                <h3 className="text-h3">Web Dashboard</h3>
                <p className="text-text-muted">
                  AI Insights built by our team, plus history, multi-plot views, alerts, and
                  reports.
                </p>
                <EcosystemLink
                  href={siteConfig.links.dashboard}
                  target="dashboard"
                  className="mt-auto"
                >
                  Open dashboard
                </EcosystemLink>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
