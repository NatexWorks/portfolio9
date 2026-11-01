export type ContactMailtoInput = {
  name: string;
  email: string;
  type: string;
  message: string;
};

export type ProjectMailtoInput = {
  name: string;
  email: string;
  business: string;
  type: string;
  budget: string;
  goal: string;
  details: string;
};

const RECIPIENT = "natexworks@gmail.com";

/**
 * Build the mailto hand-off without sending or storing enquiry data.
 * Keeping URL construction pure makes character and newline encoding testable.
 */
export function buildContactMailto(input: ContactMailtoInput): string {
  const name = input.name.trim();
  const email = input.email.trim();
  const type = input.type.trim() || "Not sure yet";
  const message = input.message.trim();
  const subject = encodeURIComponent("Project enquiry — " + name);
  const body = encodeURIComponent(
    "Name: " + name +
    "\nEmail: " + email +
    "\nProject type: " + type +
    "\n\n" + message,
  );

  return `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
}

export function buildProjectMailto(input: ProjectMailtoInput): string {
  const name = input.name.trim();
  const email = input.email.trim();
  const business = input.business.trim() || "Not provided";
  const type = input.type.trim() || "Not sure yet";
  const budget = input.budget.trim() || "Not specified";
  const goal = input.goal.trim();
  const details = input.details.trim() || "Not provided";
  const subject = encodeURIComponent(`Project enquiry — ${type} — ${name}`);
  const body = encodeURIComponent([
    `Name: ${name}`,
    `Email: ${email}`,
    `Business / project: ${business}`,
    `Project type: ${type}`,
    `Estimated budget: ${budget}`,
    "",
    "What I want to build:",
    goal,
    "",
    "Additional details:",
    details,
  ].join("\n"));

  return `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
}
