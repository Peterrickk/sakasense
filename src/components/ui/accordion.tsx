"use client";
import { Accordion as A } from "radix-ui";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = A.Root;

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof A.Item>) {
  return <A.Item className={cn("glass rounded-card mb-3 overflow-hidden", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof A.Trigger>) {
  return (
    <A.Header>
      <A.Trigger
        className={cn(
          "group hover:text-primary flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="size-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </A.Trigger>
    </A.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof A.Content>) {
  return (
    <A.Content className="text-text-muted overflow-hidden" {...props}>
      <div className={cn("px-5 pb-5", className)}>{children}</div>
    </A.Content>
  );
}
