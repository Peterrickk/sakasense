"use client";
import { motion, useReducedMotion } from "motion/react";

/** Fade-and-rise on scroll: 16px, 400ms, ease-out, staggered by `index` x 60ms. Honors reduced motion. */
export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.06 }}
    >
      {children}
    </motion.div>
  );
}
