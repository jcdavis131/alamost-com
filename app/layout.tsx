import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "alamost.com — Lina's Card Shop",
  description: "Daily MTNN cards • equities, hoops, gridiron — static shop, Canvas 2D export, free-tier.",
  metadataBase: new URL("https://alamost.com"),
  openGraph: {
    title: "alamost.com — Lina's Card Shop",
    description: "Curated daily cards from MTNN models. Shop, preview, export PNG.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontSize: "18px",
          lineHeight: 1.65,
          fontFamily:
            "ui-sans-system, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          background: "#F7F7F5",
          color: "#111110",
          margin: 0,
          WebkitFontSmoothing: "antialiased",
          textRendering: "optimizeLegibility",
        }}
      >
        <style>{`
          :root{
            --ok-black:#000000;--ok-orange:#E69F00;--ok-sky:#56B4E9;--ok-green:#009E73;
            --ok-yellow:#F0E442;--ok-blue:#0072B2;--ok-verm:#D55E00;--ok-purple:#CC79A7;
            --ink:#111110;--paper:#F7F7F5;--tab-h:56px;
          }
          *{box-sizing:border-box}
          html,body{height:100%}
          a{color:inherit}
          a:focus-visible,button:focus-visible{outline:2px solid var(--ok-blue);outline-offset:2px}
          .alamost-shell{min-height:100vh;display:flex;flex-direction:column}
          .alamost-main{flex:1;max-width:1120px;margin:0 auto;width:100%;padding:24px 16px calc(var(--tab-h) + env(safe-area-inset-bottom) + 24px)}
          /* 56px tabs with safe-area, triple-encoding: shape+icon+text+pattern */
          .tabbar{
            position:fixed;left:0;right:0;bottom:0;z-index:50;
            height:calc(var(--tab-h) + env(safe-area-inset-bottom));
            padding-bottom:env(safe-area-inset-bottom);
            background:rgba(255,255,255,0.96);backdrop-filter:saturate(1.2) blur(12px);
            border-top:1.5px solid #e9e7e1;display:flex;align-items:stretch;
          }
          .tabbar-inner{max-width:1120px;margin:0 auto;width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:0}
          .tab{
            height:var(--tab-h);display:flex;flex-direction:column;align-items:center;justify-content:center;
            gap:2px;text-decoration:none;font-size:12.5px;font-weight:600;letter-spacing:.02em;
            color:#44443f;border:none;background:transparent;cursor:pointer;
            position:relative;
          }
          .tab[aria-current="page"]{color:var(--ink)}
          .tab-icon{width:22px;height:22px;display:grid;place-items:center;border-radius:6px}
          .tab[data-tab="shop"] .tab-icon{border:1.5px solid var(--ok-blue)} /* shape: square with stroke */
          .tab[data-tab="studio"] .tab-icon{border:1.5px dashed var(--ok-orange);border-radius:999px} /* circle dashed */
          .tab[data-tab="about"] .tab-icon{border:1.5px solid var(--ok-green);transform:rotate(0deg);clip-path:polygon(50% 0,100% 100%,0 100%)} /* triangle pattern */
          .tab[data-tab="shop"][aria-current="page"] .tab-icon{background:var(--ok-blue);color:#fff}
          .tab[data-tab="studio"][aria-current="page"] .tab-icon{background:var(--ok-orange);color:#fff;border-style:solid}
          .tab[data-tab="about"][aria-current="page"] .tab-icon{background:var(--ok-green);color:#fff}
          .tab-dot{width:4px;height:4px;border-radius:99px;background:currentColor;opacity:0}
          .tab[aria-current="page"] .tab-dot{opacity:1}
          .minimal-footer{font-size:13px;color:#6b6a63;padding:16px 0;margin-top:24px;border-top:1px solid #eceae3}
          .minimal-footer a{text-decoration:underline;text-underline-offset:3px}
        `}</style>

        <div className="alamost-shell">
          <header
            style={{
              maxWidth: 1120,
              margin: "0 auto",
              width: "100%",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "#0072B2",
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                A
              </span>
              <span style={{ fontWeight: 750, letterSpacing: "-.01em" }}>alamost.com</span>
              <span style={{ fontSize: 12.5, color: "#6b6a63", marginLeft: 6, fontWeight: 600 }}>Lina&apos;s Card Shop</span>
            </a>
            <div style={{ fontSize: 12.5, color: "#6b6a63" }}>free-tier • static</div>
          </header>

          <main className="alamost-main">{children}</main>

          <nav className="tabbar" aria-label="Primary">
            <div className="tabbar-inner">
              <a className="tab" data-tab="shop" aria-current="page" href="/">
                <span className="tab-icon" aria-hidden="true">
                  {/* shop: rect icon */}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="12" height="10" rx="1.5" />
                    <path d="M5 6h6M5 9h6" />
                  </svg>
                </span>
                <span>Shop</span>
                <span className="tab-dot" aria-hidden="true" />
              </a>
              <a className="tab" data-tab="studio" href="/#studio">
                <span className="tab-icon" aria-hidden="true">
                  {/* studio: circle */}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="8" cy="8" r="5" />
                    <path d="M8 5v6M5 8h6" />
                  </svg>
                </span>
                <span>Studio</span>
                <span className="tab-dot" aria-hidden="true" />
              </a>
              <a className="tab" data-tab="about" href="/#about">
                <span className="tab-icon" aria-hidden="true">
                  {/* about: triangle */}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 2L10.3 10H1.7L6 2Z" />
                  </svg>
                </span>
                <span>About</span>
                <span className="tab-dot" aria-hidden="true" />
              </a>
            </div>
          </nav>

          <div style={{ maxWidth: 1120, margin: "0 auto", width: "100%", padding: "0 16px" }}>
            <footer className="minimal-footer">
              <span>© 2026 alamost.com • Built solo • free-tier</span>
              <span style={{ marginLeft: 12 }}>
                <a href="https://github.com">GitHub → Vercel</a>
              </span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
