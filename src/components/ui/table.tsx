import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="border-border rounded-card w-full overflow-x-auto border">
      <table className={cn("w-full border-collapse text-left text-sm", className)} {...props} />
    </div>
  );
}
export function THead(props: React.ComponentProps<"thead">) {
  return (
    <thead
      className="bg-surface-2 text-text-muted font-mono text-xs tracking-wider uppercase"
      {...props}
    />
  );
}
export function TR({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr className={cn("border-border border-t first:border-t-0", className)} {...props} />;
}
export function TH({ className, ...props }: React.ComponentProps<"th">) {
  return <th scope="col" className={cn("px-4 py-3 font-medium", className)} {...props} />;
}
export function TD({ className, ...props }: React.ComponentProps<"td">) {
  return <td className={cn("px-4 py-3 align-top", className)} {...props} />;
}
