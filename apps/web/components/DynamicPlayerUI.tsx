"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LOGO_URL = "/assets/seyr-logo.png";

// Minimal typing corresponding to the passed props
interface DynamicPlayerProps {
    stream: {
        name: string;
        streamUrl: string;
        coverImageUrl?: string | null;
    };
    nextEntry?: {
        title: string;
        startsAt?: string | null;
    } | null;
}

export function DynamicPlayerUI({ stream, nextEntry }: DynamicPlayerProps) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // The threshold for when the player drops to the bottom
            setIsScrolled(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Check immediately
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // When to show the player in the enlarged "Hero" mode
    const isHeroMode = pathname === "/" && !isScrolled;

    if (!stream) return null;

    return (
        <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] flex justify-center h-0 overflow-visible">
            {/* The container that smoothly animates between Hero positioning and bottom sticky positioning */}
            <div
                className={cn(
                    "pointer-events-auto flex items-center gap-4 rounded-2xl sm:rounded-[20px] backdrop-blur-2xl transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] absolute",
                    isHeroMode
                        ? "bottom-[30vh] sm:bottom-[28vh] w-[calc(100%-2rem)] max-w-[720px] px-5 py-3.5 sm:px-6 sm:py-4 border border-white/10 bg-slate-950/40 text-white shadow-[0_32px_64px_rgba(0,0,0,0.4)] hover:scale-[1.02] hover:bg-slate-950/50"
                        : "bottom-8 w-[calc(100%-3rem)] max-w-6xl px-4 py-3 border border-slate-800/80 bg-slate-950/90 text-white shadow-[0_24px_50px_rgba(0,0,0,0.5)] scale-100"
                )}
            >
                <div className="flex shrink-0 items-center gap-3">
                    <img
                        src={stream.coverImageUrl ?? LOGO_URL}
                        alt={stream.name}
                        className={cn(
                            "h-11 w-11 rounded-xl border p-1 object-cover transition-colors duration-700",
                            isHeroMode ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
                        )}
                        referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 transition-colors duration-700">
                            Şimdi Yayında
                        </p>
                        <h4 className="truncate text-sm font-bold tracking-tight text-white transition-colors duration-700">
                            {stream.name}
                        </h4>
                    </div>
                </div>

                <div className="hidden h-10 w-px sm:block transition-colors duration-700 bg-white/10" />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white transition-colors duration-700">
                                {nextEntry?.title ?? "Seyr FM Live"}
                            </p>
                            <p className="truncate text-xs text-white/60 transition-colors duration-700">
                                {nextEntry?.startsAt ? `${nextEntry.startsAt} itibarıyla planlı yayın` : "Canlı audio stream hazır"}
                            </p>
                        </div>
                        <span className="hidden rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] sm:inline-flex bg-white/10 text-white transition-colors duration-700">
                            Live
                        </span>
                    </div>

                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-md bg-white/10 transition-colors duration-700">
                        <div className="h-full w-[38%] rounded-md bg-white transition-colors duration-700" />
                    </div>
                </div>

                <a
                    href={stream.streamUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                        "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all duration-700 shadow-sm border border-transparent",
                        isHeroMode
                            ? "bg-white text-slate-950 hover:bg-white/90 hover:scale-105"
                            : "bg-white/10 text-white border-white/10 hover:bg-white/20"
                    )}
                >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    Dinle
                </a>
            </div>
        </footer>
    );
}
