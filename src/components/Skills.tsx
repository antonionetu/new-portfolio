"use client";

import { motion } from "framer-motion";
import { skills } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import SectionHeading from "./SectionHeading";

const categoryIcons: Record<string, string> = {
  backend: "{ }",
  frontend: "</>",
  database: "\u2299",
  devops: ">>>",
  tools: ":::",
  ai: "\u2726",
};

export default function Skills() {
  const { locale } = useI18n();
  const t = getTranslations(locale);

  const categoryLabels: Record<string, string> = {
    backend: t.skills.backend,
    frontend: t.skills.frontend,
    database: t.skills.database,
    devops: t.skills.devops,
    tools: t.skills.tools,
    ai: t.skills.ai,
  };

  return (
    <section id="skills" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          index={t.skills.index}
          title={t.skills.title}
          subtitle={t.skills.subtitle}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(skills).map(([category, items], i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-brand-border bg-brand-card/30 hover:border-brand-purple/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-mono text-xs font-bold">
                  {categoryIcons[category]}
                </span>
                <h3 className="font-semibold text-white">
                  {categoryLabels[category]}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 text-sm rounded-lg border border-brand-border bg-brand-dark/50 text-brand-muted hover:text-brand-lime hover:border-brand-lime/30 hover:bg-brand-lime/5 transition-colors duration-300 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
