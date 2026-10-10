import { track as vercelTrack } from "@vercel/analytics";

/**
 * Thin analytics wrapper. Events: add_to_cart, begin_checkout, purchase, quote_submitted,
 * ecosystem_link_click. Vercel Analytics is cookie-free, so no consent banner is required.
 * If a cookie-based tool is added later, gate it behind a consent notice.
 */
export type AnalyticsEvent =
  "add_to_cart" | "begin_checkout" | "purchase" | "quote_submitted" | "ecosystem_link_click";

export function track(event: AnalyticsEvent, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(event, props);
  } catch {
    /* analytics must never break the UI */
  }
}
