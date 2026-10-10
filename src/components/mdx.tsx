import { MDXRemote } from "next-mdx-remote/rsc";
import { slugifyHeading } from "@/lib/content";
import { visibleText } from "@/lib/placeholders";

function textOf(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(textOf).join("");
  return "";
}

const components = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 id={slugifyHeading(textOf(children))}>{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 id={slugifyHeading(textOf(children))}>{children}</h3>
  ),
};

/** Server-rendered MDX. In production, [PLACEHOLDER] markers are stripped from the source. */
export function Mdx({ source }: { source: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote source={visibleText(source)} components={components} />
    </div>
  );
}
