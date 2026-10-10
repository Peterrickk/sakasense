import type { Metadata } from "next";
import Image from "next/image";
import { BrainCircuit, LayoutDashboard, Smartphone } from "lucide-react";
import { SectionHeading } from "@/components/brand/section-heading";
import { EcosystemLink } from "@/components/ecosystem/ecosystem-link";
import { StoreBadges } from "@/components/ecosystem/store-badges";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/server/queries/products";

export const metadata: Metadata = {
  title: "Products",
  description: "The SakaSense Device, the SakaSense mobile app, and the SakaSense web dashboard.",
  alternates: { canonical: "/products" },
};

export const revalidate = 300;

export default async function ProductsPage() {
  const [device] = await getProducts({ category: "device" });
  return (
    <div className="container-page py-14">
      <SectionHeading
        as="h1"
        align="left"
        eyebrow="Products"
        title="The SakaSense system"
        subtitle="One device to read your soil, one app to use it in the field, and one dashboard to track it over time."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {device ? <ProductCard product={device} /> : null}

        <article className="glass hover:border-primary/60 hover:shadow-glow rounded-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
          <div className="bg-surface-2 flex aspect-[4/3] items-center justify-center overflow-hidden pt-4">
            <Image
              src="/images/ecosystem/sakasense-app.webp"
              alt="SakaSense mobile app"
              width={355}
              height={763}
              sizes="200px"
              className="h-full w-auto object-contain object-top"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="w-fit">
                <Smartphone className="size-3" aria-hidden="true" /> Mobile app
              </Badge>
              <Badge variant="primary" className="w-fit">
                <BrainCircuit className="size-3" aria-hidden="true" /> In-house AI
              </Badge>
            </div>
            <h2 className="text-h3">SakaSense App</h2>
            <p className="text-text-muted text-sm">
              Pair your device and read your soil in the field. AI we built ourselves turns each
              reading into a soil health score and advice.
            </p>
            <StoreBadges className="mt-auto pt-2" />
          </div>
        </article>

        <article className="glass hover:border-primary/60 hover:shadow-glow rounded-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
          <Image
            src="/images/ecosystem/sakasense-dashboard.webp"
            alt="SakaSense web dashboard"
            width={1400}
            height={875}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="aspect-[4/3] w-full object-cover object-top"
          />
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex flex-wrap gap-2">
              <Badge className="w-fit">
                <LayoutDashboard className="size-3" aria-hidden="true" /> Web dashboard
              </Badge>
              <Badge variant="primary" className="w-fit">
                <BrainCircuit className="size-3" aria-hidden="true" /> In-house AI
              </Badge>
            </div>
            <h2 className="text-h3">SakaSense Web Dashboard</h2>
            <p className="text-text-muted text-sm">
              AI Insights built in-house spot problems across your plots. Plus history, alerts, and
              reports. Free to start.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <EcosystemLink
                href={siteConfig.links.dashboardSignup}
                target="dashboard_signup"
                variant="primary"
                size="sm"
              >
                Create account
              </EcosystemLink>
              <EcosystemLink
                href={siteConfig.links.dashboardLogin}
                target="dashboard_login"
                size="sm"
              >
                Log in
              </EcosystemLink>
            </div>
          </div>
        </article>
      </div>

      <aside className="glass rounded-card mt-14 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
        <p className="text-lg">
          Need several devices? <strong>Request a bulk quote</strong> for cooperatives, LGUs, and
          agribusinesses.
        </p>
        <Button href="/quote" variant="secondary">
          Request a bulk quote
        </Button>
      </aside>
    </div>
  );
}
