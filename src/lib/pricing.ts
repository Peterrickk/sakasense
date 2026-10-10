import { siteConfig } from "@/config/site";

export type ShippingMethod = "standard" | "express";

/** Free standard shipping above the configured threshold. All values are integer centavos. */
export function shippingFor(subtotalCentavos: number, method: ShippingMethod): number {
  const { standardCentavos, expressCentavos, freeThresholdCentavos } = siteConfig.shipping;
  if (method === "standard" && subtotalCentavos >= freeThresholdCentavos) return 0;
  return method === "express" ? expressCentavos : standardCentavos;
}

export function computeTotals(lines: { lineTotalCentavos: number }[], method: ShippingMethod) {
  const subtotalCentavos = lines.reduce((n, l) => n + l.lineTotalCentavos, 0);
  const shippingCentavos = shippingFor(subtotalCentavos, method);
  const discountCentavos = 0;
  return {
    subtotalCentavos,
    shippingCentavos,
    discountCentavos,
    totalCentavos: subtotalCentavos + shippingCentavos - discountCentavos,
  };
}
