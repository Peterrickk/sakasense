import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | SakaSense Admin" },
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

/** Layout is chrome only. Access control lives in each page (requireAdminPage) and each action (assertAdmin). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-border bg-surface border-b">
        <div className="container-page flex flex-wrap items-center gap-6 py-3">
          <Logo />
          <nav aria-label="Admin" className="flex flex-wrap gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:bg-surface-2 hover:text-primary rounded-full px-3 py-1.5"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="text-text-muted hover:text-primary ml-auto text-sm">
            View site →
          </Link>
        </div>
      </header>
      <main className="container-page py-10">{children}</main>
      <Toaster />
    </div>
  );
}
