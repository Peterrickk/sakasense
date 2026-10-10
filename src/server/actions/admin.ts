"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireDb } from "@/db";
import { inquiries, orders, products } from "@/db/schema";
import { assertAdmin } from "@/lib/session";
import { fieldErrors } from "@/lib/validators";
import { sendShippedEmail } from "@/server/orders";
import type { FormState } from "@/server/form-state";

// SECURITY: every exported function here must start with `await assertAdmin()`.
// Server actions are public POST endpoints, so hiding the admin UI is not enough.

const uuid = z.uuid();

const productSchema = z.object({
  id: z.uuid().optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only")
    .min(2)
    .max(80),
  name: z.string().trim().min(2).max(120),
  tagline: z.string().trim().max(200).optional(),
  description: z.string().trim().max(10000).optional(),
  category: z.enum(["device", "bundle", "accessory", "subscription"]),
  pricePesos: z.coerce.number().min(0).max(10_000_000),
  comparePesos: z.coerce.number().min(0).max(10_000_000).optional(),
  sku: z.string().trim().max(60).optional(),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  sortOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  guideUrl: z.url().optional().or(z.literal("")),
  images: z.string().default(""), // one "url | alt" per line
  inTheBox: z.string().default(""), // one item per line
  specs: z.string().default("[]"), // JSON [{label,value}]
  bluetooth: z.string().trim().max(500).optional(),
  wifi: z.string().trim().max(500).optional(),
});

const specsSchema = z.array(
  z.object({ label: z.string().trim().min(1), value: z.string().trim() }),
);

function lines(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const raw = Object.fromEntries(formData) as Record<string, FormDataEntryValue>;
  for (const k of [
    "id",
    "comparePesos",
    "tagline",
    "description",
    "sku",
    "bluetooth",
    "wifi",
    "guideUrl",
  ]) {
    if (raw[k] === "") delete raw[k];
  }
  const parsed = productSchema.safeParse({
    ...raw,
    isActive: undefined,
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  let specs: z.infer<typeof specsSchema>;
  try {
    specs = specsSchema.parse(JSON.parse(d.specs));
  } catch {
    return { ok: false, errors: { specs: "Specs are invalid" } };
  }

  const values = {
    slug: d.slug,
    name: d.name,
    tagline: d.tagline ?? null,
    description: d.description ?? null,
    category: d.category,
    priceCentavos: Math.round(d.pricePesos * 100),
    compareAtCentavos: d.comparePesos ? Math.round(d.comparePesos * 100) : null,
    sku: d.sku ?? null,
    stock: d.stock,
    sortOrder: d.sortOrder,
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    guideUrl: d.guideUrl || null,
    images: lines(d.images).map((l) => {
      const [url, alt] = l.split("|").map((s) => s.trim());
      return { url, alt: alt || d.name };
    }),
    inTheBox: lines(d.inTheBox),
    specs,
    connectivity: d.bluetooth || d.wifi ? { bluetooth: d.bluetooth, wifi: d.wifi } : null,
    updatedAt: new Date(),
  };

  const db = requireDb();
  try {
    if (d.id) await db.update(products).set(values).where(eq(products.id, d.id));
    else await db.insert(products).values(values);
  } catch (err) {
    if ((err as { code?: string }).code === "23505") {
      return { ok: false, errors: { slug: "That slug or SKU is already used" } };
    }
    throw err;
  }
  revalidatePath("/products");
  revalidatePath(`/products/${d.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/products");
  return { ok: true, message: "Product saved." };
}

export async function toggleProduct(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = uuid.parse(formData.get("id"));
  const field = z.enum(["isActive", "isFeatured"]).parse(formData.get("field"));
  const db = requireDb();
  const [p] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!p) return;
  await db
    .update(products)
    .set({ [field]: !p[field], updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/products");
  revalidatePath(`/products/${p.slug}`);
  revalidatePath("/");
  revalidatePath("/admin/products");
}

export async function setStock(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = uuid.parse(formData.get("id"));
  const stock = z.coerce.number().int().min(0).max(1_000_000).parse(formData.get("stock"));
  await requireDb()
    .update(products)
    .set({ stock, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

const orderUpdateSchema = z.object({
  id: z.uuid(),
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  courier: z.string().trim().max(80).optional(),
  trackingNumber: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function updateOrder(formData: FormData): Promise<void> {
  await assertAdmin();
  const raw = Object.fromEntries(formData) as Record<string, FormDataEntryValue>;
  for (const k of ["courier", "trackingNumber", "notes"]) if (raw[k] === "") delete raw[k];
  const d = orderUpdateSchema.parse(raw);

  const db = requireDb();
  const [before] = await db.select().from(orders).where(eq(orders.id, d.id)).limit(1);
  if (!before) return;
  const [after] = await db
    .update(orders)
    .set({
      status: d.status,
      courier: d.courier ?? null,
      trackingNumber: d.trackingNumber ?? null,
      notes: d.notes ?? null,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, d.id))
    .returning();

  // Moving an order to "shipped" triggers the shipped email (once, on the transition).
  if (before.status !== "shipped" && after.status === "shipped") await sendShippedEmail(after);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${d.id}`);
  redirect(`/admin/orders/${d.id}`);
}

export async function setInquiryStatus(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = uuid.parse(formData.get("id"));
  const status = z.enum(["new", "in_progress", "closed"]).parse(formData.get("status"));
  await requireDb().update(inquiries).set({ status }).where(eq(inquiries.id, id));
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}
