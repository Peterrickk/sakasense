import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/brand/misc";
import { Mdx } from "@/components/mdx";
import { siteConfig } from "@/config/site";
import { getAllNews, getNewsPost } from "@/lib/content";
import { visibleText } from "@/lib/placeholders";

export async function generateStaticParams() {
  return (await getAllNews()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: visibleText(post.meta.excerpt),
    alternates: { canonical: `/news/${slug}` },
  };
}

export default async function ArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();
  const { meta, content, headings } = post;
  const url = encodeURIComponent(`${siteConfig.url}/news/${slug}`);
  const title = encodeURIComponent(meta.title);

  return (
    <article className="container-page py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: meta.title },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_16rem]">
        <div className="max-w-3xl">
          <header className="mb-8">
            <time dateTime={meta.date} className="text-text-muted font-mono text-sm">
              {new Date(meta.date).toLocaleDateString("en-PH", { dateStyle: "long" })}
              {meta.author ? ` · ${meta.author}` : ""}
            </time>
            <h1 className="text-h2 mt-2">{meta.title}</h1>
          </header>
          <Mdx source={content} />
        </div>
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          {headings.length > 0 ? (
            <nav aria-label="Table of contents">
              <h2 className="mb-2 font-mono text-xs tracking-widest uppercase">On this page</h2>
              <ul className="space-y-1 text-sm">
                {headings.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                    <a href={`#${h.id}`} className="text-text-muted hover:text-primary">
                      {visibleText(h.text)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <div>
            <h2 className="mb-2 font-mono text-xs tracking-widest uppercase">Share</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <a
                  className="text-text-muted hover:text-primary"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  className="text-text-muted hover:text-primary"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
                >
                  X / Twitter
                </a>
              </li>
              <li>
                <a
                  className="text-text-muted hover:text-primary"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
