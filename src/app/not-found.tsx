import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { ContourBackground } from "@/components/brand/backgrounds";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden">
        <ContourBackground />
        <div className="container-page flex flex-col items-center py-24 text-center">
          <svg
            viewBox="0 0 200 120"
            className="mb-8 w-64"
            role="img"
            aria-label="A lone sprout in an empty field"
          >
            <path
              d="M0 100 Q50 90 100 100 T200 100"
              fill="none"
              stroke="var(--color-soil)"
              strokeWidth="3"
            />
            <path
              d="M100 100V60M100 60c0-14 10-24 26-24 0 14-10 24-26 24ZM100 76c0-10-7-16-20-16 0 10 7 16 20 16Z"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-primary font-mono text-sm">404</p>
          <h1 className="text-h2 mt-2">Looks like you&apos;re lost in the field</h1>
          <p className="text-text-muted mt-3 max-w-md">
            That page doesn&apos;t exist, or it moved.
          </p>
          <div className="mt-8 flex gap-3">
            <Button href="/">Back home</Button>
            <Button href="/products" variant="secondary">
              Browse products
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
