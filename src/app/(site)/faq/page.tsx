import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/brand/section-heading";
import { faqGroups, faqs } from "@/content/faq";
import { visibleText } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about SakaSense products, connectivity, orders, shipping, and warranty.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const visible = faqs.map((f) => ({ ...f, a: visibleText(f.a) })).filter((f) => f.a.length > 0);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visible.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <div className="container-page max-w-3xl py-14">
      <JsonLd data={ld} />
      <SectionHeading as="h1" eyebrow="FAQ" title="Frequently asked questions" />
      <div className="space-y-10">
        {faqGroups.map((g) => {
          const items = faqs.filter((f) => f.group === g);
          if (items.every((f) => !visibleText(f.a))) return null;
          return (
            <section key={g}>
              <h2 className="text-h3 mb-4">{g}</h2>
              <FaqAccordion items={items} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
