"use client";
import { useMemo, useRef, useState } from "react";
import { cardsManifest, type CardItem, type CardLeague } from "../lib/cards";
import { okabeIto } from "../lib/okabe-ito";
import CardCanvas, { exportPng } from "../components/card-canvas";
import BottomTabs from "../components/bottom-tabs";
import Footer from "../components/footer";

type Filter = "all" | CardLeague;

const filterOpts: { id: Filter; label: string; swatch: string; icon: string }[] = [
  { id: "all", label: "All", swatch: "#111110", icon: "◫" },
  { id: "equities", label: "Equities", swatch: okabeIto.green, icon: "▲" },
  { id: "hoops", label: "Hoops", swatch: okabeIto.blue, icon: "◐" },
  { id: "gridiron", label: "Gridiron", swatch: okabeIto.orange, icon: "■" },
];

export default function Page(){
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const canvasMap = useRef<Map<string, HTMLCanvasElement>>(new Map());

  const filtered = useMemo(()=>{
    return cardsManifest.filter(c=>{
      if (filter !== "all" && c.league !== filter) return false;
      if (q && !`${c.title} ${c.subtitle} ${c.drivers.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [filter, q]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#111110] antialiased selection:bg-[#F0E442]/60" style={{fontSize:"18px", lineHeight:"1.65"}}>
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-[32px] w-[32px] place-items-center rounded-[7px] bg-[#000] text-[14px] font-[800] text-white">A</div>
            <div className="leading-[1.1]">
              <div className="text-[15px] font-[750] tracking-[-0.02em]">alamost.com</div>
              <div className="text-[11px] font-[500] text-black/60">Lina’s card shop • daily MTNN → PNG</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 text-[11px] font-[600]">
              <span className="h-[6px] w-[6px] rounded-full bg-[#009E73]" /> live • free-tier
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1040px] px-5 pb-[112px] pt-6">
        {/* Hero + filters */}
        <div id="drops" className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[28px] font-[800] tracking-[-0.03em] leading-[1.15]">Daily Cards — shop grid</h1>
            <p className="mt-1 max-w-[52ch] text-[15px] leading-[1.55] text-black/65">
              Static manifest → client Canvas 2D → PNG download. Okabe-Ito safe, triple-encoded: color + shape + icon + text. No server, no paid APIs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder="Search ticker, matchup, driver"
              className="h-[40px] w-[240px] rounded-[10px] border border-black/[0.10] bg-white px-3 text-[13.5px] font-[500] outline-none placeholder:text-black/35 focus:border-[#0072B2]/40 focus:ring-2 focus:ring-[#0072B2]/10"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Card filters">
          {filterOpts.map(o=>{
            const active = filter===o.id;
            return (
              <button
                key={o.id}
                role="tab"
                aria-selected={active}
                onClick={()=>setFilter(o.id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-[650] tracking-[-0.01em] transition ${active ? "border-black bg-black text-white" : "border-black/[0.08] bg-white text-black/75 hover:border-black/20"}`}
              >
                <span className="grid h-[16px] w-[16px] place-items-center rounded-[4px] text-[11px]" style={{background:active ? o.swatch : `${o.swatch}22`, color: active ? "white" : o.swatch}}>{o.icon}</span>
                {o.label}
                <span className={`ml-1 inline-flex min-w-[18px] justify-center rounded-full px-1 text-[10px] ${active ? "bg-white/20" : "bg-black/[0.06]"}`}>{o.id==="all" ? cardsManifest.length : cardsManifest.filter(c=>c.league===o.id).length}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(card=>{
            return (
              <article key={card.id} className="group flex flex-col rounded-[14px] border border-black/[0.07] bg-white p-3 shadow-[0_1px_0_0_rgba(0,0,0,0.03),0_6px_20px_-10px_rgba(0,0,0,0.15)] transition hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.22)]">
                <div className="rounded-[10px] bg-[#F7F7F5] p-2">
                  <CardCanvas card={card} expose={(cv)=>{ canvasMap.current.set(card.id, cv); }} />
                </div>
                <div className="px-1.5 pb-1 pt-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block h-[9px] w-[9px] rounded-[2px]" style={{background: ({blue:"#0072B2",orange:"#E69F00",green:"#009E73",vermillion:"#D55E00",sky:"#56B4E9",purple:"#CC79A7",yellow:"#F0E442",black:"#000"} as any)[card.accent]||"#0072B2"}} aria-hidden />
                        <h2 className="truncate text-[14.5px] font-[700] tracking-[-0.01em]">{card.title}</h2>
                      </div>
                      <p className="mt-0.5 text-[11.5px] font-[500] text-black/55">{card.subtitle} • {card.asof.slice(0,10)} • {card.model}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-black px-2 py-1 text-[11px] font-[700] text-white">{card.price}</span>
                  </div>
                  <ul className="mt-2.5 list-none space-y-1">
                    {card.drivers.map((d,i)=>(
                      <li key={i} className="flex items-center gap-1.5 text-[11.5px] font-[500] text-black/70"><span className="text-[10px] opacity-60">▣</span> {d}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={()=>{
                        const cv = canvasMap.current.get(card.id);
                        if (cv) exportPng(cv, `card-${card.id}.png`);
                      }}
                      className="inline-flex h-[36px] flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-[#111110] px-3 text-[12.5px] font-[650] text-white transition hover:bg-black active:translate-y-[0.5px]"
                    >
                      ◩ Download PNG
                    </button>
                    <button
                      onClick={()=>{
                        const cv = canvasMap.current.get(card.id);
                        if (cv) cv.toBlob(b=>{ if(!b) return; const url=URL.createObjectURL(b); navigator.clipboard?.write?.([new ClipboardItem?.({"image/png": b} as any)]).catch(()=>window.open(url,"_blank")); });
                      }}
                      className="inline-flex h-[36px] items-center justify-center rounded-[9px] border border-black/[0.08] bg-white px-3 text-[12.5px] font-[600] text-black/75 hover:bg-black/[0.04]"
                      aria-label={`Copy ${card.title}`}
                    >
                      ⎘
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length===0 && (
          <div className="mt-16 grid place-items-center rounded-[12px] border border-dashed border-black/10 bg-white px-6 py-14 text-center">
            <p className="text-[14px] font-[600] text-black/60">No cards match filter • try “All” or clear search</p>
          </div>
        )}

        <section id="about" className="prose prose-sm mt-14 max-w-none rounded-[12px] bg-white p-5 text-[13.5px] leading-[1.6] text-black/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
          <h3 className="m-0 text-[13px] font-[700] uppercase tracking-[0.08em] text-black/60">About</h3>
          <p className="m-0 mt-1.5">Each card cites <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[11.5px]">asof</code> + <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[11.5px]">model_id</code>. Client-only Canvas 2D export via <code className="rounded bg-black/[0.06] px-1 py-0.5 text-[11.5px]">toDataURL()</code> — no Puppeteer, no Sharp, free-tier static. Deploy: Git push → Vercel → alamost.com custom domain.</p>
        </section>
      </main>

      <Footer />
      <BottomTabs />
    </div>
  );
}
