import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Optional floating chat link (Messenger/Viber). Hidden until siteConfig.chatUrl is set. */
export function ChatButton() {
  if (!siteConfig.chatUrl) return null;
  return (
    <a
      href={siteConfig.chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-brand-gradient text-on-primary shadow-glow fixed right-4 bottom-4 z-30 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
    >
      <MessageCircle className="size-5" /> Chat with us
    </a>
  );
}
