"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartMetric, SensorReading } from "@/lib/types";

const metricColors: Record<ChartMetric, string> = {
  pH: "#4ade80",
  N: "#38bdf8",
  P: "#fb923c",
  K: "#c084fc",
};

export function TrendChart({
  data,
  metric,
}: {
  data: SensorReading[];
  metric: ChartMetric;
}) {
  const chartData = data.map((r) => ({
    date: new Date(r.timestamp).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    }),
    value: r[metric],
    source: r.source,
  }));

  const color = metricColors[metric];

  return (
    <div className="h-56 w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1d3328" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: "#94ab9e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={28}
          />
          <YAxis
            tick={{ fill: "#94ab9e", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={metric === "pH" ? [4, 8] : ["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #1d3328",
              boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              background: "#0b1611",
              color: "#e8f5ec",
            }}
            formatter={(value) => [
              typeof value === "number"
                ? metric === "pH"
                  ? value.toFixed(2)
                  : Math.round(value)
                : String(value ?? ""),
              metric,
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#grad-${metric})`}
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
