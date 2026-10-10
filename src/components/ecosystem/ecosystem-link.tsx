"use client";
import type { VariantProps } from "class-variance-authority";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Outbound link to the dashboard / app / guidebook that records an `ecosystem_link_click` event. */
export function EcosystemLink({
  href,
  target,
  variant = "secondary",
  size = "md",
  className,
  children,
}: {
  href: string;
  target: string;
  className?: string;
  children: React.ReactNode;
} & VariantProps<typeof buttonVariants>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("ecosystem_link_click", { target })}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
      <ExternalLink aria-hidden="true" />
    </a>
  );
}
