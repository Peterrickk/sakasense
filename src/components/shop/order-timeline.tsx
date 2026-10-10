import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "@/db/schema";

const steps: { key: Order["status"]; label: string }[] = [
  { key: "paid", label: "Paid" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function OrderTimeline({ status }: { status: Order["status"] }) {
  if (status === "cancelled" || status === "refunded") {
    return (
      <p role="status" className="text-danger font-medium capitalize">
        Order {status}
      </p>
    );
  }
  if (status === "pending") {
    return (
      <p role="status" className="text-warning font-medium">
        Awaiting payment
      </p>
    );
  }
  const current = steps.findIndex((s) => s.key === status);
  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s.key} className="flex flex-col items-center gap-2 text-center">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-full border",
                done
                  ? "border-primary bg-primary text-on-primary"
                  : "border-border text-text-muted",
              )}
            >
              {done ? <Check className="size-5" aria-hidden="true" /> : i + 1}
            </span>
            <span className={cn("text-xs", done ? "text-text" : "text-text-muted")}>
              {s.label}
              {done && i === current ? <span className="sr-only"> (current)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
