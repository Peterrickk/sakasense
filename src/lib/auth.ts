import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, schema } from "@/db";
import { getEnv } from "@/lib/env";
import { sendEmail } from "@/lib/email/send";
import { VerifyEmail } from "@/lib/email/templates";

function create() {
  const db = getDb();
  if (!db) return null;
  const env = getEnv();
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_SITE_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Verify your SakaSense email",
          react: VerifyEmail({ verifyUrl: url }),
        });
      },
    },
    socialProviders:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } }
        : {},
    user: {
      additionalFields: {
        // input: false means a client can never set its own role.
        role: { type: "string", defaultValue: "customer", input: false },
      },
    },
    plugins: [nextCookies()],
  });
}

type Auth = NonNullable<ReturnType<typeof create>>;
let instance: Auth | null | undefined;

/** Returns the Better Auth instance, or null when no database is configured. */
export function getAuth(): Auth | null {
  if (instance === undefined) instance = create();
  return instance;
}
