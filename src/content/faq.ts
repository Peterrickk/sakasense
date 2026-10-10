export type FaqGroup = "Product" | "Connectivity" | "Orders & Shipping" | "Warranty & Support";

export type Faq = { group: FaqGroup; q: string; a: string };

export const faqs: Faq[] = [
  {
    group: "Product",
    q: "What does SakaSense measure?",
    a: "Soil pH and the three main nutrients: nitrogen (N), phosphorus (P), and potassium (K). [PLACEHOLDER — accuracy ranges]",
  },
  {
    group: "Product",
    q: "Does SakaSense use AI?",
    a: "Yes. The SakaSense mobile app and web app use AI that our own team designed and built. It turns your soil readings into a soil health score, crop and fertilizer recommendations, and insights across your plots. The device also runs a small model on board, so you get a recommendation even with no internet.",
  },
  {
    group: "Product",
    q: "How long does the battery last?",
    a: "[PLACEHOLDER — battery life.]",
  },
  {
    group: "Product",
    q: "Is it waterproof?",
    a: "[PLACEHOLDER — water and dust resistance rating.]",
  },
  {
    group: "Product",
    q: "How do I learn to read the results?",
    a: "The SakaSense Guidebook explains each reading in plain language and what to do about it. You can open it from your dashboard.",
  },
  {
    group: "Connectivity",
    q: "Do I need internet to use it?",
    a: "No. Bluetooth works offline: pair the device with the mobile app while you are in the field. Wi-Fi is needed for continuous remote monitoring from the web dashboard.",
  },
  {
    group: "Orders & Shipping",
    q: "Where do you ship, and how long does it take?",
    a: "[PLACEHOLDER — coverage areas, couriers, and delivery times.]",
  },
  {
    group: "Orders & Shipping",
    q: "What payment methods do you accept?",
    a: "GCash, Maya, and credit or debit cards through PayMongo. [PLACEHOLDER — confirm any additional methods, e.g. cash on delivery.]",
  },
  {
    group: "Warranty & Support",
    q: "What is the warranty?",
    a: "[PLACEHOLDER — warranty terms.]",
  },
];

export const faqGroups: FaqGroup[] = [
  "Product",
  "Connectivity",
  "Orders & Shipping",
  "Warranty & Support",
];

/** Four questions shown on the Home page. */
export const homeFaqs = [faqs[0], faqs[1], faqs[5], faqs[7]];
