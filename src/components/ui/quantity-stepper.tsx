"use client";
import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="border-border bg-surface inline-flex items-center rounded-full border"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="hover:text-primary flex size-10 items-center justify-center rounded-full disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="w-10 text-center font-mono tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="hover:text-primary flex size-10 items-center justify-center rounded-full disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
