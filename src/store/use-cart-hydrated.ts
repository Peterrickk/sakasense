"use client";
import { useEffect, useState } from "react";
import { useCart } from "./cart";

/**
 * Hydration guard: the persisted cart (localStorage) only exists on the client, so we
 * rehydrate after mount and report `ready` to avoid an SSR/CSR mismatch.
 */
export function useCartReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void Promise.resolve(useCart.persist.rehydrate()).then(() => setReady(true));
  }, []);
  return ready;
}
