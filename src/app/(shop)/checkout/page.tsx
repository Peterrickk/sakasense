import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/section-heading";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  return (
    <div className="container-page py-14">
      <SectionHeading as="h1" align="left" title="Checkout" />
      <CheckoutForm prefill={user ? { email: user.email, name: user.name } : undefined} />
    </div>
  );
}
