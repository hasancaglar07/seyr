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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  return (
    <header className="fixed top-1.5 sm:top-4 left-0 right-0 z-[10000] flex flex-col items-center pointer-events-none w-full">
      <nav
        className={cn(
          "relative flex items-center justify-between w-[94%] sm:w-[85%] max-w-[850px] rounded-b-[24px] sm:rounded-b-[32px] px-3 sm:px-6 py-2 sm:py-3 pointer-events-auto transition-all duration-300 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
          isScrolled ? "shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)]" : ""
        )}
      >
        {/* Left Solidroad Swoosh */}
        <div className="absolute top-0 -left-[31px] sm:-left-[43px] pointer-events-none transition-all duration-300">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px]">
            <path d="M100 0H0C55.2285 0 100 44.7715 100 100V0Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Right Solidroad Swoosh */}
        <div className="absolute top-0 -right-[31px] sm:-right-[43px] pointer-events-none transition-all duration-300">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] sm:w-[44px] sm:h-[44px]">
            <path d="M0 0H100C44.7715 0 0 44.7715 0 100V0Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Left Section: Mobile Menu & Desktop Links */}
        <div className="flex items-center flex-1">
          {/* Hamburger Menu (Left on Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center justify-center p-2 -ml-2 rounded-xl text-slate-900 transition-colors hover:bg-slate-50 relative z-[10001]"
            aria-label="Menü"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-center transition-all duration-300">
              <span className={cn("w-6 h-[2px] bg-slate-900 rounded-full transition-all duration-300 transform origin-left", isMenuOpen && "rotate-45 translate-x-[4px] -translate-y-[1px]")} />
              <span className={cn("w-6 h-[2px] bg-slate-900 rounded-full transition-all duration-300", isMenuOpen && "opacity-0")} />
              <span className={cn("w-6 h-[2px] bg-slate-900 rounded-full transition-all duration-300 transform origin-left", isMenuOpen && "-rotate-45 translate-x-[4px] translate-y-[1px]")} />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.slice(1, 4).map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-[600] text-[13.5px] lg:text-[14px] tracking-tight transition-colors flex items-center whitespace-nowrap",
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
        </div>

        {/* Absolute Center Section: Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
          <Link href="/" className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95 py-2">
            <div className="h-[28px] sm:h-[40px] overflow-hidden flex items-start mt-[4px]">
              <img
                src={LOGO_URL}
                alt="Seyr FM"
                className="h-[36px] sm:h-[50px] w-auto object-cover object-top brightness-0 -translate-y-[2px]"
              />
            </div>
          </Link>
        </div>

        {/* Right Section: Action Button */}
        <div className="flex items-center justify-end flex-1">
          <Link
            href="/canli-yayin"
            className="group flex h-[36px] sm:h-[42px] items-center gap-2 sm:gap-3 rounded-full bg-slate-950 text-white pl-4 sm:pl-5 pr-1.5 sm:pr-1.5 text-[12px] sm:text-[13.5px] font-[600] tracking-tight transition-all hover:bg-slate-900 active:scale-95"
          >
            <span className="hidden sm:inline">Canlı Dinle</span>
            <span className="sm:hidden inline">Canlı</span>
            <span className="flex h-[26px] sm:h-[30px] w-[26px] sm:w-[30px] items-center justify-center rounded-full bg-white text-slate-950 transition-transform group-hover:translate-x-0.5">
              <svg viewBox="0 0 24 24" className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current ml-[1px]">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[9999] bg-white transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] pointer-events-auto flex flex-col pt-32 px-8 overflow-y-auto",
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        )}
      >
        <div className="flex flex-col gap-8">
          {links.map((link, idx) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-3xl font-[600] tracking-tight transition-all duration-500 delay-[calc(idx*50ms)]",
                  isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0",
                  active ? "text-slate-900" : "text-slate-400"
                )}
                style={{ transitionDelay: `${idx * 60 + 200}ms` }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto pb-20 pt-10 border-t border-slate-100 transition-opacity flex flex-col gap-6" style={{ opacity: isMenuOpen ? 1 : 0 }}>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Seyr FM Sosyal Medya</p>
          <div className="flex gap-6">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95" />
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95" />
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95" />
          </div>
        </div>
      </div>
    </header>
  );
}
