import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricTile({
  label,
  value,
  unit,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("sakasense-card p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-sakasense-muted">
          {label}
        </span>
        <span className="grid size-8 place-items-center rounded-lg bg-sakasense-green-soft text-sakasense-green">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-sakasense-ink">
        {value}
        {unit ? <span className="ml-1 text-sm font-medium text-sakasense-muted">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-1 text-xs text-sakasense-muted">{hint}</p> : null}
    </div>
  );
}
