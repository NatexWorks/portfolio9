import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const generated = await readFile(path.join(root, "content/legacy-markup.ts"), "utf8");
const files = ["index.html", "services.html", "inventory.html"];
const bodyOf = (html) => html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
  ?.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "").trim();
for (const file of files) {
  const line = generated.split("\n").find((row) => row.trimStart().startsWith(`${JSON.stringify(file)}:`));
  if (!line) throw new Error(`No migrated markup entry for ${file}`);
  const migrated = JSON.parse(line.slice(line.indexOf(":") + 1).trim().replace(/,$/, ""));
  const original = bodyOf(await readFile(path.join(root, file), "utf8"));
  if (migrated !== original) throw new Error(`Visible body markup differs from original ${file}`);
  console.log(`${file}: visible markup and copy match the original source exactly.`);
}
