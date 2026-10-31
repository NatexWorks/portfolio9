import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
for (const name of ["style.css", "about-motion.css", "inventory.css", "mobile-enhancements.css", "script.js", "inventory.js", "og-image.svg", "favicon.svg"]) {
  await copyFile(path.join(root, name), path.join(publicDir, name));
}

const inventoryScript = path.join(publicDir, "inventory.js");
const script = await readFile(inventoryScript, "utf8");
const nativeScroll = script.replace(
  /const motionDeviceEligible = mobileLenisQuery\.matches && !reducedMotion &&[\s\S]*?;\s*/,
  "const motionDeviceEligible = false; // Native scrolling is the selected default.\n"
);
if (nativeScroll === script) throw new Error("Could not select native inventory scrolling");
await writeFile(inventoryScript, nativeScroll);
console.log("Copied the preserved page assets and selected native inventory scrolling.");
