"use client";
import { Dialog as D } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;
export const DialogTitle = D.Title;
export const DialogDescription = D.Description;

export function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof D.Content>) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <D.Content
        className={cn(
          "glass bg-surface shadow-glow rounded-card fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 p-6",
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
