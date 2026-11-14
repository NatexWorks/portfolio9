const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";

const routes = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Selected work", path: "/work" },
  { label: "Inventory case study", path: "/work/inventory-management" },
  { label: "Contact", path: "/contact" },
];

module.exports = {
  id: "natexworks-portfolio",
  viewports: [
    { label: "phone-390", width: 390, height: 844 },
    { label: "desktop-1440", width: 1440, height: 900 },
  ],
  scenarios: routes.map(({ label, path }) => ({
    label,
    url: baseURL + path,
    readySelector: "main",
    delay: 350,
    selectors: ["document"],
    misMatchThreshold: 0.15,
    requireSameDimensions: true,
  })),
  scenarioDefaults: {
    readySelector: "main",
    delay: 350,
    selectors: ["document"],
    misMatchThreshold: 0.15,
    requireSameDimensions: true,
  },
  paths: {
    bitmaps_reference: "backstop_data/bitmaps_reference",
    bitmaps_test: "backstop_data/bitmaps_test",
    engine_scripts: "backstop_data/engine_scripts",
    html_report: "backstop_data/html_report",
    ci_report: "backstop_data/ci_report",
  },
  onReadyScript: "disable-motion.js",
  engine: "playwright",
  engineOptions: {
    browser: "chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  asyncCaptureLimit: 2,
  asyncCompareLimit: 4,
  report: ["browser", "CI", "json"],
  debug: false,
  debugWindow: false,
  archiveReport: true,
  scenarioLogsInReports: true,
};
