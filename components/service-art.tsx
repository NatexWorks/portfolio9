export default function ServiceArt({ number }: { number: string }) {
  return (
    <div className={"service-art service-art--" + number} aria-hidden="true">
      {number === "01" && (
        <div className="service-art__browser">
          <div className="service-art__browser-bar"><i /><i /><i /><span>BUSINESS WEBSITE / PREVIEW</span></div>
          <div className="service-art__website">
            <b>YOUR BUSINESS</b>
            <div className="service-art__website-head"><span /><span /><span /></div>
            <div className="service-art__website-line" />
            <div className="service-art__website-line is-short" />
            <div className="service-art__website-button" />
            <div className="service-art__website-cards"><i /><i /><i /></div>
          </div>
        </div>
      )}
      {number === "02" && (
        <div className="service-art__app">
          <aside><b>N×</b><i /><i /><i /><i /></aside>
          <div className="service-art__app-main">
            <span>DASHBOARD / OVERVIEW</span>
            <div className="service-art__app-stats"><i /><i /><i /></div>
            <div className="service-art__app-chart"><b /><b /><b /><b /><b /><b /></div>
            <div className="service-art__app-rows"><i /><i /><i /></div>
          </div>
        </div>
      )}
      {number === "03" && (
        <div className="service-art__map">
          <svg viewBox="0 0 420 190" focusable="false">
            <g>
              <path d="M-10 42 90 20 170 65 260 26 430 52M-10 96 90 74 170 118 260 80 430 105M-10 150 90 128 170 172 260 135 430 160" />
              <path d="M45 -10 73 55 52 115 91 202M145 -10 173 55 152 115 191 202M245 -10 273 55 252 115 291 202M345 -10 373 55 352 115 391 202" />
              <path className="is-route" d="M74 145Q170 12 260 90T352 47" />
            </g>
            <circle cx="260" cy="90" r="19" /><circle cx="260" cy="90" r="7" />
          </svg>
          <span>LOCAL INTENT / ROUTE</span>
        </div>
      )}
      {number === "04" && (
        <div className="service-art__responsive">
          <div className="service-art__desktop">
            <span /><span /><span />
            <div><i /><i /><i /></div>
            <b /><b />
          </div>
          <div className="service-art__phone">
            <span />
            <div><i /><i /><i /><i /></div>
          </div>
          <small>DESKTOP ↔ MOBILE</small>
        </div>
      )}
    </div>
  );
}
