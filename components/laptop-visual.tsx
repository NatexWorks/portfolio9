"use client";

import { useEffect, useRef, useState } from "react";

type LaptopVisualProps = {
  variant?: "service" | "closing";
};

export default function LaptopVisual({ variant = "closing" }: LaptopVisualProps) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={root}
      className={`laptop-visual laptop-visual--${variant}${visible ? " is-visible" : ""}`}
      aria-hidden="true"
    >
      <span className="laptop-visual__aura" />
      <div className="laptop-visual__device">
        <div className="laptop-visual__lid">
          <div className="laptop-visual__screen">
            <div className="laptop-visual__screen-content">
              <span className="laptop-visual__screen-brand">NATEXWORKS <i>●</i></span>
              <span className="laptop-visual__screen-heading">Ideas into<br /><b>useful work.</b></span>
              <span className="laptop-visual__screen-rule" />
              <span className="laptop-visual__screen-footer">DESIGN / BUILD / REFINE</span>
            </div>
          </div>
          <span className="laptop-visual__camera" />
        </div>
        <div className="laptop-visual__base">
          <span className="laptop-visual__keyboard" />
          <span className="laptop-visual__trackpad" />
          <span className="laptop-visual__front-edge" />
        </div>
      </div>
      <span className="laptop-visual__reflection" />
    </div>
  );
}
