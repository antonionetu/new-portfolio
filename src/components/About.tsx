"use client";

import { motion } from "framer-motion";
import { languages } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import SectionHeading from "./SectionHeading";

export default function About() {
  const { locale } = useI18n();
  const t = getTranslations(locale);

  const stats = [
    { value: "5+", label: t.about.stats.years },
    { value: "10+", label: t.about.stats.companies },
    { value: "5", label: t.about.stats.languages },
  ];

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          index={t.about.index}
          title={t.about.title}
          subtitle={t.about.subtitle}
        />

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl border border-brand-border bg-brand-card/50 hover:border-brand-purple/30 transition-colors text-center"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="text-3xl sm:text-4xl font-bold text-gradient block"
              >
                {stat.value}
              </motion.span>
              <span className="text-xs sm:text-sm text-brand-muted mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bio grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[t.about.bio1, t.about.bio2, t.about.bio3].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-6 rounded-2xl border border-brand-border bg-brand-card/30 hover:border-brand-purple/20 transition-colors"
            >
              <span className="text-brand-lime font-mono text-xs font-bold mb-3 block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-brand-muted text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3 justify-center"
        >
          {languages.map((lang) => (
            <span
              key={lang.key}
              className="px-4 py-2 text-sm rounded-xl border border-brand-border bg-brand-card/50 text-brand-muted hover:border-brand-lime/30 hover:text-brand-lime transition-colors"
            >
              {t.languages[lang.key]}{" "}
              <span className="text-brand-purple">&middot;</span>{" "}
              <span className="text-white/80">
                {t.languages[lang.levelKey]}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
