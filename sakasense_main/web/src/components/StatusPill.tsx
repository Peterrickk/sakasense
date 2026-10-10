import type { PlotStatus } from "@/lib/types";
import { cn, statusClasses, statusLabel } from "@/lib/utils";

export function StatusPill({ status, className }: { status: PlotStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        statusClasses(status),
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
