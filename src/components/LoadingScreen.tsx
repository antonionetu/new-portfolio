"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const removeTimer = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-brand-dark flex items-center justify-center transition-all duration-600 ${
        fading ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex flex-col items-center gap-10">
        {/* Logo */}
        <div className="relative">
          {/* Spinning ring - conic gradient */}
          <div className="absolute -inset-6 rounded-full animate-spin" style={{
            background: "conic-gradient(from 0deg, transparent, #8B5CF6, #C4E538, transparent)",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
          }} />

          {/* Pulse ring - pure CSS */}
          <div className="absolute -inset-3 rounded-full border border-brand-purple/30 animate-pulse" />

          {/* Logo icon */}
          <div className="relative z-10 animate-[logoEntry_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <Image
              src="/images/logo-icon.png"
              alt="AS"
              width={72}
              height={72}
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Name */}
        <p className="text-sm font-mono text-brand-muted tracking-widest animate-[fadeInUp_0.5s_0.5s_both]">
          ANTONIO SANTANA
        </p>

        {/* Progress bar */}
        <div className="w-56 h-[2px] bg-brand-border/50 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-lime to-brand-purple animate-[progressFill_2s_ease-in-out_forwards]" />
        </div>
      </div>
    </div>
  );
}
