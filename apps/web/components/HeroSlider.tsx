"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const images = [
    "/assets/Gemini_Generated_Image_31as2d31as2d31as.png",
    "/assets/Gemini_Generated_Image_8ruuut8ruuut8ruu.png"
];

export function HeroSlider() {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const images = [
        "/assets/Gemini_Generated_Image_31as2d31as2d31as.png",
        "/assets/cc.png"
    ];

    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % images.length);
        }, 10000); // 10 seconds

        return () => clearInterval(timer);
    }, [isHovered]);

    const goNext = () => setCurrentIdx((prev) => (prev + 1) % images.length);
    const goPrev = () => setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div
            className="absolute inset-0 z-0 bg-slate-950"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {images.map((src, idx) => (
                <img
                    key={src}
                    src={src}
                    alt={`Seyr FM Background ${idx + 1}`}
                    className={cn(
                        "absolute inset-0 h-full w-full object-cover lg:object-center transition-opacity duration-1000",
                        idx === currentIdx ? "opacity-100 z-10" : "opacity-0 z-0"
                    )}
                />
            ))}

            {/* Subtle gradient to ensure the text and logos are readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/60 pointer-events-none z-20" />

            {/* Manual Navigation Controls */}
            <div className="absolute inset-y-0 left-4 flex items-center z-30 pointer-events-none">
                <button
                    onClick={(e) => { e.preventDefault(); goPrev(); }}
                    className={cn(
                        "pointer-events-auto h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white/70 transition-all hover:bg-black/40 hover:text-white hover:scale-110",
                        images.length <= 1 ? "hidden" : ""
                    )}
                    aria-label="Previous Image"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center z-30 pointer-events-none">
                <button
                    onClick={(e) => { e.preventDefault(); goNext(); }}
                    className={cn(
                        "pointer-events-auto h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white/70 transition-all hover:bg-black/40 hover:text-white hover:scale-110",
                        images.length <= 1 ? "hidden" : ""
                    )}
                    aria-label="Next Image"
                >
                    <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
