module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:3000/",
        "http://127.0.0.1:3000/services",
        "http://127.0.0.1:3000/work",
        "http://127.0.0.1:3000/work/local-discovery",
        "http://127.0.0.1:3000/contact",
      ],
      numberOfRuns: 1,
      settings: {
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 1,
          disabled: false,
        },
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:performance": "off",
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": "off",
        "categories:seo": ["warn", { minScore: 0.9 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.25 }],
        "total-blocking-time": ["warn", { maxNumericValue: 600 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "artifacts/lighthouse",
    },
  },
};
