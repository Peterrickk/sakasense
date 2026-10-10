import { BrandMark } from "@/components/Brand";
import Link from "next/link";
import { Check } from "lucide-react";
import { mainSite } from "@/lib/site";

const plans = [
  {
    name: "Free / Basic",
    price: "₱0",
    period: "",
    blurb: "One device, current reading + last 7 days.",
    features: [
      "1 linked SakaSense device",
      "Current reading + 7-day history",
      "Basic crop recommendation view",
      "Guidebook code lookup",
    ],
    cta: "Get Started",
    href: "/register",
    highlight: false,
  },
  {
    name: "Farmer Pro",
    price: "₱299",
    period: "/ month",
    blurb: "Full history, multi-plot, alerts, and exports.",
    features: [
      "Unlimited history",
      "Multiple plots / zones per device",
      "Fertilizer alerts (email / SMS / push)",
      "PDF & CSV report export",
    ],
    cta: "Start Farmer Pro",
    href: "/register",
    highlight: true,
  },
  {
    name: "Cooperative",
    price: "₱999",
    period: "/ month",
    blurb: "Multi-farm oversight with roles.",
    features: [
      "Multiple devices / farmers",
      "Aggregated barangay dashboard",
      "Admin / viewer roles",
      "Priority support (planned)",
    ],
    cta: "Contact us",
    href: mainSite.contact,
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="sakasense-grain min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sakasense-green-dark">
            SakaSense
          </span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-sakasense-green">
          Log in
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold">
          Simple plans for serious soil monitoring
        </h1>
        <p className="mt-3 max-w-2xl text-sakasense-muted">
          Pricing is illustrative for the capstone. Confirm GCash / PayMaya / PayMongo vs card before
          wiring checkout.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`sakasense-card flex flex-col p-6 ${plan.highlight ? "ring-2 ring-sakasense-green" : ""}`}
            >
              {plan.highlight ? (
                <span className="mb-3 w-fit rounded-full bg-sakasense-green-soft px-2.5 py-1 text-xs font-semibold text-sakasense-green-dark">
                  Most popular
                </span>
              ) : (
                <span className="mb-3 h-6" />
              )}
              <h2 className="font-semibold text-lg">{plan.name}</h2>
              <p className="mt-1 text-sm text-sakasense-muted">{plan.blurb}</p>
              <p className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold">
                {plan.price}
                <span className="text-base font-medium text-sakasense-muted">{plan.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-sakasense-green" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 block rounded-full py-3 text-center text-sm font-semibold ${
                  plan.highlight
                    ? "bg-sakasense-green text-sakasense-on-green hover:bg-sakasense-green-dark"
                    : "border border-sakasense-border bg-sakasense-surface-2 text-sakasense-ink"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
