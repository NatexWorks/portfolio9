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
          <div className="discovery-panel__top"><b>LOCAL / DISCOVERY</b><span>ILLUSTRATIVE LOCATION MODEL</span></div>
          <div className="discovery-panel__copy">
            <small>LOCAL INTENT · CLEAR INFORMATION</small>
            <strong>Closer to<br />the next step.</strong>
            <span>Useful business details, contact paths, and directions in one clear journey.</span>
          </div>
          <div className="discovery-earth" role="presentation">
            <div className="discovery-earth__orbit discovery-earth__orbit--one" />
            <div className="discovery-earth__orbit discovery-earth__orbit--two" />
            <div className="discovery-earth__globe">
              <svg viewBox="0 0 500 500" focusable="false">
                <defs>
                  <radialGradient id="discovery-earth-light" cx="32%" cy="30%" r="75%">
                    <stop offset="0" stopColor="#356d93" />
                    <stop offset=".58" stopColor="#17384f" />
                    <stop offset="1" stopColor="#071522" />
                  </radialGradient>
                  <linearGradient id="discovery-earth-shade" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#07111d" stopOpacity=".02" />
                    <stop offset=".72" stopColor="#030812" stopOpacity=".1" />
                    <stop offset="1" stopColor="#02050b" stopOpacity=".9" />
                  </linearGradient>
                </defs>
                <circle cx="250" cy="250" r="236" fill="url(#discovery-earth-light)" />
                <g className="discovery-earth__grid" fill="none" stroke="#8eb5ca" strokeOpacity=".22" strokeWidth="1">
                  <ellipse cx="250" cy="250" rx="210" ry="70" />
                  <ellipse cx="250" cy="250" rx="210" ry="142" />
                  <ellipse cx="250" cy="250" rx="84" ry="210" />
                  <ellipse cx="250" cy="250" rx="154" ry="210" />
                  <path d="M40 250h420M250 40v420" />
                </g>
                <g className="discovery-earth__continents">
                  <path d="M82 119 111 82 157 72 185 91 207 91 228 113 209 139 190 144 181 168 159 171 144 197 118 188 106 161 83 154Z" />
                  <path d="m170 205 22 12 17 30-8 35-15 29-9 38-20 34-14-22 7-36-12-33 5-39Z" />
                  <path d="m231 116 31-17 43 4 23 20 34-2 28 22 44 6 19 28-18 20-38-9-23 18-31-6-21 18-25-11-16-28-30-4-15-24-34-3Z" />
                  <path d="m250 213 27-17 34 8 17 28-7 35-18 34-8 39-27 39-24-18 3-35-17-31 4-39Z" />
                  <path d="m390 321 33-12 35 18 5 26-25 18-35-8-21-20Z" />
                  <path d="m75 215 20-8 18 12-5 16-24 4-14-10Z" />
                </g>
                <g className="discovery-earth__routes" fill="none" stroke="#f0b477" strokeOpacity=".58" strokeWidth="1.6">
                  <path d="M150 160Q245 82 333 149" />
                  <path d="M181 266Q272 185 369 238" />
                  <path d="M155 161Q161 238 270 294" />
                </g>
                <g className="discovery-earth__city-lights" fill="#ffd59a">
                  <circle cx="151" cy="156" r="3.5" /><circle cx="174" cy="167" r="2.5" />
                  <circle cx="258" cy="145" r="3" /><circle cx="284" cy="155" r="2.3" />
                  <circle cx="313" cy="168" r="3.4" /><circle cx="270" cy="244" r="3" />
                  <circle cx="286" cy="268" r="2.4" /><circle cx="359" cy="248" r="3.2" />
                  <circle cx="172" cy="279" r="2.5" /><circle cx="414" cy="338" r="2.4" />
                </g>
                <circle cx="250" cy="250" r="236" fill="url(#discovery-earth-shade)" />
              </svg>
              <span className="discovery-earth__atmosphere" />
            </div>
            <span className="discovery-earth__label">LOCATION SIGNAL / 01</span>
          </div>
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
