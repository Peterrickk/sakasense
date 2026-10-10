import { Activity, FlaskConical, Leaf, Sprout, type LucideIcon } from "lucide-react";

export type Metric = {
  key: string;
  name: string;
  icon: LucideIcon;
  explainer: string;
  sample: { label: string; value: number; unit?: string; decimals?: number };
};

/** The four readings the SakaSense Device takes. Sample values are illustrative, not real data. */
export const metrics: Metric[] = [
  {
    key: "ph",
    name: "pH",
    icon: FlaskConical,
    explainer: "Soil that is too acidic or too alkaline locks up nutrients your crops need.",
    sample: { label: "pH", value: 6.4, decimals: 1 },
  },
  {
    key: "n",
    name: "Nitrogen (N)",
    icon: Leaf,
    explainer: "Drives leafy growth. Too little yellows leaves, too much wastes money.",
    sample: { label: "N", value: 72, unit: "mg/kg" },
  },
  {
    key: "p",
    name: "Phosphorus (P)",
    icon: Sprout,
    explainer: "Helps roots and flowers develop strong.",
    sample: { label: "P", value: 38, unit: "mg/kg" },
  },
  {
    key: "k",
    name: "Potassium (K)",
    icon: Activity,
    explainer: "Builds plant resilience and improves fruit quality.",
    sample: { label: "K", value: 68, unit: "mg/kg" },
  },
];
