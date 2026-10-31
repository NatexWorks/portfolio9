"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function MotionEngine() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    let dispose: () => void = () => {};
    const hasMotionTargets = document.querySelector(".hero-story, .service-transform, .work-gallery, .about-hero-visual, [data-workflow-desktop], [data-process-story], [data-local-signal-field], [data-parallax], .case-study__visual, [data-reveal], [data-mobile-reveal]");
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
            const introTargets = gsap.utils.toArray<HTMLElement>(
              ".hero-story .hero-topline > span, .hero-story .hero-story__copy > .eyebrow, .hero-story__heading, .hero-lede, .hero-actions, .hero-story__visual",
            );
            gsap.fromTo(introTargets, { y: 24 }, {
              y: 0, duration: 0.85, stagger: 0.09, ease: "power3.out",
              clearProps: "transform",
            });
            gsap.timeline({
              scrollTrigger: { trigger: hero, start: "top top", end: "+=72%", pin: true, scrub: 0.85, anticipatePin: 1, invalidateOnRefresh: true },
            })
              .to(".hero-story__visual", { scale: 1.1, rotate: 7, yPercent: -4, ease: "none" }, 0)
              .to(".hero-story__heading", { yPercent: -13, ease: "none" }, 0)
              .to(".hero-story__note", { opacity: 0.35, y: -18, ease: "none" }, 0);
          }
          const pageHeading = document.querySelector<HTMLElement>(".page-hero h1");
          if (pageHeading && !hero) {
            gsap.fromTo(pageHeading, { clipPath: "inset(0 0 100% 0)", y: 24 }, {
              clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.95, ease: "power3.out",
              clearProps: "clipPath,transform",
            });
          }
          const aboutVisual = document.querySelector<HTMLElement>(".about-hero-visual");
          if (aboutVisual) {
            gsap.fromTo(aboutVisual, { autoAlpha: 0, scale: 0.88, y: 24 }, {
              autoAlpha: 1, scale: 1, y: 0, duration: 1.1, delay: 0.18, ease: "power3.out",
              clearProps: "transform,opacity,visibility",
            });
          }
          const workflow = document.querySelector<HTMLElement>("[data-workflow-desktop]");
          if (workflow && getComputedStyle(workflow).display !== "none") {
            const steps = gsap.utils.toArray<HTMLElement>("[data-workflow-step]", workflow);
            const panels = gsap.utils.toArray<HTMLElement>("[data-workflow-visual]", workflow);
            const counter = workflow.querySelector<HTMLElement>("[data-workflow-count]");
            const progress = workflow.querySelector<HTMLElement>("[data-workflow-progress]");
            if (steps.length === 4 && panels.length === 4) {
              gsap.set(panels, { autoAlpha: 0, scale: 0.975, y: 14 });
              gsap.set(panels[0], { autoAlpha: 1, scale: 1, y: 0 });
              if (progress) gsap.set(progress, { scaleX: 0.25, transformOrigin: "left center" });
              const updateActive = (progressValue: number) => {
                const active = Math.min(steps.length - 1, Math.floor(progressValue * steps.length));
                steps.forEach((step, index) => step.classList.toggle("is-active", index === active));
                if (counter) counter.textContent = String(active + 1).padStart(2, "0") + " / 04";
              };
              const workflowTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: workflow,
                  start: "top top+=96",
                  end: () => "+=" + Math.max(window.innerHeight * 2.1, 1500),
                  pin: true,
                  scrub: 0.85,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => updateActive(self.progress),
                },
              });
              workflowTimeline.to(progress || workflow, progress ? { scaleX: 1, duration: 3.15, ease: "none" } : { duration: 3.15, ease: "none" }, 0)
                .to(panels[0], { autoAlpha: 0, scale: 0.985, y: -12, duration: 0.58, ease: "none" }, 0.72)
                .to(panels[1], { autoAlpha: 1, scale: 1, y: 0, duration: 0.58, ease: "none" }, 0.78)
                .to(panels[1], { autoAlpha: 0, scale: 0.985, y: -12, duration: 0.58, ease: "none" }, 1.48)
                .to(panels[2], { autoAlpha: 1, scale: 1, y: 0, duration: 0.58, ease: "none" }, 1.54)
                .to(panels[2], { autoAlpha: 0, scale: 0.985, y: -12, duration: 0.58, ease: "none" }, 2.24)
                .to(panels[3], { autoAlpha: 1, scale: 1, y: 0, duration: 0.58, ease: "none" }, 2.3);
              const scanLine = panels[3].querySelector<HTMLElement>(".workflow-barcode__line");
              const scanResult = panels[3].querySelector<HTMLElement>(".workflow-barcode__result");
              if (scanLine && scanResult) {
                gsap.set(scanLine, { x: -65 });
                gsap.set(scanResult, { autoAlpha: 0, y: 8 });
                workflowTimeline.to(scanLine, { x: 65, duration: 0.65, ease: "none" }, 2.45)
                  .to(scanResult, { autoAlpha: 1, y: 0, duration: 0.2, ease: "none" }, 2.92);
              }
              updateActive(0);
            }
          }
          const processStory = document.querySelector<HTMLElement>("[data-process-story]");
          if (processStory) {
            const processItems = gsap.utils.toArray<HTMLElement>("[data-process-item]", processStory);
            gsap.set(processStory, { "--process-progress": 0 });
            ScrollTrigger.create({
              trigger: processStory,
              start: "top 72%",
              end: "bottom 48%",
              scrub: 0.7,
              onUpdate: (self) => {
                gsap.set(processStory, { "--process-progress": self.progress });
                const active = Math.min(processItems.length - 1, Math.floor(self.progress * processItems.length));
                processItems.forEach((item, index) => item.classList.toggle("is-active", index === active));
              },
            });
          }
          const aboutProcess = document.querySelector<HTMLElement>("[data-about-process]");
          if (aboutProcess) {
            const aboutSteps = gsap.utils.toArray<HTMLElement>("[data-about-step]", aboutProcess);
            aboutSteps.forEach((step, index) => {
              gsap.fromTo(step, { y: 20 }, {
                y: 0, ease: "none",
                scrollTrigger: {
                  trigger: step,
                  start: "top 82%",
                  end: "top 55%",
                  scrub: 0.55,
                  onEnter: () => step.classList.add("is-active"),
                  onEnterBack: () => step.classList.add("is-active"),
                  onLeave: () => step.classList.remove("is-active"),
                  onLeaveBack: () => step.classList.remove("is-active"),
                },
              });
              if (index === 0) step.classList.add("is-active");
            });
          }
          const localSignal = document.querySelector<HTMLElement>("[data-local-signal-field]");
          if (localSignal) {
            const routePaths = gsap.utils.toArray<SVGPathElement>(".local-signal-field__routes path", localSignal);
            const routeTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: localSignal,
                start: "top 72%",
                end: "center 45%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });
            routePaths.forEach((path, index) => {
              const length = path.getTotalLength();
              gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
              routeTimeline.to(path, { strokeDashoffset: 0, duration: 0.7, ease: "none" }, index * 0.22);
            });
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
            gsap.fromTo(element, { y: 28 }, {
              y: 0, duration: 0.8, ease: "power3.out",
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
          gsap.fromTo(element, { y: 18 }, {
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
