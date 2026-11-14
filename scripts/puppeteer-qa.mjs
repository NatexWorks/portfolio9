import puppeteer from "puppeteer-core";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const routes = [
  "/",
  "/services",
  "/work",
  "/work/inventory-management",
  "/work/local-discovery",
  "/work/cafe-presence",
  "/inventory.html",
  "/about",
  "/contact",
  "/start-project",
];
const viewports = [
  { label: "phone", width: 390, height: 844 },
  { label: "desktop", width: 1440, height: 900 },
];
const screenshotRoutes = new Set(["/", "/services", "/work"]);
const failures = [];
const results = [];
const browserErrors = [];

await mkdir("artifacts/puppeteer-qa", { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromium.executablePath(),
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  for (const route of routes) {
    const page = await browser.newPage();
    page.on("pageerror", (error) => browserErrors.push(route + ": " + error.message));
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(route + ": " + message.text());
    });

    const routeResults = [];
    for (const viewport of viewports) {
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
      });

      const response = await page.goto(baseURL + route, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      if (!response || response.status() !== 200) {
        failures.push(
          route + " (" + viewport.label + "): expected HTTP 200, got " +
          (response?.status() ?? "no response"),
        );
      }

      await page.waitForSelector("main", { visible: true, timeout: 15000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
        window.scrollTo(0, 0);
      });

      const state = await page.evaluate(() => ({
        title: document.title,
        h1Count: document.querySelectorAll("main h1").length,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
      }));
      const overflow = Math.max(state.documentWidth, state.bodyWidth) - state.viewportWidth;

      if (!state.title.trim()) failures.push(route + ": document title is empty");
      if (state.h1Count !== 1) failures.push(route + ": expected one main h1, got " + state.h1Count);
      if (overflow > 1) failures.push(route + " (" + viewport.label + "): horizontal overflow " + overflow + "px");

      routeResults.push({
        viewport: viewport.label,
        status: response?.status() ?? null,
        overflow: Math.max(0, overflow),
        title: state.title,
      });

      if (screenshotRoutes.has(route)) {
        const filename = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
        await page.screenshot({
          path: "artifacts/puppeteer-qa/" + filename + "-" + viewport.width + ".png",
          fullPage: true,
        });
      }
    }

    results.push({ route, viewports: routeResults });
    await page.close();
  }

  const report = {
    baseURL,
    engine: "Puppeteer",
    routesChecked: routes.length,
    viewportWidths: viewports.map(({ width }) => width),
    screenshots: screenshotRoutes.size * viewports.length,
    browserErrors,
    failures,
    results,
  };
  console.log(JSON.stringify(report, null, 2));
  if (browserErrors.length || failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
