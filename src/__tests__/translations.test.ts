import { describe, it, expect } from "vitest";
import { getTranslations } from "@/lib/translations";
import type { Locale } from "@/lib/i18n";

const locales: Locale[] = ["en", "pt", "es", "ru", "lv"];

describe("translations", () => {
  it("returns translations for all supported locales", () => {
    locales.forEach((locale) => {
      const t = getTranslations(locale);
      expect(t).toBeDefined();
      expect(t.nav).toBeDefined();
      expect(t.hero).toBeDefined();
      expect(t.about).toBeDefined();
    });
  });

  it("all locales have the same nav keys", () => {
    const enKeys = Object.keys(getTranslations("en").nav);
    locales.forEach((locale) => {
      const keys = Object.keys(getTranslations(locale).nav);
      expect(keys).toEqual(enKeys);
    });
  });

  it("all locales have the same hero keys", () => {
    const enKeys = Object.keys(getTranslations("en").hero);
    locales.forEach((locale) => {
      const keys = Object.keys(getTranslations(locale).hero);
      expect(keys).toEqual(enKeys);
    });
  });

  it("all locales have the same about keys", () => {
    const enKeys = Object.keys(getTranslations("en").about);
    locales.forEach((locale) => {
      const keys = Object.keys(getTranslations(locale).about);
      expect(keys).toEqual(enKeys);
    });
  });

  it("all locales have the same contact keys", () => {
    const enKeys = Object.keys(getTranslations("en").contact);
    locales.forEach((locale) => {
      const keys = Object.keys(getTranslations(locale).contact);
      expect(keys).toEqual(enKeys);
    });
  });

  it("no translation value is empty", () => {
    locales.forEach((locale) => {
      const t = getTranslations(locale);
      const check = (obj: Record<string, unknown>, path: string) => {
        Object.entries(obj).forEach(([key, val]) => {
          const fullPath = `${path}.${key}`;
          if (typeof val === "string") {
            expect(val.length, `${locale}: ${fullPath} is empty`).toBeGreaterThan(0);
          } else if (typeof val === "object" && val !== null) {
            check(val as Record<string, unknown>, fullPath);
          }
        });
      };
      check(t as unknown as Record<string, unknown>, locale);
    });
  });

  it("portuguese has proper accented characters", () => {
    const pt = getTranslations("pt");
    expect(pt.about.title).toContain("Sobre");
    expect(pt.experience.title).toBe("Experiência");
    expect(pt.education.title).toBe("Educação");
  });

  it("english is the default/base locale", () => {
    const en = getTranslations("en");
    expect(en.hero.greeting).toContain("Hi");
    expect(en.nav.home).toBe("Home");
  });
});
