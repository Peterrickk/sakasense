import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-on-primary font-semibold shadow-glow hover:brightness-110 hover:-translate-y-0.5",
        secondary: "glass text-text hover:border-primary/50 hover:bg-surface-2",
        ghost: "text-text hover:bg-surface-2",
        danger: "bg-danger text-white hover:brightness-110",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-base md:text-lg",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { href?: undefined };
type LinkButtonProps = Omit<React.ComponentProps<typeof Link>, "href"> &
  VariantProps<typeof buttonVariants> & { href: string };

export function Button(props: ButtonProps | LinkButtonProps) {
  if (props.href !== undefined) {
    const { className, variant, size, href, ...rest } = props;
    const cls = cn(buttonVariants({ variant, size }), className);
    if (/^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          {...(rest as React.ComponentProps<"a">)}
        />
      );
    }
    return <Link href={href} className={cls} {...rest} />;
  }
  const { className, variant, size, type = "button", ...rest } = props;
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...rest} />
  );
}
