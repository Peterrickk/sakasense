import { siteConfig } from "@/config/site";

const formatter = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
});

/** Money is always integer centavos. ₱1.00 = 100. */
export function formatPHP(centavos: number): string {
  return formatter.format(centavos / 100);
}

/** Converts a peso amount typed by a human (e.g. in the admin form) to centavos. */
export function pesosToCentavos(pesos: number): number {
  return Math.round(pesos * 100);
}
