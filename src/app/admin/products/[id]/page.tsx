import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { products } from "@/db/schema";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdminPage } from "@/lib/session";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [p] = await requireDb().select().from(products).where(eq(products.id, id)).limit(1);
  if (!p) notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-h2">Edit {p.name}</h1>
      <ProductForm product={p} />
    </div>
  );
}
