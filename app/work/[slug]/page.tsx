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

      {slug === "local-discovery" && (
        <section className="local-signal-field section-pad" aria-labelledby="local-signal-heading" data-local-signal-field>
          <div className="section-kicker"><span>LOCAL SIGNAL FIELD</span><span>GEOGRAPHY / INFORMATION / NEXT STEP</span></div>
          <div className="local-signal-field__grid">
            <div className="local-signal-field__copy">
              <p className="eyebrow">A USEFUL LOCAL JOURNEY</p>
              <h2 id="local-signal-heading">Let&apos;s shape<br /><em>a useful solution.</em></h2>
              <p>Location only becomes useful when people can understand the business, check the details that matter, and choose a clear next step. This visual connects those ideas as a design concept—not as live geographic information.</p>
              <div className="local-signal-field__legend"><span><i /> BUSINESS DETAILS</span><span><i /> CONTACT PATH</span><span><i /> DIRECTIONS</span></div>
            </div>
            <div className="local-signal-field__visual" aria-hidden="true">
              <div className="local-signal-field__visual-top"><span>LOCAL SIGNAL / CONCEPT 01</span><span>NOT LIVE DATA</span></div>
              <svg viewBox="0 0 800 520" role="presentation" focusable="false">
                <g className="local-signal-field__contours">
                  <path d="M-30 118Q120 20 248 108T510 93T835 84" />
                  <path d="M-30 154Q120 56 248 144T510 129T835 120" />
                  <path d="M-30 190Q120 92 248 180T510 165T835 156" />
                  <path d="M-30 358Q120 260 248 348T510 333T835 324" />
                  <path d="M-30 394Q120 296 248 384T510 369T835 360" />
                  <path d="M-30 430Q120 332 248 420T510 405T835 396" />
                  <path d="M118 -20Q225 110 180 224T212 540" />
                  <path d="M310 -20Q417 110 372 224T404 540" />
                  <path d="M502 -20Q609 110 564 224T596 540" />
                  <path d="M694 -20Q801 110 756 224T788 540" />
                </g>
                <g className="local-signal-field__routes">
                  <path d="M163 340C220 265 286 234 385 260S558 310 631 177" />
                  <path d="M385 260C412 175 478 127 574 122" />
                  <path d="M385 260C475 348 535 376 664 363" />
                </g>
                <g className="local-signal-field__points">
                  <circle cx="163" cy="340" r="8" /><circle cx="574" cy="122" r="7" />
                  <circle cx="631" cy="177" r="9" /><circle cx="664" cy="363" r="7" />
                  <circle cx="385" cy="260" r="11" />
                </g>
                <g className="local-signal-field__pin">
                  <circle cx="385" cy="260" r="40" /><circle cx="385" cy="260" r="23" />
                  <path d="M385 204c-26 0-47 20-47 46 0 34 47 86 47 86s47-52 47-86c0-26-21-46-47-46Z" />
                  <circle cx="385" cy="250" r="9" />
                </g>
              </svg>
              <div className="local-signal-field__visual-bottom"><span>CONNECTED INFORMATION</span><span>CONTACT → DIRECTIONS → VISIT</span></div>
            </div>
          </div>
        </section>
      )}
      <section className="case-note section-pad">
        <span className="case-note__mark">i</span>
        <div><p className="eyebrow">SCOPE & STATUS</p><p>{project.note}</p></div>
      </section>

      <section className="case-next section-pad">
        <div><p className="eyebrow">HAVE A RELATED PROBLEM?</p><h2>{slug === "local-discovery" ? <>Make the next<br /><em>step clearer.</em></> : <>Let&apos;s shape a<br /><em>useful solution.</em></>}</h2></div>
        <div><p>Start with the workflow, the goal, and the constraints. The right scope comes before the build.</p><Link className="button button--dark" href="/contact">Discuss a project <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/work">Back to all work <span aria-hidden="true">←</span></Link></div>
      </section>
    </>
  );
}
