type ProjectVariant = "inventory" | "discovery" | "cafe";

export default function ProjectArt({
  variant,
  compact = false,
}: {
  variant: ProjectVariant;
  compact?: boolean;
}) {
  if (variant === "inventory") {
    return (
      <div className={"project-art project-art--inventory" + (compact ? " is-compact" : "")} aria-hidden="true">
        <div className="art-window">
          <div className="art-window__bar"><span /><span /><span /><i>natex / workspace</i></div>
          <div className="inventory-mock">
            <aside className="inventory-mock__sidebar"><b>N×</b><span className="is-active" /><span /><span /><span /><small>•••</small></aside>
            <div className="inventory-mock__main">
              <div className="inventory-mock__header"><span>OVERVIEW / INVENTORY</span><b>THIS WEEK ↗</b></div>
              <h3>Good morning.</h3>
              <div className="inventory-mock__metrics"><div><small>Products</small><strong>248</strong><i>All records</i></div><div><small>Low stock</small><strong>08</strong><i>Needs attention</i></div><div><small>Categories</small><strong>16</strong><i>Organised</i></div></div>
              <div className="inventory-mock__table"><div><span>PRODUCT</span><span>STATUS</span><span>STOCK</span></div><div><b>Everyday tote</b><em>In stock</em><strong>124</strong></div><div><b>Ceramic cup</b><em className="low">Low stock</em><strong>08</strong></div><div><b>Desk lamp</b><em>In stock</em><strong>056</strong></div></div>
            </div>
          </div>
        </div>
        <span className="art-label">PRODUCT / 001</span>
      </div>
    );
  }

  if (variant === "discovery") {
    return (
      <div className={"project-art project-art--discovery" + (compact ? " is-compact" : "")} aria-hidden="true">
        <div className="discovery-panel">
          <div className="discovery-panel__top"><b>LOCAL / FINDER</b><span>SEARCH PREVIEW</span></div>
          <div className="discovery-panel__copy"><small>DISCOVER WHAT&apos;S NEAR</small><strong>Closer than<br />you think.</strong><span>Clear details. Useful directions. A simple next step.</span></div>
          <svg viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">
            <path d="M-20 80 120 50 220 105 340 60 460 105 630 35M-20 180 115 155 220 205 340 156 460 195 630 130M-20 285 112 245 220 295 340 250 460 292 630 220" />
            <path d="M70 -10 115 90 90 180 155 280 140 390M230 -10 265 85 248 190 300 280 282 390M400 -10 365 90 418 180 390 280 435 390M550 -10 500 80 540 180 495 280 550 390" />
            <path d="M145 110 235 90 325 125 405 100 500 135M90 230 200 210 285 245 390 205 510 235" />
          </svg>
          <div className="map-pin map-pin--one">01</div><div className="map-pin map-pin--two">02</div><div className="map-pin map-pin--three">03</div>
          <div className="discovery-search"><span>⌕</span> Find a local business <b>↗</b></div>
        </div>
        <span className="art-label">CONCEPT / 002</span>
      </div>
    );
  }

  return (
    <div className={"project-art project-art--cafe" + (compact ? " is-compact" : "")} aria-hidden="true">
      <div className="cafe-panel">
        <div className="cafe-panel__nav"><b>neswef<span>.</span></b><i>MENU&nbsp;&nbsp; STORY&nbsp;&nbsp; VISIT</i><small>↗</small></div>
        <div className="cafe-panel__hero">
          <div><small>A LITTLE PLACE TO PAUSE</small><strong>Stay for<br /><em>a little</em><br />longer.</strong><span>Good coffee. Fresh bakes. A softer kind of everyday.</span></div>
          <div className="cafe-cup"><span /><i /></div>
        </div>
        <div className="cafe-panel__bottom"><span>COFFEE / BAKES / SLOW MORNINGS</span><b>SCROLL TO EXPLORE ↓</b></div>
      </div>
      <span className="art-label">CONCEPT / 003</span>
    </div>
  );
}
