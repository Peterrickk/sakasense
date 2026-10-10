import { ProductImage } from "./product-image";

export function CartLineThumb({ image, name }: { image?: string; name: string }) {
  return (
    <ProductImage
      src={image}
      alt={name}
      sizes="80px"
      className="size-20 shrink-0 rounded-xl [&_span]:hidden"
    />
  );
}
