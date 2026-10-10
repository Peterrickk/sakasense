import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, Headphones, ShieldCheck, Truck } from "lucide-react";
import { Breadcrumbs, PriceTag } from "@/components/brand/misc";
import { SectionHeading } from "@/components/brand/section-heading";
import { StoreBadges } from "@/components/ecosystem/store-badges";
import { EcosystemLink } from "@/components/ecosystem/ecosystem-link";
import { JsonLd } from "@/components/json-ld";
import { AddToCart } from "@/components/product/add-to-cart";
import { Gallery } from "@/components/product/gallery";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TD, TR } from "@/components/ui/table";
import { siteConfig } from "@/config/site";
import { visibleText } from "@/lib/placeholders";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/server/queries/products";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.tagline ?? siteConfig.description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title: p.name, description: p.tagline ?? undefined, images: p.images[0]?.url },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const related = await getRelatedProducts(p, 3);

  const inStock = p.stock > 0;
  const hasPrice = p.priceCentavos > 0;
  const specs = p.specs
    .map((s) => ({ label: s.label, value: visibleText(s.value) }))
    .filter((s) => s.value);
  const inBox = p.inTheBox.map(visibleText).filter(Boolean);
  const description = visibleText(p.description ?? "");

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.tagline ?? undefined,
    sku: p.sku ?? undefined,
    image: p.images.map((i) => new URL(i.url, siteConfig.url).toString()),
    brand: { "@type": "Brand", name: siteConfig.shortName },
  };
  if (hasPrice) {
    jsonLd.offers = {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${p.slug}`,
      price: (p.priceCentavos / 100).toFixed(2),
      priceCurrency: "PHP",
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    };
  }

  return (
    <div className="container-page py-10">
      <JsonLd data={jsonLd} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: p.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={p.images} name={p.name} />
        <div className="space-y-5">
          <Badge>{p.category}</Badge>
          <h1 className="text-h2">{p.name}</h1>
          {p.tagline ? <p className="text-text-muted text-lg">{p.tagline}</p> : null}
          <div className="flex items-center gap-3">
            <PriceTag
              centavos={p.priceCentavos}
              compareAtCentavos={p.compareAtCentavos}
              className="[&>span:first-child]:text-3xl"
            />
            {hasPrice ? (
              <Badge variant={inStock ? "primary" : "warning"}>
                {inStock ? "In stock" : "Out of stock"}
              </Badge>
            ) : null}
          </div>
          <AddToCart product={p} withQuantity withBuyNow size="lg" />
          <ul className="border-border grid gap-3 border-t pt-5 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2">
              <ShieldCheck className="text-primary size-5" aria-hidden="true" /> Warranty included
            </li>
            <li className="flex items-center gap-2">
              <Truck className="text-primary size-5" aria-hidden="true" /> Nationwide shipping
            </li>
            <li className="flex items-center gap-2">
              <Headphones className="text-primary size-5" aria-hidden="true" /> Support from our
              team
            </li>
          </ul>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-14">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="box">What&apos;s in the box</TabsTrigger>
          {p.connectivity ? <TabsTrigger value="connectivity">Connectivity</TabsTrigger> : null}
          <TabsTrigger value="guide">Guidebook</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="max-w-3xl whitespace-pre-line">
          {description || "More details coming soon."}
        </TabsContent>
        <TabsContent value="specs" className="max-w-2xl">
          {specs.length ? (
            <Table>
              <tbody>
                {specs.map((s) => (
                  <TR key={s.label}>
                    <TD className="text-text-muted w-1/3 font-mono text-xs uppercase">{s.label}</TD>
                    <TD>{s.value}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-text-muted">Specifications coming soon.</p>
          )}
        </TabsContent>
        <TabsContent value="box">
          {inBox.length ? (
            <ul className="list-disc space-y-1 pl-5">
              {inBox.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted">Contents coming soon.</p>
          )}
        </TabsContent>
        {p.connectivity ? (
          <TabsContent value="connectivity" className="grid max-w-3xl gap-4 sm:grid-cols-2">
            <GlassCard>
              <h3 className="text-h3 mb-2">Bluetooth</h3>
              <p className="text-text-muted">{p.connectivity.bluetooth}</p>
            </GlassCard>
            <GlassCard>
              <h3 className="text-h3 mb-2">Wi-Fi</h3>
              <p className="text-text-muted">{p.connectivity.wifi}</p>
            </GlassCard>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <EcosystemLink href={siteConfig.links.dashboard} target="dashboard">
                Open dashboard
              </EcosystemLink>
              <StoreBadges />
            </div>
          </TabsContent>
        ) : null}
        <TabsContent value="guide">
          <p className="text-text-muted mb-4 flex items-center gap-2">
            <BookOpen className="text-primary size-5" aria-hidden="true" /> Learn to read and act on
            your soil data.
          </p>
          <EcosystemLink href={p.guideUrl ?? siteConfig.links.guidebook} target="guidebook">
            Open the Guidebook
          </EcosystemLink>
        </TabsContent>
      </Tabs>

      <section className="mt-16">
        <p className="text-text-muted mb-3 font-mono text-xs uppercase">Works with</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="primary">Web Dashboard</Badge>
          <Badge variant="primary">Mobile App</Badge>
          <Badge variant="primary">Guidebook</Badge>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="mt-20">
          <SectionHeading align="left" title="You might also like" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
