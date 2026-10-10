import { BrainCircuit, Cpu, LayoutDashboard, Smartphone } from "lucide-react";
import { ContourBackground, GlowOrb } from "@/components/brand/backgrounds";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";

const layers = [
  {
    icon: Smartphone,
    where: "Mobile app",
    title: "AI in your pocket",
    text: "Our AI turns each reading into a soil health score and plain-language advice you can act on in the field.",
  },
  {
    icon: LayoutDashboard,
    where: "Web app",
    title: "AI Insights across your farm",
    text: "The dashboard's AI watches every plot over time, flags problems early (like nitrogen dropping in one zone), and tells you what to do next with a Guidebook code.",
  },
  {
    icon: Cpu,
    where: "On the device",
    title: "AI that works offline",
    text: "A model on the device ranks the best crops for your soil and writes a fertilizer prescription, even with no internet.",
  },
];

/** Emphasizes that the SakaSense AI (app + web app + device) is built in-house. */
export function AiSection() {
  return (
    <section id="sakasense-ai" className="relative isolate overflow-hidden py-14 md:py-20">
      <ContourBackground />
      <GlowOrb className="top-10 left-1/2 -translate-x-1/2" />
      <div className="container-page">
        <div className="mb-6 flex justify-center">
          <Badge variant="primary">
            <BrainCircuit className="size-3.5" aria-hidden="true" /> Built in-house by SakaSense
          </Badge>
        </div>
        <SectionHeading
          eyebrow="SakaSense AI"
          title={
            <>
              AI we built <span className="gradient-text">ourselves</span>
            </>
          }
          subtitle="The AI in the SakaSense mobile app and web app is designed and built by our own team, for Filipino farms. It works from your own soil readings and points you to the matching page in the SakaSense Guidebook."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {layers.map((l, i) => (
            <Reveal key={l.where} index={i}>
              <GlassCard hover glow={i < 2} className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                    <l.icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="text-text-muted font-mono text-xs tracking-widest uppercase">
                    {l.where}
                  </span>
                </div>
                <h3 className="text-h3">{l.title}</h3>
                <p className="text-text-muted">{l.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
