import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
const appOrigin = new URL(baseURL).origin;
const routes = [
  "/",
  "/services",
  "/work",
  "/work/inventory-management",
  "/work/local-discovery",
  "/work/cafe-presence",
  "/about",
  "/contact",
  "/start-project",
  "/inventory.html",
  "/services.html",
  "/index.html",
];
const failures = [];
const applicationNetworkFailures = [];
const thirdPartyWarnings = [];
const routeResults = [];
await mkdir("artifacts/browser-qa", { recursive: true });

function classifyNetworkIssue(entry) {
  try {
    return new URL(entry.url).origin === appOrigin
      ? applicationNetworkFailures
      : thirdPartyWarnings;
  } catch {
    return applicationNetworkFailures;
  }
}

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader"],
});

try {
  for (const route of routes) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();

    page.on("requestfailed", (request) => {
      const entry = {
        route,
        url: request.url(),
        error: request.failure()?.errorText || "request failed",
      };
      classifyNetworkIssue(entry).push(entry);
    });
    page.on("response", (response) => {
      if (response.status() < 400) return;
      const entry = { route, url: response.url(), status: response.status() };
      classifyNetworkIssue(entry).push(entry);
    });
    page.on("pageerror", (error) => failures.push(route + ": " + (error.stack || error.message)));

    const response = await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    await page.locator("main h1").waitFor({ state: "visible" });
    if (!response || response.status() >= 400) {
      failures.push(route + ": route did not load successfully");
    }
    const result = await page.evaluate(() => ({
      title: document.title,
      heading: document.querySelector("main h1")?.textContent?.trim() || "",
      mainVisible: Boolean(document.querySelector("main")?.getClientRects().length),
    }));
    if (!result.title || !result.heading || !result.mainVisible) {
      failures.push(route + ": essential page content was not available");
    }

    const externalLinks = await page.locator('a[href^="http"]').evaluateAll((nodes) =>
      [...new Set(nodes.map((node) => node.href).filter((href) => new URL(href).origin !== location.origin))],
    );
    for (const url of externalLinks) {
      try {
        const linkResponse = await page.request.get(url, { timeout: 10000, maxRedirects: 5 });
        if (linkResponse.status() >= 400) {
          thirdPartyWarnings.push({ route, url, status: linkResponse.status(), kind: "external-link-check" });
        }
      } catch (error) {
        thirdPartyWarnings.push({ route, url, error: String(error).slice(0, 180), kind: "external-link-check" });
      }
    }

    routeResults.push({ route, ...result, externalLinksChecked: externalLinks.length });
    await context.close();
  }

  // External font providers are optional visual dependencies. Blocking them
  // must not make core page content disappear or prevent basic interaction.
  const fontContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const fontPage = await fontContext.newPage();
  const fontRequestFailures = [];
  await fontPage.route("https://fonts.googleapis.com/**", (route) => route.abort("failed"));
  await fontPage.route("https://fonts.gstatic.com/**", (route) => route.abort("failed"));
  fontPage.on("requestfailed", (request) => {
    fontRequestFailures.push({
      url: request.url(),
      error: request.failure()?.errorText || "request failed",
    });
  });
  fontPage.on("pageerror", (error) => failures.push("blocked-font scenario: " + (error.stack || error.message)));
  await fontPage.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
  await fontPage.locator("main h1").waitFor({ state: "visible" });
  const fontFallback = await fontPage.evaluate(() => ({
    headingVisible: Boolean(document.querySelector("main h1")?.getClientRects().length),
    bodyTextPresent: Boolean(document.querySelector("main")?.textContent?.trim()),
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
  }));
  if (!fontFallback.headingVisible || !fontFallback.bodyTextPresent || fontFallback.horizontalOverflow) {
    failures.push("The homepage did not remain usable when external Google Fonts were unavailable");
  }
  await fontPage.screenshot({ path: "artifacts/browser-qa/font-fallback-390.png", fullPage: true });
  await fontContext.close();

  // The local Earth map is a non-essential visual asset. The Three.js scene
  // should retain its base sphere when the geographic texture request fails.
  const earthContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const earthPage = await earthContext.newPage();
  const earthRequestFailures = [];
  const expectedTextureErrors = [];
  await earthPage.route("**/earth-land.json", (route) => route.abort("failed"));
  earthPage.on("requestfailed", (request) => {
    if (new URL(request.url()).pathname === "/earth-land.json") {
      earthRequestFailures.push(request.failure()?.errorText || "request failed");
    }
  });
  earthPage.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("Earth texture preparation failed")) {
      expectedTextureErrors.push(message.text());
    }
  });
  earthPage.on("pageerror", (error) => failures.push("blocked-Earth-texture scenario: " + (error.stack || error.message)));
  await earthPage.goto(baseURL + "/work/local-discovery", { waitUntil: "domcontentloaded" });
  const globe = earthPage.locator("[data-discovery-globe]").first();
  await globe.scrollIntoViewIfNeeded();
  await earthPage.locator("[data-discovery-globe] canvas, [data-discovery-globe] .discovery-globe__fallback").first().waitFor({ state: "visible" });
  const earthFallback = await globe.evaluate((root) => ({
    rootVisible: Boolean(root.getClientRects().length),
    canvasPresent: Boolean(root.querySelector("canvas")),
    fallbackPresent: Boolean(root.querySelector(".discovery-globe__fallback")),
    textureReady: root.getAttribute("data-earth-texture-ready"),
    webglReady: root.getAttribute("data-webgl-ready"),
  }));
  if (!earthFallback.rootVisible || (!earthFallback.canvasPresent && !earthFallback.fallbackPresent)) {
    failures.push("The Local Discovery visual disappeared when its optional Earth map asset failed");
  }
  if (earthRequestFailures.length === 0) {
    failures.push("The Earth texture failure simulation did not intercept the local map asset");
  }
  await earthPage.screenshot({ path: "artifacts/browser-qa/earth-texture-fallback-1280.png", fullPage: true });
  await earthContext.close();

  if (applicationNetworkFailures.length) {
    failures.push(...applicationNetworkFailures.map((entry) => "Application network failure: " + JSON.stringify(entry)));
  }

  const report = {
    baseURL,
    routesChecked: routeResults.length,
    routeResults,
    applicationNetworkFailures,
    thirdPartyWarnings,
    degradationChecks: {
      externalFonts: {
        blockedRequests: fontRequestFailures,
        contentRemainedUsable: fontFallback,
      },
      earthMap: {
        blockedRequests: earthRequestFailures,
        expectedConsoleErrors: expectedTextureErrors,
        fallbackState: earthFallback,
      },
    },
    failures,
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
