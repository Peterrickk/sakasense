import { BrandMark } from "@/components/Brand";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="sakasense-grain min-h-screen">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrandMark />
          <span className="font-[family-name:var(--font-display)] text-xl font-semibold text-sakasense-green-dark">
            SakaSense
          </span>
        </Link>
        <Link href="/login" className="text-sm font-semibold text-sakasense-green">
          Log in
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold">Help</h1>
        <p className="mt-2 text-sakasense-muted">
          SakaSense works offline-first. The website is the optional online layer for history and
          reports.
        </p>
        <div className="sakasense-card mt-6 space-y-5 p-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-semibold">Live vs synced data</h2>
            <p className="mt-1 text-sakasense-muted">
              When your ESP32 has Wi‑Fi, readings post as live. In the field with no signal, data
              stays on the SD card until the mobile app or home Wi‑Fi syncs it — then the site shows
              last synced, never pretending it is live.
            </p>
          </section>
          <section>
            <h2 className="font-semibold">Guidebook codes</h2>
            <p className="mt-1 text-sakasense-muted">
              Enter the 4-digit code from your sensor screen in the Digital Guidebook after login.
            </p>
          </section>
          <section>
            <h2 className="font-semibold">Linking a device</h2>
            <p className="mt-1 text-sakasense-muted">
              Use onboarding with the serial printed on the unit, or sync via the mobile app first
              if the field has no Wi‑Fi.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
