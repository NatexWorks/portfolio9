import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Start a project with NatexWorks",
  description: "Tell NatexWorks what you are building, what is not working, or what you would like to improve.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-page section-pad">
        <div className="section-kicker"><span>CONTACT / LET&apos;S BEGIN</span><span>GOOD WORK STARTS WITH A CONVERSATION</span></div>
        <div className="contact-page__grid">
          <div className="contact-page__intro">
            <p className="eyebrow"><span className="eyebrow__dot" /> START A PROJECT</p>
            <h1>Tell me what<br />needs to <em>work.</em></h1>
            <p>Share the idea, the current obstacle, or the workflow you want to improve. The first step is understanding the problem—not jumping straight into a solution.</p>
            <div className="contact-email">
              <span className="eyebrow">DIRECT EMAIL</span>
              <a href="mailto:natexworks@gmail.com">natexworks@gmail.com <span aria-hidden="true">↗</span></a>
            </div>
            <div className="contact-response-note">No fake countdowns. No pressure. Just a clear conversation about scope and fit.</div>
          </div>
          <div className="contact-page__form">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
