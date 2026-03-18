"use client";

import { motion } from "framer-motion";
import { education } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import SectionHeading from "./SectionHeading";

export default function Education() {
  const { locale } = useI18n();
  const t = getTranslations(locale);

  return (
    <section id="education" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          index={t.education.index}
          title={t.education.title}
          subtitle={t.education.subtitle}
        />

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.institution}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative p-6 rounded-2xl border border-brand-border bg-brand-card/30 hover:border-brand-lime/30 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-lime/5 rounded-bl-full" />

              <div className="relative">
                <span className="inline-block px-3 py-1 text-xs font-mono rounded-md bg-brand-lime/10 text-brand-lime border border-brand-lime/20 mb-4">
                  {edu.period}
                </span>

                <a
                  href={edu.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-brand-lime transition-colors flex items-center gap-2">
                    {edu.institution}
                    <svg
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </h3>
                </a>
                <p className="text-brand-purple font-medium mt-1">
                  {(t.education as any).degrees?.[edu.key] || edu.degree}
                </p>
                <p className="text-sm text-brand-muted mt-2 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {edu.location}
                </p>

                {edu.extra && edu.extra.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {edu.extra.includes("mentor") && (
                      <div className="px-3 py-1.5 text-xs rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                        <span className="font-semibold">
                          {t.education.mentor}
                        </span>
                        <span className="text-brand-muted ml-1.5">
                          &mdash; {t.education.mentorDesc}
                        </span>
                      </div>
                    )}
                    {edu.extra.includes("researcher") && (
                      <div className="px-3 py-1.5 text-xs rounded-lg bg-brand-lime/10 text-brand-lime border border-brand-lime/20">
                        <span className="font-semibold">
                          {t.education.researcher}
                        </span>
                        <span className="text-brand-muted ml-1.5">
                          &mdash; {t.education.researcherDesc}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
