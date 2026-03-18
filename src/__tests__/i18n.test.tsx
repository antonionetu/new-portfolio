import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
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
    Object.defineProperty(navigator, "language", { value: "en-US", configurable: true });
  });

  it("defaults to 'en' when no locale is saved", async () => {
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("en");
    });
  });

  it("reads saved locale from localStorage", async () => {
    localStorage.setItem("locale", "pt");
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("pt");
    });
  });

  it("switches locale and persists to localStorage", async () => {
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

  it("ignores invalid saved locale and defaults to 'en'", async () => {
    localStorage.setItem("locale", "xx");
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("en");
    });
  });

  it("detects browser language 'pt'", async () => {
    Object.defineProperty(navigator, "language", { value: "pt-BR", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("pt");
    });
  });

  it("detects browser language 'es'", async () => {
    Object.defineProperty(navigator, "language", { value: "es-ES", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("es");
    });
  });

  it("detects browser language 'ru'", async () => {
    Object.defineProperty(navigator, "language", { value: "ru-RU", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("ru");
    });
  });

  it("detects browser language 'lv'", async () => {
    Object.defineProperty(navigator, "language", { value: "lv-LV", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("lv");
    });
  });

  it("defaults to 'en' for unknown browser language", async () => {
    Object.defineProperty(navigator, "language", { value: "ja-JP", configurable: true });
    render(
      <I18nProvider>
        <TestConsumer />
      </I18nProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("locale").textContent).toBe("en");
    });
  });
});
