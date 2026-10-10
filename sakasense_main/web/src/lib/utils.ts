import { clsx, type ClassValue } from "clsx";
import type { PlotStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function statusLabel(status: PlotStatus): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "needs_attention":
      return "Needs Attention";
    case "action_required":
      return "Action Required";
  }
}

export function statusClasses(status: PlotStatus): string {
  switch (status) {
    case "healthy":
      return "bg-sakasense-healthy/15 text-sakasense-healthy border-sakasense-healthy/30";
    case "needs_attention":
      return "bg-sakasense-warn/15 text-sakasense-warn-ink border-sakasense-warn/40";
    case "action_required":
      return "bg-sakasense-danger/15 text-sakasense-danger border-sakasense-danger/30";
  }
}

export function computeSoilHealthIndex(reading: {
  pH: number;
  N: number;
  P: number;
  K: number;
}): number {
  // Simple heuristic for demo: ideal pH ~6.5, N/P/K mid ranges for common crops
  const pHScore = 100 - Math.min(100, Math.abs(reading.pH - 6.5) * 40);
  const nScore = Math.min(100, (reading.N / 80) * 100);
  const pScore = Math.min(100, (reading.P / 50) * 100);
  const kScore = Math.min(100, (reading.K / 80) * 100);
  return Math.round(pHScore * 0.3 + nScore * 0.25 + pScore * 0.2 + kScore * 0.25);
}

export function daysBetween(iso: string): number {
  // Clamp at 0: a reading stamped slightly in the future (device clock drift) is "today", not -1 days.
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
}
