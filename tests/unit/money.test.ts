import { describe, expect, it } from "vitest";
import { formatPHP, pesosToCentavos } from "@/lib/money";

describe("money", () => {
  it("formats centavos as PHP", () => {
    expect(formatPHP(249900)).toContain("2,499.00");
    expect(formatPHP(249900)).toContain("₱");
  });
  it("converts pesos to integer centavos without float drift", () => {
    expect(pesosToCentavos(19.99)).toBe(1999);
    expect(pesosToCentavos(0.1 + 0.2)).toBe(30);
  });
});
