import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { StatCounter } from "@/components/brand/stat-counter";
import { ContourBackground, GlowOrb } from "@/components/brand/backgrounds";
import { FaqAccordion } from "@/components/faq-accordion";
import { TeamCard } from "@/components/team/team-card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { homeFaqs } from "@/content/faq";
import { team } from "@/content/team";

/** Hidden until real partner/pilot logos exist (siteConfig.features.showPartners). */
export function TrustStrip() {
  if (!siteConfig.features.showPartners) return null;
  return (
    <section className="border-border border-y py-8 text-center">
      <p className="text-text-muted font-mono text-xs tracking-widest uppercase">
        Built for Filipino farmers
      </p>
    </section>
  );
}

/** Hidden until real numbers exist (siteConfig.features.showStats). */
export function ImpactStats({
  stats,
}: {
  stats?: { value: number; label: string; suffix?: string }[];
}) {
  if (!siteConfig.features.showStats || !stats?.length) return null;
  return (
    <section className="container-page py-14 md:py-20">
      <div className="grid gap-8 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCounter key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}

/** Hidden until real testimonials exist (siteConfig.features.showTestimonials). */
export function Testimonials() {
  return null;
}

export function LeadershipTeaser() {
  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading
        eyebrow="Leadership"
        title="The people behind SakaSense"
        subtitle="A team combining strategy, finance, and deep IoT engineering."
      />
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
        {team.map((m, i) => (
          <Reveal key={m.slug} index={i}>
            <TeamCard member={m} compact />
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/about/leadership" variant="secondary">
          Meet the team <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

export function FaqPreview() {
  return (
    <section className="container-page max-w-3xl py-14 md:py-20">
      <SectionHeading eyebrow="FAQ" title="Quick answers" />
      <FaqAccordion items={homeFaqs} />
      <div className="mt-8 text-center">
        <Button href="/faq" variant="ghost">
          See all questions <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="container-page py-14 md:py-20">
      <div className="glass relative isolate overflow-hidden rounded-3xl px-6 py-16 text-center md:py-24">
        <ContourBackground />
        <GlowOrb className="top-0 left-1/2 -translate-x-1/2" />
        <h2 className="text-h2 mx-auto max-w-2xl">Ready to see what&apos;s beneath the surface?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/products" size="lg">
            Shop Now
          </Button>
          <Button href="/quote" variant="secondary" size="lg">
            Request a bulk quote
          </Button>
        </div>
      </div>
    </section>
  );
}
