"use server";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { sendEmail } from "@/lib/email/send";
import { NewsletterConfirmEmail } from "@/lib/email/templates";
import { rateLimitIp } from "@/lib/rate-limit";
import { fieldErrors, newsletterSchema } from "@/lib/validators";
import { siteConfig } from "@/config/site";
import type { FormState } from "@/server/form-state";

export async function subscribeNewsletter(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    // A filled honeypot gets a fake success so bots learn nothing.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) return { ok: true };
    return { ok: false, errors: fieldErrors(parsed.error) };
  }
  if (!(await rateLimitIp("newsletter", 5, 10 * 60_000))) {
    return { ok: false, message: "Too many attempts. Please try again in a few minutes." };
  }
  const db = getDb();
  if (!db) return { ok: false, message: "Sign-ups are not available right now." };

  const { email } = parsed.data;
  const [existing] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);
  if (existing?.confirmed) return { ok: true, message: "You are already subscribed." };

  const token = randomBytes(24).toString("hex");
  if (existing) {
    await db
      .update(newsletterSubscribers)
      .set({ token })
      .where(eq(newsletterSubscribers.id, existing.id));
  } else {
    await db.insert(newsletterSubscribers).values({ email, token });
  }
  await sendEmail({
    to: email,
    subject: "Confirm your SakaSense subscription",
    react: NewsletterConfirmEmail({
      confirmUrl: `${siteConfig.url}/newsletter/confirm?token=${token}`,
    }),
  });
  return { ok: true, message: "Check your inbox to confirm your subscription." };
}
