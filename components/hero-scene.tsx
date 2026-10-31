"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

function StaticOrbit() {
  return (
    <svg viewBox="0 0 480 480" role="presentation" focusable="false">
      <defs>
        <linearGradient id="orbit-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8792f5" />
          <stop offset="1" stopColor="#4654c8" />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="1.5">
        <ellipse cx="240" cy="240" rx="176" ry="75" stroke="#ed765d" transform="rotate(-34 240 240)" />
        <ellipse cx="240" cy="240" rx="202" ry="104" stroke="#4d5de0" transform="rotate(41 240 240)" />
        <ellipse cx="240" cy="240" rx="150" ry="193" stroke="#a5b9a0" transform="rotate(66 240 240)" />
      </g>
      <path d="M240 122 334 175 334 281 240 335 146 281 146 175Z" fill="url(#orbit-fill)" opacity=".94" />
      <path d="m240 122 94 53-94 54-94-54Z" fill="#b8c0ff" opacity=".42" />
      <path d="M240 229 334 175v106l-94 54Z" fill="#303da8" opacity=".42" />
      <path d="m146 175 94 54v106l-94-54Z" fill="#242e86" opacity=".26" />
      <g fill="#f07558">
        <circle cx="91" cy="123" r="6" /><circle cx="382" cy="309" r="5" /><circle cx="331" cy="73" r="4" />
      </g>
      <g fill="#6572e9"><circle cx="106" cy="347" r="5" /><circle cx="375" cy="144" r="4" /></g>
    </svg>
  );
}

const DeferredHeroCanvas = dynamic(() => import("./hero-canvas"), {
  ssr: false,
  loading: () => <div className="hero-scene__fallback"><StaticOrbit /></div>,
});

export default function HeroScene() {
  const frame = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const fallback: ReactNode = <div className="hero-scene__fallback"><StaticOrbit /></div>;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 900px)").matches;
    if (reduced || compact || !("IntersectionObserver" in window)) return;

    const node = frame.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0]?.isIntersecting ?? false;
        setVisible(isVisible);
        if (isVisible) setHasEntered(true);
      },
      { rootMargin: "180px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero-scene" ref={frame} aria-hidden="true">
      {hasEntered ? <DeferredHeroCanvas visible={visible} fallback={fallback} /> : fallback}
      <span className="hero-scene__halo" />
    </div>
  );
}
