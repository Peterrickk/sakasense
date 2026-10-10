import { Hero } from "@/components/home/hero";
import { ProblemSolution } from "@/components/home/problem-solution";
import { WhatItMeasures } from "@/components/home/what-it-measures";
import { HowItWorksSteps } from "@/components/home/how-it-works-steps";
import { EcosystemCards } from "@/components/home/ecosystem-cards";
import { AiSection } from "@/components/home/ai-section";
import {
  FaqPreview,
  FinalCta,
  ImpactStats,
  LeadershipTeaser,
  Testimonials,
  TrustStrip,
} from "@/components/home/small-sections";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { team } from "@/content/team";

export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
          telephone: siteConfig.contact.phoneTel,
          address: {
            "@type": "PostalAddress",
            streetAddress: "Sagkahan",
            addressLocality: "Tacloban City",
            addressCountry: "PH",
          },
          employee: team.map((m) => ({ "@type": "Person", name: m.name, jobTitle: m.title })),
        }}
      />
      <Hero />
      <TrustStrip />
      <ProblemSolution />
      <WhatItMeasures />
      <HowItWorksSteps />
      <EcosystemCards />
      <AiSection />
      <ImpactStats />
      <Testimonials />
      <LeadershipTeaser />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
