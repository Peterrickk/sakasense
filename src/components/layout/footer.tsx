import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "@/components/brand/social-icons";
import { Logo } from "@/components/brand/logo";
import { footerNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { NewsletterForm } from "./newsletter-form";
import { Placeholder } from "@/components/placeholder";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
} as const;

export function Footer() {
  const socials = Object.entries(siteConfig.socials).filter(([, url]) => url);
  return (
    <footer className="border-border bg-surface mt-24 border-t">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="space-y-4">
            <Logo />
            <p className="text-text-muted max-w-xs text-sm">
              {siteConfig.tagline}. Know your soil, grow with confidence.
            </p>
            <NewsletterForm />
            {socials.length > 0 ? (
              <div className="flex gap-3">
                {socials.map(([name, url]) => {
                  const Icon = socialIcons[name as keyof typeof socialIcons];
                  return (
                    <a
                      key={name}
                      href={url}
                      aria-label={name}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="text-text-muted hover:text-primary"
                    >
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
          {Object.entries(footerNav).map(([title, links]) => (
            <nav key={title} aria-label={title}>
              <h2 className="text-text mb-3 font-mono text-xs tracking-widest uppercase">
                {title}
              </h2>
              <ul className="space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-primary"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-text-muted hover:text-primary">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <address className="text-text-muted border-border mt-10 grid gap-1 border-t pt-6 text-sm not-italic sm:grid-cols-3">
          <span>
            <Placeholder value={siteConfig.contact.address} />
          </span>
          <span>
            <Placeholder value={siteConfig.contact.email} />
          </span>
          <span>
            <a href={`tel:${siteConfig.contact.phoneTel}`} className="hover:text-primary">
              {siteConfig.contact.phone}
            </a>
          </span>
        </address>
        <p className="text-text-muted mt-6 text-sm">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
