"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function HeroSlider() {
    const images = [
        "/assets/Gemini_Generated_Image_31as2d31as2d31as.png",
        "/assets/cc.png"
    ];

    const [currentIdx, setCurrentIdx] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;

        const timer = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % images.length);
        }, 10000); // 10 seconds

        return () => clearInterval(timer);
    }, [isHovered, images.length]);

    const goNext = () => setCurrentIdx((prev) => (prev + 1) % images.length);
    const goPrev = () => setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div
            className="absolute inset-0 z-0 bg-slate-100 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={currentIdx}
                    className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_e, { offset }) => {
                        const swipeThreshold = 50;
                        if (offset.x < -swipeThreshold) {
                            goNext();
                        } else if (offset.x > swipeThreshold) {
                            goPrev();
                        }
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <div className="absolute inset-0 bg-black/5 z-[5]" />
                    <img
                        src={images[currentIdx]}
                        alt={`Seyr FM Background ${currentIdx + 1}`}
                        className="h-full w-full object-cover lg:object-center select-none"
                        draggable={false}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Manual Navigation Controls - Removed per user request, now uses drag */}
        </div>
    );
}
