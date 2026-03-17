import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { priority, fill, unoptimized, ...rest } = props;
    return <img {...rest} />;
  },
}));

describe("LoadingScreen", async () => {
  const { default: LoadingScreen } = await import(
    "@/components/LoadingScreen"
  );

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("renders loading screen initially", () => {
    render(<LoadingScreen />);
    expect(screen.getByText("ANTONIO SANTANA")).toBeInTheDocument();
    expect(screen.getByAltText("AS")).toBeInTheDocument();
  });

  it("has the spinning ring element", () => {
    const { container } = render(<LoadingScreen />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("has the progress bar", () => {
    const { container } = render(<LoadingScreen />);
    const progressBar = container.querySelector(
      ".bg-gradient-to-r"
    );
    expect(progressBar).toBeInTheDocument();
  });

  it("starts fading out after 2 seconds", () => {
    const { container } = render(<LoadingScreen />);
    const overlay = container.firstChild as HTMLElement;
    expect(overlay.className).toContain("opacity-100");

    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(overlay.className).toContain("opacity-0");
  });

  it("is removed from DOM after 2.6 seconds", () => {
    const { container } = render(<LoadingScreen />);
    expect(container.firstChild).not.toBeNull();

    act(() => {
      vi.advanceTimersByTime(2700);
    });
    expect(container.firstChild).toBeNull();
  });

  it("cleans up timers on unmount", () => {
    const { unmount } = render(<LoadingScreen />);
    unmount();
    // Should not throw when timers fire after unmount
    act(() => {
      vi.advanceTimersByTime(3000);
    });
  });
});
