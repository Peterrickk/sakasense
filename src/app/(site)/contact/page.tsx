import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/brand/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { isPlaceholder } from "@/components/placeholder";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with the SakaSense team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = siteConfig.contact;
  const rows = [
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    { icon: Phone, label: "Phone", value: c.phone, href: `tel:${c.phoneTel}` },
    { icon: MapPin, label: "Address", value: c.address },
    { icon: Clock, label: "Office hours", value: c.hours },
  ].filter((r) => !isPlaceholder(r.value));

  return (
    <div className="container-page py-14">
      <SectionHeading as="h1" eyebrow="Contact" title="Talk to the SakaSense team" />
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard className="p-6 md:p-8">
          <ContactForm />
        </GlassCard>
        <aside className="space-y-4">
          {rows.length > 0 ? (
            <GlassCard className="space-y-4">
              {rows.map((r) => (
                <div key={r.label} className="flex gap-3">
                  <r.icon className="text-primary mt-1 size-5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-text-muted font-mono text-xs uppercase">{r.label}</p>
                    {r.href ? (
                      <a href={r.href} className="hover:text-primary">
                        {r.value}
                      </a>
                    ) : (
                      <p>{r.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </GlassCard>
          ) : null}
          <div className="border-border rounded-card overflow-hidden border">
            <iframe
              title={`Map: ${c.address}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapQuery)}&output=embed`}
              className="block aspect-[4/3] w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.7)]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <GlassCard>
            <p className="text-text-muted text-sm">
              Looking to buy 10+ units? Our{" "}
              <a className="text-primary underline" href="/quote">
                bulk quote form
              </a>{" "}
              gets you pricing fastest.
            </p>
          </GlassCard>
        </aside>
      </div>
    </div>
  );
}
