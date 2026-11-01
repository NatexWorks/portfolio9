import { describe, expect, it } from "vitest";
import { buildContactMailto, buildProjectMailto } from "../lib/contact-mailto";

function queryParams(mailto: string) {
  const query = mailto.slice(mailto.indexOf("?") + 1);
  return new URLSearchParams(query);
}

describe("contact email draft encoding", () => {
  it("encodes reserved characters, currency symbols, and newlines once", () => {
    const mailto = buildContactMailto({
      name: "A & B / Studio #4",
      email: "qa+portfolio@example.com",
      type: "Custom web application",
      message: "First line & second line\nBudget: ₹25,000 — 50% ready?",
    });

    expect(mailto.startsWith("mailto:natexworks@gmail.com?")).toBe(true);
    const params = queryParams(mailto);
    expect(params.get("subject")).toBe("Project enquiry — A & B / Studio #4");
    expect(params.get("body")).toBe(
      "Name: A & B / Studio #4\n" +
      "Email: qa+portfolio@example.com\n" +
      "Project type: Custom web application\n\n" +
      "First line & second line\nBudget: ₹25,000 — 50% ready?",
    );
    expect(mailto).not.toContain("\n");
    expect(mailto).toContain("%0A");
  });

  it("uses the same fallback wording as the existing contact form", () => {
    const params = queryParams(buildContactMailto({
      name: "  Pat  ",
      email: " pat@example.com ",
      type: "",
      message: "  Please call me.  ",
    }));

    expect(params.get("subject")).toBe("Project enquiry — Pat");
    expect(params.get("body")).toBe(
      "Name: Pat\nEmail: pat@example.com\nProject type: Not sure yet\n\nPlease call me.",
    );
  });
});

describe("project email draft encoding", () => {
  it("preserves the complete project brief and special characters", () => {
    const params = queryParams(buildProjectMailto({
      name: "Natex",
      email: "natex+qa@example.com",
      business: "Cafe & Co. / Sector 9",
      type: "Café / business website",
      budget: "₹25,000–₹50,000",
      goal: "Show the menu.\nMake directions easy.\nKeep 100% of prices accurate.",
      details: "Reference: https://example.com/?a=1&b=2",
    }));

    expect(params.get("subject")).toBe("Project enquiry — Café / business website — Natex");
    expect(params.get("body")).toBe([
      "Name: Natex",
      "Email: natex+qa@example.com",
      "Business / project: Cafe & Co. / Sector 9",
      "Project type: Café / business website",
      "Estimated budget: ₹25,000–₹50,000",
      "",
      "What I want to build:",
      "Show the menu.\nMake directions easy.\nKeep 100% of prices accurate.",
      "",
      "Additional details:",
      "Reference: https://example.com/?a=1&b=2",
    ].join("\n"));
  });

  it("uses the existing fallbacks for optional project fields", () => {
    const params = queryParams(buildProjectMailto({
      name: "Pat",
      email: "pat@example.com",
      business: " ",
      type: "",
      budget: "",
      goal: "A useful project goal.",
      details: "",
    }));

    expect(params.get("subject")).toBe("Project enquiry — Not sure yet — Pat");
    expect(params.get("body")).toContain("Business / project: Not provided");
    expect(params.get("body")).toContain("Estimated budget: Not specified");
    expect(params.get("body")).toContain("Additional details:\nNot provided");
  });
});
