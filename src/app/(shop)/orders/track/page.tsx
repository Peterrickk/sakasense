import type { Metadata } from "next";
import { SectionHeading } from "@/components/brand/section-heading";
import { TrackForm } from "@/components/shop/track-form";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Enter your order number and email to see your order status.",
};

export default function TrackPage() {
  return (
    <div className="container-page max-w-3xl py-14">
      <SectionHeading
        as="h1"
        title="Track your order"
        subtitle="Enter the order number from your confirmation email, and the email you used."
      />
      <TrackForm />
    </div>
  );
}
