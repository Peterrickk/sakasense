import { siteConfig } from "./site";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Solutions", href: "/solutions" },
  {
    label: "Ecosystem",
    href: "/ecosystem",
    children: [
      { label: "Web Dashboard", href: siteConfig.links.dashboard, external: true },
      { label: "Mobile App", href: "/ecosystem#mobile-app" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/about" },
      { label: "Leadership", href: "/about/leadership" },
      { label: "News", href: "/news" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  Products: [
    { label: "All products", href: "/products" },
    { label: "Request a bulk quote", href: "/quote" },
    { label: "Track an order", href: "/orders/track" },
  ],
  Company: [
    { label: "Our story", href: "/about" },
    { label: "Leadership", href: "/about/leadership" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
  ],
  Ecosystem: [
    { label: "Web Dashboard", href: siteConfig.links.dashboard, external: true },
    { label: "Mobile App", href: "/ecosystem#mobile-app" },
  ],
  Support: [
    { label: "FAQ", href: "/faq" },
    { label: "How it works", href: "/how-it-works" },
    { label: "Solutions", href: "/solutions" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "Shipping & Returns", href: "/legal/shipping-returns" },
    { label: "Warranty", href: "/legal/warranty" },
  ],
} satisfies Record<string, NavItem[]>;
