import { beforeEach, describe, expect, it } from "vitest";
import { selectCount, selectSubtotal, useCart } from "@/store/cart";

const item = { productId: "p1", slug: "core", name: "Core", unitPriceCentavos: 1000 };

describe("cart store", () => {
  beforeEach(() => useCart.setState({ items: [], isOpen: false, bump: 0 }));

  it("adds, merges, and totals", () => {
    useCart.getState().add(item);
    useCart.getState().add(item, 2);
    const s = useCart.getState();
    expect(s.items).toHaveLength(1);
    expect(selectCount(s)).toBe(3);
    expect(selectSubtotal(s)).toBe(3000);
    expect(s.isOpen).toBe(true);
    expect(s.bump).toBe(2);
  });
  it("sets quantity, removes at zero, caps at 99, and clears", () => {
    useCart.getState().add(item);
    useCart.getState().setQty("p1", 500);
    expect(useCart.getState().items[0].quantity).toBe(99);
    useCart.getState().setQty("p1", 0);
    expect(useCart.getState().items).toHaveLength(0);
    useCart.getState().add(item);
    useCart.getState().clear();
    expect(useCart.getState().items).toHaveLength(0);
  });
});
