"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] bg-brand-dark flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-10">
            {/* Logo */}
            <div className="relative">
              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 rounded-full"
                style={{
                  border: "2px solid transparent",
                  borderTopColor: "#8B5CF6",
                  borderRightColor: "#C4E538",
                }}
              />
              {/* Inner pulse ring */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-3 rounded-full border border-brand-purple/30"
              />
              {/* Actual logo icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <Image
                  src="/images/logo-icon.png"
                  alt="AS"
                  width={72}
                  height={72}
                  priority
                />
              </motion.div>
            </div>

            {/* Name */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm font-mono text-brand-muted tracking-widest"
            >
              ANTONIO SANTANA
            </motion.p>

            {/* Progress bar */}
            <div className="w-56 h-[2px] bg-brand-border/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-lime to-brand-purple"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
