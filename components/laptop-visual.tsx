"use client";

import { useEffect, useRef } from "react";

type LaptopVisualProps = {
  variant?: "service" | "closing";
};

function CafeScreenPreview() {
  return (
    <div className="service-cafe-screen">
      <div className="service-cafe-screen__nav">
        <strong>neswef<span>.</span></strong>
        <small>MENU&nbsp;&nbsp; STORY&nbsp;&nbsp; VISIT</small>
      </div>
      <div className="service-cafe-screen__hero">
        <div className="service-cafe-screen__copy">
          <small>A LITTLE PLACE TO PAUSE</small>
          <h2>Stay for<br /><em>a little</em><br />longer.</h2>
          <p>Good coffee. Fresh bakes. A softer kind of everyday.</p>
        </div>
        <div className="service-cafe-screen__cup" aria-hidden="true"><i /></div>
      </div>
      <div className="service-cafe-screen__footer">COFFEE / BAKES / SLOW MORNINGS</div>
    </div>
  );
}

function InventoryScreenPreview() {
  return (
    <div className="service-inventory-screen">
      <aside className="service-inventory-screen__sidebar">
        <b>N<span>×</span></b>
        <i className="is-active" /><i /><i /><i />
        <small>•••</small>
      </aside>
      <div className="service-inventory-screen__main">
        <div className="service-inventory-screen__top">
          <span>OVERVIEW / INVENTORY</span><b>THIS WEEK ↗</b>
        </div>
        <h2>Good morning.</h2>
        <div className="service-inventory-screen__metrics">
          <div><small>Products</small><strong>248</strong><i>All records</i></div>
          <div><small>Low stock</small><strong>08</strong><i>Needs attention</i></div>
          <div><small>Categories</small><strong>16</strong><i>Organised</i></div>
        </div>
        <div className="service-inventory-screen__table">
          <div><span>PRODUCT</span><span>STATUS</span><span>STOCK</span></div>
          <div><b>Everyday tote</b><em>In stock</em><strong>124</strong></div>
          <div><b>Ceramic cup</b><em className="is-low">Low stock</em><strong>08</strong></div>
          <div><b>Desk lamp</b><em>In stock</em><strong>056</strong></div>
        </div>
      </div>
    </div>
  );
}

export default function LaptopVisual({ variant = "closing" }: LaptopVisualProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.classList.add("is-visible");
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
      className={"laptop-visual laptop-visual--" + variant}
      aria-hidden="true"
    >
      <span className="laptop-visual__aura" />
      <div className="laptop-visual__device">
        <div className="laptop-visual__lid">
          <div className="laptop-visual__screen">
            <div className="laptop-visual__screen-content">
              {variant === "service" ? (
                <div className="service-laptop-gallery">
                  <div
                    className="service-laptop-gallery__preview service-laptop-gallery__preview--cafe"
                    data-service-preview="cafe"
                  >
                    <CafeScreenPreview />
                  </div>
                  <div
                    className="service-laptop-gallery__preview service-laptop-gallery__preview--inventory"
                    data-service-preview="inventory"
                  >
                    <InventoryScreenPreview />
                  </div>
                </div>
              ) : (
                <>
                  <span className="laptop-visual__screen-brand">NATEXWORKS <i>●</i></span>
                  <span className="laptop-visual__screen-heading">Ideas into<br /><b>useful work.</b></span>
                  <span className="laptop-visual__screen-rule" />
                  <span className="laptop-visual__screen-footer">DESIGN / BUILD / REFINE</span>
                </>
              )}
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
