"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Mono label + animated value, e.g. `pH 6.4`. Values here are decorative samples, not real measurements. */
export function SensorReadout({
  label,
  value,
  unit,
  decimals = 0,
  className,
}: {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span
      ref={ref}
      className={cn(
        "glass inline-flex items-baseline gap-2 rounded-full px-3 py-1.5 font-mono text-sm",
        className,
      )}
    >
      <span className="text-text-muted">{label}</span>
      <span className="text-primary font-medium tabular-nums">
        {display.toFixed(decimals)}
        {unit ? <span className="text-text-muted ml-0.5 text-xs">{unit}</span> : null}
      </span>
    </span>
  );
}
