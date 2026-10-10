"use client";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = D.Root;
export const SheetTrigger = D.Trigger;
export const SheetClose = D.Close;
export const SheetTitle = D.Title;
export const SheetDescription = D.Description;

export function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof D.Content> & { side?: "right" | "left" }) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <D.Content
        className={cn(
          "border-border bg-surface fixed inset-y-0 z-50 flex h-dvh w-full max-w-md flex-col p-6 shadow-2xl",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          className,
        )}
        {...props}
      >
        {children}
        <D.Close
          aria-label="Close"
          className="text-text-muted hover:text-text absolute top-4 right-4 rounded-full p-1"
        >
          <X className="size-5" />
        </D.Close>
      </D.Content>
    </D.Portal>
  );
}
