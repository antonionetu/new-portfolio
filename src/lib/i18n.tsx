"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type Locale = "en" | "pt" | "es" | "ru" | "lv";

export const localeConfig: Record<Locale, { label: string; flag: string }> = {
  en: { label: "EN", flag: "\u{1F1FA}\u{1F1F8}" },
  pt: { label: "PT", flag: "\u{1F1E7}\u{1F1F7}" },
  es: { label: "ES", flag: "\u{1F1EA}\u{1F1F8}" },
  ru: { label: "RU", flag: "\u{1F1F7}\u{1F1FA}" },
  lv: { label: "LV", flag: "\u{1F1F1}\u{1F1FB}" },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("locale") as Locale;
      if (saved && saved in localeConfig) return saved;
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "pt") return "pt";
      if (browserLang === "es") return "es";
      if (browserLang === "ru") return "ru";
      if (browserLang === "lv") return "lv";
    }
    return "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("locale", l);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
