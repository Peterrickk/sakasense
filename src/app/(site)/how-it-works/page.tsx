import type { Metadata } from "next";
import Image from "next/image";
import { BarChart3, BookOpen, Cpu, Radio, Sprout, Wrench } from "lucide-react";
import { Reveal } from "@/components/brand/reveal";
import { SectionHeading } from "@/components/brand/section-heading";
import { Button } from "@/components/ui/button";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { visibleText } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How the SakaSense Device reads your soil, recommends crops and fertilizer, and syncs to the app and dashboard.",
  alternates: { canonical: "/how-it-works" },
};

const story = [
  {
    icon: Cpu,
    title: "Device anatomy",
    text: "A grey enclosure with a built-in LCD screen, an ESP32 controller, and a three-prong NPK soil probe on a cable.",
  },
  {
    icon: Sprout,
    title: "Placement in soil",
    text: "Push the prongs into the soil at root depth. No digging and no lab samples.",
  },
  {
    icon: Radio,
    title: "Data captured",
    text: "The probe reads soil pH and nitrogen, phosphorus, and potassium (N-P-K).",
  },
  {
    icon: BookOpen,
    title: "On-device answer",
    text: "An on-device model ranks the best crops for that soil and writes a fertilizer prescription. The screen shows it with a 4-digit Guidebook code. No internet needed.",
  },
  {
    icon: BarChart3,
    title: "Sync and track",
    text: "Pair with the mobile app in the field, or sync over Wi-Fi to the web dashboard for history, plots, alerts, and reports.",
  },
  {
    icon: Wrench,
    title: "Action",
    text: "Fertilize and plant at the right time, with confidence.",
  },
];

const comparison = [
  ["Best for", "Quick in-field answers, even offline", "History, multi-plot views, and reports"],
  ["Internet needed", "No", "Yes (Wi-Fi when you sync)"],
  ["Where you read it", "Device screen and mobile app", "Web dashboard"],
  ["Data history", "Last readings on the device [PLACEHOLDER]", "Full history in the dashboard"],
];

export default function HowItWorksPage() {
  return (
    <div className="container-page py-14">
      <SectionHeading
        as="h1"
        eyebrow="How it works"
        title="From soil to signal"
        subtitle="Six steps from the probe in the ground to a decision in your hand."
      />
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_0.8fr]">
        <ol className="border-primary/30 relative space-y-10 border-l pl-8">
          {story.map((s, i) => (
            <Reveal key={s.title} index={0}>
              <li className="relative">
                <span className="bg-bg border-primary text-primary absolute -left-[3.15rem] flex size-10 items-center justify-center rounded-full border">
                  <s.icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-text-muted font-mono text-xs">0{i + 1}</p>
                <h2 className="text-h3 mt-1">{s.title}</h2>
                <p className="text-text-muted mt-2 max-w-xl">{visibleText(s.text)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <div className="glass shadow-glow overflow-hidden rounded-3xl p-2 lg:sticky lg:top-28">
          <Image
            src="/images/products/sakasense-device.webp"
            alt="The SakaSense Device with its LCD screen and three-prong NPK soil probe"
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="rounded-2xl"
          />
        </div>
      </div>

      <section className="mt-24">
        <SectionHeading
          title="On the device vs. in the dashboard"
          subtitle="Use the device on its own, or add the app and dashboard."
        />
        <Table>
          <THead>
            <TR>
              <TH />
              <TH>On the device and app</TH>
              <TH>In the web dashboard</TH>
            </TR>
          </THead>
          <tbody>
            {comparison.map(([k, a, b]) => (
              <TR key={k}>
                <TD className="text-text-muted font-medium">{k}</TD>
                <TD>{visibleText(a)}</TD>
                <TD>{visibleText(b)}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </section>

      <div className="mt-16 text-center">
        <Button href="/products/sakasense-device" size="lg">
          Get the SakaSense Device
        </Button>
      </div>
    </div>
  );
}
