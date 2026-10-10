import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: optionalString,
  BETTER_AUTH_SECRET: optionalString,
  BETTER_AUTH_URL: optionalString,
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
  PAYMONGO_SECRET_KEY: optionalString,
  PAYMONGO_WEBHOOK_SECRET: optionalString,
  STRIPE_SECRET_KEY: optionalString,
  STRIPE_WEBHOOK_SECRET: optionalString,
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  ADMIN_EMAIL: optionalString,
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

/** Variables that must exist when the app runs for real customers. */
const REQUIRED_IN_PRODUCTION = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "ADMIN_EMAIL",
] as const;

export type Env = z.infer<typeof baseSchema>;

let cached: Env | undefined;

/**
 * Validates process.env once, on first server-side use (not at import time, so
 * `next build` of static pages does not need secrets). Throws a clear error
 * listing every missing or invalid variable.
 */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = baseSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
  }
  const env = parsed.data;
  if (env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    const missing = REQUIRED_IN_PRODUCTION.filter((k) => !env[k]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. See .env.example.`,
      );
    }
  }
  cached = env;
  return env;
}

/** Test helper. */
export function resetEnvCache() {
  cached = undefined;
}
