import Link from "next/link";
import type { Metadata } from "next";
import ProjectArt from "@/components/project-art";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Selected work — Product build & concept explorations",
  description: "Explore the NatexWorks inventory application, Neswef Café website preview, and local-discovery concept.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section className="page-hero page-hero--work section-pad">
        <div className="section-kicker"><span>SELECTED WORK / 01—03</span><span>BUILDS & EXPLORATIONS</span></div>
        <p className="eyebrow"><span className="eyebrow__dot" /> THE WORK</p>
        <h1>Ideas deserve<br /><em>good execution.</em></h1>
        <div className="page-hero__bottom">
          <p>One working application, one café website preview, and one local-discovery concept. Each project is labelled clearly, with the work and its limitations explained without inflated claims.</p>
          <span>MOVE THROUGH THE WORK ↘</span>
        </div>
      </section>

      <section className="work-gallery" aria-label="Selected projects">
        <div className="work-gallery__track">
          {projects.map((project) => (
            <article className="work-card" key={project.slug}>
              <Link className="work-card__link" href={"/work/" + project.slug}>
                <div className="work-card__visual"><ProjectArt variant={project.art} /></div>
                <div className="work-card__meta"><span>{project.status.toUpperCase()}</span><span>{project.number} / 03</span></div>
                <div className="work-card__heading"><h2>{project.title}</h2><span aria-hidden="true">↗</span></div>
                <p>{project.summary}</p>
                <span className="work-card__category">{project.category}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="work-note section-pad">
        <p className="eyebrow">A NOTE ON THE PORTFOLIO</p>
        <h2>Clear labels are part<br />of <em>good work.</em></h2>
        <p>The inventory application is documented from its public source repository and linked demo. Neswef Café is a website preview with sample business details clearly identified. Local discovery is concept work. Portfolio artwork is illustrative, not captured product photography.</p>
        <Link className="text-link" href="/start-project">Discuss a project like these <span aria-hidden="true">→</span></Link>
      </section>
    </>
  );
}
