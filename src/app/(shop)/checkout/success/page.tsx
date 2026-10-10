import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SuccessView } from "@/components/shop/success-view";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const { order } = await searchParams;
  if (typeof order !== "string" || !/^SKS-\d{4}-\d{6}$/.test(order)) redirect("/products");
  return (
    <div className="container-page py-16">
      <SuccessView orderNumber={order} />
    </div>
  );
}
