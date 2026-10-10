import { cn } from "@/lib/utils";

/** Thin grid lines that fade out toward the edges. */
export function GridBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className,
      )}
    />
  );
}

/** Topographic contour lines, drawn as nested wavy paths. */
export function ContourBackground({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "text-primary pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.08]",
        className,
      )}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 11 }, (_, i) => {
        const o = i * 26;
        return (
          <path
            key={i}
            d={`M-20 ${300 + o} C 150 ${120 + o}, 300 ${480 - o / 2}, 450 ${300 + o / 2} S 700 ${100 + o}, 820 ${280 + o}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        );
      })}
    </svg>
  );
}

export function GlowOrb({
  className,
  color = "primary",
}: {
  className?: string;
  color?: "primary" | "accent" | "info";
}) {
  const bg = { primary: "bg-primary", accent: "bg-accent", info: "bg-info" }[color];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -z-10 size-72 rounded-full opacity-20 blur-3xl md:size-96",
        bg,
        className,
      )}
    />
  );
}
