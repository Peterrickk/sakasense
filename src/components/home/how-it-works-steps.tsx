import { BarChart3, Cpu, Sprout } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";

const steps = [
  {
    icon: Sprout,
    title: "Insert into soil",
    text: "Push the three-prong probe into the soil where you want to read.",
  },
  {
    icon: Cpu,
    title: "Get an instant answer",
    text: "The device reads pH, N, P, and K, ranks the best crops, and shows a fertilizer prescription on its screen. No internet needed.",
  },
  {
    icon: BarChart3,
    title: "Track it over time",
    text: "Sync with the mobile app or Wi-Fi to the web dashboard for history, plots, and reports.",
  },
];

export function HowItWorksSteps() {
  return (
    <section className="container-page py-14 md:py-20">
      <SectionHeading eyebrow="How it works" title="From soil to signal in three steps" />
      <ol className="relative grid gap-10 md:grid-cols-3">
        {/* Glowing line connecting the steps (desktop). */}
        <div
          aria-hidden="true"
          className="via-primary animate-pulse-line absolute top-10 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent to-transparent bg-[length:200%_100%] md:block"
        />
        {steps.map((s, i) => (
          <Reveal key={s.title} index={i}>
            <li className="relative flex flex-col items-center text-center">
              <span className="glass text-primary shadow-glow relative z-10 mb-5 flex size-20 items-center justify-center rounded-full">
                <s.icon className="size-8" aria-hidden="true" />
              </span>
              <span className="text-text-muted font-mono text-xs">STEP {i + 1}</span>
              <h3 className="text-h3 mt-1">{s.title}</h3>
              <p className="text-text-muted mt-2 max-w-xs">{s.text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
