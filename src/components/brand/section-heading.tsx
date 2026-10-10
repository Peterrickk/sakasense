import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl md:mb-14",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary mb-3 font-mono text-xs tracking-[0.2em] uppercase">{eyebrow}</p>
      ) : null}
      <Tag className={Tag === "h1" ? "text-h1" : "text-h2"}>{title}</Tag>
      {subtitle ? <p className="text-text-muted mt-4 text-lg">{subtitle}</p> : null}
    </div>
  );
}
