import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Money is always stored as integer centavos (₱1.00 = 100). Never use floats for money.

export const productCategory = pgEnum("product_category", [
  "device",
  "bundle",
  "accessory",
  "subscription",
]);
export const userRole = pgEnum("user_role", ["customer", "admin"]);
export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);
export const paymentProvider = pgEnum("payment_provider", ["paymongo", "stripe", "cod"]);
export const inquiryType = pgEnum("inquiry_type", ["contact", "quote"]);
export const inquiryStatus = pgEnum("inquiry_status", ["new", "in_progress", "closed"]);

export type ProductImage = { url: string; alt: string };
export type ProductSpec = { label: string; value: string };

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description"), // markdown
  category: productCategory("category").notNull(),
  /** 0 means the price is not set yet ("Price coming soon", not purchasable). */
  priceCentavos: integer("price_centavos").notNull(),
  compareAtCentavos: integer("compare_at_centavos"),
  currency: text("currency").notNull().default("PHP"),
  sku: text("sku").unique(),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  images: jsonb("images")
    .$type<ProductImage[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  specs: jsonb("specs")
    .$type<ProductSpec[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  inTheBox: jsonb("in_the_box")
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'::jsonb`),
  connectivity: jsonb("connectivity").$type<{ bluetooth?: string; wifi?: string }>(),
  guideUrl: text("guide_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ---- Better Auth tables (names/fields follow Better Auth's core schema) ----
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: userRole("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ShippingAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  postalCode: string;
  country: string;
};

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  barangay: text("barangay").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  region: text("region").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull().default("PH"),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(), // e.g. SKS-2026-000123
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // null = guest
  email: text("email").notNull(),
  phone: text("phone"),
  status: orderStatus("status").notNull().default("pending"),
  subtotalCentavos: integer("subtotal_centavos").notNull(),
  shippingCentavos: integer("shipping_centavos").notNull(),
  discountCentavos: integer("discount_centavos").notNull().default(0),
  totalCentavos: integer("total_centavos").notNull(),
  currency: text("currency").notNull().default("PHP"),
  shippingAddress: jsonb("shipping_address").$type<ShippingAddress>().notNull(), // snapshot
  shippingMethod: text("shipping_method"),
  paymentProvider: paymentProvider("payment_provider").notNull(),
  paymentRef: text("payment_ref"),
  trackingNumber: text("tracking_number"),
  courier: text("courier"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  nameSnapshot: text("name_snapshot").notNull(),
  unitPriceCentavos: integer("unit_price_centavos").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotalCentavos: integer("line_total_centavos").notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: inquiryType("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  orgType: text("org_type"),
  topic: text("topic"),
  units: integer("units"),
  hectares: text("hectares"),
  region: text("region"),
  message: text("message"),
  status: inquiryStatus("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  confirmed: boolean("confirmed").notNull().default(false),
  token: text("token"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
