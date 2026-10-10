"use client";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPHP } from "@/lib/money";
import { selectSubtotal, useCart } from "@/store/cart";
import { useCartReady } from "@/store/use-cart-hydrated";
import { CartLineThumb } from "@/components/product/cart-line-thumb";

export function CartSheet() {
  const ready = useCartReady();
  const { items, isOpen, setOpen, setQty, remove } = useCart();
  const subtotal = selectSubtotal({ items });
  const lines = ready ? items : [];

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent>
        <SheetTitle className="font-display text-2xl font-bold">Your cart</SheetTitle>
        <SheetDescription className="sr-only">Items in your shopping cart</SheetDescription>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="text-primary size-12" aria-hidden="true" />
            <p className="text-text-muted">Your cart is empty.</p>
            <Button href="/products" onClick={() => setOpen(false)}>
              Browse products
            </Button>
          </div>
        ) : (
          <>
            <ul className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
              {lines.map((i) => (
                <li key={i.productId} className="border-border flex gap-3 border-b pb-4">
                  <CartLineThumb image={i.image} name={i.name} />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${i.slug}`}
                      onClick={() => setOpen(false)}
                      className="hover:text-primary line-clamp-2 font-medium"
                    >
                      {i.name}
                    </Link>
                    <p className="text-text-muted text-sm">{formatPHP(i.unitPriceCentavos)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <QuantityStepper
                        value={i.quantity}
                        onChange={(n) => setQty(i.productId, n)}
                        label={`Quantity for ${i.name}`}
                      />
                      <button
                        type="button"
                        aria-label={`Remove ${i.name}`}
                        onClick={() => remove(i.productId)}
                        className="text-text-muted hover:text-danger p-2"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-border mt-4 space-y-3 border-t pt-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-display font-bold">{formatPHP(subtotal)}</span>
              </div>
              <p className="text-text-muted text-xs">Shipping calculated at checkout.</p>
              <Button href="/checkout" className="w-full" onClick={() => setOpen(false)}>
                Proceed to checkout
              </Button>
              <Button
                href="/cart"
                variant="secondary"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                View full cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
