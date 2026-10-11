/**
 * Single source of truth for company details, contact info and ecosystem links.
 * Every [PLACEHOLDER] value here must be replaced by the business owner.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
/**
 * Where the SakaSense web dashboard (sakasense_main/web) is hosted. On Vercel it is the `dashboard`
 * service under /app on this same domain (see vercel.json). Absolute because emails use it too.
 */
const dashboardUrl = (
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? `${siteUrl.replace(/\/$/, "")}/app`
).replace(/\/$/, "");

export const siteConfig = {
  name: "SakaSense Venture Solutions",
  shortName: "SakaSense",
  tagline: "Smart Soil Intelligence",
  description:
    "SakaSense is an IoT soil sensor that reads pH, nitrogen, phosphorus, and potassium, recommends crops and fertilizer, and syncs to a mobile app and web dashboard.",
  url: siteUrl,
  currency: "PHP",
  locale: "en-PH",
  contact: {
    email: "[PLACEHOLDER email]",
    phone: "0993 017 7122",
    /** Same number in international format, for tel: links. */
    phoneTel: "+639930177122",
    address: "Sagkahan, Tacloban City",
    /** Map search text (more specific than the display address, so the pin lands in Tacloban). */
    mapQuery: "Sagkahan, Tacloban City, Leyte, Philippines",
    hours: "[PLACEHOLDER office hours]",
    dpoEmail: "[PLACEHOLDER DPO email]",
  },
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
  chatUrl: "", // Messenger/Viber link. Empty hides the floating chat button.
  /** Ecosystem links. Change here only. The dashboard is the separate sakasense_main app. */
  links: {
    dashboard: dashboardUrl,
    dashboardLogin: `${dashboardUrl}/login`,
    dashboardSignup: `${dashboardUrl}/register`,
    // The Guidebook lives inside the dashboard.
    guidebook: `${dashboardUrl}/guidebook`,
    appStore: "https://apps.apple.com/[PLACEHOLDER]",
    playStore: "https://play.google.com/store/apps/details?id=[PLACEHOLDER]",
  },
  announcement: {
    enabled: true,
    text: "Free shipping nationwide on orders over ₱[PLACEHOLDER]",
  },
  shipping: {
    /** Centavos. [PLACEHOLDER rates] */
    standardCentavos: 15000,
    expressCentavos: 30000,
    freeThresholdCentavos: 500000,
  },
  cod: { enabled: false }, // owner decides
  features: {
    stripe: false, // enable for international orders
    showStats: false, // hide until real numbers exist
    showTestimonials: false,
    showPartners: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;
