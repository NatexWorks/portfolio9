import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
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
const widths = [320, 360, 390, 430, 768, 1024, 1280, 1440];
const failures = [];
const results = [];
const browserErrors = [];
await mkdir("artifacts/browser-qa", { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const route of routes) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => browserErrors.push(route + ": " + error.message));
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(route + ": " + message.text());
    });

    const response = await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    if (!response || response.status() !== 200) {
      failures.push(route + ": expected HTTP 200, got " + (response?.status() ?? "no response"));
    }

    if (route === "/") {
      const labels = await page.locator("[data-workflow-card] h3").allTextContents();
      if (labels.join("|") !== "Catalog|Stock|Checkout|Barcode") {
        failures.push("Homepage workflow cards are missing or not in Catalog → Stock → Checkout → Barcode order");
      }
    }

    const title = await page.title();
    const h1Count = await page.locator("main h1").count();
    if (!title.trim()) failures.push(route + ": document title is empty");
    if (h1Count !== 1) failures.push(route + ": expected one main h1, got " + h1Count);

    const uniqueInternal = await page.locator('a[href^="/"]').evaluateAll((anchors) =>
      [...new Set(anchors.map((anchor) => anchor.getAttribute("href")).filter(Boolean))],
    );
    for (const href of uniqueInternal) {
      if (href.startsWith("//") || href.startsWith("/#")) continue;
      const check = await page.request.get(new URL(href, baseURL).toString(), { maxRedirects: 5 });
      if (!check.ok()) failures.push(route + ": internal link " + href + " returned " + check.status());
    }

    const viewportResults = [];
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 500 ? 820 : 1000 });
      await page.waitForTimeout(70);
      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        headingCount: document.querySelectorAll("main h1").length,
      }));
      const overflow = Math.max(dimensions.document, dimensions.body) - dimensions.viewport;
      viewportResults.push({ width, overflow: Math.max(0, overflow) });
      if (overflow > 1) failures.push(route + " at " + width + "px: horizontal overflow " + overflow + "px");
    }

    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: width < 500 ? 820 : 1000 });
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      for (const violation of axe.violations) {
        for (const node of violation.nodes) {
          failures.push(
            route + " at " + width + "px: axe " + violation.id +
            " on " + node.target.join(", ") + ": " +
            (node.failureSummary || violation.help) +
            " | " + node.html.slice(0, 320),
          );
        }
      }
    }

    await page.setViewportSize({ width: 390, height: 820 });
    await page.screenshot({ path: "artifacts/browser-qa/" + route.replaceAll("/", "_").replace(/^_$/, "home") + "-390.png", fullPage: true });
    if (route === "/" || route === "/services" || route === "/work") {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.screenshot({ path: "artifacts/browser-qa/" + route.replaceAll("/", "_").slice(1) + "-1440.png", fullPage: true });
    }

    results.push({ route, title, viewports: viewportResults });
    await context.close();
  }

  const menuContext = await browser.newContext({ viewport: { width: 390, height: 820 } });
  const menuPage = await menuContext.newPage();
  await menuPage.goto(baseURL + "/about", { waitUntil: "domcontentloaded" });
  const toggle = menuPage.locator(".menu-toggle");
  await toggle.click();
  if (await toggle.getAttribute("aria-expanded") !== "true") failures.push("Mobile menu did not open");
  await menuPage.keyboard.press("Escape");
  if (await toggle.getAttribute("aria-expanded") !== "false") failures.push("Escape did not close the mobile menu");
  if (!(await toggle.evaluate((element) => element === document.activeElement))) failures.push("Escape did not return focus to the menu toggle");
  await menuContext.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
  await reducedPage.waitForTimeout(150);
  if (await reducedPage.locator(".hero-scene canvas").count() !== 0) {
    failures.push("Reduced-motion mode should use the static hero fallback");
  }
  await reducedContext.close();


  const scrollProgressResults = [];
  const scrollSequences = [
    { route: "/", section: ".hero-story", target: ".hero-story__visual", delta: 320 },
    { route: "/services", section: ".service-transform", target: ".service-transform__art", delta: 320 },
    { route: "/work", section: ".work-gallery", target: ".work-gallery__track", delta: 320 },
  ];

  for (const sequence of scrollSequences) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.on("pageerror", (error) => browserErrors.push(sequence.route + " scroll test: " + error.message));
    await page.goto(baseURL + sequence.route, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);

    const section = page.locator(sequence.section);
    const target = page.locator(sequence.target);
    if (!(await section.count()) || !(await target.count())) {
      failures.push(sequence.route + ": scroll system target not found");
      await context.close();
      continue;
    }

    const sectionTop = await section.evaluate((element) =>
      element.getBoundingClientRect().top + window.scrollY,
    );
    await page.evaluate((top) => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo({ top, behavior: "instant" });
    }, sectionTop);
    await page.waitForTimeout(450);

    const before = await target.evaluate((element) => ({
      transform: getComputedStyle(element).transform,
      top: element.getBoundingClientRect().top,
    }));

    await page.evaluate((delta) =>
      window.scrollTo({ top: window.scrollY + delta, behavior: "instant" }),
    sequence.delta);
    await page.waitForTimeout(500);

    const after = await target.evaluate((element) => ({
      transform: getComputedStyle(element).transform,
      top: element.getBoundingClientRect().top,
    }));
    const sectionTopAfter = await section.evaluate((element) => element.getBoundingClientRect().top);
    const moved = before.transform !== after.transform;
    const pinned = Math.abs(sectionTopAfter) <= 3;

    scrollProgressResults.push({
      route: sequence.route,
      transformChanged: moved,
      pinnedAtTop: pinned,
      before: before.transform,
      after: after.transform,
    });
    if (!moved) failures.push(sequence.route + ": scroll progress did not change the target transform");
    if (!pinned) failures.push(sequence.route + ": pinned section did not remain at the viewport top");
    await context.close();
  }


  // Mobile workflow story: verify the GSAP/ScrollTrigger stack is tied to
  // scroll progress, keeps every card reachable, and hands off to the next panel.
  const workflowContext = await browser.newContext({
    viewport: { width: 390, height: 820 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const workflowPage = await workflowContext.newPage();
  workflowPage.on("pageerror", (error) => browserErrors.push("mobile workflow: " + error.message));
  await workflowPage.goto(baseURL + "/", { waitUntil: "domcontentloaded" });

  const workflowReady = await workflowPage.waitForFunction(
    () => document.documentElement.classList.contains("mobile-story-motion-ready"),
    { timeout: 12000 },
  ).then(() => true).catch(() => false);
  if (!workflowReady) {
    failures.push("Mobile workflow: GSAP mobile story did not initialise at 390px");
  } else {
    const stage = workflowPage.locator("[data-mobile-workflow-stage]");
    const stack = workflowPage.locator("[data-mobile-workflow-stack]");
    const cards = workflowPage.locator("[data-workflow-card]");
    const nextPanel = workflowPage.locator("[data-workflow-next-panel]");
    if (await stage.count() !== 1 || await stack.count() !== 1 || await cards.count() !== 4 || await nextPanel.count() !== 1) {
      failures.push("Mobile workflow: expected one stage, one stack, four cards, and one following panel");
    } else {
      const initial = await cards.evaluateAll((nodes) => nodes.map((node) => ({
        opacity: Number.parseFloat(getComputedStyle(node).opacity),
        transform: getComputedStyle(node).transform,
      })));
      const initialNextTransform = await nextPanel.evaluate((node) => getComputedStyle(node).transform);
      const stageTop = await stage.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      const stageHeight = await stage.evaluate((node) => node.getBoundingClientRect().height);
      const start = stageTop - 78;
      const travel = Math.max(window.innerHeight * 1.7, stageHeight - window.innerHeight * 0.15);

      await workflowPage.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start + travel * 0.18);
      await workflowPage.waitForTimeout(180);
      const early = await cards.evaluateAll((nodes) => nodes.map((node) => Number.parseFloat(getComputedStyle(node).opacity)));
      if (!(early[0] > 0.5)) failures.push("Mobile workflow: first card did not reveal with scroll progress");
      if (!(early[1] < early[0])) failures.push("Mobile workflow: cards did not enter in sequence");

      await workflowPage.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start + travel * 0.86);
      await workflowPage.waitForTimeout(220);
      const late = await cards.evaluateAll((nodes) => nodes.map((node) => ({
        opacity: Number.parseFloat(getComputedStyle(node).opacity),
        transform: getComputedStyle(node).transform,
      })));
      if (!late.every((card) => card.opacity > 0.5)) {
        failures.push("Mobile workflow: all four cards were not visible by the end of the scroll sequence");
      }
      if (!late.some((card, index) => card.transform !== initial[index].transform)) {
        failures.push("Mobile workflow: card transforms did not respond to scroll progress");
      }

      await workflowPage.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), start + travel * 0.99);
      await workflowPage.waitForTimeout(180);
      const finalNextTransform = await nextPanel.evaluate((node) => getComputedStyle(node).transform);
      if (finalNextTransform === initialNextTransform) {
        failures.push("Mobile workflow: next section did not animate into the foreground");
      }
    }
  }
  await workflowContext.close();

  // Reduced-motion users get a complete, static card list rather than hidden
  // cards waiting for a scroll-triggered animation.
  const reducedMobileContext = await browser.newContext({
    viewport: { width: 390, height: 820 },
    reducedMotion: "reduce",
    isMobile: true,
    hasTouch: true,
  });
  const reducedMobilePage = await reducedMobileContext.newPage();
  await reducedMobilePage.goto(baseURL + "/", { waitUntil: "domcontentloaded" });
  const reducedWorkflow = await reducedMobilePage.locator("[data-workflow-card]").evaluateAll((nodes) =>
    nodes.map((node) => ({
      opacity: Number.parseFloat(getComputedStyle(node).opacity),
      visibility: getComputedStyle(node).visibility,
      display: getComputedStyle(node).display,
    })),
  );
  if (reducedWorkflow.length !== 4 || !reducedWorkflow.every((card) =>
    card.opacity > 0.99 && card.visibility === "visible" && card.display !== "none"
  )) {
    failures.push("Mobile reduced-motion: all four workflow cards should remain visible without animation");
  }
  await reducedMobileContext.close();

  if (browserErrors.length) failures.push(...browserErrors.map((entry) => "Browser error: " + entry));

  const summary = {
    baseURL,
    routesChecked: routes.length,
    viewportWidths: widths,
    axeViewports: [390, 1440],
    reducedMotion: "checked",
    mobileMenuKeyboard: "checked",
    scrollProgressResults,
    failures,
    results,
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
