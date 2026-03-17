import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { I18nProvider, useI18n, localeConfig } from "@/lib/i18n";

function TestConsumer() {
  const { locale, setLocale } = useI18n();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale("pt")}>Switch to PT</button>
    </div>
  );
}

describe("localeConfig", () => {
  it("has 5 locales with labels and flags", () => {
    const locales = Object.keys(localeConfig);
    expect(locales).toHaveLength(5);
    expect(locales).toEqual(["en", "pt", "es", "ru", "lv"]);

    Object.values(localeConfig).forEach((config) => {
      expect(config.label).toBeTruthy();
      expect(config.flag).toBeTruthy();
    });
  });
});

describe("I18nProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to 'en' when no locale is saved", () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("en");
  });

  it("reads saved locale from localStorage", () => {
    localStorage.setItem("locale", "pt");
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("pt");
  });

  it("switches locale and persists to localStorage", () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    act(() => {
      screen.getByText("Switch to PT").click();
    });
    expect(screen.getByTestId("locale").textContent).toBe("pt");
    expect(localStorage.getItem("locale")).toBe("pt");
  });

  it("ignores invalid saved locale and defaults to 'en'", () => {
    localStorage.setItem("locale", "xx");
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("en");
  });
});
