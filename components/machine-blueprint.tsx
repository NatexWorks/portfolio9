"use client";

import { useEffect, useRef } from "react";

export default function MachineBlueprint() {
  const root = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      svg.classList.add("is-drawn");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        svg.classList.add("is-drawn");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return <svg ref={root} className="machine-blueprint" viewBox="0 0 720 340" fill="none" role="img" aria-label="Technical line drawing of a four-wheel machine">
    <g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
      <path className="machine-draw" pathLength="1" d="M105 220h42l27-46 74-20 37-54h112l51 40 75 19 44 61h39" />
      <path className="machine-draw" pathLength="1" d="M145 220h428M177 174h190l27-74m30 0 48 40M200 191l16-29m181 60 14-42m68-43-18 54" />
      <path className="machine-draw" pathLength="1" d="m254 154 40-43 13 43m61-43 33 45H278m162-33 35 28 46 12m-275 50 14-22h43l16 22m85 0 14-22h43l19 22" />
      <path className="machine-draw" pathLength="1" d="M224 222a35 35 0 1 0 70 0 35 35 0 0 0-70 0Zm264 0a35 35 0 1 0 70 0 35 35 0 0 0-70 0Z" />
      <path className="machine-draw" pathLength="1" d="M216 224a23 30 0 1 0 46 0 23 30 0 0 0-46 0Zm264 0a23 30 0 1 0 46 0 23 30 0 0 0-46 0Z" />
      <path className="machine-draw" pathLength="1" d="M238 222a21 21 0 1 0 42 0 21 21 0 0 0-42 0Zm264 0a21 21 0 1 0 42 0 21 21 0 0 0-42 0Z" />
      <path className="machine-draw" pathLength="1" d="M145 252H75m76-5-78 1m482 4h76m-1-5 78 1M273 114l-51-48m187 2V34m113 96 62-37M224 222H124m134-44v-36m178 60h74" />
      <path className="machine-draw" pathLength="1" d="M68 66h38m-19-19v38m288-51v38m-19-19h38m129 17 22 31m-12-42 25 35M86 254v-9m562 9v-9M360 71v-7m-18 7h36" />
      <path className="machine-draw" pathLength="1" d="M62 292h590m-590 0v-8m590 8v-8m-300-197h80m-40 0v-9M159 281H96m463 0h63" strokeDasharray="3 5" />
    </g>
    <g fill="currentColor" fontFamily="DM Mono, monospace" fontSize="9" letterSpacing="1.4">
      <text x="40" y="58">CHASSIS / 04</text><text x="408" y="27">AXLE: 02</text><text x="548" y="84">SUSPENSION</text><text x="51" y="310">ASSEMBLY DATUM ── 01.04</text><text x="516" y="310">NATEX / LAB</text>
    </g>
  </svg>;
}
