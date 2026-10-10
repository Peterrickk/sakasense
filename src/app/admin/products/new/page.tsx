import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdminPage } from "@/lib/session";

export const metadata: Metadata = { title: "New product" };

export default async function NewProduct() {
  await requireAdminPage();
  return (
    <div className="space-y-6">
      <h1 className="text-h2">New product</h1>
      <ProductForm />
    </div>
  );
}
