import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectArt from "@/components/project-art";
import InventoryCaseStudy from "@/components/inventory-case-study";
import CafeCaseStudy from "@/components/cafe-case-study";
import { projects } from "@/content/site";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: "/work/" + project.slug },
    openGraph: { title: project.title + " — NatexWorks", description: project.summary, images: ["/og-image.svg"] },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  if (slug === "inventory-management") return <InventoryCaseStudy project={project} />;
  if (slug === "cafe-presence") return <CafeCaseStudy project={project} />;

  return (
    <>
      <section className="case-hero section-pad">
        <div className="section-kicker"><span>SELECTED WORK / {project.number}</span><span>{project.status.toUpperCase()}</span></div>
        <p className="eyebrow"><span className="eyebrow__dot" /> {project.category}</p>
        <h1>{project.title.split(" ").slice(0, -1).join(" ")}<br /><em>{project.title.split(" ").slice(-1).join(" ")}</em></h1>
        <p className="case-hero__summary">{project.summary}</p>
        <div className="case-hero__meta"><span>STATUS / {project.status.toUpperCase()}</span><span>TYPE / {project.category.toUpperCase()}</span></div>
      </section>

      <section className="case-study__visual"><ProjectArt variant={project.art} /></section>

      <section className="case-overview section-pad">
        <div className="section-kicker"><span>THE PROJECT</span><span>{project.number} / CONTEXT & RESPONSE</span></div>
        <div className="case-overview__grid">
          <div><p className="eyebrow">THE CHALLENGE</p><h2>Start with<br /><em>the real problem.</em></h2></div>
          <div><p>{project.challenge}</p><p>{project.approach}</p></div>
        </div>
      </section>

      <section className="case-deliverables section-pad">
        <div className="section-kicker"><span>WHAT IT COVERS</span><span>THE AGREED WORK / CONCEPT SCOPE</span></div>
        <h2>Built around<br /><em>the useful parts.</em></h2>
        <div className="case-deliverables__grid">
          {project.deliverables.map((item, index) => <div className="case-deliverable" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
        </div>
        {project.technology.length > 0 && <div className="case-technology"><span className="eyebrow">TECHNOLOGY</span>{project.technology.map((item) => <b key={item}>{item}</b>)}</div>}
      </section>

      <section className="case-note section-pad">
        <span className="case-note__mark">i</span>
        <div><p className="eyebrow">SCOPE & STATUS</p><p>{project.note}</p></div>
      </section>

      <section className="case-next section-pad">
        <div><p className="eyebrow">HAVE A RELATED PROBLEM?</p><h2>Let&apos;s shape a<br /><em>useful solution.</em></h2></div>
        <div><p>Start with the workflow, the goal, and the constraints. The right scope comes before the build.</p><Link className="button button--dark" href="/contact">Discuss a project <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/work">Back to all work <span aria-hidden="true">←</span></Link></div>
      </section>
    </>
  );
}
