import type { Metadata } from "next";
import ProjectEnquiryForm from "@/components/project-enquiry-form";

export const metadata: Metadata = {
  title: "Start a project — NatexWorks",
  description: "Share what you want to build, the business problem you need to solve, and the project scope you have in mind.",
  alternates: { canonical: "/start-project" },
  openGraph: { title: "Start a project — NatexWorks", description: "A clear first brief for your next website or web application.", images: ["/og-image.svg"] },
};

type PageProps = { searchParams: Promise<{ project?: string }> };

const projectContexts: Record<string, string> = {
  "inventory-management": "Inventory / business application",
  "cafe-presence": "Café / business website",
  "local-discovery": "Local SEO foundations",
};

export default async function StartProjectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialProjectType = params.project ? projectContexts[params.project] || "" : "";
  return (
    <section className="contact-page start-project-page section-pad">
      <div className="section-kicker"><span>START A PROJECT / ENQUIRY</span><span>BEGIN WITH THE CONTEXT</span></div>
      <div className="contact-page__grid">
        <div className="contact-page__intro">
          <p className="eyebrow"><span className="eyebrow__dot" /> A USEFUL FIRST BRIEF</p>
          <h1>Start with the<br /><em>right context.</em></h1>
          <p>Tell me what you want to build, who it is for, and what is getting in the way. The details help shape a sensible first conversation—not an automatic quote.</p>
          <div className="contact-email"><span className="eyebrow">DIRECT EMAIL</span><a href="mailto:natexworks@gmail.com">natexworks@gmail.com <span aria-hidden="true">↗</span></a></div>
          <p className="contact-process-note">This page opens a prefilled email draft in your email application. The site does not transmit or store form submissions. Your enquiry is complete only after you review and send the email.</p>
        </div>
        <div className="contact-page__form"><ProjectEnquiryForm initialProjectType={initialProjectType} /></div>
      </div>
    </section>
  );
}
