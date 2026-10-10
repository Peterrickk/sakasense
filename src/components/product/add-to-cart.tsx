"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useCart } from "@/store/cart";
import { track } from "@/lib/analytics";
import type { Product } from "@/db/schema";

export type CartableProduct = Pick<
  Product,
  "id" | "slug" | "name" | "priceCentavos" | "stock" | "images"
>;

export function AddToCart({
  product,
  withQuantity = false,
  withBuyNow = false,
  size = "md",
  className,
}: {
  product: CartableProduct;
  withQuantity?: boolean;
  withBuyNow?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const purchasable = product.priceCentavos > 0 && product.stock > 0;

  if (!purchasable) {
    return (
      <Button
        href={`/quote?product=${product.slug}`}
        variant="secondary"
        size={size}
        className={className}
      >
        {product.priceCentavos > 0 ? "Out of stock — ask us" : "Ask about availability"}
      </Button>
    );
  }

  const addToCart = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0]?.url,
        unitPriceCentavos: product.priceCentavos,
      },
      qty,
    );
    track("add_to_cart", { slug: product.slug, quantity: qty });
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {withQuantity ? (
          <QuantityStepper value={qty} onChange={setQty} max={Math.min(99, product.stock)} />
        ) : null}
        <Button size={size} onClick={addToCart}>
          <ShoppingCart /> Add to cart
        </Button>
        {withBuyNow ? (
          <Button
            size={size}
            variant="secondary"
            onClick={() => {
              addToCart();
              useCart.getState().setOpen(false);
              router.push("/checkout");
            }}
          >
            Buy now
          </Button>
        ) : null}
      </div>
    </div>
  );
}
