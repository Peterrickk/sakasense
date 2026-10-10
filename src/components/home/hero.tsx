import Image from "next/image";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { ContourBackground, GlowOrb, GridBackground } from "@/components/brand/backgrounds";
import { SensorReadout } from "@/components/brand/sensor-readout";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <GridBackground />
      <ContourBackground />
      <GlowOrb className="top-10 -right-20" />
      <GlowOrb className="bottom-0 -left-24" color="accent" />
      <div className="container-page grid items-center gap-10 py-12 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-primary mb-5 font-mono text-xs tracking-[0.25em] uppercase">
            Smart soil intelligence
          </p>
          <h1 className="text-h1">
            Know your soil.
            <br />
            <span className="gradient-text">Grow with confidence.</span>
          </h1>
          <p className="text-text-muted mt-6 max-w-xl text-lg md:text-xl">
            SakaSense reads your soil&apos;s pH, nitrogen, phosphorus, and potassium in the field.
            Our mobile app and web app use{" "}
            <strong className="text-text">AI we built ourselves</strong> to tell you what to plant
            and what fertilizer to use.
          </p>
          <a
            href="#sakasense-ai"
            className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
          >
            <BrainCircuit className="size-4" aria-hidden="true" />
            In-house AI in the app and web app
          </a>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/products/sakasense-device" size="lg">
              Get the SakaSense Device <ArrowRight />
            </Button>
            <Button href="/how-it-works" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="glass shadow-glow overflow-hidden rounded-3xl p-2">
            <Image
              src="/images/products/sakasense-device.webp"
              alt="The SakaSense Device: a grey enclosure with an LCD screen and a three-prong NPK soil probe"
              width={1600}
              height={1200}
              priority
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="rounded-2xl"
            />
          </div>
          {/* Readouts sit below the photo, never on top of it. */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <SensorReadout label="pH" value={6.4} decimals={1} className="justify-center" />
            <SensorReadout label="N" value={72} unit="mg/kg" className="justify-center" />
            <SensorReadout label="P" value={38} unit="mg/kg" className="justify-center" />
            <SensorReadout label="K" value={68} unit="mg/kg" className="justify-center" />
          </div>
        </div>
      </div>
    </section>
  );
}
