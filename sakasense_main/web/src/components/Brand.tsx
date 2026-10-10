import Image from "next/image";

/** SakaSense emblem (same logo as the main website). */
export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/brand/logo-mark.webp"
      alt=""
      width={size}
      height={Math.round(size * 1.06)}
      className="rounded-lg bg-sakasense-surface-2 object-contain"
      priority
    />
  );
}
