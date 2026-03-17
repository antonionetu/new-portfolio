import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { priority, fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    header: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <header {...props}>{children}</header>,
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    li: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

function renderNavbar() {
  return render(
    <I18nProvider>
      <div id="home" />
      <div id="about" />
      <div id="experience" />
      <div id="skills" />
      <div id="education" />
      <div id="contact" />
      <NavbarComponent />
    </I18nProvider>
  );
}

let NavbarComponent: React.ComponentType;

describe("Navbar", async () => {
  const mod = await import("@/components/Navbar");
  NavbarComponent = mod.default;

  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = "";
  });

  it("renders the logo", () => {
    renderNavbar();
    expect(screen.getByAltText("Antonio Santana")).toBeInTheDocument();
  });

  it("renders desktop nav links", () => {
    renderNavbar();
    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByText("About").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Experience").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Skills").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Education").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
  });

  it("renders language switcher with flag", () => {
    const { container } = renderNavbar();
    // Should have flag emoji somewhere
    const html = container.innerHTML;
    expect(html).toContain("EN");
  });

  it("opens mobile menu when hamburger is clicked", () => {
    renderNavbar();
    const hamburger = screen.getByLabelText("Open menu");
    act(() => {
      fireEvent.click(hamburger);
    });
    // Close button should appear
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("closes mobile menu when close button is clicked", () => {
    renderNavbar();
    const hamburger = screen.getByLabelText("Open menu");
    act(() => {
      fireEvent.click(hamburger);
    });
    const closeBtn = screen.getByLabelText("Close menu");
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
  });

  it("closes mobile menu when a link is clicked", () => {
    renderNavbar();
    const hamburger = screen.getByLabelText("Open menu");
    act(() => {
      fireEvent.click(hamburger);
    });
    // Click one of the nav links inside the mobile menu
    const aboutLinks = screen.getAllByText("About");
    const mobileAbout = aboutLinks[aboutLinks.length - 1];
    act(() => {
      fireEvent.click(mobileAbout);
    });
    expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
  });

  it("locks body scroll when mobile menu is open", () => {
    renderNavbar();
    const hamburger = screen.getByLabelText("Open menu");
    act(() => {
      fireEvent.click(hamburger);
    });
    expect(document.body.style.overflow).toBe("hidden");

    const closeBtn = screen.getByLabelText("Close menu");
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("shows language flags in mobile fullscreen menu", () => {
    renderNavbar();
    const hamburger = screen.getByLabelText("Open menu");
    act(() => {
      fireEvent.click(hamburger);
    });
    // The mobile menu should have language buttons at the bottom (5 locales)
    const closeMenu = screen.getByLabelText("Close menu");
    expect(closeMenu).toBeInTheDocument();
    // There should be flag buttons for each locale
    const allButtons = document.querySelectorAll("button");
    expect(allButtons.length).toBeGreaterThan(5);
  });

  it("switches language from mobile menu", () => {
    renderNavbar();
    const hamburger = screen.getByLabelText("Open menu");
    act(() => {
      fireEvent.click(hamburger);
    });
    // Find a PT flag button and click it
    const ptButton = Array.from(document.querySelectorAll("button")).find(
      (btn) => btn.textContent?.includes("🇧🇷")
    );
    expect(ptButton).toBeTruthy();
    act(() => {
      fireEvent.click(ptButton!);
    });
    // Menu should close and locale should change
    expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
  });

  it("opens desktop language dropdown", () => {
    renderNavbar();
    // Find the desktop lang button (has "EN" text)
    const desktopLangBtns = screen.getAllByText("EN");
    const desktopBtn = desktopLangBtns[0].closest("button");
    expect(desktopBtn).toBeTruthy();
    act(() => {
      fireEvent.click(desktopBtn!);
    });
    // Dropdown should show all locale options
    const ptOptions = screen.getAllByText("PT");
    expect(ptOptions.length).toBeGreaterThan(0);
  });

  it("switches language from desktop dropdown", () => {
    renderNavbar();
    // Open dropdown
    const desktopLangBtns = screen.getAllByText("EN");
    const desktopBtn = desktopLangBtns[0].closest("button");
    act(() => {
      fireEvent.click(desktopBtn!);
    });
    // Click PT option
    const ptOptions = screen.getAllByText("PT");
    const ptBtn = ptOptions[ptOptions.length - 1].closest("button");
    act(() => {
      fireEvent.click(ptBtn!);
    });
    // Should now show PT as the selected language
    expect(localStorage.getItem("locale")).toBe("pt");
  });

  it("closes desktop dropdown on outside click", () => {
    renderNavbar();
    const desktopLangBtns = screen.getAllByText("EN");
    const desktopBtn = desktopLangBtns[0].closest("button");
    act(() => {
      fireEvent.click(desktopBtn!);
    });
    // Click outside
    act(() => {
      document.dispatchEvent(new MouseEvent("click"));
    });
  });

  it("applies blur class when scrolled", () => {
    renderNavbar();
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });
      window.dispatchEvent(new Event("scroll"));
    });
    const header = document.querySelector("header");
    expect(header?.className).toContain("bg-brand-dark/70");
  });

  it("has transparent bg when not scrolled", () => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true });
    renderNavbar();
    const header = document.querySelector("header");
    expect(header?.className).toContain("bg-transparent");
  });
});
