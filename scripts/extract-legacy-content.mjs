import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pages = ["index.html", "services.html", "inventory.html"];
const extractBody = (html) => {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw new Error("Could not find an HTML body");
  return body.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "").trim();
};
const extractScripts = (html) => [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)]
  .filter(([, attributes]) => !/type=["']application\/ld\+json["']/i.test(attributes))
  .map(([, attributes, script]) => /\bsrc=/i.test(attributes) ? "" : script.trim())
  .filter(Boolean).join("\n;\n");

await mkdir(path.join(root, "content"), { recursive: true });
const entries = await Promise.all(pages.map(async (name) => {
  const html = await readFile(path.join(root, name), "utf8");
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map((match) => match[1]).join("\n");
  await writeFile(path.join(root, "public", `${name}.inline.css`), styles);
  await writeFile(path.join(root, "public", `${name}.inline.js`), extractScripts(html));
  return `  ${JSON.stringify(name)}: ${JSON.stringify(extractBody(html))}`;
}));
await writeFile(path.join(root, "content/legacy-markup.ts"),
  `// Generated from the original HTML files. Run npm run content:extract after approved source-copy edits.\nexport const legacyMarkup = {\n${entries.join(",\n")}\n} as const;\n`);
console.log("Extracted visible page markup from all three original pages.");
