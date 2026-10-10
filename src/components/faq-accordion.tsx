"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { visibleText } from "@/lib/placeholders";
import type { Faq } from "@/content/faq";

/**
 * FAQ list. In production, [PLACEHOLDER] markers are stripped and items with no real answer
 * left are hidden; in development everything stays visible as a reminder.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const visible = items.map((f) => ({ ...f, a: visibleText(f.a) })).filter((f) => f.a.length > 0);
  return (
    <Accordion type="single" collapsible>
      {visible.map((f) => (
        <AccordionItem key={f.q} value={f.q}>
          <AccordionTrigger>{f.q}</AccordionTrigger>
          <AccordionContent>{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
