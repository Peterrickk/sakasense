import "server-only";
import { Resend } from "resend";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { getEnv } from "@/lib/env";

type SendArgs = { to: string; subject: string; react: ReactElement };

/**
 * Sends a React Email template via Resend. Never throws: a failed email must not fail an order
 * or form submission. Without RESEND_API_KEY (local dev) the send is skipped and logged.
 * Logs never include recipient addresses or message bodies (no PII in logs).
 */
export async function sendEmail({ to, subject, react }: SendArgs): Promise<boolean> {
  const env = getEnv();
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.info(`[email] skipped (Resend not configured): "${subject}"`);
    return false;
  }
  try {
    const resend = new Resend(env.RESEND_API_KEY);
    const html = await render(react);
    const { error } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html });
    if (error) {
      console.error(`[email] failed: "${subject}" — ${error.name}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[email] error: "${subject}" — ${err instanceof Error ? err.name : "unknown"}`);
    return false;
  }
}

/** Address that receives internal alerts (new orders, inquiries). */
export function teamInbox(): string | undefined {
  return getEnv().ADMIN_EMAIL;
}
