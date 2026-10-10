/** Links between the SakaSense dashboard and the main SakaSense website. Set via env in production. */
export const MAIN_SITE_URL = (process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const mainSite = {
  home: MAIN_SITE_URL,
  device: `${MAIN_SITE_URL}/products/sakasense-device`,
  app: `${MAIN_SITE_URL}/ecosystem#mobile-app`,
  guidebook: `${MAIN_SITE_URL}/ecosystem#guidebook`,
  contact: `${MAIN_SITE_URL}/contact`,
  privacy: `${MAIN_SITE_URL}/legal/privacy`,
  terms: `${MAIN_SITE_URL}/legal/terms`,
};
