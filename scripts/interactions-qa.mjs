import { chromium } from "playwright";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
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
];
const failures = [];
const browserErrors = [];
const routeResults = [];
let internalLinksClicked = 0;
let mobileMenuLinksClicked = 0;
let buttonsClicked = 0;
let clickActions = 0;
let externalTargetsValidated = 0;
let activeRoute = "initial";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader"],
});

function parseTarget(href) {
  try {
    return new URL(href, baseURL);
  } catch {
    return null;
  }
}

async function assertDestination(page, expected, context) {
  await page.waitForURL(
    (url) =>
      url.origin === expected.origin &&
      url.pathname === expected.pathname &&
      url.search === expected.search &&
      (!expected.hash || url.hash === expected.hash),
    { timeout: 9000 },
  ).catch(() => {});
  const actual = new URL(page.url());
  const ok =
    actual.origin === expected.origin &&
    actual.pathname === expected.pathname &&
    actual.search === expected.search &&
    (!expected.hash || actual.hash === expected.hash);
  if (!ok) failures.push(context + ": expected " + expected.pathname + expected.search + expected.hash + " but landed on " + actual.pathname + actual.search + actual.hash);
  return ok;
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => browserErrors.push(activeRoute + ": " + (error.stack || error.message)));

  // Visit every public route and click every visible same-site link individually.
  for (const route of routes) {
    activeRoute = route;
    const response = await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(100);
    if (!response || response.status() >= 400) {
      failures.push(route + ": HTTP " + (response?.status() ?? "no response"));
      continue;
    }
    await page.waitForTimeout(100);

    const summary = await page.evaluate(() => ({
      title: document.title,
      h1Count: document.querySelectorAll("main h1").length,
      links: [...document.querySelectorAll("a[href]")].map((anchor, index) => {
        const style = getComputedStyle(anchor);
        return {
          index,
          href: anchor.getAttribute("href") || "",
          target: anchor.getAttribute("target") || "",
          skipLink: anchor.classList.contains("skip-link"),
          visible: Boolean(anchor.getClientRects().length) && style.display !== "none" && style.visibility !== "hidden",
        };
      }),
    }));
    if (!summary.title.trim()) failures.push(route + ": empty document title");
    if (summary.h1Count !== 1) failures.push(route + ": expected one main h1, found " + summary.h1Count);

    // The skip link is intentionally visually hidden until keyboard focus.
    // Focus it first, then click the revealed control to verify its destination.
    const skipLink = page.locator("a.skip-link");
    if (await skipLink.count()) {
      await skipLink.focus();
      if (!(await skipLink.isVisible())) failures.push(route + ": skip link did not become visible on keyboard focus");
      // Same-document hash jumps do not create a full page navigation.
      // Dispatch the real anchor click without asking Playwright to await a load event.
      await skipLink.evaluate((element) => element.click());
      await page.waitForFunction(() => window.location.hash === "#main-content", null, { timeout: 2500 });
      if (new URL(page.url()).hash !== "#main-content") {
        failures.push(route + ": skip link did not navigate to #main-content");
      } else {
        clickActions += 1;
      }
    }

    let routeClicks = 0;
    for (const item of summary.links) {
      if (item.skipLink || !item.visible || !item.href) continue;
      const expected = parseTarget(item.href);
      if (!expected) {
        failures.push(route + ": malformed link " + item.href);
        continue;
      }
      if (expected.protocol === "mailto:" || expected.protocol === "tel:") {
        externalTargetsValidated += 1;
        continue;
      }
      if (expected.protocol !== "http:" && expected.protocol !== "https:") {
        failures.push(route + ": unsupported link scheme " + item.href);
        continue;
      }
      if (expected.origin !== new URL(baseURL).origin) {
        externalTargetsValidated += 1;
        continue;
      }

      if (expected.hash && expected.pathname === new URL(baseURL + route).pathname) {
        const id = decodeURIComponent(expected.hash.slice(1));
        if (route === "/") await page.waitForSelector("#" + id, { timeout: 5000 }).catch(() => {});
        const exists = await page.evaluate((targetId) => Boolean(document.getElementById(targetId)), id);
        if (!exists) {
          failures.push(route + ": broken in-page anchor " + expected.hash);
          continue;
        }
      }

      await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(100);
      const link = page.locator("a[href]").nth(item.index);
      if (!(await link.isVisible().catch(() => false))) continue;
      await link.scrollIntoViewIfNeeded();

      try {
        const popupPromise = item.target === "_blank"
          ? context.waitForEvent("page", { timeout: 5000 }).catch(() => null)
          : null;
        await link.click({ timeout: 7000 });

        if (item.target === "_blank") {
          const popup = await popupPromise;
          if (!popup) {
            failures.push(route + ": target=_blank link failed to open " + item.href);
          } else {
            await popup.waitForLoadState("domcontentloaded", { timeout: 7000 }).catch(() => {});
            const opened = new URL(popup.url());
            if (opened.origin !== expected.origin || opened.pathname !== expected.pathname) {
              failures.push(route + ": popup destination mismatch for " + item.href);
            }
            await popup.close().catch(() => {});
          }
        } else {
          await assertDestination(page, expected, route + " link " + item.href);
        }
        routeClicks += 1;
        internalLinksClicked += 1;
        clickActions += 1;
      } catch (error) {
        failures.push(route + ": click failed for " + item.href + " — " + String(error).slice(0, 200));
      }
    }

    routeResults.push({ route, visibleLinks: summary.links.filter((item) => item.visible).length, internalLinksClicked: routeClicks });
  }

  // On each page, operate the hamburger and click every destination in its mobile menu.
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 820 });
  for (const route of routes) {
    activeRoute = route + " mobile menu";
    await mobile.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    await mobile.waitForTimeout(120);
    const toggle = mobile.locator(".menu-toggle");
    if (!(await toggle.count())) continue;
    await toggle.click();
    clickActions += 1;
    if (await toggle.getAttribute("aria-expanded") !== "true") {
      failures.push(route + ": mobile menu did not open");
      continue;
    }
    const destinations = await mobile.locator("#mobile-navigation a[href]").evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute("href") || ""),
    );
    for (let index = 0; index < destinations.length; index += 1) {
      const href = destinations[index];
      const expected = parseTarget(href);
      if (!expected || expected.origin !== new URL(baseURL).origin) {
        failures.push(route + ": invalid mobile menu link " + href);
        continue;
      }
      await mobile.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    await mobile.waitForTimeout(120);
      await mobile.locator(".menu-toggle").click();
      clickActions += 1;
      try {
        await mobile.locator("#mobile-navigation a[href]").nth(index).click({ timeout: 5000 });
        await assertDestination(mobile, expected, route + " mobile menu " + href);
        mobileMenuLinksClicked += 1;
        clickActions += 1;
      } catch (error) {
        failures.push(route + ": mobile menu click failed for " + href + " — " + String(error).slice(0, 180));
      }
    }

    await mobile.goto(baseURL + route, { waitUntil: "domcontentloaded" });
    await mobile.waitForTimeout(120);
    await mobile.locator(".menu-toggle").click();
    await mobile.keyboard.press("Escape");
    if (await mobile.locator(".menu-toggle").getAttribute("aria-expanded") !== "false") {
      failures.push(route + ": Escape did not close the mobile menu");
    }
    if (!(await mobile.locator(".menu-toggle").evaluate((node) => node === document.activeElement))) {
      failures.push(route + ": Escape did not restore focus to the menu toggle");
    }
  }

  // Click all visible non-menu buttons which are not form submit actions.
  for (const route of routes) {
    activeRoute = route + " buttons";
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(100);
    const buttons = await page.locator("button").evaluateAll((nodes) =>
      nodes.map((node, index) => {
        const style = getComputedStyle(node);
        return {
          index,
          visible: Boolean(node.getClientRects().length) && style.display !== "none" && style.visibility !== "hidden",
          menu: node.classList.contains("menu-toggle"),
          submit: (node.getAttribute("type") || "implicit") === "submit",
          inForm: Boolean(node.closest("form")),
          label: (node.innerText || node.getAttribute("aria-label") || "").trim(),
          disabled: node.hasAttribute("disabled"),
        };
      }),
    );
    for (const item of buttons) {
      if (!item.visible || item.menu || item.disabled || (item.submit && item.inForm)) continue;
      if (!item.label) failures.push(route + ": visible button is missing an accessible name");
      await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(100);
      const button = page.locator("button").nth(item.index);
      if (!(await button.isVisible().catch(() => false))) continue;
      try {
        await button.click({ timeout: 5000 });
        buttonsClicked += 1;
        clickActions += 1;
      } catch (error) {
        failures.push(route + ": button click failed — " + String(error).slice(0, 180));
      }
    }
  }

  // Check required-field blocking and the successful email-draft handoff on both forms.
  for (const route of ["/contact", "/start-project"]) {
    activeRoute = route + " form";
    await page.goto(baseURL + route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(100);
    const form = page.locator("form").first();
    const submit = form.locator('button[type="submit"]');
    await submit.click();
    clickActions += 1;
    if ((await form.locator(":invalid").count()) === 0) {
      failures.push(route + ": empty required form was not blocked");
    }

    await form.locator('input[name="name"]').fill("Playwright QA");
    await form.locator('input[name="email"]').fill("qa@example.com");
    if (route === "/contact") {
      await form.locator('textarea[name="message"]').fill("Testing the project enquiry flow from the full-site Playwright suite.");
    } else {
      await form.locator('select[name="type"]').selectOption("Business website");
      await form.locator('textarea[name="goal"]').fill("Make the primary website journey clearer and easier to complete.");
    }
    await submit.click();
    clickActions += 1;
    const status = await form.locator('[role="status"]').textContent();
    if (!status || !status.includes("email app")) {
      failures.push(route + ": valid submit did not prepare the email-draft status");
    }
    if (new URL(page.url()).pathname !== route) {
      failures.push(route + ": form navigated away during email-draft handoff");
    }
  }

  // Verify the local-discovery artwork is an actual WebGL globe, not the old flat SVG.
  activeRoute = "/work/local-discovery WebGL";
  await page.setViewportSize({ width: 1280, height: 900 });
  const earthAssetResponses = [];
  page.on("response", (response) => {
    if (new URL(response.url()).pathname === "/earth-land.json") {
      earthAssetResponses.push({ status: response.status(), bytes: Number(response.headers()["content-length"] || 0) });
    }
  });
  await page.goto(baseURL + "/work/local-discovery", { waitUntil: "domcontentloaded" });
  const globe = page.locator("[data-discovery-globe]").first();
  await globe.scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-discovery-globe] canvas", { timeout: 20000 }).catch(() => {});
  await page.waitForFunction(() => {
    const node = document.querySelector("[data-discovery-globe]");
    return node?.getAttribute("data-earth-texture-ready") === "true";
  }, { timeout: 25000 }).catch(() => {});
  await page.waitForFunction(() => {
    const node = document.querySelector("[data-discovery-globe]");
    return node?.getAttribute("data-webgl-ready") === "ready";
  }, { timeout: 15000 }).catch(() => {});
  const globeState = await globe.evaluate((root) => {
    const canvas = root.querySelector("canvas");
    if (!canvas) {
      return {
        canvas: false, webgl: false, width: 0, height: 0,
        textureReady: root.getAttribute("data-earth-texture-ready"),
        landPolygons: Number(root.getAttribute("data-earth-land-polygons") || 0),
        motion: root.getAttribute("data-earth-motion"),
      };
    }
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return {
      canvas: true,
      webgl: Boolean(context),
      width: canvas.width,
      height: canvas.height,
      textureReady: root.getAttribute("data-earth-texture-ready"),
      landPolygons: Number(root.getAttribute("data-earth-land-polygons") || 0),
      webglReady: root.getAttribute("data-webgl-ready"),
      motion: root.getAttribute("data-earth-motion"),
      rotation: root.getAttribute("data-earth-rotation"),
    };
  });
  if (!globeState.canvas || !globeState.webgl || globeState.width < 100 || globeState.height < 100) {
    failures.push("Earth did not initialise as a visible WebGL canvas: " + JSON.stringify(globeState));
  }
  if (globeState.textureReady !== "true" || globeState.landPolygons < 80) {
    failures.push("Earth's local geographic land texture did not load: " + JSON.stringify(globeState));
  }
  if (globeState.webglReady !== "ready" || globeState.motion !== "rotating") {
    failures.push("Earth WebGL or rotation state did not become active: " + JSON.stringify(globeState));
  }
  if (!earthAssetResponses.some((response) => response.status === 200)) {
    failures.push("Earth's local land geometry asset did not return HTTP 200");
  }

  const firstRotation = Number(globeState.rotation);
  await page.waitForTimeout(800);
  const secondRotation = Number(await globe.getAttribute("data-earth-rotation"));
  const rotationChanged = Number.isFinite(firstRotation) && Number.isFinite(secondRotation) &&
    Math.abs(secondRotation - firstRotation) > 0.001;
  if (!rotationChanged) {
    failures.push("Earth sphere did not rotate over time: first=" + globeState.rotation + ", second=" + secondRotation);
  }

  // Reduced motion keeps the 3D object available but pauses all continuous rotation.
  const earthReducedContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const earthReducedPage = await earthReducedContext.newPage();
  earthReducedPage.on("pageerror", (error) => browserErrors.push("reduced-motion Earth: " + (error.stack || error.message)));
  await earthReducedPage.goto(baseURL + "/work/local-discovery", { waitUntil: "domcontentloaded" });
  const reducedGlobe = earthReducedPage.locator("[data-discovery-globe]").first();
  await reducedGlobe.scrollIntoViewIfNeeded();
  await earthReducedPage.waitForSelector("[data-discovery-globe] canvas", { timeout: 20000 }).catch(() => {});
  await earthReducedPage.waitForFunction(() => {
    const node = document.querySelector("[data-discovery-globe]");
    return node?.getAttribute("data-earth-texture-ready") === "true";
  }, { timeout: 25000 }).catch(() => {});
  await earthReducedPage.waitForTimeout(550);
  const reducedEarthState = await reducedGlobe.evaluate((root) => ({
    motion: root.getAttribute("data-earth-motion"),
    rotation: root.getAttribute("data-earth-rotation"),
    textureReady: root.getAttribute("data-earth-texture-ready"),
  }));
  if (reducedEarthState.motion !== "paused" || reducedEarthState.rotation !== null ||
      reducedEarthState.textureReady !== "true") {
    failures.push("Reduced-motion Earth did not remain textured and paused: " + JSON.stringify(reducedEarthState));
  }
  await earthReducedContext.close();

  if (browserErrors.length) failures.push(...browserErrors.map((error) => "Uncaught browser error: " + error));

  const report = {
    baseURL,
    routesVisited: routes.length,
    internalLinksClicked,
    mobileMenuLinksClicked,
    otherButtonsClicked: buttonsClicked,
    clickActions,
    emailAndExternalLinksValidatedNotLaunched: externalTargetsValidated,
    globe: globeState,
    routeResults,
    browserErrors,
    failures,
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;

  await mobile.close();
  await context.close();
} finally {
  await browser.close();
}
