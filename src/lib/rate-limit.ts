import { headers } from "next/headers";

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

/**
 * Sliding-window limiter. In-memory, so it is per server instance: good enough to stop casual
 * spam, but for strict limits on Vercel back it with Redis/Upstash or the database.
 * Returns true if the call is allowed.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  // Opportunistic cleanup so the map cannot grow forever.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (b.hits.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Convenience: rate-limit the current request's IP under a named scope. */
export async function rateLimitIp(scope: string, limit: number, windowMs: number) {
  return rateLimit(`${scope}:${await clientIp()}`, limit, windowMs);
}

export function resetRateLimits() {
  buckets.clear();
}
