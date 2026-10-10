import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";
import { getLegalDoc, LEGAL_SLUGS } from "@/lib/content";
import { visibleText } from "@/lib/placeholders";

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getLegalDoc(slug);
  return doc ? { title: doc.title, alternates: { canonical: `/legal/${slug}` } } : {};
}

export default async function LegalPage({ params }: PageProps<"/legal/[slug]">) {
  const { slug } = await params;
  const doc = await getLegalDoc(slug);
  if (!doc) notFound();
  const updated = visibleText(doc.updated);
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-h2 mb-2">{doc.title}</h1>
      {updated ? (
        <p className="text-text-muted mb-8 font-mono text-sm">Last updated: {updated}</p>
      ) : null}
      <Mdx source={doc.content} />
    </div>
  );
}
