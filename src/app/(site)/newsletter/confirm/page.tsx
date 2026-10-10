import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Confirm subscription", robots: { index: false } };

export default async function ConfirmNewsletter({
  searchParams,
}: PageProps<"/newsletter/confirm">) {
  const { token } = await searchParams;
  const db = getDb();
  let ok = false;
  if (db && typeof token === "string" && token.length > 10) {
    const updated = await db
      .update(newsletterSubscribers)
      .set({ confirmed: true, token: null })
      .where(eq(newsletterSubscribers.token, token))
      .returning({ id: newsletterSubscribers.id });
    ok = updated.length > 0;
  }
  return (
    <section className="container-page py-24 text-center">
      <h1 className="text-h2">{ok ? "You're subscribed" : "That link didn't work"}</h1>
      <p className="text-text-muted mx-auto mt-4 max-w-md">
        {ok
          ? "Thanks for confirming. We'll keep you posted on SakaSense news."
          : "The confirmation link is invalid or already used."}
      </p>
      <Button href="/" className="mt-8">
        Back to home
      </Button>
    </section>
  );
}
