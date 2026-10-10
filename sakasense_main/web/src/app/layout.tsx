import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "SakaSense — Know your soil. Grow with confidence.",
    template: "%s · SakaSense",
  },
  description:
    "Subscription web platform for SakaSense IoT soil sensors — historical trends, multi-plot farms, fertilizer guidance, and reports.",
};

export const viewport: Viewport = {
  themeColor: "#050b08",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }} className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans text-sakasense-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
