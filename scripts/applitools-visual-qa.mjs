import { chromium } from "playwright";
import {
  BatchInfo,
  BrowserType,
  Configuration,
  Eyes,
  Target,
  VisualGridRunner,
} from "@applitools/eyes-playwright";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const routes = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/work", "Selected work"],
];
const viewports = [
  { label: "phone-390", width: 390, height: 844 },
  { label: "desktop-1440", width: 1440, height: 900 },
];

if (!process.env.APPLITOOLS_API_KEY) {
  console.log("Applitools Visual AI checks skipped: APPLITOOLS_API_KEY is not configured.");
  process.exit(0);
}

const runner = new VisualGridRunner({ testConcurrency: 2 });
const configuration = new Configuration();
configuration.setBatch(
  new BatchInfo({
    name: "NatexWorks Portfolio Visual AI",
  }),
);
configuration.addBrowsers(
  { name: BrowserType.CHROME, width: 1440, height: 900 },
  { name: BrowserType.FIREFOX, width: 1440, height: 900 },
  { name: BrowserType.SAFARI, width: 1440, height: 900 },
);

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const [route, routeName] of routes) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      const eyes = new Eyes(runner, configuration);
      const testName = routeName + " — " + viewport.label;
      let eyesOpen = false;

      try {
        await eyes.open(
          page,
          "NatexWorks Portfolio",
          testName,
          { width: viewport.width, height: viewport.height },
        );
        eyesOpen = true;

        const response = await page.goto(baseURL + route, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        if (!response || response.status() !== 200) {
          throw new Error(testName + ": expected HTTP 200 before Visual AI checkpoint");
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
        await eyes.check("Full page", Target.window().fully());
      } catch (error) {
        failures.push(testName + ": " + (error?.stack || error?.message || String(error)));
        throw error;
      } finally {
        if (eyesOpen) await eyes.close();
        await context.close();
      }
    }
  }

  const results = await runner.getAllTestResults();
  console.log("Applitools Visual AI results:", results.toString());
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
