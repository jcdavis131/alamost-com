"use client";
import { useMemo, useRef, useState } from "react";
import { cardsManifest, type CardLeague } from "../lib/cards";
import { okabeIto } from "../lib/okabe-ito";
import CardCanvas, { exportPng } from "../components/card-canvas";
import BottomTabs from "../components/bottom-tabs";
import Footer from "../components/footer";

type Filter = "all" | CardLeague;
const filterOpts: { id: Filter; label: string; swatch: string; icon: string }[] = [
  { id: "all", label: "All", swatch: "#111", icon: "◫" },
  { id: "equities", label: "Equities", swatch: okabeIto.green, icon: "▲" },
  { id: "hoops", label: "Hoops", swatch: okabeIto.blue, icon: "◐" },
  { id: "gridiron", label: "Gridiron", swatch: okabeIto.orange, icon: "■" },
];

function getAccent(c: string){
  const map: Record<string,string> = { blue:"#0072B2", orange:"#E69F00", green:"#009E73", vermillion:"#D55E00", sky:"#56B4E9", purple:"#CC79A7", yellow:"#F0E442", black:"#000" };
  return map[c] || "#0072B2";
}

export default function Page(){
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const canvasMap = useRef(new Map<string, HTMLCanvasElement>());

  const filtered = useMemo(()=>{
    const low = q.toLowerCase();
    return cardsManifest.filter(c=>{
      if (filter !== "all" && c.league !== filter) return false;
      if (q && (`${c.title} ${c.subtitle} ${c.drivers.join(" ")}`.toLowerCase().indexOf(low) === -1)) return false;
      return true;
    });
  }, [filter, q]);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#111110] antialiased" style={{fontSize:"18px", lineHeight:"1.65"}}>
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-[32px] w-[32px] place-items-center rounded-[7px] bg-black text-[14px] font-bold text-white">A</div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold">alamost.com</div>
              <div className="text-[11px] text-black/60">Lina card shop - daily MTNN to PNG</div>
            </div>
          </div>
          <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold"><span className="mr-1 inline-block h-[6px] w-[6px] rounded-full bg-green-600" /> live free-tier</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1040px] px-5 pb-[112px] pt-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight">Daily Cards - shop grid</h1>
            <p className="mt-1 max-w-[52ch] text-[15px] text-black/60">Static manifest to client Canvas 2D to PNG download. No server, no paid APIs.</p>
          </div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search ticker, matchup, driver" className="h-[40px] w-[240px] rounded-[10px] border border-black/10 bg-white px-3 text-[13.5px] outline-none" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {filterOpts.map(o=>{
            const active = filter===o.id;
            const count = o.id==="all" ? cardsManifest.length : cardsManifest.filter(c=>c.league===o.id).length;
            return (
              <button key={o.id} onClick={()=>setFilter(o.id)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold ${active ? "border-black bg-black text-white" : "border-black/10 bg-white text-black/70"}`}>
                <span className="grid h-[16px] w-[16px] place-items-center rounded text-[11px]" style={{background: active ? o.swatch : "#eee"}}>{o.icon}</span>{o.label}<span className="ml-1 rounded-full bg-black/10 px-1 text-[10px]">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(card=>{
            return (
              <article key={card.id} className="flex flex-col rounded-[14px] border border-black/10 bg-white p-3">
                <div className="rounded-[10px] bg-[#F7F7F5] p-2"><CardCanvas card={card} expose={(cv)=>{ canvasMap.current.set(card.id, cv); }} /></div>
                <div className="px-1.5 pt-3">
                  <div className="flex items-center gap-1.5"><span className="inline-block h-[9px] w-[9px] rounded" style={{background:getAccent(card.accent)}} /><h2 className="truncate text-[14.5px] font-bold">{card.title}</h2></div>
                  <p className="mt-0.5 text-[11.5px] text-black/55">{card.subtitle} - {card.asof.slice(0,10)} - {card.model}</p>
                  <ul className="mt-2.5 space-y-1">{card.drivers.map((d,i)=>(<li key={i} className="text-[11.5px] text-black/70">- {d}</li>))}</ul>
                  <div className="mt-3 flex gap-2">
                    <button onClick={()=>{ const cv = canvasMap.current.get(card.id); if (cv) exportPng(cv, `card-${card.id}.png`); }} className="flex-1 rounded-[9px] bg-black px-3 py-2 text-[12.5px] font-semibold text-white">Download PNG</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length===0 && <div className="mt-16 rounded border border-dashed px-6 py-14 text-center text-[14px] text-black/60">No cards match - try All or clear search</div>}

        <section className="mt-14 rounded bg-white p-5 text-[13.5px] text-black/70 shadow-sm"><h3 className="text-[13px] font-bold uppercase text-black/60">About</h3><p className="mt-1">Each card cites asof + model_id. Client-only Canvas 2D export - no Puppeteer, no Sharp, free-tier static. Deploy: Git push to Vercel to alamost.com.</p></section>
      </main>

      <Footer />
      <BottomTabs />
    </div>
  );
}
