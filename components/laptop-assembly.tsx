"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LaptopScene = dynamic(() => import("@/components/laptop-scene"), {
  ssr: false,
  loading: () => <div className="laptop-poster" aria-hidden="true"><div className="poster-device"><span>NW</span></div><i>ASSEMBLY / VISUAL FALLBACK</i></div>,
});

export default function LaptopAssembly() {
  const section = useRef<HTMLDivElement>(null);
  const progress = useRef({ value: 0 });
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const update = () => setDesktop(window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      if (!section.current) return;
      const state = progress.current;
      state.value = 0;
      gsap.to(state, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=1150",
          scrub: 0.75,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      return () => { state.value = 0; };
    });
    return () => mm.revert();
  }, []);

  return <div ref={section} className={`laptop-assembly${desktop ? " is-desktop-assembly" : " is-light-assembly"}`} aria-label="Illustrated laptop assembly">
    {desktop ? <LaptopScene progress={progress} /> : <div className="mobile-laptop-poster" aria-hidden="true"><div className="mobile-laptop-screen"><span>NW</span><i /></div><div className="mobile-laptop-base" /></div>}
    <div className="assembly-stages" aria-hidden="true"><span>01 / COMPONENTS</span><span>02 / CORE</span><span>03 / STRUCTURE</span><span>04 / ASSEMBLY</span><span>05 / REVEAL</span></div>
  </div>;
}
