"use client";

import { useEffect, useRef } from "react";

export default function DesktopCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = cursor.current;
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!node || !fine.matches || reduced.matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, px = x, py = y;
    let frame = 0;
    const move = (event: PointerEvent) => {
      tx = event.clientX; ty = event.clientY;
      const target = (event.target as HTMLElement | null)?.closest("a,button,[role='button']");
      node.classList.toggle("is-active", Boolean(target));
    };
    const draw = () => {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      const dx = tx - px, dy = ty - py;
      const rotate = Math.max(-12, Math.min(12, dx * 0.08));
      const tilt = Math.max(-8, Math.min(8, dy * 0.06));
      px = tx; py = ty;
      node.style.transform = `translate3d(${x}px,${y}px,0) rotate(${rotate}deg) rotateX(${tilt}deg)`;
      frame = requestAnimationFrame(draw);
    };
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); };
  }, []);
  return <div className="natex-cursor" ref={cursor} aria-hidden="true"><span /></div>;
}
