import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import pngjs from "pngjs";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const { PNG } = pngjs;
const mode = process.argv[2];
if (mode !== "reference" && mode !== "test") {
  throw new Error("Usage: node scripts/visual-regression.mjs <reference|test>");
}

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const baselineDir = "visual-regression/baselines";
const currentDir = "artifacts/visual-regression/current";
const diffDir = "artifacts/visual-regression/diff";
const reportDir = "artifacts/visual-regression";
const mismatchLimitPercent = Number(process.env.VISUAL_MISMATCH_LIMIT_PERCENT || "0.15");

if (!Number.isFinite(mismatchLimitPercent) || mismatchLimitPercent < 0 || mismatchLimitPercent > 100) {
  throw new Error("VISUAL_MISMATCH_LIMIT_PERCENT must be a number from 0 to 100.");
}

const scenarios = [
  { label: "Home", route: "/" },
  { label: "Services", route: "/services" },
  { label: "Selected work", route: "/work" },
  { label: "Inventory case study", route: "/work/inventory-management" },
  { label: "Contact", route: "/contact" },
];
const viewports = [
  { label: "phone", width: 390, height: 844 },
  { label: "desktop", width: 1440, height: 900 },
];
const failures = [];
const results = [];

await Promise.all([
  mkdir(currentDir, { recursive: true }),
  mkdir(diffDir, { recursive: true }),
  mkdir(reportDir, { recursive: true }),
]);
if (mode === "reference") await mkdir(baselineDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  for (const scenario of scenarios) {
    for (const viewport of viewports) {
      const fileStem = (scenario.route === "/" ? "home" : scenario.route.slice(1).replaceAll("/", "-")) +
        "-" + viewport.width;
      const currentPath = path.join(currentDir, fileStem + ".png");
      const baselinePath = path.join(baselineDir, fileStem + ".png");
      const diffPath = path.join(diffDir, fileStem + "-diff.png");
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();

      try {
        const response = await page.goto(baseURL + scenario.route, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        if (!response || (!response.ok() && response.status() !== 304)) {
          throw new Error(scenario.label + ": expected a successful page response, got " +
            (response?.status() ?? "no response"));
        }

        await page.locator("main").waitFor({ state: "visible", timeout: 15000 });
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
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
        await page.evaluate(async () => {
          await document.fonts.ready;
          window.scrollTo(0, 0);
        });
        await page.screenshot({
          path: currentPath,
          fullPage: true,
          animations: "disabled",
          caret: "hide",
        });

        if (mode === "reference") {
          await writeFile(baselinePath, await readFile(currentPath));
          results.push({
            route: scenario.route,
            viewport: viewport.label,
            status: "reference-written",
            baseline: baselinePath,
          });
          continue;
        }

        if (!existsSync(baselinePath)) {
          results.push({
            route: scenario.route,
            viewport: viewport.label,
            status: "baseline-not-yet-seeded",
            current: currentPath,
          });
          continue;
        }

        const reference = PNG.sync.read(await readFile(baselinePath));
        const actual = PNG.sync.read(await readFile(currentPath));
        if (reference.width !== actual.width || reference.height !== actual.height) {
          failures.push(
            scenario.label + " (" + viewport.label + "): image dimensions changed from " +
            reference.width + "x" + reference.height + " to " + actual.width + "x" + actual.height,
          );
          results.push({
            route: scenario.route,
            viewport: viewport.label,
            status: "dimension-mismatch",
            expected: { width: reference.width, height: reference.height },
            actual: { width: actual.width, height: actual.height },
          });
          continue;
        }

        const diff = new PNG({ width: actual.width, height: actual.height });
        const diffPixels = pixelmatch(
          reference.data,
          actual.data,
          diff.data,
          actual.width,
          actual.height,
          { threshold: 0.1, includeAA: false },
        );
        const totalPixels = actual.width * actual.height;
        const mismatchPercent = (diffPixels / totalPixels) * 100;
        await writeFile(diffPath, PNG.sync.write(diff));

        results.push({
          route: scenario.route,
          viewport: viewport.label,
          status: mismatchPercent > mismatchLimitPercent ? "failed" : "passed",
          diffPixels,
          mismatchPercent: Number(mismatchPercent.toFixed(4)),
          mismatchLimitPercent,
          current: currentPath,
          baseline: baselinePath,
          diff: diffPath,
        });
        if (mismatchPercent > mismatchLimitPercent) {
          failures.push(
            scenario.label + " (" + viewport.label + "): " +
            mismatchPercent.toFixed(4) + "% different pixels exceeds " +
            mismatchLimitPercent + "% limit",
          );
        }
      } finally {
        await context.close();
      }
    }
  }

  const missingBaselines = results.filter((item) => item.status === "baseline-not-yet-seeded").length;
  const report = {
    baseURL,
    engine: "Playwright Chromium + pixelmatch",
    mode,
    mismatchLimitPercent,
    scenarios: scenarios.length,
    viewports: viewports.map(({ width, height }) => ({ width, height })),
    baselineMissing: missingBaselines,
    failures,
    results,
  };
  await writeFile(path.join(reportDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
