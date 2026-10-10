import type { NewProduct } from "./schema";

/**
 * The only purchasable product is the SakaSense Device. The Mobile App and the Web Dashboard are
 * software (see siteConfig.links) and are not sold through the shop.
 * Facts below come from the owner's own dashboard project (sakasense_main) and device photo;
 * anything not confirmed there is a [PLACEHOLDER]. Price 0 = "not set": "Price coming soon".
 */
export const placeholderProducts: NewProduct[] = [
  {
    slug: "sakasense-device",
    name: "SakaSense Device",
    category: "device",
    tagline: "Soil pH and N-P-K sensor with an on-device crop and fertilizer recommendation.",
    description:
      "The SakaSense Device reads your soil's pH and nitrogen, phosphorus, and potassium (N-P-K) right where you plant. An on-device model ranks the best crops for that soil and writes a fertilizer prescription, then shows the result on the built-in screen with a 4-digit Guidebook code. No internet needed.\n\nWhen Wi-Fi is available, it can sync to the SakaSense Web Dashboard for history, multi-plot views, and reports, and it pairs with the SakaSense mobile app.",
    priceCentavos: 0,
    sku: "SKS-DEVICE",
    stock: 0,
    isFeatured: true,
    sortOrder: 1,
    images: [
      {
        url: "/images/products/sakasense-device.webp",
        alt: "SakaSense Device: a grey enclosure with an LCD screen and a three-prong NPK soil probe",
      },
    ],
    specs: [
      { label: "Measures", value: "Soil pH, nitrogen (N), phosphorus (P), potassium (K)" },
      { label: "Controller", value: "ESP32" },
      { label: "Recommendation", value: "On-device crop ranking and fertilizer prescription" },
      { label: "Display", value: "Built-in LCD with Guidebook code" },
      { label: "Connectivity", value: "Works offline; Wi-Fi sync to the Web Dashboard" },
      { label: "Power", value: "[PLACEHOLDER]" },
      { label: "Battery life", value: "[PLACEHOLDER]" },
      { label: "Water resistance", value: "[PLACEHOLDER]" },
    ],
    inTheBox: ["SakaSense Device", "NPK soil probe", "[PLACEHOLDER — other contents]"],
    connectivity: {
      bluetooth: "Pair with the SakaSense mobile app in the field. No internet needed.",
      wifi: "Sync readings to the Web Dashboard for history, multi-plot views, and reports.",
    },
  },
];

/** Dev-only prices so the checkout flow can be tested. Enabled with SEED_DEMO_PRICES=true. */
export const demoPrices: Record<string, { priceCentavos: number; stock: number }> = {
  "sakasense-device": { priceCentavos: 249900, stock: 50 },
};
