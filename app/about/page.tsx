import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Manish — The thinking behind NatexWorks",
  description: "Meet Manish, the person behind NatexWorks: building custom websites and digital tools, and helping businesses improve their local search visibility.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero--about section-pad">
        <div className="section-kicker"><span>ABOUT MANISH / NATEXWORKS</span><span>THOUGHTFUL BY DESIGN</span></div>
        <p className="eyebrow"><span className="eyebrow__dot" /> A LITTLE ABOUT ME</p>
        <h1>Curious by nature.<br /><em>Practical by design.</em></h1>
        <div className="page-hero__bottom">
          <p>I build custom websites and digital tools that solve real business problems—from complete business workflows to clearer online experiences.</p>
          <span>THE THINKING BEHIND THE WORK ↓</span>
        </div>
      </section>

      <section className="about-statement section-pad" data-mobile-reveal>
        <div className="section-kicker"><span>THE PERSON BEHIND THE WORK</span><span>DESIGN, DATA FLOW & LOGIC</span></div>
        <div className="about-statement__grid">
          <h2>I enjoy turning<br />real problems into<br /><em>useful products.</em></h2>
          <div className="about-statement__copy">
            <p className="about-statement__lead">I’m Manish, the person behind NatexWorks. I enjoy the challenge of building complete products—from the interface and data flow to the logic working behind the scenes.</p>
            <p>I build custom websites and digital tools around real business needs. I also help businesses improve their visibility through search engine optimisation (SEO), Google Search, and Google Maps local search optimisation.</p>
            <p>From inventory systems to business websites and local discovery, I focus on practical solutions. The goal is not to add technology for its own sake; it is to make something genuinely useful for the people who rely on it.</p>
          </div>
        </div>
      </section>

      <section className="about-visual-story section-pad">
        <div className="about-visual-story__top"><span>HOW THE WORK TAKES SHAPE</span><span>01 — 04</span></div>
        <div className="about-visual-story__canvas">
          <div className="about-visual-story__grid" />
          <div className="about-visual-story__shape" data-parallax="18"><span>N×</span></div>
          <div className="about-visual-story__side-note" data-parallax="8">QUESTION<br />→ STRUCTURE<br />→ SYSTEM<br />→ USEFULNESS</div>
          <span className="about-visual-story__caption">A GOOD SOLUTION SHOULD MAKE THE WORK FEEL LIGHTER.</span>
        </div>
      </section>

      <section className="about-method section-pad" data-mobile-reveal>
        <div className="section-kicker"><span>HOW I WORK</span><span>FOUR CLEAR MOVES</span></div>
        <div className="about-method__list">
          <article><span>01</span><div><h3>Understand before proposing.</h3><p>I start with the goal, the people using the solution, the current process, and the problem that needs attention.</p></div></article>
          <article><span>02</span><div><h3>Plan the right direction.</h3><p>I work out the structure, content, essential features, and visual direction before moving into development.</p></div></article>
          <article><span>03</span><div><h3>Build, then test the details.</h3><p>I develop the agreed experience and review its important interactions, data flow, and behaviour across screen sizes.</p></div></article>
          <article><span>04</span><div><h3>Review and hand over clearly.</h3><p>I check the key flows, accessibility, and responsive behaviour, resolve agreed fixes, and explain what has been delivered.</p></div></article>
        </div>
      </section>

      <section className="about-last section-pad" data-mobile-reveal>
        <p className="eyebrow">A NOTE ON SEARCH VISIBILITY</p>
        <h2>Work towards<br /><em>stronger visibility.</em></h2>
        <p>Search visibility depends on relevance, competition, location, business information, and other factors. I focus on improving the foundations and never promise a particular ranking.</p>
        <Link className="button button--dark" href="/work">See the work <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
