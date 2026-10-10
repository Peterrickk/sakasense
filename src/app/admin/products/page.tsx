import type { Metadata } from "next";
import Link from "next/link";
import { asc } from "drizzle-orm";
import { requireDb } from "@/db";
import { products } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TD, TH, THead, TR } from "@/components/ui/table";
import { formatPHP } from "@/lib/money";
import { requireAdminPage } from "@/lib/session";
import { setStock, toggleProduct } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProducts() {
  await requireAdminPage();
  const list = await requireDb().select().from(products).orderBy(asc(products.sortOrder));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h2">Products</h1>
        <Button href="/admin/products/new">New product</Button>
      </div>
      <Table>
        <THead>
          <TR>
            <TH>Name</TH>
            <TH>Price</TH>
            <TH>Stock</TH>
            <TH>Active</TH>
            <TH>Featured</TH>
          </TR>
        </THead>
        <tbody>
          {list.map((p) => (
            <TR key={p.id}>
              <TD>
                <Link className="hover:text-primary font-medium" href={`/admin/products/${p.id}`}>
                  {p.name}
                </Link>
                <div className="text-text-muted font-mono text-xs">{p.slug}</div>
              </TD>
              <TD>
                {p.priceCentavos ? (
                  formatPHP(p.priceCentavos)
                ) : (
                  <Badge variant="warning">Not set</Badge>
                )}
              </TD>
              <TD>
                <form action={setStock} className="flex gap-2">
                  <input type="hidden" name="id" value={p.id} />
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    aria-label={`Stock for ${p.name}`}
                    className="h-9 w-24"
                  />
                  <Button size="sm" variant="secondary" type="submit">
                    Set
                  </Button>
                </form>
              </TD>
              {(["isActive", "isFeatured"] as const).map((f) => (
                <TD key={f}>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="field" value={f} />
                    <Button size="sm" variant={p[f] ? "primary" : "ghost"} type="submit">
                      {p[f] ? "On" : "Off"}
                    </Button>
                  </form>
                </TD>
              ))}
            </TR>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
