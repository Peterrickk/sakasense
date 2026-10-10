import Link from "next/link";
import { ChevronRight, Sprout } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { formatPHP } from "@/lib/money";
import { cn } from "@/lib/utils";

export function PriceTag({
  centavos,
  compareAtCentavos,
  className,
}: {
  centavos: number | null;
  compareAtCentavos?: number | null;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className="font-display text-xl font-bold">
        {!centavos ? "Price coming soon" : formatPHP(centavos)}
      </span>
      {compareAtCentavos && centavos && compareAtCentavos > centavos ? (
        <s className="text-text-muted text-sm">{formatPHP(compareAtCentavos)}</s>
      ) : null}
    </span>
  );
}

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${siteConfig.url}${c.href}` } : {}),
          })),
        }}
      />
      <ol className="text-text-muted flex flex-wrap items-center gap-1 text-sm">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1">
            {c.href && i < items.length - 1 ? (
              <Link href={c.href} className="hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span
                aria-current={i === items.length - 1 ? "page" : undefined}
                className="text-text"
              >
                {c.label}
              </span>
            )}
            {i < items.length - 1 ? <ChevronRight className="size-4" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass rounded-card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <Sprout className="text-primary size-10" aria-hidden="true" />
      <h2 className="text-h3">{title}</h2>
      {description ? <p className="text-text-muted max-w-md">{description}</p> : null}
      {action}
    </div>
  );
}
