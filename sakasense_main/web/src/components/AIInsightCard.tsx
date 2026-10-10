import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AIInsightCard({
  insight,
  guidebookCode,
  href,
}: {
  insight: string;
  guidebookCode: string;
  href: string;
}) {
  return (
    <div className="sakasense-card overflow-hidden animate-fade-up-delay">
      <div className="flex items-start gap-3 border-b border-sakasense-border bg-gradient-to-r from-sakasense-green-soft to-sakasense-surface px-5 py-4">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-sakasense-green text-sakasense-on-green">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-sakasense-green-dark">
            AI Insight
          </h3>
          <p className="text-xs text-sakasense-muted">
            SakaSense AI, built in-house · Guidebook {guidebookCode}
          </p>
        </div>
      </div>
      <div className="space-y-4 px-5 py-4">
        <p className="text-sm leading-relaxed text-sakasense-ink">{insight}</p>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-full bg-sakasense-green px-4 py-2.5 text-sm font-semibold text-sakasense-on-green transition hover:bg-sakasense-green-dark"
        >
          View Recommendation
        </Link>
      </div>
    </div>
  );
}
