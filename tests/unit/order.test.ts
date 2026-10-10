import { describe, expect, it } from "vitest";
import { computeTotals, generateOrderNumber, priceLines } from "@/lib/order";

const catalog = [
  { id: "a", name: "Core", priceCentavos: 100000, stock: 5, isActive: true },
  { id: "b", name: "Pro", priceCentavos: 0, stock: 5, isActive: true },
  { id: "c", name: "Kit", priceCentavos: 50000, stock: 1, isActive: true },
  { id: "d", name: "Old", priceCentavos: 50000, stock: 9, isActive: false },
];

describe("priceLines", () => {
  it("uses database prices and ignores anything the client sends", () => {
    const tampered = [{ productId: "a", quantity: 2, unitPriceCentavos: 1 }];
    const r = priceLines(tampered, catalog);
    expect(r.ok && r.lines[0].unitPriceCentavos).toBe(100000);
    expect(r.ok && r.lines[0].lineTotalCentavos).toBe(200000);
  });
  it("rejects unknown, unpriced, inactive, and over-stock items", () => {
    expect(priceLines([{ productId: "zzz", quantity: 1 }], catalog)).toMatchObject({ ok: false });
    expect(priceLines([{ productId: "b", quantity: 1 }], catalog)).toMatchObject({ ok: false });
    expect(priceLines([{ productId: "d", quantity: 1 }], catalog)).toMatchObject({ ok: false });
    expect(priceLines([{ productId: "c", quantity: 2 }], catalog)).toMatchObject({
      ok: false,
      error: { code: "out_of_stock" },
    });
  });
  it("checks stock against merged duplicate lines", () => {
    const r = priceLines(
      [
        { productId: "c", quantity: 1 },
        { productId: "c", quantity: 1 },
      ],
      catalog,
    );
    expect(r.ok).toBe(false);
  });
});

describe("computeTotals", () => {
  it("adds shipping and applies free standard shipping over the threshold", () => {
    expect(computeTotals([{ lineTotalCentavos: 100000 }], "standard")).toMatchObject({
      shippingCentavos: 15000,
      totalCentavos: 115000,
    });
    expect(computeTotals([{ lineTotalCentavos: 600000 }], "standard").shippingCentavos).toBe(0);
    expect(computeTotals([{ lineTotalCentavos: 600000 }], "express").shippingCentavos).toBe(30000);
  });
});

describe("generateOrderNumber", () => {
  it("matches SKS-YYYY-NNNNNN", () => {
    expect(generateOrderNumber(new Date(2026, 4, 1))).toMatch(/^SKS-2026-\d{6}$/);
  });
});
