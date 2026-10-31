# NatexWorks — new portfolio

A new Next.js App Router portfolio direction built independently from the legacy HTML site. The legacy markup is not used as the new page structure or design system.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- GSAP + ScrollTrigger for desktop scroll-linked sequences
- React Three Fiber / Three.js for one optional hero visual
- CSS design tokens, responsive layouts, and reduced-motion fallbacks

No new runtime dependency was added for this implementation.

## Routes

- `/` — Home
- `/services` — Services and process
- `/work` — Selected work
- `/work/inventory-management` — Inventory management project
- `/work/local-discovery` — Local discovery concept
- `/work/cafe-presence` — Café website concept
- `/about` — Approach and principles
- `/contact` — Project enquiry
- `/inventory.html` and `/services.html` — Legacy-path redirects

## Content accuracy

The portfolio currently presents four service areas: business websites, custom web applications, SEO and Google Maps visibility, and responsive interface improvements.

The inventory management system is the only project described as a working product. It is described as a MERN-stack application with product and category records, stock visibility, billing-related workflows, barcode-assisted lookup, and reporting concepts. The live demo remains the source of truth for currently enabled functionality; some business-specific workflows may need configuration or further implementation.

The local discovery and café website entries are explicitly marked as concepts. No fabricated clients, testimonials, certifications, rankings, revenue, time savings, or performance outcomes are published.

Contact address retained from the existing project: `natexworks@gmail.com`.

## Motion architecture

- Home: desktop pinned hero with scroll-progress-driven visual and typography movement.
- Services: pinned, three-stage transformation narrative; the visual composition responds to each stage.
- Work: desktop pinned horizontal editorial gallery. At mobile widths, projects return to a natural vertical list.
- About: restrained parallax on a static visual composition.
- Case studies: scroll-linked image-frame reveal.
- Shared: small optional reveal transitions; all essential content is rendered independently of animation.

GSAP owns scroll-linked transforms. React Three Fiber owns the isolated hero scene. CSS owns layout, focus, responsive behaviour, and reduced-motion fallbacks. Motion is disabled for reduced-motion preferences; pinned and horizontal interactions are restricted to wider screens.

The WebGL hero scene pauses outside its viewport and uses an inline SVG visual fallback on compact screens, reduced-motion devices, or when WebGL is unavailable.

## Environment

Set `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`) to the canonical production origin before deployment. This value is used for canonical metadata, sitemap, and robots sitemap references. Without it, the sitemap intentionally returns no URLs rather than emitting a guessed production domain.

Example:

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.example
```

Do not deploy with the example domain. Replace it with the verified canonical host.

## Local development

```bash
npm ci
npm run dev
```

## Verification commands

```bash
npm run lint
npm run typecheck
npm run build
```

Responsive browser checks should cover 320, 360, 390, 430, 768, 900, 1024, 1280, and 1440+ CSS pixels, plus keyboard-only navigation and reduced-motion settings.

## Contact form behaviour

The contact form validates required fields client-side and prepares a message in the visitor's default email application using a `mailto:` link. It does not send email from the server or store enquiry data. A backend delivery provider would be a separate, explicitly configured integration.

## Reference analysis and limitations

See [docs/reference-analysis.md](docs/reference-analysis.md) for the seven-site research matrix. Some reference sites limit automated inspection or do not expose readable content; such observations are marked as unverified rather than inferred.

## Deployment

No deployment is performed by this repository change. Configure the canonical URL, review the final production content and project demo, run the verification commands, and deploy only through the project's authorised hosting workflow.
