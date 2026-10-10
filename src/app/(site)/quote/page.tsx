import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/section-heading";
import { QuoteForm } from "@/components/forms/quote-form";
import { GlassCard } from "@/components/ui/glass-card";

export const metadata: Metadata = {
  title: "Request a bulk quote",
  description: "Get pricing for cooperatives, LGUs, agribusinesses, and research institutions.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  const { product } = await searchParams;
  const defaultMessage =
    typeof product === "string" && /^[a-z0-9-]+$/.test(product) ? `Interested in: ${product}` : "";
  return (
    <div className="container-page max-w-3xl py-14">
      <SectionHeading
        as="h1"
        eyebrow="Bulk & B2B"
        title="Request a quote"
        subtitle="For cooperatives, LGUs, agribusinesses, and research institutions."
      />
      <GlassCard className="p-6 md:p-8">
        <QuoteForm defaultMessage={defaultMessage} />
      </GlassCard>
    </div>
  );
}
