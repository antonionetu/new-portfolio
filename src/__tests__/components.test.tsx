import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nProvider } from "@/lib/i18n";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { priority, fill, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock next/dynamic for HeroScene
vi.mock("next/dynamic", () => ({
  default: () => {
    return function MockHeroScene() {
      return <div data-testid="hero-scene" />;
    };
  },
}));

// Mock framer-motion to avoid animation complexity
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
    h1: ({ children, ...props }: Record<string, unknown>) => (
      <h1 {...props}>{children as React.ReactNode}</h1>
    ),
    p: ({ children, ...props }: Record<string, unknown>) => (
      <p {...props}>{children as React.ReactNode}</p>
    ),
    span: ({ children, ...props }: Record<string, unknown>) => (
      <span {...props}>{children as React.ReactNode}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

function withI18n(Component: React.ComponentType) {
  return render(
    <I18nProvider>
      <Component />
    </I18nProvider>
  );
}

describe("SectionHeading", async () => {
  const { default: SectionHeading } = await import("@/components/SectionHeading");

  it("renders title and subtitle", () => {
    render(
      <SectionHeading index="01." title="Test Title" subtitle="Test subtitle" />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test subtitle")).toBeInTheDocument();
    expect(screen.getByText("01.")).toBeInTheDocument();
  });

  it("applies center class when center prop is true", () => {
    const { container } = render(
      <SectionHeading index="01." title="Title" subtitle="Sub" center />
    );
    expect(container.firstChild).toHaveClass("text-center");
  });

  it("does not apply center class by default", () => {
    const { container } = render(
      <SectionHeading index="01." title="Title" subtitle="Sub" />
    );
    expect(container.firstChild).not.toHaveClass("text-center");
  });
});

describe("Hero", async () => {
  const { default: Hero } = await import("@/components/Hero");

  it("renders greeting and name", () => {
    withI18n(Hero);
    expect(screen.getByText("Antonio Santana")).toBeInTheDocument();
  });

  it("renders tech highlights with commas", () => {
    const { container } = withI18n(Hero);
    const html = container.innerHTML;
    expect(html).toContain("C#/.NET");
    expect(html).toContain("React");
    expect(html).toContain("Docker");
  });

  it("renders CTA buttons", () => {
    withI18n(Hero);
    const links = screen.getAllByRole("link");
    const whatsappLink = links.find((l) =>
      l.getAttribute("href")?.includes("wa.me")
    );
    expect(whatsappLink).toBeTruthy();
  });

  it("renders social links", () => {
    withI18n(Hero);
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
    expect(screen.getByLabelText("WhatsApp")).toBeInTheDocument();
  });
});

describe("About", async () => {
  const { default: About } = await import("@/components/About");

  it("renders section heading", () => {
    withI18n(About);
    expect(screen.getByText("About Me")).toBeInTheDocument();
  });

  it("renders stats with 10+ companies", () => {
    withI18n(About);
    expect(screen.getByText("10+")).toBeInTheDocument();
    expect(screen.getByText("5+")).toBeInTheDocument();
  });
});

describe("Experience", async () => {
  const { default: Experience } = await import("@/components/Experience");

  it("renders all companies", () => {
    withI18n(Experience);
    expect(screen.getByText("Atos Capital")).toBeInTheDocument();
    expect(screen.getByText("Vox")).toBeInTheDocument();
    expect(screen.getByText("Quantum Educacional")).toBeInTheDocument();
  });

  it("shows Porto Digital Partnership for Atos Capital", () => {
    const { container } = withI18n(Experience);
    expect(container.innerHTML).toContain("Porto Digital Partnership");
  });
});

describe("Skills", async () => {
  const { default: Skills } = await import("@/components/Skills");

  it("renders all skill categories", () => {
    withI18n(Skills);
    expect(screen.getByText("C#")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Insomnia")).toBeInTheDocument();
    expect(screen.getByText("ClickUp")).toBeInTheDocument();
    expect(screen.getByText("Claude AI")).toBeInTheDocument();
  });
});

describe("Education", async () => {
  const { default: Education } = await import("@/components/Education");

  it("renders institutions", () => {
    withI18n(Education);
    expect(
      screen.getByText("Riga Technical University (RTU)")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Universidade Tiradentes (UNIT)")
    ).toBeInTheDocument();
  });
});

describe("Contact", async () => {
  const { default: Contact } = await import("@/components/Contact");

  it("renders contact section with WhatsApp CTA", () => {
    withI18n(Contact);
    const links = screen.getAllByRole("link");
    const whatsappCta = links.find((l) =>
      l.getAttribute("href")?.includes("wa.me")
    );
    expect(whatsappCta).toBeTruthy();
  });

  it("renders social links", () => {
    withI18n(Contact);
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
  });
});

describe("Footer", async () => {
  const { default: Footer } = await import("@/components/Footer");

  it("renders brand name and logo", () => {
    withI18n(Footer);
    expect(screen.getByText("Antonio Santana")).toBeInTheDocument();
    expect(screen.getByAltText("Antonio Santana")).toBeInTheDocument();
  });

  it("renders source code link to GitHub", () => {
    withI18n(Footer);
    expect(screen.getByText("Source code")).toBeInTheDocument();
  });

  it("renders contact info", () => {
    withI18n(Footer);
    expect(screen.getByText("devantonio.fer@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("+371 25 562 433")).toBeInTheDocument();
  });
});
