import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Db = PostgresJsDatabase<typeof schema>;

let db: Db | null | undefined;

/** True when a database is configured. Without one the public site serves seed data. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Returns the shared Drizzle client, or null when DATABASE_URL is not set. */
export function getDb(): Db | null {
  if (db !== undefined) return db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    db = null;
    return db;
  }
  const client = postgres(url, { max: 5, prepare: false });
  db = drizzle(client, { schema });
  return db;
}

/** Like getDb but throws a clear error for code paths that cannot work without a database. */
export function requireDb(): Db {
  const d = getDb();
  if (!d) throw new Error("DATABASE_URL is not set. Add it to .env.local to use this feature.");
  return d;
}

export { schema };
