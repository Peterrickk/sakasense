import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** The real SakaSense emblem. It has a white background, so it sits in a white badge on both themes. */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/images/brand/logo-mark.webp"
      alt=""
      width={size}
      height={Math.round(size * 1.06)}
      className={cn("rounded-lg bg-white object-contain p-0.5", className)}
      priority
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.shortName} home`}
      className={cn("flex items-center gap-2.5", className)}
    >
      <LogoMark />
      <span className="font-display text-xl font-bold tracking-tight">
        Saka<span className="gradient-text">Sense</span>
      </span>
    </Link>
  );
}
