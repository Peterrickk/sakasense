import type { Metadata } from "next";
import { Heart, Leaf, Lightbulb, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { LeadershipTeaser } from "@/components/home/small-sections";
import { DevNote } from "@/components/placeholder";
import { GlassCard } from "@/components/ui/glass-card";

export const metadata: Metadata = {
  title: "About us",
  description: "The story, mission, and values behind SakaSense Venture Solutions.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Heart,
    title: "Farmer-first",
    text: "Every decision starts with what helps the person in the field.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    text: "Use only what the soil needs, protect it for the next season.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    text: "Make advanced soil science simple and affordable.",
  },
  { icon: ShieldCheck, title: "Integrity", text: "Honest data, honest claims, honest service." },
];

export default function AboutPage() {
  return (
    <>
      <div className="container-page py-14">
        <SectionHeading
          as="h1"
          eyebrow="About SakaSense"
          title={
            <>
              Rooted in the field. <span className="gradient-text">Built with technology.</span>
            </>
          }
        />
        <div className="mx-auto max-w-3xl space-y-6">
          {process.env.NODE_ENV !== "production" ? (
            <section>
              <h2 className="text-h3 mb-2">Our story</h2>
              <DevNote>[PLACEHOLDER — founding story, year, and location]</DevNote>
            </section>
          ) : null}
          <GlassCard>
            <h2 className="text-h3 mb-2">Mission</h2>
            <p className="text-text-muted">
              To give every Filipino farmer access to affordable, real-time soil intelligence.{" "}
              <DevNote>[PLACEHOLDER — owner to confirm]</DevNote>
            </p>
          </GlassCard>
          <GlassCard>
            <h2 className="text-h3 mb-2">Vision</h2>
            <p className="text-text-muted">
              A future where every harvest is grown on data, not guesswork.{" "}
              <DevNote>[PLACEHOLDER — owner to confirm]</DevNote>
            </p>
          </GlassCard>
        </div>

        <section className="mt-20">
          <SectionHeading title="What we value" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} index={i}>
                <GlassCard hover className="h-full">
                  <v.icon className="text-primary mb-3 size-7" aria-hidden="true" />
                  <h3 className="text-h3">{v.title}</h3>
                  <p className="text-text-muted mt-2 text-sm">{v.text}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </section>

        {process.env.NODE_ENV !== "production" ? (
          <section className="mx-auto mt-20 max-w-3xl">
            <h2 className="text-h3 mb-3">Milestones</h2>
            <DevNote>[PLACEHOLDER — timeline of milestones]</DevNote>
          </section>
        ) : null}
      </div>
      <LeadershipTeaser />
    </>
  );
}
