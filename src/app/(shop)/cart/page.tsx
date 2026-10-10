import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/section-heading";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="container-page py-14">
      <SectionHeading as="h1" align="left" title="Your cart" />
      <CartView />
    </div>
  );
}
