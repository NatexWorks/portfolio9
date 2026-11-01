import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ContactForm from "../components/contact-form";

describe("ContactForm", () => {
  it("exposes labelled fields and native required/email constraints", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText("Your name")).toBeRequired();
    expect(screen.getByLabelText("Email address")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Email address")).toBeRequired();
    expect(screen.getByLabelText("A little context")).toBeRequired();
    expect(screen.getByRole("button", { name: /prepare enquiry/i })).toBeEnabled();
    expect(screen.getByText(/does not send or store/i)).toBeVisible();
  });

  it("allows a visitor to enter details and choose a project type", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Your name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.selectOptions(
      screen.getByLabelText("What are you looking to build?"),
      "Custom web application",
    );
    await user.type(screen.getByLabelText("A little context"), "I need a clearer stock workflow.");

    expect(screen.getByLabelText("Your name")).toHaveValue("Ada Lovelace");
    expect(screen.getByLabelText("Email address")).toHaveValue("ada@example.com");
    expect(screen.getByLabelText("What are you looking to build?")).toHaveValue("Custom web application");
    expect(screen.getByLabelText("A little context")).toHaveValue("I need a clearer stock workflow.");
  });
});
