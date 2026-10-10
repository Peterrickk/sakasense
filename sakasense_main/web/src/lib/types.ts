export type SubscriptionTier = "free" | "farmer_pro" | "cooperative";
export type UserRole = "farmer" | "cooperative_admin" | "viewer";
export type FarmType = "rural_field" | "urban_container";
export type PlotStatus = "healthy" | "needs_attention" | "action_required";
export type ReadingSource = "live" | "synced_sd_card";
export type AlertType = "deficiency" | "device_offline" | "check_in_due";

export interface User {
  id: string;
  name: string;
  email: string;
  contact?: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
}

export interface Farm {
  id: string;
  ownerUserId: string;
  name: string;
  location: string;
  type: FarmType;
  /** Map center for optional Google Maps 3D view */
  lat: number;
  lng: number;
  altitude?: number;
}

export interface Plot {
  id: string;
  farmId: string;
  name: string;
  cropCurrent: string;
  areaLabel: string;
  status: PlotStatus;
  /** CSS grid placement on the stylized farm plan */
  layout: { col: number; row: number; colSpan?: number; rowSpan?: number };
  /** Offset from farm center for 3D map markers (degrees) */
  latOffset: number;
  lngOffset: number;
}

export interface Device {
  id: string;
  plotId: string | null;
  serialNumber: string;
  model: string;
  lastSeenAt: string;
  batteryPercent: number;
  status: "online" | "offline" | "syncing";
}

export interface SensorReading {
  id: string;
  deviceId: string;
  plotId: string;
  timestamp: string;
  pH: number;
  N: number;
  P: number;
  K: number;
  source: ReadingSource;
}

export interface FertilizerPrescription {
  product: string;
  amount: string;
  timing: string;
  notes: string;
}

export interface Recommendation {
  id: string;
  plotId: string;
  timestamp: string;
  rankedCrops: { crop: string; score: number }[];
  guidebookCode: string;
  fertilizer: FertilizerPrescription;
  insight: string;
  generatedOnDevice: boolean;
}

export interface Alert {
  id: string;
  plotId: string;
  type: AlertType;
  message: string;
  triggeredAt: string;
  resolvedAt: string | null;
  channelSent: ("email" | "sms" | "push")[];
}

export interface GuidebookEntry {
  code: string;
  crop: string;
  soilCondition: string;
  cultivationSteps: string[];
  fertilizerNotes: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: "active" | "past_due" | "canceled";
  renewalDate: string;
  paymentMethod: string;
}

export type ChartMetric = "pH" | "N" | "P" | "K";
