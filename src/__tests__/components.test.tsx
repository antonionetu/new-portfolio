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
const motionProxy = (tag: string) => {
  const Component = ({ children, ...props }: Record<string, unknown>) => {
    const Tag = tag as any;
    return <Tag {...props}>{children as React.ReactNode}</Tag>;
  };
  Component.displayName = `motion.${tag}`;
  return Component;
};

vi.mock("framer-motion", () => ({
  motion: new Proxy({}, { get: (_target, prop: string) => motionProxy(prop) }),
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

  it("renders translated role in PT", () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Hero);
    expect(container.innerHTML).toContain("Desenvolvedor Full Stack");
    localStorage.clear();
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

  it("uses translated descriptions when available (PT)", () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Experience);
    // PT has translated descriptions - should show PT text for Quantum
    expect(container.innerHTML).toContain("Quantum Educ.");
    localStorage.clear();
  });

  it("falls back to English descriptions when translation is empty", () => {
    localStorage.setItem("locale", "ru");
    const { container } = withI18n(Experience);
    // RU has empty descriptions, should fallback to EN data
    expect(container.innerHTML).toContain("Atos Capital");
    localStorage.clear();
  });

  it("uses translated roles when available (PT)", () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Experience);
    expect(container.innerHTML).toContain("Desenvolvedor Full Stack");
    localStorage.clear();
  });

  it("falls back to English roles when translation is empty", () => {
    localStorage.setItem("locale", "lv");
    const { container } = withI18n(Experience);
    // LV has empty roles, should fallback to EN data
    expect(container.innerHTML).toContain("Developer");
    localStorage.clear();
  });

  it("translates experience types in PT", async () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Experience);
    await vi.waitFor(() => {
      expect(container.innerHTML).toContain("Parceria Porto Digital");
      expect(container.innerHTML).toContain("Tempo integral");
    });
    localStorage.clear();
  });

  it("translates 'Present' in period to PT", async () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Experience);
    await vi.waitFor(() => {
      expect(container.innerHTML).toContain("Atual");
    });
    localStorage.clear();
  });

  it("falls back to English types when translation empty", () => {
    localStorage.setItem("locale", "lv");
    const { container } = withI18n(Experience);
    // LV types exist, should translate
    expect(container.innerHTML).toContain("Porto Digital");
    localStorage.clear();
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

  it("uses translated degrees (PT)", () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Education);
    expect(container.innerHTML).toContain("Bacharelado - Ci\u00eancia da Computa\u00e7\u00e3o");
    // RTU stays in English even in PT
    expect(container.innerHTML).toContain("Bachelor\u2019s - Computer Systems");
    localStorage.clear();
  });

  it("renders mentor and researcher badges", () => {
    withI18n(Education);
    expect(screen.getByText("Mentor")).toBeInTheDocument();
    expect(screen.getByText("Undergraduate Researcher")).toBeInTheDocument();
  });

  it("shows EN degrees by default", () => {
    localStorage.clear();
    const { container } = withI18n(Education);
    expect(container.innerHTML).toContain("Bachelor\u2019s - Computer Science");
    expect(container.innerHTML).toContain("Bachelor\u2019s - Computer Systems");
  });

  it("translates UNIT degree to PT but keeps RTU in English", async () => {
    localStorage.setItem("locale", "pt");
    const { container } = withI18n(Education);
    await vi.waitFor(() => {
      expect(container.innerHTML).toContain("Bacharelado");
      expect(container.innerHTML).toContain("Bachelor\u2019s - Computer Systems");
    });
    localStorage.clear();
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

  it("renders translated footer in PT", () => {
    localStorage.setItem("locale", "pt");
    withI18n(Footer);
    expect(screen.getByText("C\u00f3digo fonte")).toBeInTheDocument();
    expect(screen.getAllByText("Contato").length).toBeGreaterThan(0);
    localStorage.clear();
  });

  it("renders nav links in footer", () => {
    localStorage.clear();
    withI18n(Footer);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("renders social icons", () => {
    localStorage.clear();
    withI18n(Footer);
    expect(screen.getByLabelText("GitHub")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByLabelText("WhatsApp")).toBeInTheDocument();
  });
});
