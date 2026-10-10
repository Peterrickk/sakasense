import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/brand/section-heading";
import { EcosystemLink } from "@/components/ecosystem/ecosystem-link";
import { StoreBadges } from "@/components/ecosystem/store-badges";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ecosystem",
  description: "The SakaSense Device, mobile app, and web dashboard working together.",
  alternates: { canonical: "/ecosystem" },
};

export default function EcosystemPage() {
  return (
    <div className="container-page py-14">
      <SectionHeading
        as="h1"
        eyebrow="Ecosystem"
        title="One device. One app. One dashboard."
        subtitle="Everything you need to go from reading to decision."
      />
      <div className="space-y-24">
        <section id="device" className="grid items-center gap-8 md:grid-cols-2">
          <div className="glass overflow-hidden rounded-3xl p-2">
            <Image
              src="/images/products/sakasense-device.webp"
              alt="The SakaSense Device"
              width={1600}
              height={1200}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-h2">SakaSense Device</h2>
            <p className="text-text-muted">
              The field unit. It reads soil pH and N-P-K, ranks the best crops, and shows a
              fertilizer prescription on its screen, with no internet needed.
            </p>
            <Button href="/products/sakasense-device">View the device</Button>
          </div>
        </section>

        <section id="mobile-app" className="grid items-center gap-8 md:grid-cols-2">
          <div className="space-y-4 md:order-2">
            <p className="text-primary font-mono text-xs tracking-widest uppercase">
              AI built in-house
            </p>
            <h2 className="text-h2">SakaSense App</h2>
            <p className="text-text-muted">
              Pair your device and read your soil right in the field. The app&apos;s AI, built by
              our own team, turns readings into a soil health score and clear next steps.
            </p>
            <GlassCard className="space-y-2">
              <p>
                <strong>Bluetooth:</strong>{" "}
                <span className="text-text-muted">
                  pair with the device nearby; works with no internet.
                </span>
              </p>
              <p>
                <strong>Wi-Fi:</strong>{" "}
                <span className="text-text-muted">
                  connect the device to your network to sync with the dashboard.
                </span>
              </p>
            </GlassCard>
            <StoreBadges />
          </div>
          <div className="bg-surface-2 border-border mx-auto w-full max-w-xs overflow-hidden rounded-3xl border p-3 md:order-1">
            <Image
              src="/images/ecosystem/sakasense-app.webp"
              alt="SakaSense app showing a soil health score of 78 out of 100 and live phosphorus and potassium gauges"
              width={355}
              height={763}
              sizes="320px"
              className="h-auto w-full rounded-2xl"
            />
          </div>
        </section>

        <section id="dashboard" className="grid items-center gap-8 md:grid-cols-2">
          <div className="border-border rounded-card overflow-hidden border">
            <Image
              src="/images/ecosystem/sakasense-dashboard.webp"
              alt="SakaSense web dashboard showing farm plots with status colors, a soil health index, and pH, N, P, K readings"
              width={1400}
              height={875}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div className="space-y-4">
            <p className="text-primary font-mono text-xs tracking-widest uppercase">
              AI built in-house
            </p>
            <h2 className="text-h2">Web Dashboard</h2>
            <p className="text-text-muted">
              For farmers with Wi-Fi: connect your SakaSense Device and see every plot in one place.
            </p>
            <ul className="text-text-muted list-disc space-y-1 pl-5">
              <li>
                <strong className="text-text">AI Insights</strong> (built in-house) that spot
                problems across your plots and say what to do next
              </li>
              <li>Farm layout with plot status (healthy, needs attention, action required)</li>
              <li>pH and N-P-K history and trends</li>
              <li>Crop health, alerts, and printable reports</li>
              <li>The SakaSense Guidebook, matched to the code on your device</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <EcosystemLink
                href={siteConfig.links.dashboardSignup}
                target="dashboard_signup"
                variant="primary"
              >
                Create account
              </EcosystemLink>
              <EcosystemLink href={siteConfig.links.dashboardLogin} target="dashboard_login">
                Log in
              </EcosystemLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
