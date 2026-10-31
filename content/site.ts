export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  status: "Working product" | "Website preview" | "Concept";
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  technology: string[];
  note: string;
  art: "inventory" | "discovery" | "cafe";
};

export const services = [
  {
    number: "01",
    title: "Business websites",
    kicker: "A clearer first impression",
    description: "Responsive websites that explain what your business does and make the next step easy—whether that is calling, messaging, booking, or visiting.",
    details: ["Landing pages and multi-page sites", "Mobile-first layouts", "Contact and location paths", "Basic on-page SEO structure"],
  },
  {
    number: "02",
    title: "Custom web applications",
    kicker: "Tools shaped around the work",
    description: "Purpose-built tools for workflows that are awkward to manage with scattered spreadsheets or manual processes. The feature set is shaped around the actual problem.",
    details: ["Dashboards and admin panels", "Inventory and product workflows", "Database-backed features", "Responsive interfaces"],
  },
  {
    number: "03",
    title: "SEO & Google Maps visibility",
    kicker: "Stronger foundations for discovery",
    description: "Improve the foundations that help search engines and nearby customers understand a business, including accurate business details and a website that supports local intent.",
    details: ["On-page SEO fundamentals", "Google Business Profile review", "Consistent business information", "Local landing-page recommendations"],
  },
  {
    number: "04",
    title: "Interface fixes & responsive polish",
    kicker: "Make an existing site easier to use",
    description: "Improve an existing website's layout, navigation, usability, and behaviour across different screen sizes without rebuilding everything unnecessarily.",
    details: ["Mobile and tablet layout fixes", "Navigation and interaction improvements", "Visual consistency and accessibility basics", "Focused UI refinements"],
  },
];

export const projects: Project[] = [
  {
    slug: "inventory-management",
    number: "01",
    title: "Inventory Management System",
    category: "Business application",
    status: "Working product",
    summary: "An inventory and point-of-sale application connecting product records, stock visibility, barcode-assisted lookup, orders, returns, and reporting workflows.",
    challenge: "Retail work connects several small but important tasks: organising products, checking quantities, finding an item, and recording a sale. When those tasks are separated, it becomes harder to keep the catalogue, stock, and order history in step.",
    approach: "The public source uses a Next.js App Router interface with authenticated API routes and service modules. Product and category records provide the catalogue; stock levels, barcode records, orders, returns, and reporting connect the wider workflow.",
    deliverables: [
      "Create, edit, search, and organise product records by category, SKU, description, and barcode",
      "Review quantities and low-stock products; the current dashboard query treats five units or fewer as low stock",
      "Use camera-assisted barcode scanning for supported formats, subject to browser camera support and permission",
      "Create orders for approval, complete or cancel them, and process returns through the order workflow",
      "Review dashboard summaries, recent orders, completed-order revenue, top products, and category analytics"
    ],
    technology: ["Next.js", "React 19", "MongoDB", "Mongoose", "ZXing"],
    note: "These capabilities are present in the public source repository. The linked live deployment may differ by commit, environment, or configuration, so verify the exact enabled flows in the demo before relying on them operationally. The portfolio interface artwork is illustrative, not a captured application screenshot. No adoption, revenue, time-saved, or production-impact metric is claimed.",
    art: "inventory",
  },
  {
    slug: "local-discovery",
    number: "02",
    title: "Local discovery",
    category: "Experience concept",
    status: "Concept",
    summary: "A concept for helping local customers understand a business through a clearer website, accurate business information, and a useful path to contact or visit.",
    challenge: "A nearby customer should not have to piece together business details from inconsistent pages or outdated listings.",
    approach: "This concept explores a joined-up journey between useful on-page information, Google Business Profile details, location context, and clear contact paths.",
    deliverables: ["Local-intent page structure", "Business information hierarchy", "Contact and directions pathways", "Google Business Profile improvement checklist"],
    technology: [],
    note: "Concept exploration only. It is not a client case study, a verified Google Business Profile, or evidence of ranking improvements.",
    art: "discovery",
  },
  {
    slug: "cafe-presence",
    number: "03",
    title: "Neswef Café",
    category: "Business website",
    status: "Website preview",
    summary: "A warm, café-led website preview built around atmosphere, menu discovery, and clear visit information.",
    challenge: "A café website needs to do more than display a logo. Visitors should be able to get a feel for the place, explore the menu, and find the information needed for a visit without searching through an unstructured page.",
    approach: "The source website uses an editorial, photo-led direction with a warm paper, forest-green, and terracotta palette. The homepage connects the story, ambience, menu highlights, and visit information; a separate menu page supports category browsing and search.",
    deliverables: [
      "Photo-led homepage with café identity, story, ambience, menu highlights, and visit-oriented sections",
      "Separate menu page with 25 sample entries, category navigation, and live search",
      "Responsive layouts and mobile navigation with keyboard Escape support",
      "Reservation request form with native validation and an email-draft handoff"
    ],
    technology: ["HTML", "CSS", "Vanilla JavaScript"],
    note: "This is a website preview, not a connected restaurant booking system. The source README identifies menu items, prices, address, opening hours, email, and social details as sample content to replace. The reservation form opens an email draft; it does not store a request or confirm a booking. No customer or commercial outcome is claimed.",
    art: "cafe",
  },
];

export const process = [
  { number: "01", title: "Understand", text: "Clarify the goal, audience, constraints, and what a useful outcome should look like." },
  { number: "02", title: "Shape", text: "Agree on structure, content, scope, timing, and visual direction before building." },
  { number: "03", title: "Build & refine", text: "Develop the agreed experience and review the details that matter." },
  { number: "04", title: "Verify & hand over", text: "Check key flows, accessibility, and screen sizes; resolve agreed fixes and hand over clearly." },
];
