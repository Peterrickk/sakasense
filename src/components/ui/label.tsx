import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label className={cn("text-text mb-1.5 block text-sm font-medium", className)} {...props} />
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-danger mt-1 text-sm">
      {message}
    </p>
  );
}
