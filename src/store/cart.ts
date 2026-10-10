"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  /** Display only. The server always recomputes prices from the database. */
  unitPriceCentavos: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  /** Increments on every add, so the header badge can animate. */
  bump: number;
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const MAX_QTY = 99;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      bump: 0,
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === item.productId);
          const items = existing
            ? s.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + qty) }
                  : i,
              )
            : [...s.items, { ...item, quantity: Math.min(MAX_QTY, qty) }];
          return { items, isOpen: true, bump: s.bump + 1 };
        }),
      remove: (productId) =>
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.productId !== productId)
              : s.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: Math.min(MAX_QTY, qty) } : i,
                ),
        })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "sakasense-cart",
      partialize: (s) => ({ items: s.items }),
      skipHydration: true,
    },
  ),
);

export const selectCount = (s: Pick<CartState, "items">) =>
  s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: Pick<CartState, "items">) =>
  s.items.reduce((n, i) => n + i.unitPriceCentavos * i.quantity, 0);
