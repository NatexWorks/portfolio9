import { legacyMarkup } from "@/content/legacy-markup";
import LegacyEnhancements from "@/components/legacy-enhancements";

type LegacyName = keyof typeof legacyMarkup;

const styles: Record<LegacyName, string[]> = {
  "index.html": ["/style.css", "/about-motion.css", "/mobile-enhancements.css", "/index.html.inline.css"],
  "services.html": ["/style.css", "/about-motion.css", "/mobile-enhancements.css", "/services.html.inline.css"],
  "inventory.html": ["/inventory.css", "/inventory.html.inline.css"],
};

export default function LegacyPage({ name }: { name: LegacyName }) {
  const markup = name === "index.html"
    ? legacyMarkup[name]
      .replace('<section class="trust-strip"', '<div id="machine-slot"></div><section class="trust-strip"')
      .replace('<section class="section work-section"', '<div id="assembly-slot"></div><section class="section work-section"')
      .replace(/(<div class="hero-actions">[\s\S]*?<\/div>)/, '$1<div id="enter-slot"></div>')
    : legacyMarkup[name];
  return <>
    {styles[name].map((href) => <link key={href} rel="stylesheet" href={href} />)}
    <div data-natex-page={name} dangerouslySetInnerHTML={{ __html: markup }} />
    <LegacyEnhancements page={name} />
  </>;
}
