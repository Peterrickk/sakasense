import type { PlotStatus } from "./types";

export type CropVisual = {
  label: string;
  /** Soft gradient / field color under the crop image */
  field: string;
  /** Unsplash crop photo (cached by browser; falls back to CSS plant pattern) */
  image: string;
  patternClass: string;
};

const cropCatalog: Record<string, CropVisual> = {
  Potato: {
    label: "Potato field",
    field: "linear-gradient(180deg, #8bc34a 0%, #4caf50 45%, #2e7d32 100%)",
    image: "/potato.jpg",
    patternClass: "crop-potato",
  },
  Rice: {
    label: "Rice paddy",
    field: "linear-gradient(180deg, #7cb342 0%, #558b2f 45%, #33691e 100%)",
    image:
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=70",
    patternClass: "crop-rice",
  },
  Corn: {
    label: "Corn field",
    field: "linear-gradient(180deg, #cddc39 0%, #9ccc65 40%, #689f38 100%)",
    image:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=70",
    patternClass: "crop-corn",
  },
  Tomato: {
    label: "Tomato vines",
    field: "linear-gradient(180deg, #aed581 0%, #7cb342 40%, #e53935 130%)",
    image: "/tomato.jpg",
    patternClass: "crop-tomato",
  },
  Eggplant: {
    label: "Eggplant beds",
    field: "linear-gradient(180deg, #81c784 0%, #66bb6a 35%, #5e35b1 120%)",
    image: "/eggplant.jpg",
    patternClass: "crop-eggplant",
  },
};

const fallback: CropVisual = {
  label: "Crop plot",
  field: "linear-gradient(180deg, #a5d6a7, #558b2f)",
  image:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70",
  patternClass: "crop-generic",
};

export function getCropVisual(crop: string): CropVisual {
  return cropCatalog[crop] ?? fallback;
}

export function statusRing(status: PlotStatus): string {
  switch (status) {
    case "healthy":
      return "ring-sakasense-healthy/80 shadow-[0_0_0_3px_rgba(46,125,50,0.25)]";
    case "needs_attention":
      return "ring-sakasense-warn/90 shadow-[0_0_0_3px_rgba(249,168,37,0.35)]";
    case "action_required":
      return "ring-sakasense-danger/80 shadow-[0_0_0_3px_rgba(198,40,40,0.3)]";
  }
}

export function statusAccent(status: PlotStatus): string {
  switch (status) {
    case "healthy":
      return "bg-sakasense-healthy";
    case "needs_attention":
      return "bg-sakasense-warn";
    case "action_required":
      return "bg-sakasense-danger";
  }
}
