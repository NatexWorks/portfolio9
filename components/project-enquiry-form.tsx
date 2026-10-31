"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ProjectEnquiryFormProps = { initialProjectType?: string };

export default function ProjectEnquiryForm({ initialProjectType = "" }: ProjectEnquiryFormProps) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const business = String(data.get("business") || "").trim() || "Not provided";
    const type = String(data.get("type") || "Not sure yet");
    const budget = String(data.get("budget") || "Not specified");
    const goal = String(data.get("goal") || "").trim();
    const details = String(data.get("details") || "").trim();
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
      details || "Not provided"
    ].join("\n"));
    setStatus("Your email app should open with the enquiry filled in. Review the draft and press Send to complete the enquiry.");
    window.location.href = `mailto:natexworks@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="enquiry-form project-enquiry-form" onSubmit={handleSubmit}>
      <div className="enquiry-form__top"><span>PROJECT BRIEF</span><span>01 / 01</span></div>
      <div className="project-form-grid">
        <div><label htmlFor="project-name">Your name</label><input id="project-name" name="name" autoComplete="name" required maxLength={90} placeholder="How should I address you?" /></div>
        <div><label htmlFor="project-email">Email address</label><input id="project-email" name="email" type="email" autoComplete="email" required maxLength={140} placeholder="you@company.com" /></div>
      </div>
      <label htmlFor="project-business">Business or project name <span>(optional)</span></label>
      <input id="project-business" name="business" autoComplete="organization" maxLength={120} placeholder="What should I call the project?" />
      <div className="project-form-grid">
        <div><label htmlFor="project-type">Type of project</label>
          <select id="project-type" name="type" defaultValue={initialProjectType} required>
            <option value="" disabled>Select a project type</option>
            <option value="Business website">Business website</option>
            <option value="Café / business website">Café / business website</option>
            <option value="Custom web application">Custom web application</option>
            <option value="Inventory / business application">Inventory / business application</option>
            <option value="Interface refinement">Interface refinement</option>
            <option value="Local SEO foundations">Local SEO foundations</option>
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div><label htmlFor="project-budget">Estimated budget <span>(optional)</span></label>
          <select id="project-budget" name="budget" defaultValue="">
            <option value="">Not decided yet</option>
            <option>Under ₹25,000</option>
            <option>₹25,000–₹50,000</option>
            <option>₹50,000–₹1,00,000</option>
            <option>₹1,00,000+</option>
            <option>Prefer to discuss</option>
          </select>
        </div>
      </div>
      <label htmlFor="project-goal">What do you want to build?</label>
      <textarea id="project-goal" name="goal" required minLength={12} maxLength={2000} rows={4} placeholder="What is the problem, who is it for, and what should become easier?" />
      <label htmlFor="project-details">Additional details <span>(optional)</span></label>
      <textarea id="project-details" name="details" maxLength={3000} rows={4} placeholder="Share context, timeline, or existing links." />
      <button className="button button--dark enquiry-form__submit" type="submit">Prepare project email <span aria-hidden="true">↗</span></button>
      <p className="enquiry-form__privacy">This prepares an email draft. It does not send, store, or submit your enquiry to a server.</p>
      <p className="enquiry-form__status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
