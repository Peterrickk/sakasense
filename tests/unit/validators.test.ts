import { describe, expect, it } from "vitest";
import { checkoutSchema, contactSchema, newsletterSchema, quoteSchema } from "@/lib/validators";

const address = {
  fullName: "Juan Dela Cruz",
  phone: "09171234567",
  line1: "123 Rizal St",
  barangay: "Poblacion",
  city: "Naga",
  province: "Camarines Sur",
  region: "Region V",
  postalCode: "4400",
};
const base = {
  email: "a@b.com",
  phone: "09171234567",
  address,
  shippingMethod: "standard",
  paymentMethod: "gcash",
};

describe("validators", () => {
  it("accepts a valid checkout and strips client-sent prices", () => {
    const r = checkoutSchema.safeParse({
      ...base,
      email: "A@B.com",
      items: [{ productId: crypto.randomUUID(), quantity: 1, unitPriceCentavos: 1 }],
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("a@b.com");
      expect("unitPriceCentavos" in r.data.items[0]).toBe(false);
    }
  });
  it("rejects empty carts, bad ids, and bad postal codes", () => {
    const id = crypto.randomUUID();
    expect(checkoutSchema.safeParse({ ...base, items: [] }).success).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...base, items: [{ productId: "x", quantity: 1 }] }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({
        ...base,
        address: { ...address, postalCode: "12" },
        items: [{ productId: id, quantity: 1 }],
      }).success,
    ).toBe(false);
  });
  it("flags a filled honeypot", () => {
    const r = contactSchema.safeParse({
      name: "Ana",
      email: "a@b.com",
      topic: "Sales",
      message: "Hello there friend",
      website: "spam",
    });
    expect(r.success).toBe(false);
    expect(newsletterSchema.safeParse({ email: "a@b.com", website: "x" }).success).toBe(false);
  });
  it("validates quotes", () => {
    const q = {
      organization: "Coop",
      orgType: "Cooperative",
      name: "Ana",
      email: "a@b.com",
      region: "Bicol",
    };
    const ok = quoteSchema.safeParse({ ...q, units: "25" });
    expect(ok.success && ok.data.units).toBe(25);
    expect(quoteSchema.safeParse({ ...q, units: "0" }).success).toBe(false);
  });
});
