import Image from "next/image";
import { Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

/** Product photo, or a stylized placeholder tile until real photography exists. */
export function ProductImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={cn("bg-surface-2 relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (photo coming soon)`}
      className={cn(
        "bg-grid from-surface-2 to-surface relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        className,
      )}
    >
      <Cpu className="text-primary/60 size-1/4 min-w-10" aria-hidden="true" />
      <span className="text-text-muted absolute bottom-3 left-3 font-mono text-[10px] tracking-widest uppercase">
        Photo coming soon
      </span>
    </div>
  );
}
