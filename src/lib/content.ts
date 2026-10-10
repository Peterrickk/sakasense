import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type NewsMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  author: string;
  tags: string[];
};

export type Heading = { id: string; text: string; level: 2 | 3 };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(source: string): Heading[] {
  return [...source.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => ({
    level: m[1].length as 2 | 3,
    text: m[2].trim(),
    id: slugifyHeading(m[2]),
  }));
}

function safeSlug(slug: string): string | null {
  return /^[a-z0-9-]+$/.test(slug) ? slug : null;
}

async function readMdx(dir: string, slug: string) {
  const safe = safeSlug(slug);
  if (!safe) return null;
  try {
    const raw = await fs.readFile(path.join(ROOT, dir, `${safe}.mdx`), "utf8");
    return matter(raw);
  } catch {
    return null;
  }
}

export async function getNewsPost(slug: string) {
  const file = await readMdx("news", slug);
  if (!file) return null;
  const d = file.data;
  const meta: NewsMeta = {
    slug,
    title: String(d.title ?? slug),
    date: String(d.date ?? ""),
    excerpt: String(d.excerpt ?? ""),
    cover: String(d.cover ?? ""),
    author: String(d.author ?? ""),
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
  };
  return { meta, content: file.content, headings: extractHeadings(file.content) };
}

export async function getAllNews(): Promise<NewsMeta[]> {
  const files = await fs.readdir(path.join(ROOT, "news")).catch(() => []);
  const posts = await Promise.all(
    files.filter((f) => f.endsWith(".mdx")).map((f) => getNewsPost(f.replace(/\.mdx$/, ""))),
  );
  return posts
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => p.meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getLegalDoc(slug: string) {
  const file = await readMdx("legal", slug);
  if (!file) return null;
  return {
    title: String(file.data.title ?? slug),
    updated: String(file.data.updated ?? ""),
    content: file.content,
  };
}

export const LEGAL_SLUGS = ["privacy", "terms", "shipping-returns", "warranty"] as const;
