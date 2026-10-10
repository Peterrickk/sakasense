"use client";

import { BrandMark } from "@/components/Brand";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  Bell,
  BookOpen,
  FileText,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Sprout,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { mainSite } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/crop-health", label: "Crop Health", icon: Sprout },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/guidebook", label: "Guidebook", icon: BookOpen },
  { href: "/account", label: "Account", icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen grid place-items-center sakasense-grain">
        <div className="flex items-center gap-3 text-sakasense-muted">
          <Leaf className="size-5 animate-pulse text-sakasense-green" />
          Loading SakaSense…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen sakasense-grain">
      <header className="sticky top-0 z-40 border-b border-sakasense-border/80 bg-sakasense-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-sakasense-ink lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrandMark />
              <span className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-sakasense-green-dark">
                SakaSense
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
                    active
                      ? "bg-sakasense-green-soft text-sakasense-green-dark"
                      : "text-sakasense-muted hover:bg-sakasense-surface-2 hover:text-sakasense-ink",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={mainSite.home}
              className="hidden text-sm font-medium text-sakasense-muted hover:text-sakasense-ink md:inline"
            >
              ← SakaSense website
            </a>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold leading-tight">{user.name}</p>
              <p className="text-xs capitalize text-sakasense-muted">
                {user.subscriptionTier.replace("_", " ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-sakasense-border bg-sakasense-surface-2 px-3 py-2 text-sm font-medium text-sakasense-muted hover:text-sakasense-ink"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-sakasense-border bg-sakasense-surface-2 px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "inline-flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                      active ? "bg-sakasense-green-soft text-sakasense-green-dark" : "text-sakasense-ink",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-sakasense-border pt-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="text-xs capitalize text-sakasense-muted">
                  {user.subscriptionTier.replace("_", " ")}
                </p>
              </div>
              <a
                href={mainSite.home}
                className="shrink-0 rounded-full border border-sakasense-border px-3 py-2 text-xs font-medium text-sakasense-muted hover:text-sakasense-ink"
              >
                ← SakaSense website
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
