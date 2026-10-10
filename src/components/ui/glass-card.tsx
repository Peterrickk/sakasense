import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  hover = false,
  glow = false,
  ...props
}: React.ComponentProps<"div"> & { hover?: boolean; glow?: boolean }) {
  return (
    <div
      className={cn(
        "glass rounded-card p-6",
        hover && "hover:border-primary/50 transition-all duration-300 hover:-translate-y-1",
        glow && "shadow-glow",
        className,
      )}
      {...props}
    />
  );
}
