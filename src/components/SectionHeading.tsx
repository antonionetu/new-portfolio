"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  index,
  center = false,
}: {
  title: string;
  subtitle: string;
  index: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-16 ${center ? "text-center" : ""}`}
    >
      <span className="text-brand-lime font-mono text-sm font-medium">
        {index}
      </span>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      <p className={`mt-3 text-brand-muted ${center ? "mx-auto" : ""} max-w-lg`}>
        {subtitle}
      </p>
      <div
        className={`mt-4 w-16 h-1 rounded-full bg-gradient-to-r from-brand-purple to-brand-lime ${
          center ? "mx-auto" : ""
        }`}
      />
    </motion.div>
  );
}
