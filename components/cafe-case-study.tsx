import Link from "next/link";
import ProjectArt from "@/components/project-art";
import type { Project } from "@/content/site";

export default function CafeCaseStudy({ project }: { project: Project }) {
  const previewUrl = "https://natexworks.github.io/Neswef/";
  const menuUrl = "https://natexworks.github.io/Neswef/menu.html";
  const sourceUrl = "https://github.com/NatexWorks/Neswef";

  return (
    <div className="case-deep case-deep--cafe">
      <section className="case-deep__hero section-pad">
        <div className="section-kicker"><span>WEBSITE PROJECT / 002</span><span>BUSINESS WEBSITE · {project.status.toUpperCase()}</span></div>
        <div className="case-deep__hero-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow__dot" /> CAFÉ WEBSITE / NESWEF</p>
            <h1>A warmer digital home<br />for <em>Neswef Café.</em></h1>
            <p className="case-deep__summary">{project.summary}</p>
            <div className="case-deep__meta">{project.technology.map((item) => <span key={item}>{item}</span>)}</div>
            <a className="button button--dark" href={previewUrl} target="_blank" rel="noopener noreferrer">Visit website preview <span aria-hidden="true">↗</span></a>
          </div>
          <div className="case-deep__art">
            <ProjectArt variant="cafe" />
            <p>ILLUSTRATIVE PORTFOLIO ARTWORK · NOT A CAPTURED PAGE</p>
          </div>
        </div>
      </section>

      <section className="case-deep__intro section-pad" data-mobile-reveal>
        <div className="section-kicker"><span>THE EXPERIENCE / 02</span><span>FROM FIRST IMPRESSION TO MENU</span></div>
        <div><h2>A café website should make the visit feel easy to imagine.</h2><p>Before a visitor arrives, the website can introduce the atmosphere, give the menu a clear place, and make practical visit information easy to find. This preview is organised around that simple journey.</p></div>
      </section>

      <section className="case-deep__chapters case-deep__chapters--cafe section-pad">
        <div className="section-kicker"><span>FROM FIRST IMPRESSION TO MENU</span><span>STORY · MENU · VISIT</span></div>
        <h2>A little more than<br /><em>a landing page.</em></h2>
        <div className="case-deep__grid">
          <article data-mobile-reveal><span>01 / BUSINESS CONTEXT</span><h3>Help someone decide to visit.</h3><p>The site is structured to answer early questions: what kind of place is this, what can I explore, and where do I find the menu and visit details?</p><b>ATMOSPHERE · INFORMATION · NEXT STEP</b></article>
          <article className="is-cafe-dark" data-mobile-reveal><span>02 / DESIGN DIRECTION</span><h3>Warm materials. Clear editorial rhythm.</h3><p>The source README describes a warm paper, forest-green, and terracotta palette. Photography, serif display type, restrained labels, and generous sections give the café a recognisable visual mood.</p><b>PAPER · FOREST GREEN · TERRACOTTA</b></article>
          <article data-mobile-reveal><span>03 / HOMEPAGE EXPERIENCE</span><h3>Tell the story, then guide the visit.</h3><p>The homepage includes a photo-led hero, featured menu cards, story and ambience sections, visit information, and a footer that keeps the main paths available.</p><b>HERO · STORY · AMBIENCE · VISIT</b></article>
          <article data-mobile-reveal><span>04 / MENU DISCOVERY</span><h3>Give the menu its own space.</h3><p>A separate menu page contains 25 sample entries, category navigation, and live search. Category controls help visitors narrow the list without a full page reload.</p><b>25 SAMPLE ITEMS · CATEGORY FILTER · SEARCH</b><a className="case-deep__inline-link" href={menuUrl} target="_blank" rel="noopener noreferrer">Explore the separate menu preview ↗</a></article>
          <article data-mobile-reveal><span>05 / VISIT JOURNEY</span><h3>Keep practical information discoverable.</h3><p>Navigation links connect the story, menu, and visit sections. The project includes visit details, but its README marks the address and opening hours as sample information that must be replaced with verified café details.</p><b>NAVIGATION · VISIT DETAILS</b></article>
          <article className="is-cafe-dark" data-mobile-reveal><span>06 / ENQUIRY & RESPONSIVE DESIGN</span><h3>Make the request path clear—and honest.</h3><p>The reservation form uses native validation and opens an email draft. It is not connected to a booking backend and does not store requests or confirm reservations. The source also includes responsive layouts, mobile navigation, and reduced-motion support.</p><b>EMAIL DRAFT · MOBILE NAV · REDUCED MOTION</b></article>
        </div>
      </section>

      <section className="case-deep__evidence case-deep__evidence--cafe section-pad" data-mobile-reveal>
        <div className="case-deep__evidence-mark">i</div>
        <div><p className="eyebrow">PREVIEW STATUS & CONTENT NOTES</p><h2>A website preview—not a live booking operation.</h2>
          <p>The public source describes this as a website concept. Menu items, prices, address, opening hours, email, and social details are sample content and must be replaced before the site is used with real customers. No actual bookings, enquiries, footfall, analytics, or commercial outcome is claimed.</p>
          <div className="case-deep__links"><a href={sourceUrl} target="_blank" rel="noopener noreferrer">Inspect website source ↗</a><a href={previewUrl} target="_blank" rel="noopener noreferrer">Visit website preview ↗</a></div>
        </div>
      </section>

      <section className="case-deep__next case-deep__next--cafe section-pad">
        <div><p className="eyebrow">NEXT / ANOTHER KIND OF DIGITAL PRODUCT</p><h2>Inventory Management</h2><p>A working application connecting product records, stock visibility, orders, and barcode workflows.</p></div>
        <div><Link className="button button--light" href="/work/inventory-management">Explore the application <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/start-project?project=cafe-presence">Discuss a business website <span aria-hidden="true">↗</span></Link></div>
      </section>
    </div>
  );
}
