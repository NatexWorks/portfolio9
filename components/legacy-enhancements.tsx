"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import MachineBlueprint from "@/components/machine-blueprint";
import DesktopCursor from "@/components/desktop-cursor";
import EnterExperience from "@/components/enter-experience";

type PageName = "index.html" | "services.html" | "inventory.html";

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.dataset.legacyRuntime = "true";
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.body.append(script);
  });
}

export default function LegacyEnhancements({ page }: { page: PageName }) {
  useEffect(() => {
    let live = true;
    const external = page === "inventory.html" ? ["/inventory.js"] : ["/script.js"];
    const mountRoots: ReturnType<typeof createRoot>[] = [];
    let assemblyObserver: IntersectionObserver | undefined;
    let storyCleanup: (() => void) | undefined;
    let storyMedia: MediaQueryList | undefined;
    let storyMediaHandler: (() => void) | undefined;
    if (page === "index.html") {
      const machineSlot = document.getElementById("machine-slot");
      const assemblySlot = document.getElementById("assembly-slot");
      const enterSlot = document.getElementById("enter-slot");
      if (machineSlot) { const root = createRoot(machineSlot); root.render(<div className="natex-machine-dock"><MachineBlueprint /></div>); mountRoots.push(root); }
      if (assemblySlot) {
        const root = createRoot(assemblySlot);
        root.render(<section className="assembly-section" aria-label="Illustrated laptop assembly"><div className="laptop-assembly-fallback" aria-hidden="true"><span>NW</span></div></section>);
        mountRoots.push(root);
        assemblyObserver = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          assemblyObserver?.disconnect();
          void import("@/components/laptop-assembly").then(({ default: LaptopAssembly }) => {
            if (live && assemblySlot.isConnected) root.render(<section className="assembly-section" aria-label="Illustrated laptop assembly"><LaptopAssembly /></section>);
          });
        }, { rootMargin: "600px 0px" });
        assemblyObserver.observe(assemblySlot);
      }
      if (enterSlot) { const root = createRoot(enterSlot); root.render(<EnterExperience />); mountRoots.push(root); }

      // One pinned handoff gives the homepage a clear cinematic beat without
      // making every section sticky or delaying access to its content.
      storyMedia = window.matchMedia("(min-width: 1000px) and (prefers-reduced-motion: no-preference)");
      const setupStory = () => {
        storyCleanup?.();
        storyCleanup = undefined;
        if (!storyMedia?.matches) return;
        void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
          if (!live || !storyMedia?.matches) return;
          gsap.registerPlugin(ScrollTrigger);
          const work = document.querySelector<HTMLElement>("#work.work-section");
          const feature = document.querySelector<HTMLElement>(".feature-band");
          if (!work || !feature) return;
          const context = gsap.context(() => {
            gsap.timeline({
              scrollTrigger: {
                trigger: work,
                start: "top top+=88",
                end: () => `+=${Math.round(window.innerHeight * 0.42)}`,
                scrub: 0.8,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
              .to(work, { scale: 0.975, y: -12, rotateX: 1.2, transformOrigin: "50% 0%", ease: "none" }, 0)
              .fromTo(feature, { yPercent: 22 }, { yPercent: 0, ease: "none" }, 0);
          });
          storyCleanup = () => context.revert();
        }).catch(() => {
          // Native scrolling and the static section layout remain the fallback.
        });
      };
      storyMediaHandler = setupStory;
      storyMedia.addEventListener("change", setupStory);
      setupStory();
    }
    void (async () => {
      try {
        await loadScript(`/${page}.inline.js`);
        for (const src of external) if (live) await loadScript(src);
      } catch (error) {
        console.error("NatexWorks page enhancement failed to load", error);
      }
    })();
    return () => {
      live = false;
      storyCleanup?.();
      if (storyMedia && storyMediaHandler) storyMedia.removeEventListener("change", storyMediaHandler);
      assemblyObserver?.disconnect();
      mountRoots.forEach((root) => root.unmount());
      document.querySelectorAll('script[data-legacy-runtime="true"]').forEach((script) => script.remove());
    };
  }, [page]);

  if (page !== "index.html") return null;
  return <DesktopCursor />;
}
