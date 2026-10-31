const steps = [
  {
    number: "01",
    title: "Catalog",
    description: "Create and update product records, organise categories, and search by name, description, category, SKU, or barcode.",
    detail: "PRODUCTS · CATEGORIES · SEARCH",
  },
  {
    number: "02",
    title: "Stock",
    description: "Keep quantities visible and review products that need attention. The current dashboard query flags stock at five units or fewer.",
    detail: "QUANTITY · LOW-STOCK REVIEW",
  },
  {
    number: "03",
    title: "Checkout",
    description: "Create an order for approval, complete or cancel it, and process returns. Completing an order updates product stock.",
    detail: "ORDERS · APPROVAL · RETURNS",
  },
  {
    number: "04",
    title: "Barcode",
    description: "Look up products with barcode records and camera-assisted scanning when the browser supports it and permission is granted.",
    detail: "BARCODE RECORDS · CAMERA SCAN",
  },
];

function WorkflowPanel({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <div className="workflow-screen__panel is-active" data-workflow-visual="0" aria-hidden="true">
        <div className="workflow-screen__panel-head"><span>PRODUCT CATALOG</span><span>RECORDS / SEARCH</span></div>
        <div className="workflow-catalog-search"><span>⌕</span><span>Search name, SKU, barcode…</span><b>FILTER</b></div>
        <div className="workflow-catalog-layout">
          <aside><b>CATALOGUE</b><span className="is-current">All products</span><span>Categories</span><span>Archived</span></aside>
          <div className="workflow-catalog-table">
            <div className="workflow-table-row is-heading"><span>PRODUCT</span><span>CATEGORY</span><span>SKU / CODE</span></div>
            <div className="workflow-table-row"><b>Sample product A</b><span>Accessories</span><code>NW-001</code></div>
            <div className="workflow-table-row"><b>Sample product B</b><span>Homeware</span><code>NW-002</code></div>
            <div className="workflow-table-row"><b>Sample product C</b><span>Equipment</span><code>NW-003</code></div>
          </div>
        </div>
        <div className="workflow-screen__foot">ILLUSTRATIVE RECORDS · SEARCHABLE FIELDS SHOWN</div>
      </div>
    );
  }

  if (stage === 1) {
    return (
      <div className="workflow-screen__panel" data-workflow-visual="1" aria-hidden="true">
        <div className="workflow-screen__panel-head"><span>STOCK OVERVIEW</span><span>QUANTITY / ATTENTION</span></div>
        <div className="workflow-stock-summary"><div><small>STOCK RULE</small><b>≤ 5 units</b><span>Low-stock review threshold</span></div><div><small>REVIEW QUEUE</small><b>Needs attention</b><span>Only qualifying products are flagged</span></div></div>
        <div className="workflow-stock-list">
          <div className="workflow-stock-row"><span>Sample product A</span><span className="workflow-stock-bar"><i style={{ width: "82%" }} /></span><b>18</b><em>In stock</em></div>
          <div className="workflow-stock-row is-low"><span>Sample product B</span><span className="workflow-stock-bar"><i style={{ width: "16%" }} /></span><b>4</b><em>Low stock</em></div>
          <div className="workflow-stock-row"><span>Sample product C</span><span className="workflow-stock-bar"><i style={{ width: "56%" }} /></span><b>12</b><em>In stock</em></div>
        </div>
        <div className="workflow-screen__foot">SAMPLE QUANTITIES · AMBER FLAGS ONLY VALUES AT OR BELOW FIVE</div>
      </div>
    );
  }

  if (stage === 2) {
    return (
      <div className="workflow-screen__panel" data-workflow-visual="2" aria-hidden="true">
        <div className="workflow-screen__panel-head"><span>ORDER WORKFLOW</span><span>APPROVAL / COMPLETION</span></div>
        <div className="workflow-order">
          <div className="workflow-order__id"><small>EXAMPLE ORDER</small><b>#ORDER-01</b><span>Created for approval</span></div>
          <div className="workflow-order__flow">
            <div className="is-complete"><i>01</i><span>Created</span></div><b aria-hidden="true" />
            <div className="is-current"><i>02</i><span>Pending approval</span></div><b aria-hidden="true" />
            <div><i>03</i><span>Complete or cancel</span></div>
          </div>
          <div className="workflow-order__outcome"><span>ON COMPLETION</span><b>Product stock is updated</b><small>Returns are processed through the order workflow.</small></div>
        </div>
        <div className="workflow-screen__foot">STATUS PATH SUMMARISED FROM THE APPLICATION WORKFLOW</div>
      </div>
    );
  }

  return (
    <div className="workflow-screen__panel" data-workflow-visual="3" aria-hidden="true">
      <div className="workflow-screen__panel-head"><span>BARCODE LOOKUP</span><span>CAMERA / PRODUCT RECORD</span></div>
      <div className="workflow-barcode">
        <div className="workflow-barcode__scan"><span className="workflow-barcode__line" /><div className="workflow-barcode__bars" aria-hidden="true" /></div>
        <div className="workflow-barcode__result"><small>LOOKUP RESULT / EXAMPLE</small><b>Product record found</b><span>Code 890000000001</span><i>Illustrative result only · no camera is opened here</i></div>
      </div>
      <div className="workflow-screen__foot">CAMERA ACCESS REQUIRES BROWSER SUPPORT AND VISITOR PERMISSION</div>
    </div>
  );
}

export default function WorkflowDesktopStory() {
  return (
    <div className="workflow-desktop-story" data-workflow-desktop>
      <div className="workflow-desktop-story__copy">
        <div className="workflow-desktop-story__meta"><span>WORKFLOW / INVENTORY</span><b data-workflow-count>01 / 04</b></div>
        <div className="workflow-desktop-story__steps">
          {steps.map((step, index) => (
            <article className={"workflow-desktop-story__step" + (index === 0 ? " is-active" : "")} data-workflow-step={index} key={step.number}>
              <span>{step.number} / 04</span>
              <div><h3>{step.title}</h3><p>{step.description}</p><small>{step.detail}</small></div>
            </article>
          ))}
        </div>
        <div className="workflow-desktop-story__progress" aria-hidden="true"><span data-workflow-progress /></div>
        <p className="workflow-desktop-story__hint">SCROLL TO MOVE THROUGH THE WORKFLOW</p>
      </div>
      <div className="workflow-desktop-story__visual">
        <div className="workflow-screen">
          <div className="workflow-screen__chrome"><span /><span /><span /><b>NATEX / INVENTORY WORKSPACE</b><i>ILLUSTRATIVE INTERFACE STUDY</i></div>
          <div className="workflow-screen__viewport">
            <WorkflowPanel stage={0} />
            <WorkflowPanel stage={1} />
            <WorkflowPanel stage={2} />
            <WorkflowPanel stage={3} />
          </div>
        </div>
        <div className="workflow-desktop-story__visual-caption"><span>PRODUCTS → STOCK → ORDERS → BARCODE</span><span>01—04 / CONNECTED TASKS</span></div>
      </div>
    </div>
  );
}
