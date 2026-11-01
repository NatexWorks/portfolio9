import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ProjectEnquiryForm from "../components/project-enquiry-form";

describe("ProjectEnquiryForm", () => {
  it("applies a query-string-derived project type supplied by the page", () => {
    render(<ProjectEnquiryForm initialProjectType="Inventory / business application" />);

    expect(screen.getByLabelText("Type of project")).toHaveValue("Inventory / business application");
  });

  it("supports realistic typing and selection without submitting an enquiry", async () => {
    const user = userEvent.setup();
    render(<ProjectEnquiryForm initialProjectType="" />);

    await user.type(screen.getByLabelText("Your name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.type(screen.getByLabelText("Business or project name (optional)"), "Analytical Engines");
    await user.selectOptions(screen.getByLabelText("Type of project"), "Business website");
    await user.selectOptions(screen.getByLabelText("Estimated budget (optional)"), "₹25,000–₹50,000");
    await user.type(screen.getByLabelText("What do you want to build?"), "A clear website for a small business.");
    await user.type(screen.getByLabelText("Additional details (optional)"), "Please keep the page accessible.");

    expect(screen.getByLabelText("Your name")).toHaveValue("Ada Lovelace");
    expect(screen.getByLabelText("Email address")).toHaveValue("ada@example.com");
    expect(screen.getByLabelText("Business or project name (optional)")).toHaveValue("Analytical Engines");
    expect(screen.getByLabelText("Type of project")).toHaveValue("Business website");
    expect(screen.getByLabelText("Estimated budget (optional)")).toHaveValue("₹25,000–₹50,000");
    expect(screen.getByLabelText("What do you want to build?")).toHaveValue("A clear website for a small business.");
    expect(screen.getByLabelText("Additional details (optional)")).toHaveValue("Please keep the page accessible.");
  });

  it("keeps the minimum goal length and privacy disclosure explicit", () => {
    render(<ProjectEnquiryForm initialProjectType="Business website" />);

    expect(screen.getByLabelText("Your name")).toBeRequired();
    expect(screen.getByLabelText("Email address")).toBeRequired();
    expect(screen.getByLabelText("What do you want to build?")).toBeRequired();
    expect(screen.getByLabelText("What do you want to build?")).toHaveAttribute("minLength", "12");
    expect(screen.getByText(/does not send, store, or submit/i)).toBeVisible();
  });
});
