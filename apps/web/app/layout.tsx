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
      <body className="app-shell bg-white">
        {/* Global Fixed Frame (Universal White Border) */}
        <div className="fixed inset-x-0 top-0 z-[9999] h-1.5 sm:h-4 bg-white pointer-events-none" />
        <div className="fixed inset-x-0 bottom-0 z-[9999] h-1.5 sm:h-4 bg-white pointer-events-none" />
        <div className="fixed inset-y-0 left-0 z-[9999] w-1.5 sm:w-4 bg-white pointer-events-none" />
        <div className="fixed inset-y-0 right-0 z-[9999] w-1.5 sm:w-4 bg-white pointer-events-none" />

        <div className="relative p-1.5 sm:p-4 min-h-screen">
          <SiteNav />
          <main className="relative z-0">
            {children}
          </main>
          <StickyPlayerDock />
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
