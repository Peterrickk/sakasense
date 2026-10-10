import type {
  Alert,
  Device,
  Farm,
  GuidebookEntry,
  Plot,
  Recommendation,
  SensorReading,
  Subscription,
  User,
} from "./types";

/** Demo clock: readings relative to "now" so the UI always feels current. */
function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}

function daysAgo(d: number, hour = 8): string {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
}

export const DEMO_USER: User = {
  id: "user-1",
  name: "Maria Santos",
  email: "maria@sakasense.demo",
  contact: "+63 917 123 4567",
  role: "farmer",
  subscriptionTier: "farmer_pro",
};

export const DEMO_PASSWORD = "sakasense123";

export const farms: Farm[] = [
  {
    id: "farm-1",
    ownerUserId: "user-1",
    name: "Santos Family Farm",
    location: "Baybay, Leyte",
    type: "rural_field",
    lat: 10.6785,
    lng: 124.8006,
    altitude: 40,
  },
  {
    id: "farm-2",
    ownerUserId: "user-1",
    name: "Rooftop Garden",
    location: "Tacloban City",
    type: "urban_container",
    lat: 11.244,
    lng: 125.003,
    altitude: 25,
  },
];

export const plots: Plot[] = [
  {
    id: "plot-a",
    farmId: "farm-1",
    name: "Zone A — Potato",
    cropCurrent: "Potato",
    areaLabel: "0.5 ha",
    status: "healthy",
    layout: { col: 1, row: 1, colSpan: 2, rowSpan: 2 },
    latOffset: 0.0008,
    lngOffset: -0.0012,
  },
  {
    id: "plot-b",
    farmId: "farm-1",
    name: "Zone B — Tomato",
    cropCurrent: "Tomato",
    areaLabel: "0.3 ha",
    status: "needs_attention",
    layout: { col: 3, row: 1, colSpan: 1, rowSpan: 2 },
    latOffset: 0.0006,
    lngOffset: 0.001,
  },
  {
    id: "plot-c",
    farmId: "farm-1",
    name: "Zone C — Eggplant",
    cropCurrent: "Eggplant",
    areaLabel: "0.2 ha",
    status: "action_required",
    layout: { col: 1, row: 3, colSpan: 3, rowSpan: 1 },
    latOffset: -0.0009,
    lngOffset: -0.0002,
  },
  {
    id: "plot-d",
    farmId: "farm-2",
    name: "Balcony Container 1",
    cropCurrent: "Basil",
    areaLabel: "20 L pot",
    status: "healthy",
    layout: { col: 1, row: 1, colSpan: 1, rowSpan: 2 },
    latOffset: 0.0002,
    lngOffset: -0.0003,
  },
  {
    id: "plot-e",
    farmId: "farm-2",
    name: "Balcony Container 2",
    cropCurrent: "Tomato",
    areaLabel: "30 L pot",
    status: "needs_attention",
    layout: { col: 2, row: 1, colSpan: 1, rowSpan: 2 },
    latOffset: 0.00015,
    lngOffset: 0.00035,
  },
];

export const devices: Device[] = [
  {
    id: "dev-1",
    plotId: "plot-a",
    serialNumber: "KS-ESP32-004821",
    model: "ESP32-SakaSense-v2",
    lastSeenAt: hoursAgo(0.4),
    batteryPercent: 86,
    status: "online",
  },
  {
    id: "dev-2",
    plotId: "plot-b",
    serialNumber: "KS-ESP32-004822",
    model: "ESP32-SakaSense-v2",
    lastSeenAt: hoursAgo(6),
    batteryPercent: 62,
    status: "syncing",
  },
  {
    id: "dev-3",
    plotId: "plot-c",
    serialNumber: "KS-ESP32-004823",
    model: "ESP32-SakaSense-v2",
    lastSeenAt: daysAgo(2, 14),
    batteryPercent: 41,
    status: "offline",
  },
  {
    id: "dev-4",
    plotId: "plot-d",
    serialNumber: "KS-ESP32-004901",
    model: "ESP32-SakaSense-v2",
    lastSeenAt: hoursAgo(1.2),
    batteryPercent: 91,
    status: "online",
  },
  {
    id: "dev-5",
    plotId: "plot-e",
    serialNumber: "KS-ESP32-004902",
    model: "ESP32-SakaSense-v2",
    lastSeenAt: hoursAgo(18),
    batteryPercent: 55,
    status: "offline",
  },
];

function buildSeries(
  plotId: string,
  deviceId: string,
  base: { pH: number; N: number; P: number; K: number },
  days: number,
): SensorReading[] {
  const out: SensorReading[] = [];
  for (let d = days; d >= 0; d--) {
    const wobble = Math.sin(d / 3) * 2;
    const source = d > 3 && d % 5 === 0 ? "synced_sd_card" : "live";
    out.push({
      id: `r-${plotId}-${d}`,
      deviceId,
      plotId,
      timestamp: daysAgo(d, 7 + (d % 3)),
      pH: Number((base.pH + wobble * 0.05 + (Math.random() - 0.5) * 0.15).toFixed(2)),
      N: Math.round(base.N + wobble * 1.5 + (Math.random() - 0.5) * 4),
      P: Math.round(base.P + wobble * 0.8 + (Math.random() - 0.5) * 2),
      K: Math.round(base.K + wobble * 1.2 + (Math.random() - 0.5) * 3),
      source,
    });
  }
  return out;
}

export const readings: SensorReading[] = [
  ...buildSeries("plot-a", "dev-1", { pH: 5.8, N: 58, P: 42, K: 82 }, 30),
  ...buildSeries("plot-b", "dev-2", { pH: 6.2, N: 48, P: 40, K: 58 }, 30),
  ...buildSeries("plot-c", "dev-3", { pH: 5.2, N: 32, P: 38, K: 38 }, 30),
  ...buildSeries("plot-d", "dev-4", { pH: 6.6, N: 65, P: 42, K: 70 }, 14),
  ...buildSeries("plot-e", "dev-5", { pH: 6.1, N: 48, P: 22, K: 50 }, 14),
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    plotId: "plot-a",
    timestamp: hoursAgo(0.4),
    rankedCrops: [
      { crop: "Potato", score: 92 },
      { crop: "Eggplant", score: 78 },
      { crop: "Basil", score: 71 },
    ],
    guidebookCode: "5001",
    fertilizer: {
      product: "Potato Boost 12-12-17",
      amount: "2–3 bags / ha",
      timing: "Within 7 days (basal)",
      notes: "Soil is well balanced for potato with good potassium for tuber development. Maintain consistent moisture.",
    },
    insight:
      "Zone A soil is well suited for potato. Maintain nutrient levels — next check-in in 5 days.",
    generatedOnDevice: true,
  },
  {
    id: "rec-2",
    plotId: "plot-b",
    timestamp: hoursAgo(6),
    rankedCrops: [
      { crop: "Tomato", score: 74 },
      { crop: "Sweet potato", score: 68 },
      { crop: "Eggplant", score: 61 },
    ],
    guidebookCode: "5002",
    fertilizer: {
      product: "Tomato Bloom 10-20-10",
      amount: "2–3 bags / ha",
      timing: "Within 5 days",
      notes: "Nitrogen and phosphorus levels are low for tomato. Apply balanced fertilizer with higher phosphorus.",
    },
    insight:
      "Nitrogen is trending low in Zone B — apply tomato-specific fertilizer within 5 days per Guidebook code 5002.",
    generatedOnDevice: true,
  },
  {
    id: "rec-3",
    plotId: "plot-c",
    timestamp: daysAgo(2, 14),
    rankedCrops: [
      { crop: "Sweet potato", score: 70 },
      { crop: "Cassava", score: 66 },
      { crop: "Eggplant", score: 48 },
    ],
    guidebookCode: "4821",
    fertilizer: {
      product: "Urea + Muriate of Potash",
      amount: "Urea 1 bag/ha · MOP 0.5 bag/ha",
      timing: "Within 3 days",
      notes: "pH is acidic and N/K are deficient for eggplant. Lime recommended before fertilizing.",
    },
    insight:
      "Nitrogen is trending low in Zone C — apply Urea within 3 days per Guidebook code 4821.",
    generatedOnDevice: true,
  },
  {
    id: "rec-4",
    plotId: "plot-d",
    timestamp: hoursAgo(1.2),
    rankedCrops: [
      { crop: "Basil", score: 94 },
      { crop: "Lettuce", score: 88 },
      { crop: "Chili", score: 76 },
    ],
    guidebookCode: "5510",
    fertilizer: {
      product: "Organic compost tea",
      amount: "200–300 mL / pot",
      timing: "Weekly",
      notes: "Container basil looks healthy. Light feeding is enough.",
    },
    insight: "Balcony Container 1 is ideal for basil. Continue weekly light feeding.",
    generatedOnDevice: true,
  },
  {
    id: "rec-5",
    plotId: "plot-e",
    timestamp: hoursAgo(18),
    rankedCrops: [
      { crop: "Chili", score: 72 },
      { crop: "Tomato", score: 65 },
      { crop: "Basil", score: 80 },
    ],
    guidebookCode: "6123",
    fertilizer: {
      product: "14-14-14 soluble",
      amount: "1 tsp / 2 L water",
      timing: "Within 4 days",
      notes: "Phosphorus a bit low for fruiting tomato. Water thoroughly after feeding.",
    },
    insight:
      "Phosphorus is low in Container 2 for tomato fruiting — apply soluble fertilizer per Guidebook 6123.",
    generatedOnDevice: true,
  },
];

/** Older recommendation history for plot detail timelines */
export const recommendationHistory: Recommendation[] = [
  ...recommendations,
  {
    id: "rec-c-old-1",
    plotId: "plot-c",
    timestamp: daysAgo(8, 10),
    rankedCrops: [
      { crop: "Eggplant", score: 55 },
      { crop: "Sweet potato", score: 68 },
    ],
    guidebookCode: "4810",
    fertilizer: {
      product: "Agricultural lime",
      amount: "0.5–1 ton / ha",
      timing: "Apply before next fertilizing",
      notes: "pH correction first.",
    },
    insight: "Soil acidity rising in Zone C — lime before nitrogen application.",
    generatedOnDevice: true,
  },
  {
    id: "rec-c-old-2",
    plotId: "plot-c",
    timestamp: daysAgo(15, 9),
    rankedCrops: [
      { crop: "Eggplant", score: 62 },
      { crop: "Okra", score: 60 },
    ],
    guidebookCode: "4799",
    fertilizer: {
      product: "Complete 14-14-14",
      amount: "2 bags / ha",
      timing: "Basal dressing",
      notes: "Routine maintenance dose.",
    },
    insight: "Zone C nutrients were borderline — scheduled follow-up reading.",
    generatedOnDevice: true,
  },
];

export const alerts: Alert[] = [
  {
    id: "alert-1",
    plotId: "plot-c",
    type: "deficiency",
    message: "Nitrogen deficiency — Action Required in Zone C",
    triggeredAt: daysAgo(2, 14),
    resolvedAt: null,
    channelSent: ["email", "push"],
  },
  {
    id: "alert-2",
    plotId: "plot-b",
    type: "deficiency",
    message: "Nitrogen trending low in Zone B",
    triggeredAt: hoursAgo(6),
    resolvedAt: null,
    channelSent: ["push"],
  },
  {
    id: "alert-3",
    plotId: "plot-c",
    type: "device_offline",
    message: "Device KS-ESP32-004823 last synced 2 days ago",
    triggeredAt: daysAgo(1, 8),
    resolvedAt: null,
    channelSent: ["email"],
  },
  {
    id: "alert-4",
    plotId: "plot-e",
    type: "check_in_due",
    message: "Recommended check-in overdue for Container 2",
    triggeredAt: hoursAgo(12),
    resolvedAt: null,
    channelSent: ["push"],
  },
  {
    id: "alert-5",
    plotId: "plot-a",
    type: "deficiency",
    message: "Brief pH dip detected (resolved)",
    triggeredAt: daysAgo(10, 11),
    resolvedAt: daysAgo(9, 16),
    channelSent: ["push"],
  },
];

export const guidebook: GuidebookEntry[] = [
  {
    code: "2147",
    crop: "Potato",
    soilCondition: "pH 5.5–6.5 · K tubers",
    cultivationSteps: [
      "Plant seed potatoes 10–15 cm deep, 30 cm apart.",
      "Hill up soil around stems as plants grow.",
      "Harvest after foliage dies back.",
    ],
    fertilizerNotes: "Apply fertilizer higher in potassium (e.g., 12-12-17) at planting and tuber set.",
  },
  {
    code: "3902",
    crop: "Tomato",
    soilCondition: "pH 6.0–6.8 · P for fruiting",
    cultivationSteps: [
      "Start seeds indoors 6–8 weeks before last frost.",
      "Transplant after danger of frost has passed.",
      "Stake or cage vines early; water at base.",
    ],
    fertilizerNotes: "Use balanced fertilizer with higher phosphorus (e.g., 10-20-10) at flowering.",
  },
  {
    code: "4821",
    crop: "Eggplant",
    soilCondition: "pH acidic · N & K deficient",
    cultivationSteps: [
      "Correct pH with agricultural lime 1–2 weeks before planting.",
      "Stake plants early; prune lower leaves.",
      "Harvest fruits regularly to encourage more flowering.",
    ],
    fertilizerNotes: "After liming, apply Urea + MOP. Re-test soil in 7–10 days.",
  },
  {
    code: "5510",
    crop: "Basil",
    soilCondition: "pH 6.0–7.0 · container-friendly",
    cultivationSteps: [
      "Keep potting mix moist but not waterlogged.",
      "Pinch tips to promote bushy growth.",
      "Provide 4–6 hours of sun daily.",
    ],
    fertilizerNotes: "Light weekly compost tea or dilute organic liquid fertilizer.",
  },
  {
    code: "6123",
    crop: "Tomato",
    soilCondition: "pH 6.0–6.8 · P low for fruiting",
    cultivationSteps: [
      "Stake or cage vines early.",
      "Water at the base — avoid wetting leaves.",
      "Remove suckers below the first flower cluster.",
    ],
    fertilizerNotes: "Boost phosphorus with soluble 14-14-14 during flowering/fruit set.",
  },
  {
    code: "4810",
    crop: "Eggplant",
    soilCondition: "Rising acidity",
    cultivationSteps: [
      "Broadcast lime and incorporate lightly.",
      "Delay nitrogen-heavy fertilizers until pH recovers.",
    ],
    fertilizerNotes: "Lime first, then resume complete fertilizer program.",
  },
  {
    code: "4799",
    crop: "Eggplant",
    soilCondition: "Borderline nutrients",
    cultivationSteps: [
      "Continue regular irrigation schedule.",
      "Re-test soil in one week.",
    ],
    fertilizerNotes: "Maintenance dose of complete fertilizer.",
  },
];

export const subscription: Subscription = {
  id: "sub-1",
  userId: "user-1",
  tier: "farmer_pro",
  status: "active",
  renewalDate: daysAgo(-20),
  paymentMethod: "GCash ···· 4567",
};

export const supportedCrops = [
  "Rice",
  "Corn",
  "Eggplant",
  "Sweet potato",
  "Cassava",
  "Okra",
  "Basil",
  "Lettuce",
  "Tomato",
  "Chili",
  "Pechay",
  "Kangkong",
];

export function getFarm(farmId: string) {
  return farms.find((f) => f.id === farmId);
}

export function getPlot(plotId: string) {
  return plots.find((p) => p.id === plotId);
}

export function getPlotsForFarm(farmId: string) {
  return plots.filter((p) => p.farmId === farmId);
}

export function getDeviceForPlot(plotId: string) {
  return devices.find((d) => d.plotId === plotId);
}

export function getLatestReading(plotId: string) {
  return readings
    .filter((r) => r.plotId === plotId)
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))[0];
}

export function getReadingsForPlot(plotId: string, days = 30) {
  const cutoff = Date.now() - days * 86400000;
  return readings
    .filter((r) => r.plotId === plotId && +new Date(r.timestamp) >= cutoff)
    .sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
}

export function getLatestRecommendation(plotId: string) {
  return recommendations.find((r) => r.plotId === plotId);
}

export function getRecommendationHistory(plotId: string) {
  return recommendationHistory
    .filter((r) => r.plotId === plotId)
    .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
}

export function getGuidebookEntry(code: string) {
  return guidebook.find((g) => g.code === code);
}

export function readingStats(plotId: string, days = 30) {
  const series = getReadingsForPlot(plotId, days);
  if (!series.length) return null;
  const metrics = ["pH", "N", "P", "K"] as const;
  const result = {} as Record<
    (typeof metrics)[number],
    { max: number; min: number; mean: number }
  >;
  for (const m of metrics) {
    const vals = series.map((r) => r[m]);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    result[m] = {
      max: m === "pH" ? Number(max.toFixed(2)) : Math.round(max),
      min: m === "pH" ? Number(min.toFixed(2)) : Math.round(min),
      mean: m === "pH" ? Number(mean.toFixed(2)) : Math.round(mean),
    };
  }
  return result;
}
