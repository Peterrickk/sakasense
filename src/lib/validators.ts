import { z } from "zod";

const phone = z
  .string()
  .trim()
  .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number");

const optionalPhone = z
  .string()
  .trim()
  .optional()
  .transform((v) => v || undefined)
  .pipe(phone.optional());

/** Honeypot: real people leave it empty. */
const honeypot = z.string().max(0).optional();

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  website: honeypot,
});

export const contactTopics = ["General", "Sales", "Support", "Partnership", "Media"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: optionalPhone,
  topic: z.enum(contactTopics, { message: "Choose a topic" }),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(4000),
  website: honeypot,
});

export const orgTypes = ["Cooperative", "LGU", "Agribusiness", "Research", "Other"] as const;

export const quoteSchema = z.object({
  organization: z.string().trim().min(2, "Enter your organization").max(150),
  orgType: z.enum(orgTypes, { message: "Choose an organization type" }),
  name: z.string().trim().min(2, "Enter a contact person").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: optionalPhone,
  region: z.string().trim().min(2, "Enter your region or province").max(100),
  units: z.coerce.number().int("Whole numbers only").min(1, "At least 1 unit").max(100000),
  hectares: z.string().trim().max(50).optional(),
  message: z.string().trim().max(4000).optional(),
  website: honeypot,
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().trim().toUpperCase().min(5, "Enter your order number"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const shippingMethods = ["standard", "express"] as const;
export const paymentMethods = ["gcash", "maya", "card", "stripe", "cod"] as const;

export const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's name").max(100),
  phone,
  line1: z.string().trim().min(3, "Enter a street address").max(200),
  line2: z.string().trim().max(200).optional(),
  barangay: z.string().trim().min(2, "Enter a barangay").max(100),
  city: z.string().trim().min(2, "Enter a city or municipality").max(100),
  province: z.string().trim().min(2, "Enter a province").max(100),
  region: z.string().trim().min(2, "Enter a region").max(100),
  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{4}$/, "Enter a 4-digit postal code"),
  country: z.string().default("PH"),
});

export const checkoutSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone,
  address: addressSchema,
  shippingMethod: z.enum(shippingMethods),
  paymentMethod: z.enum(paymentMethods),
  /** Only ids and quantities are trusted from the client. Prices are recomputed on the server. */
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1, "Your cart is empty")
    .max(50),
  notes: z.string().trim().max(500).optional(),
});

export const checkoutFormSchema = checkoutSchema.omit({ items: true });

export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;

/** Flattens Zod issues to { field: firstMessage } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}
