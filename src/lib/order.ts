import { randomInt } from "node:crypto";
import type { Product } from "@/db/schema";

export { computeTotals, shippingFor, type ShippingMethod } from "./pricing";

export type PricedLine = {
  productId: string;
  name: string;
  unitPriceCentavos: number;
  quantity: number;
  lineTotalCentavos: number;
};

export type PricingError = {
  code: "unknown_product" | "unavailable" | "out_of_stock";
  name?: string;
};

/**
 * Recomputes every line from the database rows. The client only ever supplies product ids
 * and quantities, so a tampered price in the browser has no effect on what is charged.
 */
export function priceLines(
  requested: { productId: string; quantity: number }[],
  catalog: Pick<Product, "id" | "name" | "priceCentavos" | "stock" | "isActive">[],
): { ok: true; lines: PricedLine[] } | { ok: false; error: PricingError } {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  // Merge duplicate product ids so stock is checked against the combined quantity.
  const qty = new Map<string, number>();
  for (const r of requested) qty.set(r.productId, (qty.get(r.productId) ?? 0) + r.quantity);

  const lines: PricedLine[] = [];
  for (const [productId, quantity] of qty) {
    const p = byId.get(productId);
    if (!p) return { ok: false, error: { code: "unknown_product" } };
    if (!p.isActive || p.priceCentavos <= 0) {
      return { ok: false, error: { code: "unavailable", name: p.name } };
    }
    if (p.stock < quantity) return { ok: false, error: { code: "out_of_stock", name: p.name } };
    lines.push({
      productId,
      name: p.name,
      unitPriceCentavos: p.priceCentavos,
      quantity,
      lineTotalCentavos: p.priceCentavos * quantity,
    });
  }
  return { ok: true, lines };
}

/** e.g. SKS-2026-000123. Uniqueness is enforced by the database; callers retry on conflict. */
export function generateOrderNumber(date = new Date()): string {
  const serial = String(randomInt(0, 1_000_000)).padStart(6, "0");
  return `SKS-${date.getFullYear()}-${serial}`;
}
