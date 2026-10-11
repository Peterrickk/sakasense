/**
 * Links between the SakaSense dashboard and the main SakaSense website.
 * Both are served from one domain on Vercel (dashboard under /app), so the default is same-origin.
 * Use plain <a> for these, not next/link, or basePath gets prepended. Override for local dev.
 */
export const MAIN_SITE_URL = (process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "").replace(/\/$/, "");

export const mainSite = {
  home: MAIN_SITE_URL || "/",
  device: `${MAIN_SITE_URL}/products/sakasense-device`,
  app: `${MAIN_SITE_URL}/ecosystem#mobile-app`,
  guidebook: `${MAIN_SITE_URL}/ecosystem#guidebook`,
  contact: `${MAIN_SITE_URL}/contact`,
  privacy: `${MAIN_SITE_URL}/legal/privacy`,
  terms: `${MAIN_SITE_URL}/legal/terms`,
};
