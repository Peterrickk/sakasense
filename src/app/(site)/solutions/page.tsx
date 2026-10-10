import type { Metadata } from "next";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { ProductImage } from "@/components/product/product-image";
import { Button } from "@/components/ui/button";
import { solutions } from "@/content/solutions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "How SakaSense helps smallholders, cooperatives, commercial farms, and institutions.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <div className="container-page py-14">
      <SectionHeading
        as="h1"
        eyebrow="Solutions"
        title="Soil intelligence for every kind of farm"
        subtitle="Whether you tend one plot or manage thousands of hectares."
      />
      <div className="space-y-16">
        {solutions.map((s, i) => (
          <Reveal key={s.slug}>
            <section
              id={s.slug}
              className={cn(
                "grid items-center gap-8 md:grid-cols-2",
                i % 2 === 1 && "md:[&>*:first-child]:order-2",
              )}
            >
              <ProductImage alt={s.title} className="rounded-card aspect-[4/3] w-full" />
              <div className="space-y-4">
                <s.icon className="text-primary size-9" aria-hidden="true" />
                <h2 className="text-h2">{s.title}</h2>
                <p>
                  <strong className="text-danger">The pain:</strong>{" "}
                  <span className="text-text-muted">{s.pain}</span>
                </p>
                <p>
                  <strong className="text-primary">How SakaSense helps:</strong>{" "}
                  <span className="text-text-muted">{s.help}</span>
                </p>
                <p className="text-sm">
                  Recommended: <strong>{s.recommended}</strong>
                </p>
                <Button href={s.cta.href}>{s.cta.label}</Button>
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
