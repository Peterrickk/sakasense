"use client";

export function SoilHealthGauge({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 54;
  const circumference = Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color =
    clamped >= 75 ? "#4ade80" : clamped >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 90" className="w-full max-w-[200px]">
        <path
          d="M 16 78 A 54 54 0 0 1 124 78"
          fill="none"
          stroke="#1d3328"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 16 78 A 54 54 0 0 1 124 78"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-arc"
        />
        <text
          x="70"
          y="68"
          textAnchor="middle"
          className="fill-sakasense-ink"
          style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-display)" }}
        >
          {clamped}%
        </text>
        <text
          x="70"
          y="84"
          textAnchor="middle"
          fill="#94ab9e"
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          Soil Health Index
        </text>
      </svg>
    </div>
  );
}
