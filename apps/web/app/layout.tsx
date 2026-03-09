import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { StickyPlayerDock } from "@/components/StickyPlayerDock";
import { cn } from "@/lib/utils";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SeyrDijital | Yeni Nesil Yayin Deneyimi",
  description:
    "SeyrDijital icin canli yayin, programlar, programcilar, yayin akisi ve iletisim odakli modern web deneyimi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={cn(display.variable, mono.variable, "font-sans antialiased")}>
      <body className="app-shell">
        <SiteNav />
        {children}
        <StickyPlayerDock />
        <SiteFooter />
      </body>
    </html>
  );
}
