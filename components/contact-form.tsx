"use client";
import { useState } from "react";
import type { FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const type = String(form.get("type") || "Not sure yet");
    const message = String(form.get("message") || "").trim();
    if (!name || !email || !message) {
      setStatus("Please complete your name, email, and project details.");
      return;
    }
    const subject = encodeURIComponent("Project enquiry — " + name);
    const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nProject type: " + type + "\n\n" + message);
    setStatus("Your email app should open with the enquiry filled in. Review it and press Send to complete the message.");
    window.location.href = "mailto:natexworks@gmail.com?subject=" + subject + "&body=" + body;
  }
  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="enquiry-form__top"><span>PROJECT ENQUIRY</span><span>01 / 01</span></div>
      <label htmlFor="contact-name">Your name</label>
      <input id="contact-name" name="name" autoComplete="name" required placeholder="How should I address you?" />
      <label htmlFor="contact-email">Email address</label>
      <input id="contact-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
      <label htmlFor="contact-type">What are you looking to build?</label>
      <select id="contact-type" name="type" defaultValue="">
        <option value="" disabled>Select a project type</option>
        <option>Business website</option>
        <option>Custom web application</option>
        <option>SEO and local discovery</option>
        <option>Responsive interface improvements</option>
        <option>Something else</option>
      </select>
      <label htmlFor="contact-message">A little context</label>
      <textarea id="contact-message" name="message" required rows={5} placeholder="What are you trying to improve? What does the current process look like?" />
      <button className="button button--dark enquiry-form__submit" type="submit">Prepare enquiry <span aria-hidden="true">↗</span></button>
      <p className="enquiry-form__privacy">This form prepares an email in your default mail app. It does not send or store your message on this website.</p>
      <p className="enquiry-form__status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
