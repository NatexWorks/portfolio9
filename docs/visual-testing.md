# Visual QA workflow

The portfolio uses separate tools for separate classes of visual defects:

- **Playwright** checks route behaviour, accessibility, viewport overflow, menus, forms, and scroll-driven interactions.
- **Puppeteer** independently opens the same routes in Chromium and checks page errors, titles, headings, and horizontal overflow.
- **BackstopJS** compares current full-page screenshots against committed reference images at 390px and 1440px.
- **Percy** uploads responsive page snapshots for review in the Percy dashboard.
- **Applitools Eyes** sends visual checkpoints to Visual AI and compares them across Chrome, Firefox, and Safari rendering environments.

## Local commands

Start the production build and server in one terminal:

```bash
npm ci
npm run build
npm run start
```

In another terminal:

```bash
npm run test:browser
npm run test:puppeteer
```

BackstopJS uses committed references. On the first successful push to `main`, CI creates the initial references if none exist. For an intentional design change, regenerate references only after reviewing the visual output:

```bash
npm run visual:backstop:reference
npm run visual:backstop
```

Do not approve new reference images merely to silence a failing comparison. Review the HTML diff report first, then commit the newly reviewed files under `backstop_data/bitmaps_reference/`.

## Cloud service credentials

The Percy and Applitools clients are integrated into the CI workflow, but their cloud uploads require credentials belonging to the relevant projects. Add these as **GitHub Actions repository secrets**; never write the values into source files:

| GitHub secret | Provider | Used for |
| --- | --- | --- |
| `PERCY_TOKEN` | Percy / BrowserStack | Uploading responsive visual snapshots |
| `APPLITOOLS_API_KEY` | Applitools Eyes | Uploading Visual AI checkpoints |

Once the secret exists, the next CI run executes that provider's checks. Without it, that cloud step reports a clear skip; local Playwright, Puppeteer, and BackstopJS checks still run.

## Reports and baselines

CI uploads the Playwright screenshots, Puppeteer screenshots, BackstopJS comparison images, and BackstopJS reports as the `portfolio-visual-qa` workflow artifact.

Generated test screenshots and reports are ignored by Git. Only the reviewed BackstopJS baseline images are committed.
