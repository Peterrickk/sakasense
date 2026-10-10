"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, User } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, type NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";
import { selectCount, useCart } from "@/store/cart";
import { useCartReady } from "@/store/use-cart-hydrated";
import { CartSheet } from "./cart-sheet";

function NavLink({ item, className }: { item: NavItem; className?: string }) {
  const external = item.external || /^https?:\/\//.test(item.href);
  return external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
      {item.label}
    </a>
  ) : (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

function CartButton() {
  const ready = useCartReady();
  const items = useCart((s) => s.items);
  const bump = useCart((s) => s.bump);
  const setOpen = useCart((s) => s.setOpen);
  const reduce = useReducedMotion();
  const count = ready ? selectCount({ items }) : 0;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="hover:bg-surface-2 relative flex size-10 items-center justify-center rounded-full"
    >
      <ShoppingBag className="size-5" />
      {count > 0 ? (
        <motion.span
          key={bump}
          initial={reduce ? false : { scale: 1.6 }}
          animate={{ scale: 1 }}
          className="bg-brand-gradient text-on-primary absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full text-[11px] font-bold"
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      ) : null}
    </button>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "glass border-b" : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger className="hover:text-primary flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium">
                  {item.label} <ChevronDown className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.children.map((c) => (
                    <DropdownMenuItem key={c.label} asChild>
                      <NavLink item={c} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink
                key={item.label}
                item={item}
                className={cn(
                  "hover:text-primary rounded-full px-3 py-2 text-sm font-medium",
                  pathname === item.href && "text-primary",
                )}
              />
            ),
          )}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/account"
            aria-label="Account"
            className="hover:bg-surface-2 hidden size-10 items-center justify-center rounded-full sm:flex"
          >
            <User className="size-5" />
          </Link>
          <CartButton />
          <Button href="/products" size="sm" className="ml-2 hidden sm:inline-flex">
            Shop Now
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="hover:bg-surface-2 flex size-10 items-center justify-center rounded-full lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="font-display text-xl font-bold">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav aria-label="Mobile" className="mt-6 flex-1 space-y-1 overflow-y-auto">
                {mainNav.map((item) => (
                  <div key={item.label}>
                    <SheetClose asChild>
                      <NavLink
                        item={item}
                        className="hover:bg-surface-2 block rounded-xl px-3 py-3 text-lg font-medium"
                      />
                    </SheetClose>
                    {item.children?.map((c) => (
                      <SheetClose asChild key={c.label}>
                        <NavLink
                          item={c}
                          className="text-text-muted hover:text-primary block py-2 pl-7 text-base"
                        />
                      </SheetClose>
                    ))}
                  </div>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/account"
                    className="hover:bg-surface-2 block rounded-xl px-3 py-3 text-lg font-medium"
                  >
                    Account
                  </Link>
                </SheetClose>
              </nav>
              <SheetClose asChild>
                <Button href="/products" size="lg" className="mt-4 w-full">
                  Shop Now
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <CartSheet />
    </header>
  );
}
