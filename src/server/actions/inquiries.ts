"use server";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { sendEmail, teamInbox } from "@/lib/email/send";
import { AutoReplyEmail, InternalAlertEmail } from "@/lib/email/templates";
import { rateLimitIp } from "@/lib/rate-limit";
import { contactSchema, fieldErrors, quoteSchema } from "@/lib/validators";
import type { FormState } from "@/server/form-state";

const LIMIT = 5;
const WINDOW = 10 * 60_000;

function isHoneypot(error: { issues: { path: PropertyKey[] }[] }) {
  return error.issues.some((i) => i.path[0] === "website");
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    if (isHoneypot(parsed.error)) return { ok: true, message: "Thanks! We'll be in touch." };
    return { ok: false, errors: fieldErrors(parsed.error) };
  }
  if (!(await rateLimitIp("inquiry", LIMIT, WINDOW))) {
    return { ok: false, message: "Too many submissions. Please try again in a few minutes." };
  }
  const db = getDb();
  if (!db)
    return { ok: false, message: "We can't take messages right now. Please email us instead." };

  const d = parsed.data;
  await db.insert(inquiries).values({
    type: "contact",
    name: d.name,
    email: d.email,
    phone: d.phone,
    topic: d.topic,
    message: d.message,
  });

  const team = teamInbox();
  if (team) {
    await sendEmail({
      to: team,
      subject: `New ${d.topic} message`,
      react: InternalAlertEmail({
        title: `New ${d.topic} message`,
        rows: [
          ["Name", d.name],
          ["Email", d.email],
          ["Phone", d.phone ?? "-"],
          ["Message", d.message],
        ],
      }),
    });
  }
  await sendEmail({
    to: d.email,
    subject: "We got your message",
    react: AutoReplyEmail({ name: d.name, kind: "contact" }),
  });
  return { ok: true, message: "Thanks! We'll be in touch soon." };
}

export async function submitQuote(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = quoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    if (isHoneypot(parsed.error))
      return { ok: true, message: "Thanks! We'll send your quote soon." };
    return { ok: false, errors: fieldErrors(parsed.error) };
  }
  if (!(await rateLimitIp("inquiry", LIMIT, WINDOW))) {
    return { ok: false, message: "Too many submissions. Please try again in a few minutes." };
  }
  const db = getDb();
  if (!db)
    return { ok: false, message: "We can't take requests right now. Please email us instead." };

  const d = parsed.data;
  await db.insert(inquiries).values({
    type: "quote",
    name: d.name,
    email: d.email,
    phone: d.phone,
    organization: d.organization,
    orgType: d.orgType,
    units: d.units,
    hectares: d.hectares,
    region: d.region,
    message: d.message,
  });

  const team = teamInbox();
  if (team) {
    await sendEmail({
      to: team,
      subject: `New quote request: ${d.organization}`,
      react: InternalAlertEmail({
        title: "New quote request",
        rows: [
          ["Organization", `${d.organization} (${d.orgType})`],
          ["Contact", `${d.name} <${d.email}>`],
          ["Region", d.region],
          ["Units", String(d.units)],
          ["Hectares", d.hectares ?? "-"],
          ["Message", d.message ?? "-"],
        ],
      }),
    });
  }
  await sendEmail({
    to: d.email,
    subject: "We received your quote request",
    react: AutoReplyEmail({ name: d.name, kind: "quote" }),
  });
  return { ok: true, message: "Thanks! We'll send your quote soon." };
}
