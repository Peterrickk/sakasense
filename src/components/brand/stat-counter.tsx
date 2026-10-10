"use client";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export function StatCounter({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(value);
      return;
    }
    if (!inView) return;
    const c = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, reduce, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display gradient-text text-5xl font-bold tabular-nums">
        {n.toLocaleString("en-PH")}
        {suffix}
      </div>
      <div className="text-text-muted mt-1 font-mono text-sm uppercase">{label}</div>
    </div>
  );
}
