import Link from "next/link";
import type { Metadata } from "next";
import HeroScene from "@/components/hero-scene";
import ProjectArt from "@/components/project-art";
import { projects, process, services } from "@/content/site";

export const metadata: Metadata = {
  title: "Digital work, built around real business",
  description: "NatexWorks builds business websites, custom web applications, responsive interfaces, and practical local-search foundations.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = projects[0];
  return (
    <>
      <section className="hero-story" aria-labelledby="home-heading">
        <div className="hero-topline">
          <span>INDEPENDENT DIGITAL PRACTICE</span>
          <span>DESIGN / DEVELOPMENT / DISCOVERY</span>
        </div>
        <div className="hero-grid">
          <div className="hero-story__copy">
            <p className="eyebrow"><span className="eyebrow__dot" /> BUSINESS, MADE MORE USEFUL</p>
            <h1 className="hero-story__heading" id="home-heading">
              Digital work<br />that makes business<br /><em>work better.</em>
            </h1>
            <p className="hero-lede">
              I build custom websites and practical digital tools around the way a business actually works.
            </p>
            <div className="hero-actions">
              <Link className="button button--dark" href="/work">Explore selected work <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/services">What I can help with <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="hero-story__visual">
            <div className="hero-visual__frame">
              <HeroScene />
              <div className="hero-visual__orbit-label hero-visual__orbit-label--top">THINK / DESIGN / BUILD</div>
              <div className="hero-visual__orbit-label hero-visual__orbit-label--bottom">SYSTEMS WITH PURPOSE</div>
              <span className="hero-visual__index">N° 001</span>
            </div>
            <p className="hero-story__note">A connected system is more useful<br />than a collection of moving parts.</p>
          </div>
        </div>
        <div className="hero-bottomline">
          <span>WEB / APPLICATIONS / LOCAL SEARCH</span>
          <a href="#start-here">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
          <span>BUILT WITH INTENTION</span>
        </div>
      </section>

      <section className="intro-statement section-pad" id="start-here">
        <div className="section-kicker"><span>01 / THE PRINCIPLE</span><span>GOOD WORK STARTS WITH A GOOD QUESTION</span></div>
        <div className="intro-statement__body" data-reveal>
          <p>Not another layer of complexity.</p>
          <h2>Make the important things<br /><em>easier to understand</em><br />and easier to do.</h2>
          <div className="intro-statement__aside">
            <span className="accent-mark">↘</span>
            <p>From a first website to a custom business workflow, the aim is the same: remove friction and make the next step obvious.</p>
          </div>
        </div>
      </section>

      <section className="services-overview section-pad">
        <div className="section-kicker"><span>02 / CAPABILITIES</span><span>THE RIGHT TOOL FOR THE PROBLEM</span></div>
        <div className="section-heading-row">
          <h2>Useful by design.<br /><em>Clear in practice.</em></h2>
          <p>Four areas of work, connected by one idea: build only what helps the business move forward.</p>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <Link className="service-list__item" href="/services" key={service.number}>
              <span className="service-list__number">{service.number}</span>
              <span className="service-list__title">{service.title}</span>
              <span className="service-list__detail">{service.kicker}</span>
              <span className="service-list__arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <div className="section-end-link"><Link className="text-link" href="/services">Explore all services <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="featured-work section-pad">
        <div className="section-kicker"><span>03 / SELECTED WORK</span><span>ONE PRODUCT · ONE WEBSITE PREVIEW · ONE CONCEPT</span></div>
        <div className="section-heading-row">
          <h2>Ideas made<br /><em>tangible.</em></h2>
          <p>A working inventory application, a café website preview, and a clearly labelled local-discovery concept.</p>
        </div>
        <Link href={"/work/" + featured.slug} className="featured-project">
          <div className="featured-project__art"><ProjectArt variant="inventory" /></div>
          <div className="featured-project__info">
            <div><span className="project-status"><i /> WORKING PRODUCT</span><span className="project-number">01 / 03</span></div>
            <h3>{featured.title}</h3>
            <p>{featured.summary}</p>
            <span className="featured-project__link">View project <b aria-hidden="true">↗</b></span>
          </div>
        </Link>
        <div className="concept-row">
          {projects.slice(1).map((project) => (
            <Link className="concept-card" href={"/work/" + project.slug} key={project.slug}>
              <div className="concept-card__art"><ProjectArt variant={project.art} compact /></div>
              <div className="concept-card__meta"><span>{project.category}</span><span>{project.number} / 03</span></div>
              <h3>{project.title} <span aria-hidden="true">↗</span></h3>
              <p>{project.status} — {project.summary}</p>
            </Link>
          ))}
        </div>
        <div className="section-end-link"><Link className="text-link" href="/work">See all selected work <span aria-hidden="true">→</span></Link></div>
      </section>

      <section className="workflow-showcase section-pad" data-mobile-workflow-story>
        <div className="section-kicker"><span>04 / INVENTORY MANAGEMENT</span><span>CATALOGUE TO CHECKOUT</span></div>
        <div className="workflow-showcase__heading">
          <h2>Useful workflows.<br /><em>One workspace.</em></h2>
          <p>Four connected jobs from the inventory application: organise products, review stock, move an order through its lifecycle, and find an item using its barcode.</p>
        </div>
        <div className="workflow-stage" data-mobile-workflow-stage>
          <div className="workflow-stack" data-mobile-workflow-stack aria-label="Four inventory application workflows">
            <article className="workflow-card workflow-card--catalog" data-workflow-card>
              <div className="workflow-card__top"><span>01 / WORKFLOW</span><b aria-hidden="true">▦</b></div>
              <div><h3>Catalog</h3><p>Create and update product records, organise categories, and search by product name, description, category, SKU, or barcode.</p></div>
              <span className="workflow-card__detail">PRODUCTS · CATEGORIES · SEARCH</span>
            </article>
            <article className="workflow-card workflow-card--stock" data-workflow-card>
              <div className="workflow-card__top"><span>02 / WORKFLOW</span><b aria-hidden="true">◷</b></div>
              <div><h3>Stock</h3><p>Keep quantities visible and review products that need attention. The current dashboard query flags stock at five units or fewer.</p></div>
              <span className="workflow-card__detail">QUANTITY · LOW-STOCK REVIEW</span>
            </article>
            <article className="workflow-card workflow-card--checkout" data-workflow-card>
              <div className="workflow-card__top"><span>03 / WORKFLOW</span><b aria-hidden="true">↗</b></div>
              <div><h3>Checkout</h3><p>Create an order for approval, complete or cancel it, and process returns. Completing an order updates product stock.</p></div>
              <span className="workflow-card__detail">ORDERS · APPROVAL · RETURNS</span>
            </article>
            <article className="workflow-card workflow-card--barcode" data-workflow-card>
              <div className="workflow-card__top"><span>04 / WORKFLOW</span><b aria-hidden="true">▥</b></div>
              <div><h3>Barcode</h3><p>Look up products with barcode records and camera-assisted scanning when the browser supports it and the visitor grants camera permission.</p></div>
              <span className="workflow-card__detail">BARCODE RECORDS · CAMERA SCAN</span>
            </article>
          </div>
        </div>
        <div className="workflow-showcase__foot"><span>SCROLL TO MOVE THROUGH THE WORKFLOWS</span><span>CATALOG → STOCK → CHECKOUT → BARCODE</span></div>
      </section>

      <section className="process-overview section-pad" data-workflow-next-panel>
        <div className="section-kicker"><span>05 / HOW IT COMES TOGETHER</span><span>FROM PROBLEM TO PRODUCT</span></div>
        <div className="section-heading-row">
          <h2>Clear steps.<br /><em>No guesswork.</em></h2>
          <p>Good work starts with understanding the problem—not jumping straight into code.</p>
        </div>
        <div className="process-grid">
          {process.map((step) => (
            <article className="process-item" key={step.number} data-reveal>
              <span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-invite">
        <div className="closing-invite__inner">
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>Let&apos;s make it<br /><em>work better.</em></h2>
          <p>Tell me what you are building, what is slowing you down, or what you would like to improve.</p>
          <Link className="button button--light" href="/start-project">Start a project <span aria-hidden="true">↗</span></Link>
          <span className="closing-invite__index">NATEXWORKS / 2026</span>
        </div>
      </section>
    </>
  );
}
