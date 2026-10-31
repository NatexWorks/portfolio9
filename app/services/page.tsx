import Link from "next/link";
import type { Metadata } from "next";
import { process, services } from "@/content/site";
import ServiceArt from "@/components/service-art";

export const metadata: Metadata = {
  title: "Services — Websites, applications & local visibility",
  description: "Explore NatexWorks services: business websites, custom web applications, local SEO and Google Maps foundations, and responsive interface improvements.",
  alternates: { canonical: "/services" },
};

const serviceProof: Record<string, { href: string; label: string }> = {
  "Business websites": { href: "/work/cafe-presence", label: "See the Neswef Café website preview ↗" },
  "Custom web applications": { href: "/work/inventory-management", label: "See the Inventory Management build ↗" },
  "SEO & Google Maps visibility": { href: "/work/local-discovery", label: "See the local discovery concept ↗" },
  "Interface fixes & responsive polish": { href: "/work/inventory-management", label: "Explore the product workflow example ↗" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero page-hero--services section-pad">
        <div className="section-kicker"><span>CAPABILITIES / 01—04</span><span>BUILT AROUND THE ACTUAL NEED</span></div>
        <p className="eyebrow"><span className="eyebrow__dot" /> SERVICES</p>
        <h1>Less guesswork.<br /><em>More control.</em></h1>
        <div className="page-hero__bottom">
          <p>Choose the help that fits your business: a better website, a custom tool, or a clearer path for local customers to find you.</p>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="service-transform section-pad" aria-labelledby="service-transform-heading" data-mobile-reveal>
        <div className="service-transform__copy">
          <div className="section-kicker"><span>THE BUILDING PROCESS</span><span>01 / 03</span></div>
          <h2 id="service-transform-heading">From scattered<br />to <em>connected.</em></h2>
          <p className="service-transform__intro">The best solution is not always the biggest one. It is the one that connects the right pieces and removes the right friction.</p>
          <div className="service-transform__steps">
            <article className="service-transform__step">
              <span>01 / DISCOVER</span><h3>Find the friction.</h3><p>Understand the people, the current workflow, and the step that needs to become easier.</p>
            </article>
            <article className="service-transform__step">
              <span>02 / DESIGN</span><h3>Give it a shape.</h3><p>Set a clear structure, agree on scope, and design the experience around the job it needs to do.</p>
            </article>
            <article className="service-transform__step">
              <span>03 / DELIVER</span><h3>Make it useful.</h3><p>Build, check the important flows, refine the details, and hand over the agreed work clearly.</p>
            </article>
          </div>
        </div>
        <div className="service-transform__stage" aria-hidden="true">
          <div className="service-transform__art">
            <div className="transform-orbit transform-orbit--one" />
            <div className="transform-orbit transform-orbit--two" />
            <div className="transform-core"><span>N×</span><i /><b /></div>
            <div className="transform-node transform-node--one">01</div>
            <div className="transform-node transform-node--two">02</div>
            <div className="transform-node transform-node--three">03</div>
            <div className="transform-caption">STRUCTURE / SYSTEM / OUTCOME</div>
          </div>
        </div>
      </section>

      <section className="service-detail-list section-pad">
        <div className="section-kicker"><span>WHAT I CAN HELP WITH</span><span>FOUR PRACTICAL DISCIPLINES</span></div>
        {services.map((service) => (
          <article className="service-detail" id={"service-" + service.number} key={service.number} data-mobile-reveal data-reveal>
            <div className="service-detail__number">{service.number}</div>
            <div className="service-detail__main">
              <p className="eyebrow">{service.kicker}</p>
              <h2>{service.title}</h2>
              <p className="service-detail__description">{service.description}</p>
              <ServiceArt number={service.number} />
            </div>
            <div>
              <ul className="service-detail__points">
                {service.details.map((detail) => <li key={detail}>{detail}</li>)}
              </ul>
              <Link className="service-proof-link" href={serviceProof[service.title].href}>{serviceProof[service.title].label}</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="visibility-note section-pad">
        <div className="visibility-note__mark">i</div>
        <div><p className="eyebrow">A NOTE ON SEARCH VISIBILITY</p><h2>Visibility is a process,<br /><em>not a ranking promise.</em></h2></div>
        <p>Google Search and Google Maps results depend on competition, relevance, location, business information, reviews, and other factors. The work can improve your setup and technical foundations, but no particular position or timeline can be guaranteed.</p>
      </section>

      <section className="process-overview process-overview--compact section-pad">
        <div className="section-kicker"><span>HOW WE WORK</span><span>AGREED BEFORE BUILDING</span></div>
        <div className="process-grid">
          {process.map((step) => <article className="process-item" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
      </section>

      <section className="page-cta section-pad">
        <div><p className="eyebrow">YOUR NEXT STEP</p><h2>What needs to<br /><em>work better?</em></h2></div>
        <div><p>Share the goal, what you already have, and the main obstacle. We can define a practical scope before committing to a build.</p><Link className="button button--dark" href="/start-project">Start a project <span aria-hidden="true">↗</span></Link></div>
      </section>
    </>
  );
}
