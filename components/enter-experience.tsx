"use client";

import { useState } from "react";

export default function EnterExperience() {
  const [entering, setEntering] = useState(false);
  const activate = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const work = document.getElementById("work");
    if (!work) return;
    if (reduce) { work.scrollIntoView({ behavior: "auto" }); return; }
    setEntering(true);
    window.setTimeout(() => {
      work.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => setEntering(false), 650);
    }, 420);
  };
  return <>
    <button type="button" className="natex-enter" onClick={activate}>Enter experience <span aria-hidden="true">↘</span></button>
    {entering && <div className="experience-transition" aria-hidden="true"><span /></div>}
  </>;
}
