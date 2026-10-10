import { and, asc, desc, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { placeholderProducts } from "@/db/seed-data";
import { products, type Product } from "@/db/schema";
import { visibleText } from "@/lib/placeholders";

export type ProductSort = "featured" | "price-asc" | "price-desc";
export type ProductCategory = Product["category"];

export const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "device", label: "Devices" },
  { value: "bundle", label: "Bundles" },
  { value: "accessory", label: "Accessories" },
  { value: "subscription", label: "Subscriptions" },
];

/** Seed data as full Product rows, used when no database is configured (local preview). */
function fallbackProducts(): Product[] {
  const now = new Date(0);
  return placeholderProducts.map((p, i) => ({
    id: `seed-${p.slug}`,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? null,
    description: p.description ?? null,
    category: p.category,
    priceCentavos: p.priceCentavos,
    compareAtCentavos: null,
    currency: "PHP",
    sku: p.sku ?? null,
    stock: p.stock ?? 0,
    isActive: true,
    isFeatured: p.isFeatured ?? false,
    images: p.images ?? [],
    specs: p.specs ?? [],
    inTheBox: p.inTheBox ?? [],
    connectivity: p.connectivity ?? null,
    guideUrl: null,
    sortOrder: p.sortOrder ?? i,
    createdAt: now,
    updatedAt: now,
  }));
}

/** In production, strips [PLACEHOLDER] markers so none reach customers (including the client payload). */
function publicProduct(p: Product): Product {
  return {
    ...p,
    description: p.description ? visibleText(p.description) : p.description,
    specs: p.specs
      .map((x) => ({ label: x.label, value: visibleText(x.value) }))
      .filter((x) => x.value),
    inTheBox: p.inTheBox.map(visibleText).filter(Boolean),
  };
}

function sortList(list: Product[], sort: ProductSort): Product[] {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.priceCentavos - b.priceCentavos);
  else if (sort === "price-desc") copy.sort((a, b) => b.priceCentavos - a.priceCentavos);
  else
    copy.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.sortOrder - b.sortOrder);
  return copy;
}

export async function getProducts(
  opts: {
    category?: ProductCategory;
    sort?: ProductSort;
  } = {},
): Promise<Product[]> {
  const { category, sort = "featured" } = opts;
  const db = getDb();
  if (!db) {
    const list = fallbackProducts().filter((p) => !category || p.category === category);
    return sortList(list, sort).map(publicProduct);
  }
  const where = category
    ? and(eq(products.isActive, true), eq(products.category, category))
    : eq(products.isActive, true);
  const order =
    sort === "price-asc"
      ? [asc(products.priceCentavos)]
      : sort === "price-desc"
        ? [desc(products.priceCentavos)]
        : [desc(products.isFeatured), asc(products.sortOrder)];
  const rows = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(...order);
  return rows.map(publicProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb();
  if (!db) {
    const p = fallbackProducts().find((x) => x.slug === slug);
    return p ? publicProduct(p) : null;
  }
  const [row] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return row ? publicProduct(row) : null;
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const db = getDb();
  if (!db)
    return sortList(
      fallbackProducts().filter((p) => p.isFeatured),
      "featured",
    )
      .slice(0, limit)
      .map(publicProduct);
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
  return rows.map(publicProduct);
}

export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const db = getDb();
  if (!db) {
    return fallbackProducts()
      .filter((p) => p.slug !== product.slug)
      .slice(0, limit)
      .map(publicProduct);
  }
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true), ne(products.id, product.id)))
    .orderBy(asc(products.sortOrder))
    .limit(limit);
  return rows.map(publicProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return (await getProducts()).map((p) => p.slug);
}

/** A product can be bought only with a real price and stock. */
export function isPurchasable(p: Pick<Product, "priceCentavos" | "stock">): boolean {
  return p.priceCentavos > 0 && p.stock > 0;
}
