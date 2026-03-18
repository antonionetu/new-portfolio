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

  it("detects browser language 'pt' and sets locale to 'pt'", () => {
    Object.defineProperty(navigator, "language", { value: "pt-BR", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("pt");
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });

  it("detects browser language 'es' and sets locale to 'es'", () => {
    Object.defineProperty(navigator, "language", { value: "es-ES", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("es");
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });

  it("detects browser language 'ru' and sets locale to 'ru'", () => {
    Object.defineProperty(navigator, "language", { value: "ru-RU", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("ru");
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });

  it("detects browser language 'lv' and sets locale to 'lv'", () => {
    Object.defineProperty(navigator, "language", { value: "lv-LV", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("lv");
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });

  it("defaults to 'en' for unknown browser language", () => {
    Object.defineProperty(navigator, "language", { value: "ja-JP", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    expect(screen.getByTestId("locale").textContent).toBe("en");
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });
});
