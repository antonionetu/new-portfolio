"use client";

import { motion } from "framer-motion";
import { experiences } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  const { locale } = useI18n();
  const t = getTranslations(locale);

  return (
    <section id="experience" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          index={t.experience.index}
          title={t.experience.title}
          subtitle={t.experience.subtitle}
        />

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-purple via-brand-lime/30 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={`${exp.company}-${exp.period}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8 md:pl-20"
              >
                <div className="absolute left-0 md:left-8 top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-brand-purple border-4 border-brand-dark" />

                <div className="p-6 rounded-2xl border border-brand-border bg-brand-card/30 hover:border-brand-purple/30 hover:bg-brand-card/50 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-brand-lime transition-colors duration-300">
                        {(t.experience as any).roles?.[exp.key] || exp.role}
                      </h3>
                      <p className="text-brand-purple font-medium">
                        {exp.company}
                        <span className="text-brand-muted font-normal">
                          {" "}
                          &middot; {exp.type}
                        </span>
                      </p>
                    </div>
                    <div className="text-sm text-brand-muted font-mono shrink-0">
                      {exp.period}
                    </div>
                  </div>

                  <p className="text-brand-muted text-sm leading-relaxed mb-4">
                    {(t.experience as any).descriptions?.[exp.key] || exp.description}
                  </p>

                  {exp.techs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.techs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs font-mono rounded-md bg-brand-purple/10 text-brand-purple border border-brand-purple/20 hover:bg-brand-lime/10 hover:text-brand-lime hover:border-brand-lime/30 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
