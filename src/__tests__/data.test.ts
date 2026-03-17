import { describe, it, expect } from "vitest";
import {
  personalInfo,
  experiences,
  education,
  skills,
  languages,
  navSections,
} from "@/lib/data";

describe("personalInfo", () => {
  it("has all required fields", () => {
    expect(personalInfo.name).toBe("Antonio Santana");
    expect(personalInfo.email).toBe("devantonio.fer@gmail.com");
    expect(personalInfo.github).toContain("github.com");
    expect(personalInfo.linkedin).toContain("linkedin.com");
    expect(personalInfo.whatsapp).toContain("wa.me");
    expect(personalInfo.instagram).toContain("instagram.com");
    expect(personalInfo.website).toContain("antoniosantana");
  });

  it("has valid URLs", () => {
    const urls = [
      personalInfo.website,
      personalInfo.linkedin,
      personalInfo.github,
      personalInfo.whatsapp,
      personalInfo.instagram,
    ];
    urls.forEach((url) => {
      expect(url).toMatch(/^https?:\/\//);
    });
  });

  it("has a valid email format", () => {
    expect(personalInfo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});

describe("experiences", () => {
  it("has at least 7 entries", () => {
    expect(experiences.length).toBeGreaterThanOrEqual(7);
  });

  it("each experience has required fields", () => {
    experiences.forEach((exp) => {
      expect(exp.company).toBeTruthy();
      expect(exp.role).toBeTruthy();
      expect(exp.type).toBeTruthy();
      expect(exp.period).toBeTruthy();
      expect(exp.location).toBeTruthy();
      expect(exp.description).toBeTruthy();
      expect(exp.techs.length).toBeGreaterThan(0);
    });
  });

  it("first experience is the most recent", () => {
    expect(experiences[0].period).toContain("Present");
  });

  it("techs are non-empty strings", () => {
    experiences.forEach((exp) => {
      exp.techs.forEach((tech) => {
        expect(typeof tech).toBe("string");
        expect(tech.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("education", () => {
  it("has at least 2 entries", () => {
    expect(education.length).toBeGreaterThanOrEqual(2);
  });

  it("each entry has required fields", () => {
    education.forEach((edu) => {
      expect(edu.institution).toBeTruthy();
      expect(edu.degree).toBeTruthy();
      expect(edu.period).toBeTruthy();
      expect(edu.location).toBeTruthy();
      expect(edu.url).toMatch(/^https?:\/\//);
    });
  });

  it("UNIT has mentor and researcher extras", () => {
    const unit = education.find((e) =>
      e.institution.includes("Tiradentes")
    );
    expect(unit?.extra).toContain("mentor");
    expect(unit?.extra).toContain("researcher");
  });
});

describe("skills", () => {
  it("has all 6 categories", () => {
    expect(Object.keys(skills)).toEqual(
      expect.arrayContaining(["backend", "frontend", "database", "devops", "tools", "ai"])
    );
  });

  it("each category has items", () => {
    Object.values(skills).forEach((items) => {
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("has no duplicates within categories", () => {
    Object.entries(skills).forEach(([category, items]) => {
      const unique = new Set(items);
      expect(unique.size).toBe(items.length);
    });
  });

  it("contains key technologies", () => {
    expect(skills.backend).toContain("C#");
    expect(skills.backend).toContain("Python");
    expect(skills.frontend).toContain("React");
    expect(skills.database).toContain("PostgreSQL");
    expect(skills.devops).toContain("Docker");
    expect(skills.tools).toContain("Insomnia");
    expect(skills.tools).toContain("ClickUp");
  });
});

describe("languages", () => {
  it("has 5 languages", () => {
    expect(languages).toHaveLength(5);
  });

  it("portuguese is native", () => {
    const pt = languages.find((l) => l.key === "portuguese");
    expect(pt?.levelKey).toBe("native");
  });

  it("each language has key and levelKey", () => {
    languages.forEach((lang) => {
      expect(lang.key).toBeTruthy();
      expect(lang.levelKey).toBeTruthy();
    });
  });
});

describe("navSections", () => {
  it("has 6 sections", () => {
    expect(navSections).toHaveLength(6);
  });

  it("starts with home and ends with contact", () => {
    expect(navSections[0].id).toBe("home");
    expect(navSections[navSections.length - 1].id).toBe("contact");
  });

  it("each section has id and key", () => {
    navSections.forEach((s) => {
      expect(s.id).toBeTruthy();
      expect(s.key).toBeTruthy();
    });
  });
});
