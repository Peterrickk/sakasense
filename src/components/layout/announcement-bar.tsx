import { siteConfig } from "@/config/site";

/** Config-driven. Hidden while its text still contains a [PLACEHOLDER]. */
export function AnnouncementBar() {
  const { enabled, text } = siteConfig.announcement;
  if (!enabled || text.includes("[PLACEHOLDER")) return null;
  return (
    <div className="bg-brand-gradient text-on-primary px-4 py-2 text-center text-sm font-medium">
      {text}
    </div>
  );
}
