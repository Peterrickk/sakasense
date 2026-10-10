import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { TeamCard } from "@/components/team/team-card";
import { siteConfig } from "@/config/site";
import { team } from "@/content/team";
import { visibleText } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet the leadership team of SakaSense Venture Solutions.",
  alternates: { canonical: "/about/leadership" },
};

export default function LeadershipPage() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    founder: team.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.title })),
  };
  return (
    <div className="container-page py-14">
      <JsonLd data={orgLd} />
      <SectionHeading
        as="h1"
        eyebrow="Leadership"
        title="The team behind SakaSense"
        subtitle="Strategy, finance, and engineering working together for farmers."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {team.map((m, i) => (
          <Reveal key={m.slug} index={i}>
            <TeamCard member={{ ...m, bio: visibleText(m.bio) }} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
