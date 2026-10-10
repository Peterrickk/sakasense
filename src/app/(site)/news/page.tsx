import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/brand/section-heading";
import { EmptyState } from "@/components/brand/misc";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { getAllNews } from "@/lib/content";
import { visibleText } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "News",
  description: "News and updates from SakaSense.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const posts = await getAllNews();
  return (
    <div className="container-page py-14">
      <SectionHeading as="h1" eyebrow="News" title="Latest from SakaSense" />
      {posts.length === 0 ? (
        <EmptyState title="No news yet" description="Check back soon." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/news/${p.slug}`} className="block">
              <GlassCard hover className="h-full space-y-3">
                <time dateTime={p.date} className="text-text-muted font-mono text-xs">
                  {new Date(p.date).toLocaleDateString("en-PH", { dateStyle: "long" })}
                </time>
                <h2 className="text-h3">{p.title}</h2>
                <p className="text-text-muted text-sm">{visibleText(p.excerpt)}</p>
                <div className="flex gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
