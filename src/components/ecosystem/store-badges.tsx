import { Apple, Play } from "lucide-react";
import { siteConfig } from "@/config/site";
import { EcosystemLink } from "./ecosystem-link";
import { isPlaceholder } from "@/components/placeholder";
import { cn } from "@/lib/utils";

/** App Store / Google Play buttons. Shows a disabled "Coming soon" until real listing URLs are set. */
export function StoreBadges({ className }: { className?: string }) {
  const stores = [
    {
      name: "App Store",
      sub: "Download on the",
      href: siteConfig.links.appStore,
      Icon: Apple,
      key: "app_store",
    },
    {
      name: "Google Play",
      sub: "Get it on",
      href: siteConfig.links.playStore,
      Icon: Play,
      key: "play_store",
    },
  ];
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {stores.map(({ name, sub, href, Icon, key }) =>
        isPlaceholder(href) ? (
          <span
            key={key}
            aria-disabled="true"
            className="border-border text-text-muted inline-flex items-center gap-2 rounded-xl border border-dashed px-4 py-2"
          >
            <Icon className="size-6" aria-hidden="true" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] uppercase">Coming soon</span>
              <span className="block text-sm font-semibold">{name}</span>
            </span>
          </span>
        ) : (
          <EcosystemLink key={key} href={href} target={key} className="h-auto rounded-xl py-2">
            <Icon aria-hidden="true" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] uppercase">{sub}</span>
              <span className="block text-sm font-semibold">{name}</span>
            </span>
          </EcosystemLink>
        ),
      )}
    </div>
  );
}
