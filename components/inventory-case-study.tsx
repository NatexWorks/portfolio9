import Link from "next/link";
import ProjectArt from "@/components/project-art";
import type { Project } from "@/content/site";

export default function InventoryCaseStudy({ project }: { project: Project }) {
  const demoUrl = "https://inventory-system-mu-puce.vercel.app/";
  const sourceUrl = "https://github.com/NatexWorks/Inventory-Management-System";

  return (
    <div className="case-deep case-deep--inventory">
      <section className="case-deep__hero section-pad">
        <div className="section-kicker"><span>FEATURED BUILD / 001</span><span>BUSINESS APPLICATION · {project.status.toUpperCase()}</span></div>
        <div className="case-deep__hero-grid">
          <div>
            <p className="eyebrow"><span className="eyebrow__dot" /> PRODUCT / INVENTORY MANAGEMENT</p>
            <h1>Know what you have.<br /><em>See what needs attention.</em></h1>
            <p className="case-deep__summary">{project.summary}</p>
            <div className="case-deep__meta">{project.technology.map((item) => <span key={item}>{item}</span>)}</div>
            <a className="button button--dark" href={demoUrl} target="_blank" rel="noopener noreferrer">Open live demo <span aria-hidden="true">↗</span></a>
          </div>
          <div className="case-deep__art">
            <ProjectArt variant="inventory" />
            <p>ILLUSTRATIVE PORTFOLIO ARTWORK · NOT A CAPTURED PRODUCT SCREEN</p>
          </div>
        </div>
      </section>

      <section className="case-deep__intro section-pad" data-mobile-reveal>
        <div className="section-kicker"><span>THE PRODUCT / 01</span><span>FROM RECORDS TO DAILY WORK</span></div>
        <div>
          <h2>Inventory work is a chain of small decisions.</h2>
          <p>Find the right product. Understand how many are available. Record what moves out. Keep the records useful for the next decision. The application brings these jobs into one workspace rather than treating them as unrelated screens.</p>
        </div>
      </section>

      <section className="case-deep__chapters section-pad">
        <div className="section-kicker"><span>A WALK THROUGH THE WORKFLOW</span><span>CATALOG → STOCK → ORDER</span></div>
        <h2>From catalogue<br /><em>to checkout.</em></h2>
        <div className="case-deep__grid">
          <article data-mobile-reveal><span>01 / THE PROBLEM</span><h3>Disconnected records create avoidable work.</h3><p>Product details, category organisation, stock quantities, and order history are linked. When each is maintained in isolation, it becomes harder to know which information is current.</p><b>CLARITY BEFORE COMPLEXITY</b></article>
          <article data-mobile-reveal><span>02 / CATALOG</span><h3>Give every item a useful record.</h3><p>Products can be created, updated, listed, and searched. The source supports category, SKU, description, and barcode matching, so the catalogue is more than a static name-and-price list.</p><b>PRODUCTS · CATEGORIES · SEARCH</b></article>
          <article data-mobile-reveal><span>03 / STOCK</span><h3>Make quantity visible.</h3><p>Product records hold stock quantities. The dashboard summarises products that need attention and lists low-stock items; the current report query uses five units or fewer as its low-stock rule.</p><b>QUANTITY · LOW-STOCK REVIEW</b></article>
          <article className="is-dark" data-mobile-reveal><span>04 / BARCODE</span><h3>Move from a code to a product.</h3><p>The scanner uses ZXing and includes EAN-13, EAN-8, UPC-A, and Code 128 formats. Camera scanning depends on browser support, a secure context, and the visitor&apos;s camera permission.</p><b>BARCODE RECORDS · CAMERA SCAN</b></article>
          <article data-mobile-reveal><span>05 / CHECKOUT & ORDERS</span><h3>Keep the sale connected to stock.</h3><p>Orders can move through pending approval, completion, and cancellation. Completing an order decrements product stock; cancelling a non-completed order releases reserved barcodes. Completed orders can be returned, restoring stock through the return workflow.</p><b>ORDERS · APPROVAL · RETURNS</b></article>
          <article data-mobile-reveal><span>06 / REPORTING</span><h3>Turn records into a useful overview.</h3><p>The reporting service builds product and low-stock counts, recent orders, completed-order revenue and sales totals, top products, a top category, and category-level sales analytics.</p><b>DASHBOARD · COMPLETED ORDERS · ANALYTICS</b></article>
        </div>
      </section>

      <section className="case-deep__technical section-pad" data-mobile-reveal>
        <div>
          <p className="eyebrow">TECHNICAL IMPLEMENTATION</p>
          <h2>Separate the interface<br /><em>from the rules.</em></h2>
          <p>The public source uses a Next.js App Router application. Authenticated API routes validate requests and delegate product, barcode, and order operations to service modules. MongoDB and Mongoose store application records; ZXing supports the camera scanner workflow.</p>
        </div>
        <div className="case-deep__tech-grid">
          {[...project.technology, "Authenticated API routes", "Request validation", "Order state transitions"].map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="case-deep__evidence section-pad" data-mobile-reveal>
        <div className="case-deep__evidence-mark">i</div>
        <div><p className="eyebrow">WHAT IS VERIFIED</p><h2>Show the implementation.<br /><em>Be precise about the evidence.</em></h2>
          <p>The capabilities described above are present in the inspected public source repository. The live demo may run a different commit or configuration, so confirm the current deployment before relying on a particular flow. The figures and interface artwork in this portfolio are illustrative; no customer, revenue, adoption, or time-saving result is claimed.</p>
          <div className="case-deep__links"><a href={sourceUrl} target="_blank" rel="noopener noreferrer">Inspect source repository ↗</a><a href={demoUrl} target="_blank" rel="noopener noreferrer">Open live demo ↗</a></div>
        </div>
      </section>

      <section className="case-deep__next section-pad">
        <div><p className="eyebrow">NEXT / ANOTHER KIND OF BUSINESS EXPERIENCE</p><h2>Neswef Café</h2><p>A warm website preview focused on atmosphere, menu discovery, and visit information.</p></div>
        <div><Link className="button button--light" href="/work/cafe-presence">Explore the website preview <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/start-project?project=inventory-management">Discuss a similar workflow <span aria-hidden="true">↗</span></Link></div>
      </section>
    </div>
  );
}
