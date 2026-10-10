import { AnnouncementBar } from "./announcement-bar";
import { Footer } from "./footer";
import { Header } from "./header";
import { ChatButton } from "./chat-button";
import { Toaster } from "@/components/ui/toaster";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="bg-primary text-on-primary sr-only z-50 rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <ChatButton />
      <Toaster />
    </>
  );
}
