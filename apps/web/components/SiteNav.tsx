"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_URL = "/assets/seyr-logo.png";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/yayin-akisi", label: "Yayin Akisi" },
  { href: "/programlar", label: "Programlar" },
  { href: "/programcilar", label: "Programcilar" },
  { href: "/canli-yayin", label: "Canli Yayin" },
  { href: "/iletisim", label: "Iletisim" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex flex-col items-center pointer-events-none w-full">
      <nav
        className={cn(
          "relative flex items-center justify-between w-[calc(100%-2rem)] sm:w-[calc(100%-4rem)] max-w-[850px] rounded-b-[16px] sm:rounded-b-[20px] px-3 sm:px-6 py-2.5 sm:py-3.5 pointer-events-auto transition-all duration-300 bg-white",
          isScrolled ? "shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)]" : ""
        )}
      >
        {/* Left Solidroad Swoosh (Inverted Border Radius using SVG) */}
        <div className="absolute top-0 -left-[16px] sm:-left-[20px] pointer-events-none transition-all duration-300 opacity-100 translate-y-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 0H0C13.2548 0 24 10.7452 24 24V0Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Right Solidroad Swoosh (Inverted Border Radius using SVG) */}
        <div className="absolute top-0 -right-[16px] sm:-right-[20px] pointer-events-none transition-all duration-300 opacity-100 translate-y-0">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 0H24C10.7452 0 0 10.7452 0 24V0Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Left Section: Navigation Links */}
        <div className="hidden md:flex items-center gap-7 flex-1">
          {links.slice(1, 4).map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-[600] text-[13.5px] sm:text-[14px] tracking-[0.015em] transition-colors flex items-center",
                  active
                    ? "text-slate-900"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile View Placeholder for Left */}
        <div className="flex md:hidden items-center flex-1">
          <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-slate-800 fill-none stroke-[2] ml-2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>

        {/* Absolute Center Section: Logo with custom Text-Crop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
          <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 py-2">
            {/* Height restricted container to crop out the tiny slogan text at the bottom. Adjusted to allow the 'y' microphone base to show correctly. */}
            <div className="h-[28px] sm:h-[38px] overflow-hidden flex items-start mt-[4px]">
              <img
                src={LOGO_URL}
                alt="Seyr FM"
                className="h-[36px] sm:h-[48px] w-auto object-cover object-top brightness-0 -translate-y-[2px]"
              />
            </div>
          </Link>
        </div>

        {/* Right Section: Action Button */}
        <div className="flex items-center justify-end flex-1">
          <Link
            href="/canli-yayin"
            className="group flex h-[38px] sm:h-[44px] items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800/80 pl-4 sm:pl-5 pr-1.5 sm:pr-2 text-[13px] sm:text-[14.5px] font-[600] tracking-wide text-white transition-all hover:bg-slate-900 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
          >
            Canlı Dinle
            <span className="flex h-[26px] sm:h-[32px] w-[26px] sm:w-[32px] items-center justify-center rounded-lg sm:rounded-xl bg-white/10 text-white backdrop-blur-sm transition-transform group-hover:translate-x-0.5 group-hover:bg-white/20">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-[1.5px]" stroke="currentColor" strokeWidth="0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
