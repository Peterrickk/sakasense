import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContourBackground, GridBackground } from "@/components/brand/backgrounds";
import { Breadcrumbs, EmptyState, PriceTag } from "@/components/brand/misc";
import { SectionHeading } from "@/components/brand/section-heading";
import { SensorReadout } from "@/components/brand/sensor-readout";
import { StatCounter } from "@/components/brand/stat-counter";
import { TeamCard } from "@/components/team/team-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { team } from "@/content/team";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqs } from "@/content/faq";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/server/queries/products";

export const metadata: Metadata = { title: "Style guide", robots: { index: false, follow: false } };

/** Dev-only component gallery. Returns 404 in production and is excluded from the sitemap. */
export default async function StyleGuide() {
  if (process.env.NODE_ENV === "production") notFound();
  const [product] = await getFeaturedProducts(1);
  const swatches = [
    "bg",
    "surface",
    "surface-2",
    "primary",
    "primary-glow",
    "accent",
    "soil",
    "info",
    "warning",
    "danger",
  ];
  return (
    <div className="relative isolate">
      <GridBackground />
      <ContourBackground />
      <div className="container-page space-y-14 py-10">
        <header className="flex items-center justify-between">
          <h1 className="text-h2">Style guide</h1>
        </header>

        <section>
          <h2 className="text-h3 mb-4">Colors</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {swatches.map((c) => (
              <div key={c} className="border-border rounded-xl border p-2">
                <div className="h-12 rounded-lg" style={{ background: `var(--color-${c})` }} />
                <p className="mt-1 font-mono text-xs">{c}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Typography</h2>
          <p className="text-h1 gradient-text">Display heading</p>
          <p className="text-text-muted">
            Body text in Inter. Muted text must keep 4.5:1 contrast.
          </p>
          <p className="font-mono text-sm">Mono readout: pH 6.4 · N 42 mg/kg</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Buttons &amp; badges</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary glow</Button>
            <Button variant="secondary">Secondary glass</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <GlassCard hover>
            <h3 className="text-h3">GlassCard (hover)</h3>
            <p className="text-text-muted">Translucent surface with a 1px border.</p>
          </GlassCard>
          <GlassCard glow>
            <h3 className="text-h3">GlassCard (glow)</h3>
            <p className="text-text-muted">Use glow on featured cards only.</p>
          </GlassCard>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3">Sensor readouts &amp; stats</h2>
          <div className="flex flex-wrap gap-3">
            <SensorReadout label="pH" value={6.4} decimals={1} />
            <SensorReadout label="Moisture" value={31} unit="%" />
          </div>
          <div className="grid max-w-md grid-cols-2 gap-6">
            <StatCounter value={1200} label="Sample" suffix="+" />
            <StatCounter value={85} label="Sample" />
          </div>
        </section>

        <section className="grid max-w-xl gap-4">
          <h2 className="text-h3">Form controls</h2>
          <div>
            <Label htmlFor="sg-i">Input</Label>
            <Input id="sg-i" placeholder="Placeholder" />
          </div>
          <div>
            <Label htmlFor="sg-s">Select</Label>
            <Select id="sg-s">
              <option>One</option>
              <option>Two</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="sg-t">Textarea</Label>
            <Textarea id="sg-t" />
          </div>
          <QuantityStepper value={2} onChange={() => {}} />
          <PriceTag centavos={249900} compareAtCentavos={299900} />
        </section>

        <section>
          <SectionHeading
            eyebrow="Eyebrow"
            title="Section heading"
            subtitle="Subtitle goes here."
          />
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Style guide" }]} />
        </section>

        <section className="space-y-4">
          <h2 className="text-h3">Table</h2>
          <Table>
            <THead>
              <TR>
                <TH>Mode</TH>
                <TH>Internet</TH>
              </TR>
            </THead>
            <tbody>
              <TR>
                <TD>Bluetooth</TD>
                <TD>No</TD>
              </TR>
              <TR>
                <TD>Wi-Fi</TD>
                <TD>Yes</TD>
              </TR>
            </tbody>
          </Table>
        </section>

        <section className="space-y-4">
          <h2 className="text-h3">Accordion</h2>
          <FaqAccordion items={faqs.slice(0, 3)} />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <TeamCard key={m.slug} member={m} />
          ))}
        </section>

        {product ? (
          <section className="max-w-sm">
            <h2 className="text-h3 mb-4">Product card</h2>
            <ProductCard product={product} />
          </section>
        ) : null}

        <EmptyState title="Empty state" description="Shown when a list has nothing to display." />
      </div>
    </div>
  );
}
