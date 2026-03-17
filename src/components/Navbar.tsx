"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { navSections } from "@/lib/data";
import { useI18n, localeConfig, type Locale } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [langOpen, setLangOpen] = useState(false);
  const { locale, setLocale } = useI18n();
  const t = getTranslations(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.3 }
    );

    navSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const close = () => setLangOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [langOpen]);

  const navLinks = navSections.map((s) => ({
    href: `#${s.id}`,
    label: t.nav[s.key],
  }));

  const currentFlag = localeConfig[locale];

  return (
    <>
      {/* Header bar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md ${
          scrolled
            ? "bg-brand-dark/70 border-b border-brand-border shadow-lg shadow-black/10"
            : "bg-transparent backdrop-blur-none"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="flex items-center">
            <Image
              src="/images/logo-icon.png"
              alt="Antonio Santana"
              width={36}
              height={36}
              priority
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      active === link.href
                        ? "text-brand-lime bg-brand-lime/10"
                        : "text-brand-muted hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop language switcher */}
            <div
              className="relative ml-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="cursor-pointer px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-white hover:bg-white/5 transition-all border border-brand-border flex items-center gap-1.5"
              >
                <span className="text-base leading-none">
                  {currentFlag.flag}
                </span>
                <span className="font-mono text-xs">{currentFlag.label}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-2xl min-w-[120px]"
                  >
                    {(Object.keys(localeConfig) as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLocale(l);
                          setLangOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                          locale === l
                            ? "text-brand-lime bg-brand-lime/10"
                            : "text-brand-muted hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="text-base leading-none">
                          {localeConfig[l].flag}
                        </span>
                        <span className="font-mono text-xs">
                          {localeConfig[l].label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile language switcher */}
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="cursor-pointer px-2 py-1.5 rounded-lg text-sm text-brand-muted border border-brand-border flex items-center gap-1"
              >
                <span className="text-base leading-none">
                  {currentFlag.flag}
                </span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-2 bg-brand-card border border-brand-border rounded-xl overflow-hidden shadow-2xl z-50"
                  >
                    {(Object.keys(localeConfig) as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          setLocale(l);
                          setLangOpen(false);
                        }}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                          locale === l
                            ? "text-brand-lime bg-brand-lime/10"
                            : "text-brand-muted hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="text-base leading-none">
                          {localeConfig[l].flag}
                        </span>
                        <span className="font-mono text-xs">
                          {localeConfig[l].label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Open menu"
            >
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white" />
              <span className="block w-5 h-0.5 bg-white" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile fullscreen overlay - OUTSIDE header */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-[999] bg-brand-dark/95 backdrop-blur-2xl flex flex-col"
          >
            {/* Top bar with logo + close */}
            <div className="flex items-center justify-between px-6 h-16 shrink-0">
              <Image
                src="/images/logo-icon.png"
                alt="Antonio Santana"
                width={36}
                height={36}
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-10 h-10 flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <ul className="flex flex-col items-center gap-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-8 py-3 rounded-xl text-2xl font-semibold transition-all ${
                        active === link.href
                          ? "text-brand-lime"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Bottom language selector */}
            <div className="flex justify-center gap-3 pb-10 shrink-0">
              {(Object.keys(localeConfig) as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLocale(l);
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    locale === l
                      ? "text-brand-lime bg-brand-lime/10 border border-brand-lime/30"
                      : "text-brand-muted border border-brand-border"
                  }`}
                >
                  <span className="text-base">{localeConfig[l].flag}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
