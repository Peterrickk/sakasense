"use client";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { EmptyState } from "@/components/brand/misc";
import { CartLineThumb } from "@/components/product/cart-line-thumb";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPHP } from "@/lib/money";
import { selectSubtotal, useCart } from "@/store/cart";
import { useCartReady } from "@/store/use-cart-hydrated";
import { Skeleton } from "@/components/ui/skeleton";

export function CartView() {
  const ready = useCartReady();
  const { items, setQty, remove } = useCart();

  if (!ready) return <Skeleton className="h-64 w-full" />;
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a SakaSense device to get started."
        action={<Button href="/products">Browse products</Button>}
      />
    );
  }
  const subtotal = selectSubtotal({ items });
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.productId}>
            <GlassCard className="flex gap-4 p-4">
              <CartLineThumb image={i.image} name={i.name} />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link href={`/products/${i.slug}`} className="hover:text-primary font-medium">
                  {i.name}
                </Link>
                <p className="text-text-muted text-sm">{formatPHP(i.unitPriceCentavos)} each</p>
                <div className="mt-auto flex items-center justify-between">
                  <QuantityStepper
                    value={i.quantity}
                    onChange={(n) => setQty(i.productId, n)}
                    label={`Quantity for ${i.name}`}
                  />
                  <span className="font-display font-bold">
                    {formatPHP(i.unitPriceCentavos * i.quantity)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${i.name}`}
                    onClick={() => remove(i.productId)}
                    className="text-text-muted hover:text-danger p-2"
                  >
                    <Trash2 className="size-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
      <GlassCard className="h-fit space-y-4 lg:sticky lg:top-28">
        <h2 className="text-h3">Order summary</h2>
        <div className="flex justify-between">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-display font-bold">{formatPHP(subtotal)}</span>
        </div>
        <p className="text-text-muted text-sm">Shipping calculated at checkout.</p>
        <Button href="/checkout" size="lg" className="w-full">
          Proceed to checkout
        </Button>
      </GlassCard>
    </div>
  );
}
