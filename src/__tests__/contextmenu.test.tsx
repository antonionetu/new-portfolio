import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        const Component = ({ children, ...props }: Record<string, unknown>) => {
          const Tag = prop as any;
          return <Tag {...props}>{children as React.ReactNode}</Tag>;
        };
        return Component;
      },
    }
  ),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

function renderWithMenu() {
  return render(
    <I18nProvider>
      <ContextMenuComponent />
    </I18nProvider>
  );
}

let ContextMenuComponent: React.ComponentType;

describe("ContextMenu", async () => {
  const mod = await import("@/components/ContextMenu");
  ContextMenuComponent = mod.default;

  beforeEach(() => {
    localStorage.clear();
  });

  it("is hidden by default", () => {
    const { container } = renderWithMenu();
    expect(container.firstChild).toBeNull();
  });

  it("appears on right click", () => {
    renderWithMenu();
    act(() => {
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      });
      event.preventDefault = vi.fn();
      window.dispatchEvent(event);
    });
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Forward")).toBeInTheDocument();
    expect(screen.getByText("Reload")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Select all")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
  });

  it("closes on click outside", () => {
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    expect(screen.getByText("Back")).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  it("closes on scroll", () => {
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    expect(screen.getByText("Back")).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.queryByText("Back")).not.toBeInTheDocument();
  });

  it("executes Back action", () => {
    const backSpy = vi.spyOn(history, "back").mockImplementation(() => {});
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => {
      fireEvent.click(screen.getByText("Back"));
    });
    expect(backSpy).toHaveBeenCalled();
    backSpy.mockRestore();
  });

  it("executes Forward action", () => {
    const fwdSpy = vi.spyOn(history, "forward").mockImplementation(() => {});
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => {
      fireEvent.click(screen.getByText("Forward"));
    });
    expect(fwdSpy).toHaveBeenCalled();
    fwdSpy.mockRestore();
  });

  it("opens share submenu", () => {
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => {
      fireEvent.click(screen.getByText("Share"));
    });
    // Share submenu should show social options
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("X (Twitter)")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });

  it("goes back from share submenu", () => {
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => {
      fireEvent.click(screen.getByText("Share"));
    });
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    // Click the back arrow button
    const backBtn = document.querySelector("svg.w-4.h-4")?.closest("button");
    expect(backBtn).toBeTruthy();
    act(() => {
      fireEvent.click(backBtn!);
    });
    // Should be back on main menu
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("copies link and shows 'Copied!'", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => {
      fireEvent.click(screen.getByText("Share"));
    });
    act(() => {
      fireEvent.click(screen.getByText("Copy link"));
    });
    expect(writeTextMock).toHaveBeenCalled();
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("shows translated menu in PT", async () => {
    localStorage.setItem("locale", "pt");
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    await vi.waitFor(() => {
      expect(screen.getByText("Voltar")).toBeInTheDocument();
      expect(screen.getByText("Avançar")).toBeInTheDocument();
      expect(screen.getByText("Compartilhar")).toBeInTheDocument();
    });
    localStorage.clear();
  });

  it("opens WhatsApp share", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Share")); });
    act(() => { fireEvent.click(screen.getByText("WhatsApp")); });
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("wa.me"), "_blank");
    openSpy.mockRestore();
  });

  it("opens LinkedIn share", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Share")); });
    act(() => { fireEvent.click(screen.getByText("LinkedIn")); });
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("linkedin.com"), "_blank");
    openSpy.mockRestore();
  });

  it("opens Twitter share", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Share")); });
    act(() => { fireEvent.click(screen.getByText("X (Twitter)")); });
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("twitter.com"), "_blank");
    openSpy.mockRestore();
  });

  it("opens Email share", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Share")); });
    act(() => { fireEvent.click(screen.getByText("Email")); });
    expect(openSpy).toHaveBeenCalledWith(expect.stringContaining("mailto:"));
    openSpy.mockRestore();
  });

  it("executes Reload action", () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadMock, href: "http://localhost" },
      writable: true,
    });
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Reload")); });
    expect(reloadMock).toHaveBeenCalled();
  });

  it("executes Copy action", () => {
    document.execCommand = vi.fn(() => true);
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Copy")); });
    expect(document.execCommand).toHaveBeenCalledWith("copy");
  });

  it("executes Select all action", () => {
    document.execCommand = vi.fn(() => true);
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 50, clientY: 50 })
      );
    });
    act(() => { fireEvent.click(screen.getByText("Select all")); });
    expect(document.execCommand).toHaveBeenCalledWith("selectAll");
  });

  it("clamps position to viewport", () => {
    renderWithMenu();
    act(() => {
      window.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 9999,
          clientY: 9999,
        })
      );
    });
    const menu = document.querySelector(".fixed.z-\\[1000\\]") as HTMLElement;
    expect(menu).toBeTruthy();
    // Position should be clamped
    const left = parseInt(menu.style.left);
    const top = parseInt(menu.style.top);
    expect(left).toBeLessThan(9999);
    expect(top).toBeLessThan(9999);
  });
});
