/**
 * Seeds the 5 placeholder products and one admin user.
 *   npm run db:seed
 * Env: DATABASE_URL (required), ADMIN_EMAIL (required), ADMIN_PASSWORD (optional; a random one is
 * generated and printed once if omitted), SEED_DEMO_PRICES=true (dev only: fills demo prices/stock
 * so the checkout can be tested).
 */
import { randomBytes } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { demoPrices, placeholderProducts } from "./seed-data";
import * as schema from "./schema";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* file not present */
  }
}

async function main() {
  const url = process.env.DATABASE_URL;
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!url) throw new Error("DATABASE_URL is required to seed.");
  if (!adminEmail) throw new Error("ADMIN_EMAIL is required to seed the admin user.");

  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  const useDemo = process.env.SEED_DEMO_PRICES === "true";
  if (useDemo && process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed demo prices in production.");
  }

  for (const p of placeholderProducts) {
    const demo = useDemo ? demoPrices[p.slug] : undefined;
    const row = { ...p, ...(demo ?? {}) };
    await db
      .insert(schema.products)
      .values(row)
      .onConflictDoUpdate({
        target: schema.products.slug,
        // Re-seeding refreshes copy but never overwrites price/stock the owner has set.
        set: {
          name: row.name,
          tagline: row.tagline,
          category: row.category,
          updatedAt: new Date(),
        },
      });
  }
  console.log(`Seeded ${placeholderProducts.length} products.`);

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, adminEmail))
    .limit(1);

  if (!existing) {
    const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET ?? randomBytes(16).toString("hex"),
      baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
      database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
          user: schema.users,
          session: schema.sessions,
          account: schema.accounts,
          verification: schema.verifications,
        },
      }),
      emailAndPassword: { enabled: true },
    });
    const password = process.env.ADMIN_PASSWORD ?? randomBytes(12).toString("base64url");
    await auth.api.signUpEmail({ body: { email: adminEmail, password, name: "SakaSense Admin" } });
    if (!process.env.ADMIN_PASSWORD) {
      console.log(`Generated admin password (shown once, change it): ${password}`);
    }
  }
  await db
    .update(schema.users)
    .set({ role: "admin", emailVerified: true })
    .where(eq(schema.users.email, adminEmail));
  console.log(`Admin user ready: ${adminEmail}`);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
