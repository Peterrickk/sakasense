"use client";
import { DropdownMenu as M } from "radix-ui";
import { cn } from "@/lib/utils";

export const DropdownMenu = M.Root;
export const DropdownMenuTrigger = M.Trigger;

export function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof M.Content>) {
  return (
    <M.Portal>
      <M.Content
        sideOffset={sideOffset}
        className={cn("glass bg-surface z-50 min-w-48 rounded-xl p-1.5 shadow-2xl", className)}
        {...props}
      />
    </M.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }: React.ComponentProps<typeof M.Item>) {
  return (
    <M.Item
      className={cn(
        "data-[highlighted]:bg-surface-2 data-[highlighted]:text-primary flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none",
        className,
      )}
      {...props}
    />
  );
}
