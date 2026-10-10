"use client";
import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductImage as Img } from "@/db/schema";
import { ProductImage } from "./product-image";

export function Gallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (images.length === 0) {
    return <ProductImage alt={name} className="rounded-card aspect-square w-full" priority />;
  }

  return (
    <div className="space-y-3">
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="Zoom image"
            className="group rounded-card relative block aspect-square w-full overflow-hidden"
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <ZoomIn className="bg-bg/70 absolute right-3 bottom-3 size-9 rounded-full p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <DialogDescription className="sr-only">Enlarged product image</DialogDescription>
          <div className="relative aspect-square w-full">
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="768px"
              className="rounded-xl object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
      {images.length > 1 ? (
        <ul className="flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-xl border-2",
                  i === active ? "border-primary" : "border-border",
                )}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
