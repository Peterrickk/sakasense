import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireDb } from "@/db";
import { inquiries } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/session";
import { setInquiryStatus } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Inquiries" };

export default async function AdminInquiries() {
  await requireAdminPage();
  const list = await requireDb()
    .select()
    .from(inquiries)
    .orderBy(desc(inquiries.createdAt))
    .limit(200);
  return (
    <div className="space-y-6">
      <h1 className="text-h2">Inquiries</h1>
      {list.length === 0 ? <p className="text-text-muted">No inquiries yet.</p> : null}
      <ul className="space-y-4">
        {list.map((q) => (
          <li key={q.id}>
            <GlassCard className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={q.type === "quote" ? "accent" : "default"}>{q.type}</Badge>
                <strong>{q.name}</strong>
                <a className="text-primary text-sm" href={`mailto:${q.email}`}>
                  {q.email}
                </a>
                {q.phone ? <span className="text-text-muted text-sm">{q.phone}</span> : null}
                <time
                  className="text-text-muted ml-auto text-xs"
                  dateTime={q.createdAt.toISOString()}
                >
                  {q.createdAt.toLocaleString("en-PH")}
                </time>
              </div>
              {q.type === "quote" ? (
                <p className="text-sm">
                  {q.organization} ({q.orgType}) · {q.region} · {q.units} units
                  {q.hectares ? ` · ${q.hectares} ha` : ""}
                </p>
              ) : q.topic ? (
                <p className="text-sm">Topic: {q.topic}</p>
              ) : null}
              {q.message ? (
                <p className="text-text-muted text-sm whitespace-pre-line">{q.message}</p>
              ) : null}
              <form action={setInquiryStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={q.id} />
                <Select
                  name="status"
                  defaultValue={q.status}
                  aria-label="Status"
                  className="h-9 w-40"
                >
                  <option value="new">new</option>
                  <option value="in_progress">in_progress</option>
                  <option value="closed">closed</option>
                </Select>
                <Button size="sm" variant="secondary" type="submit">
                  Update
                </Button>
              </form>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
