import { CheckCircle2, XCircle } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { GlassCard } from "@/components/ui/glass-card";

const problems = [
  "Overfertilizing burns money and soil",
  "Planting crops the soil cannot support",
  "Low yields with no clear reason",
];
const answers = [
  "Apply only the nutrients your soil needs",
  "Plant the crops your soil suits best",
  "See what's happening beneath the surface",
];

export function ProblemSolution() {
  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading
        eyebrow="Why SakaSense"
        title="Stop guessing. Start knowing."
        subtitle="Farming decisions are only as good as the information behind them."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <GlassCard className="h-full">
            <h3 className="text-h3 text-danger mb-5">Guesswork costs harvests</h3>
            <ul className="space-y-3">
              {problems.map((t) => (
                <li key={t} className="flex gap-3">
                  <XCircle className="text-danger mt-1 size-5 shrink-0" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
        <Reveal index={1}>
          <GlassCard glow className="h-full">
            <h3 className="text-h3 gradient-text mb-5">SakaSense gives you answers</h3>
            <ul className="space-y-3">
              {answers.map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="text-primary mt-1 size-5 shrink-0" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
