"use client";

import { BrandMark } from "@/components/Brand";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Cpu,
  Leaf,
  Smartphone,
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mainSite } from "@/lib/site";

const steps = [
  {
    icon: Cpu,
    title: "Sense",
    body: "ESP32 SakaSense unit reads soil pH, N, P, and K in the field.",
  },
  {
    icon: Leaf,
    title: "Decide on-device",
    body: "TensorFlow Lite Micro ranks crops and writes a fertilizer prescription — no cloud needed.",
  },
  {
    icon: BookOpen,
    title: "Guidebook code",
    body: "A 4-digit code on the screen maps to your physical SakaSense Guidebook.",
  },
  {
    icon: Wifi,
    title: "Optional web dashboard",
    body: "When Wi‑Fi is available, sync history for trends, multi-plot views, and reports.",
  },
];

export default function LandingPage() {
  const pathname = usePathname();
  const [showIntro, setShowIntro] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (pathname === '/') {
      const hasShown = sessionStorage.getItem('sakasenseIntroShown');
      if (!hasShown) {
        setShowIntro(true);
        sessionStorage.setItem('sakasenseIntroShown', 'true');
      }
    } else {
      setShowIntro(false);
    }
  }, [pathname]);

  // Define the IntroOverlay component
  function IntroOverlay({ onExit }: { onExit: () => void }) {
    const [step, setStep] = useState(0); // 0: initial, 1: line1 visible, 2: line2 visible, 3: exiting

    useEffect(() => {
      if (showIntro) {
        setStep(0);
      }
    }, [showIntro]);

    useEffect(() => {
      if (step === 0) {
        setStep(1);
      }
    }, [step]);

    useEffect(() => {
      if (step === 2) {
        // Wait for half a second after line2 is visible then start exit
        const timer = setTimeout(() => {
          setStep(3);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [step]);

    useEffect(() => {
      if (step === 3) {
        onExit();
      }
    }, [step, onExit]);

    const line1 = "Welcome to SakaSense!";
    const line2 = "Know your soil. Grow with confidence — online or off.";

    return (
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            <div className="fixed inset-0 flex items-center justify-center bg-sakasense-surface/90 backdrop-blur-sm z-50">
              <div className="text-center">
                {/* Line 1 */}
                {step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      staggerChildren: prefersReducedMotion ? 0 : 0.05,
                      delayChildren: prefersReducedMotion ? 0 : 0.2,
                    }}
                    onAnimationComplete={() => {
                      setStep(2);
                    }}
                  >
                    {line1.split(' ').map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : index * 0.05,
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
                {/* Line 2 */}
                {step >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      staggerChildren: prefersReducedMotion ? 0 : 0.05,
                      delayChildren: prefersReducedMotion ? 0 : 0.2,
                    }}
                    onAnimationComplete={() => {
                      // We'll handle the exit via the step effect above
                    }}
                  >
                    {line2.split(' ').map((word, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: prefersReducedMotion ? 0 : index * 0.05,
                        }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <>
      <IntroOverlay onExit={() => setShowIntro(false)} />
      <div className="sakasense-grain min-h-screen">
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sakasense-green-dark">
              SakaSense
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={mainSite.home}
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-sakasense-muted hover:text-sakasense-ink md:inline"
            >
              Website
            </a>
            <Link
              href="/pricing"
              className="hidden rounded-full px-3 py-2 text-sm font-medium text-sakasense-muted hover:text-sakasense-ink sm:inline"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-sakasense-ink hover:bg-sakasense-surface/70"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-sakasense-green px-4 py-2.5 text-sm font-semibold text-sakasense-on-green hover:bg-sakasense-green-dark"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-24 lg:pt-10">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] tracking-tight text-sakasense-green-dark sm:text-6xl lg:text-7xl">
              SakaSense
            </p>
            <h1 className="mt-4 max-w-xl text-2xl font-medium leading-snug text-sakasense-ink sm:text-3xl">
              Know your soil. Grow with confidence — online or off.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-sakasense-muted sm:text-lg">
              The detailed companion for your SakaSense sensor, powered by AI our own team built: insights across your plots, historical trends,
              fertilizer guidance, and printable reports — synced whenever Wi‑Fi returns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-sakasense-green px-6 py-3.5 text-sm font-semibold text-sakasense-on-green shadow-sm hover:bg-sakasense-green-dark"
              >
                Get Started <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-sakasense-border bg-sakasense-surface-2 px-6 py-3.5 text-sm font-semibold text-sakasense-ink"
              >
                Try demo account
              </Link>
              <a
                href={mainSite.device}
                className="inline-flex items-center gap-2 rounded-full border border-sakasense-border bg-sakasense-surface-2 px-6 py-3.5 text-sm font-semibold text-sakasense-green-dark"
              >
                Get the SakaSense Device
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-sakasense-muted">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sakasense-green/40 bg-sakasense-green-soft px-3 py-1 font-medium text-sakasense-green-dark">
                <Sparkles className="size-4" /> AI built in-house
              </span>
              <span className="inline-flex items-center gap-1.5">
                <WifiOff className="size-4 text-sakasense-soil" /> Offline-first sensor
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Smartphone className="size-4 text-sakasense-green" /> Works with the mobile app
              </span>
            </div>
          </div>

          <div className="relative animate-fade-up-delay">
            <div className="farm-plan absolute inset-0 rounded-[2rem]" />
            <div className="relative overflow-hidden rounded-[2rem] border border-sakasense-border bg-sakasense-surface/55 p-5 shadow-xl backdrop-blur sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold">Santos Family Farm</p>
                <span className="rounded-full bg-sakasense-healthy/15 px-2.5 py-1 text-xs font-semibold text-sakasense-healthy">
                  Live + synced
                </span>
              </div>
              <div className="grid gap-3">
                {[
                  { zone: "Zone A — Potato", status: "Healthy", tone: "text-sakasense-healthy bg-sakasense-healthy/10" },
                  { zone: "Zone B — Tomato", status: "Needs Attention", tone: "text-sakasense-warn-ink bg-sakasense-warn/15" },
                  { zone: "Zone C — Eggplant", status: "Action Required", tone: "text-sakasense-danger bg-sakasense-danger/10" },
                ].map((row) => (
                  <div
                    key={row.zone}
                    className="flex items-center justify-between rounded-2xl border border-sakasense-border/70 bg-sakasense-surface-2 px-4 py-3"
                  >
                    <span className="text-sm font-medium">{row.zone}</span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.tone}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-sakasense-green-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-sakasense-green-dark">
                  SakaSense AI Insight · built in-house
                </p>
                <p className="mt-1 text-sm leading-relaxed text-sakasense-ink">
                  Nitrogen is trending low in Zone B — apply tomato-specific fertilizer within 5 days per Guidebook code
                  5002.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-sakasense-border/70 bg-sakasense-surface/60 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-sakasense-ink">
              How it works
            </h2>
            <p className="mt-2 max-w-2xl text-sakasense-muted">
              Sensor → on-device AI → Guidebook code → optional web dashboard.
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="sakasense-card p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="grid size-10 place-items-center rounded-xl bg-sakasense-green-soft text-sakasense-green">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-sakasense-muted">{step.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="sakasense-card flex flex-col items-start justify-between gap-6 border-sakasense-green/40 bg-gradient-to-br from-sakasense-green-soft to-sakasense-surface p-6 text-sakasense-ink sm:p-10 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
                Plans for every farm size
              </h2>
              <p className="mt-2 max-w-xl text-sakasense-muted">
                Free for one device and 7-day history. Farmer Pro unlocks full history, alerts, and
                PDF/CSV exports. Cooperative tier for multi-farm oversight.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sakasense-green px-5 py-3 text-sm font-semibold text-sakasense-on-green hover:bg-sakasense-green-dark"
            >
              Compare plans <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            What farmers say
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "I finally have a printout of my soil history for the cooperative loan meeting.",
                name: "Ramon, Baybay",
              },
              {
                quote: "The website shows trends the phone app can’t. I caught nitrogen drop early.",
                name: "Liza, Tacloban",
              },
              {
                quote: "Even when the field had no signal, SD sync filled the gaps later.",
                name: "Jun, Ormoc",
              },
            ].map((t) => (
              <blockquote key={t.name} className="sakasense-card p-6">
                <p className="text-sm leading-relaxed text-sakasense-ink">“{t.quote}”</p>
                <footer className="mt-4 text-sm font-semibold text-sakasense-muted">{t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <footer className="border-t border-sakasense-border bg-sakasense-surface/70 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-sakasense-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>© {new Date().getFullYear()} SakaSense · Capstone IoT Precision Agriculture</p>
            <div className="flex gap-4">
              <Link href="/help" className="hover:text-sakasense-ink">
                Help
              </Link>
              <Link href="/guidebook" className="hover:text-sakasense-ink">
                Guidebook
              </Link>
              <Link href="/pricing" className="hover:text-sakasense-ink">
                Pricing
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}