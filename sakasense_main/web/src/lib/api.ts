/**
 * Base URL of the Django API (sakasense_main/mysite).
 * On Vercel (and under `vercel dev`) the `api` service binding injects SAKASENSE_API_URL; it is only
 * available at runtime inside functions, not at build time or in middleware.
 * The fallback is Django's `runserver` default for plain `npm run dev`.
 */
function apiBase(): string {
  const base = process.env.SAKASENSE_API_URL ?? "http://127.0.0.1:8000";
  return base.endsWith("/") ? base : `${base}/`;
}

/** Absolute URL for a Django API path, e.g. `apiUrl("api/dashboard/")`. */
export function apiUrl(path: string): URL {
  return new URL(path.replace(/^\//, ""), apiBase());
}
