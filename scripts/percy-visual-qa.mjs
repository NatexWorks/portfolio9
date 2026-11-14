import { chromium } from "playwright";
import percySnapshot from "@percy/playwright";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const routes = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/work", "Selected work"],
  ["/work/inventory-management", "Inventory case study"],
  ["/work/local-discovery", "Local discovery case study"],
  ["/work/cafe-presence", "Cafe case study"],
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/start-project", "Start project"],
  ["/inventory.html", "Inventory demo"],
];

if (!process.env.PERCY_TOKEN) {
  console.log("Percy visual checks skipped: PERCY_TOKEN is not configured.");
  process.exit(0);
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [route, name] of routes) {
    const response = await page.goto(baseURL + route, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (!response || response.status() !== 200) {
      throw new Error(name + ": expected HTTP 200 before Percy snapshot");
    }
    await page.locator("main").waitFor({ state: "attached", timeout: 15000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      window.scrollTo(0, 0);
    });
    await page.addStyleTag({
      content: `
        *,
        *::before,
        *::after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
          caret-color: transparent !important;
        }
        [data-reveal],
        [data-mobile-reveal],
        [data-workflow-card],
        [data-workflow-next-panel] {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
      `,
    });
    await percySnapshot(page, "NatexWorks — " + name, {
      widths: [390, 1440],
      minHeight: 844,
    });
  }
} finally {
  await browser.close();
}
