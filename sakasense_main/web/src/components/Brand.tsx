import Image from "next/image";
import { asset } from "@/lib/basePath";

/** SakaSense emblem (same logo as the main website). */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src={asset("/brand/logo-mark.webp")}
      alt=""
      width={size}
      height={Math.round(size * 1.06)}
      className="rounded-lg bg-sakasense-surface-2 object-contain"
      priority
    />
  );
}
