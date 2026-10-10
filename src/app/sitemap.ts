import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllNews } from "@/lib/content";
import { getProducts } from "@/server/queries/products";

const staticRoutes = [
  "",
  "/products",
  "/how-it-works",
  "/solutions",
  "/ecosystem",
  "/about",
  "/about/leadership",
  "/news",
  "/faq",
  "/contact",
  "/quote",
  "/orders/track",
  "/legal/privacy",
  "/legal/terms",
  "/legal/shipping-returns",
  "/legal/warranty",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, news] = await Promise.all([getProducts(), getAllNews()]);
  const base = siteConfig.url;
  return [
    ...staticRoutes.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
    })),
    ...news.map((n) => ({ url: `${base}/news/${n.slug}`, lastModified: n.date })),
  ];
}
