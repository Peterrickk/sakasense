import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/brand/misc";
import { AddToCart } from "./add-to-cart";
import { ProductImage } from "./product-image";
import type { Product } from "@/db/schema";

const categoryLabel: Record<Product["category"], string> = {
  device: "Device",
  bundle: "Bundle",
  accessory: "Accessory",
  subscription: "Subscription",
};

export function ProductCard({ product }: { product: Product }) {
  const chips = product.specs.slice(0, 2).filter((s) => !s.value.startsWith("[PLACEHOLDER"));
  const inStock = product.stock > 0;
  return (
    <article className="glass group hover:border-primary/60 hover:shadow-glow rounded-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
        <ProductImage
          src={product.images[0]?.url}
          alt={product.images[0]?.alt ?? product.name}
          className="aspect-[4/3] w-full"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge>{categoryLabel[product.category]}</Badge>
          {product.priceCentavos > 0 ? (
            <Badge variant={inStock ? "primary" : "warning"}>
              {inStock ? "In stock" : "Out of stock"}
            </Badge>
          ) : (
            <Badge variant="info">Coming soon</Badge>
          )}
        </div>
        <h3 className="text-h3">
          <Link href={`/products/${product.slug}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        {product.tagline ? <p className="text-text-muted text-sm">{product.tagline}</p> : null}
        {chips.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {chips.map((s) => (
              <li
                key={s.label}
                className="bg-surface-2 text-text-muted rounded-full px-2.5 py-1 font-mono text-xs"
              >
                {s.label}: {s.value}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="border-border mt-auto flex flex-col gap-3 border-t pt-4">
          <PriceTag
            centavos={product.priceCentavos}
            compareAtCentavos={product.compareAtCentavos}
          />
          <AddToCart product={product} size="sm" className="w-full" />
        </div>
      </div>
    </article>
  );
}
