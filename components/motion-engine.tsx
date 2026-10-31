"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MotionEngine() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    let dispose: () => void = () => {};
    const hasMotionTargets = document.querySelector(".hero-story, .service-transform, .work-gallery, [data-parallax], .case-study__visual, [data-reveal]");
    if (!hasMotionTargets) return;
    if (!window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)").matches) return;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const hero = document.querySelector<HTMLElement>(".hero-story");
          if (hero) {
            gsap.timeline({
              scrollTrigger: { trigger: hero, start: "top top", end: "+=72%", pin: true, scrub: 0.85, anticipatePin: 1, invalidateOnRefresh: true },
            })
              .to(".hero-story__visual", { scale: 1.1, rotate: 7, yPercent: -4, ease: "none" }, 0)
              .to(".hero-story__heading", { yPercent: -13, ease: "none" }, 0)
              .to(".hero-story__note", { opacity: 0.35, y: -18, ease: "none" }, 0);
          }
          const transformation = document.querySelector<HTMLElement>(".service-transform");
          if (transformation) {
            const steps = gsap.utils.toArray<HTMLElement>(".service-transform__step");
            const artwork = document.querySelector<HTMLElement>(".service-transform__art");
            if (steps.length) {
              gsap.set(steps, { y: 14 });
              gsap.set(steps[0], { y: 0 });
            }
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: transformation, start: "top top", end: "+=145%", pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
            });
            steps.forEach((step, index) => {
              timeline.to(step, { y: 0, duration: 0.35, ease: "none" }, index);
              if (index < steps.length - 1) timeline.to(step, { y: -14, duration: 0.3, ease: "none" }, index + 0.7);
              if (artwork) timeline.to(artwork, {
                rotate: index % 2 === 0 ? 5 : -5,
                scale: 1 + index * 0.035,
                "--progress": (index + 1) / Math.max(steps.length, 1),
                duration: 0.45,
                ease: "none",
              }, index + 0.2);
            });
          }
          const gallery = document.querySelector<HTMLElement>(".work-gallery");
          const track = gallery?.querySelector<HTMLElement>(".work-gallery__track");
          if (gallery && track) {
            gsap.to(track, {
              x: () => Math.min(0, window.innerWidth - track.scrollWidth - 40),
              ease: "none",
              scrollTrigger: {
                trigger: gallery, start: "top top",
                end: () => "+=" + Math.max(500, track.scrollWidth - window.innerWidth + 100),
                pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
              },
            });
          }
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
            gsap.to(element, {
              yPercent: -(Number(element.dataset.parallax) || 12), ease: "none",
              scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 0.65 },
            });
          });
          const caseVisual = document.querySelector<HTMLElement>(".case-study__visual");
          if (caseVisual) gsap.fromTo(caseVisual,
            { clipPath: "inset(10% 7% 10% 7% round 28px)", scale: 0.94 },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, ease: "none",
              scrollTrigger: { trigger: caseVisual, start: "top 82%", end: "top 25%", scrub: 0.7 } },
          );
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
            gsap.fromTo(element, { y: 28, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 90%", once: true },
            });
          });
        });
        return () => context.revert();
      });
      dispose = () => media.revert();
      ScrollTrigger.refresh();
    }).catch(() => {
      // All content remains available without the optional animation bundle.
    });
    return () => { cancelled = true; dispose(); };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    let starting = false;
    let cleanup = () => {};
    const query = window.matchMedia("(max-width: 700px) and (prefers-reduced-motion: no-preference)");

    const initialise = async () => {
      if (!query.matches || cancelled || starting || !document.querySelector("[data-mobile-workflow-story]")) return;
      starting = true;
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !query.matches) {
        starting = false;
        return;
      }
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        document.documentElement.classList.add("mobile-story-motion-ready");
        const section = document.querySelector<HTMLElement>("[data-mobile-workflow-story]");
        const stage = section?.querySelector<HTMLElement>("[data-mobile-workflow-stage]");
        const stack = section?.querySelector<HTMLElement>("[data-mobile-workflow-stack]");
        const cards = stack ? gsap.utils.toArray<HTMLElement>("[data-workflow-card]", stack) : [];
        const nextPanel = section?.nextElementSibling instanceof HTMLElement ? section.nextElementSibling : null;

        if (stage && stack && cards.length === 4) {
          cards.forEach((card, index) => {
            gsap.set(card, {
              zIndex: index + 1,
              opacity: 0,
              x: index % 2 === 0 ? -66 : 66,
              y: 38,
              rotation: index % 2 === 0 ? -6 : 6,
              scale: 0.965,
              transformOrigin: "50% 50%",
              clipPath: "inset(0% 0% 100% 0% round 18px)",
            });
          });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top+=78",
              end: () => "+=" + Math.max(window.innerHeight * 1.7, stage.offsetHeight - window.innerHeight * 0.15),
              scrub: 0.72,
              invalidateOnRefresh: true,
            },
          });

          cards.forEach((current, index) => {
            const at = index * 0.78;
            if (index > 0) {
              const previous = cards[index - 1];
              timeline.to(previous, {
                y: index * 13,
                scale: 0.985,
                opacity: 0.84,
                clipPath: "inset(0% 0% 0% 0% round 18px)",
                duration: 0.34,
                ease: "none",
              }, at);
            }
            timeline.to(current, {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              clipPath: "inset(0% 0% 0% 0% round 18px)",
              duration: 0.64,
              ease: "power2.out",
            }, at + (index === 0 ? 0 : 0.06));
          });

          const transitionAt = cards.length * 0.78 + 0.05;
          timeline.to(stack, { rotateX: -5, scale: 0.955, y: -12, duration: 0.5, ease: "none" }, transitionAt);
          if (nextPanel) {
            gsap.set(nextPanel, { y: 64, scale: 0.985, transformOrigin: "50% 0%" });
            timeline.to(nextPanel, { y: 0, scale: 1, duration: 0.62, ease: "none" }, transitionAt + 0.05);
          }
        }

        gsap.utils.toArray<HTMLElement>("[data-mobile-reveal]").forEach((element) => {
          gsap.fromTo(element, { opacity: 0.72, y: 18 }, {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: element, start: "top 88%", end: "top 60%", scrub: 0.5, invalidateOnRefresh: true },
          });
        });
        return () => document.documentElement.classList.remove("mobile-story-motion-ready");
      }, document.body);
      ScrollTrigger.refresh();
      cleanup = () => context.revert();
      starting = false;
    };

    const onChange = () => {
      if (query.matches) void initialise().catch(() => {
        starting = false;
        document.documentElement.classList.remove("mobile-story-motion-ready");
      });
      else {
        cleanup();
        cleanup = () => {};
        document.documentElement.classList.remove("mobile-story-motion-ready");
        starting = false;
      }
    };

    query.addEventListener("change", onChange);
    if (query.matches) void initialise().catch(() => {
      starting = false;
      document.documentElement.classList.remove("mobile-story-motion-ready");
    });
    return () => {
      cancelled = true;
      query.removeEventListener("change", onChange);
      cleanup();
      document.documentElement.classList.remove("mobile-story-motion-ready");
    };
  }, [pathname]);

  return null;
}
