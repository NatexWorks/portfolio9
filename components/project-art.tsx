import DiscoveryGlobe from "@/components/discovery-globe";

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
              <DiscoveryGlobe compact={compact} />
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
