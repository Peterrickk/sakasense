"use client";
import { Tabs as T } from "radix-ui";
import { cn } from "@/lib/utils";

export const Tabs = T.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof T.List>) {
  return (
    <T.List
      className={cn("border-border flex gap-1 overflow-x-auto border-b", className)}
      {...props}
    />
  );
}
export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        "text-text-muted hover:text-text data-[state=active]:border-primary data-[state=active]:text-primary -mb-px border-b-2 border-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
        className,
      )}
      {...props}
    />
  );
}
export function TabsContent({ className, ...props }: React.ComponentProps<typeof T.Content>) {
  return <T.Content className={cn("pt-6", className)} {...props} />;
}
