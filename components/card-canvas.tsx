"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { okabeIto, PALETTE, getTripleEncoding, getDirectionFromDelta } from "../lib/okabe-ito";
import type { CardItem } from "../lib/cards";
import { slopScan, scrubCaption } from "../lib/slop-lite";

type Props = { card: CardItem; expose?: (canvas: HTMLCanvasElement)=>void };

function drawRounded(ctx: CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}

export default function CardCanvas({ card, expose }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  const render = useCallback((W:number, H:number, hiRes=false)=>{
    const c = ref.current;
    if (!c) return;
    // use offscreen for export if hiRes requested
    const canvas = hiRes ? document.createElement("canvas") : c;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    // AAA base bg
    ctx.fillStyle = PALETTE.bg; // #0F172A 15.2:1 white
    ctx.fillRect(0,0,W,H);

    // card container minus 56px tab safe-area + 24 footer
    const pad = Math.round(W*0.04);
    const footerReserve = 56;
    const cardX = pad, cardY = pad;
    const cardW = W - pad*2;
    const cardH = H - pad*2 - footerReserve - 28;

    // card
    ctx.fillStyle = PALETTE.cardBg;
    drawRounded(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = PALETTE.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const accentMap: Record<string,string> = {
      blue: okabeIto.blue,
      orange: okabeIto.orange,
      green: okabeIto.green,
      vermillion: okabeIto.vermillion,
      sky: okabeIto.sky,
      purple: okabeIto.purple,
      yellow: okabeIto.yellow,
      black: okabeIto.black,
      default: PALETTE.itoBlue,
    };
    const accent = accentMap[card.accent] || accentMap.default;

    // direction guess from badge/title for triple-encoding
    let dir = getDirectionFromDelta(0);
    if (/up|▲|\+/.test(card.badge) || card.subtitle.includes("+")) dir = "up" as const;
    else if (/down|▼|-/.test(card.badge) && !card.subtitle.includes("coin")) dir = "down" as const;
    const triple = getTripleEncoding(dir as any);

    // stripe: Okabe accent + triple color overlay
    ctx.fillStyle = accent;
    drawRounded(ctx, cardX, cardY, cardW, 10, 10);
    ctx.fill();
    ctx.fillRect(cardX, cardY+5, cardW, 5); // fix bottom clip

    // small triple-color sliver second line for AAA triple-encoding
    ctx.fillStyle = triple.color;
    ctx.fillRect(cardX, cardY+10, 64, 4);

    // scrub all text inputs via slop-lite
    const title = scrubCaption(card.title);
    const subtitle = scrubCaption(card.subtitle);
    const drivers = (card.drivers||[]).map(scrubCaption).slice(0,3);

    // ticker/title 18px/1.65 readable scaled for canvas
    const titleSize = Math.round(W*0.064);
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.font = `800 ${titleSize}px Inter, ui-sans-system, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText(title, cardX+32, cardY+36);

    // subtitle 56B4E9 + AAA secondary
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = `500 ${Math.round(W*0.028)}px Inter, system-ui, sans-serif`;
    ctx.fillText(subtitle, cardX+32, cardY+36+titleSize+16);

    // conf pill with triple encoding: shape+icon+text+pattern (AAA)
    const badgeY = cardY+36+titleSize+16+38;
    const badgeW = 220, badgeH = 44;
    ctx.fillStyle = PALETTE.pillBgLight;
    drawRounded(ctx, cardX+32, badgeY, badgeW, badgeH, 12);
    ctx.fill();
    ctx.fillStyle = triple.color;
    ctx.font = `700 ${Math.round(W*0.022)}px ui-monospace, SFMono-Regular, monospace`;
    ctx.fillText(`${triple.icon} ${triple.label} ${triple.shape}`, cardX+48, badgeY+14);

    // pattern overlay — diagonal-up / diagonal-down / dots
    if (triple.pattern !== "solid") {
      ctx.save();
      ctx.strokeStyle = triple.color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.9;
      if (triple.pattern === "diagonal-up") {
        ctx.setLineDash([6,4]);
        ctx.strokeRect(cardX+32, badgeY, badgeW, badgeH);
        ctx.setLineDash([]);
      } else if (triple.pattern === "diagonal-down") {
        ctx.setLineDash([2,6]);
        ctx.strokeRect(cardX+32, badgeY, badgeW, badgeH);
        ctx.setLineDash([]);
      } else {
        // dots simulated via short ticks
        for(let i=0;i<badgeW;i+=12){ ctx.fillStyle=triple.color; ctx.fillRect(cardX+32+i, badgeY+badgeH-3, 6,2); }
      }
      ctx.restore();
    }

    // price row AAA contrast
    ctx.fillStyle = PALETTE.textPrimary;
    ctx.font = `700 ${Math.round(W*0.052)}px Inter, sans-serif`;
    ctx.fillText(`$${(card as any).price?.replace("$","") || "4.00"}`, cardX+32, badgeY+76);

    // conf + asof + model — 18px/1.65 logic (canvas 24px ≈ 18px readable)
    ctx.fillStyle = PALETTE.textSecondary;
    ctx.font = `500 ${Math.round(W*0.024)}px Inter, sans-serif`;
    const meta = `conf ${(card.conf*100).toFixed(0)}% • ${card.asof.slice(0,10)} • ${scrubCaption(card.model)}`;
    // slop-scan meta before render — inline
    const scannedMeta = slopScan(meta).fixed;
    ctx.fillText(scannedMeta, cardX+32, badgeY+76+Math.round(W*0.06));

    // drivers with shape triple
    let y = badgeY+76+Math.round(W*0.06)+36;
    drivers.forEach((d,i)=>{
      // shape square/circle/tri
      ctx.fillStyle = accent;
      if (i===0){ ctx.fillRect(cardX+32, y-10, 10,10); }
      else if (i===1){ ctx.beginPath(); ctx.arc(cardX+37, y-5, 6,0,Math.PI*2); ctx.fill(); }
      else { ctx.beginPath(); ctx.moveTo(cardX+32, y-2); ctx.lineTo(cardX+42, y-2); ctx.lineTo(cardX+37, y-12); ctx.closePath(); ctx.fill(); }

      ctx.fillStyle = PALETTE.textSecondary;
      ctx.font = `400 ${Math.round(W*0.026)}px Inter, sans-serif`;
      // scrub + ensure not corporate hedged
      const cleanD = slopScan(d).fixed || d;
      ctx.fillText(`▣ ${cleanD}`, cardX+56, y);
      y+=38;
    });

    // league triple encoding legend
    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = `500 ${Math.round(W*0.016)}px Inter, sans-serif`;
    ctx.fillText(`shape + icon + text + pattern = triple-encoding • AAA ${title.includes("•")?title.split("•")[1].trim():""}`, cardX+32, cardY+cardH-72);

    // minimal footer — AAA muted allowed for footer only per template
    ctx.fillStyle = PALETTE.textMuted;
    ctx.font = `400 ${Math.round(W*0.016)}px Inter, sans-serif`;
    ctx.fillText(`as of ${card.asof.slice(0,10)} • ${card.model} • not financial advice • alamost.com`, cardX+32, cardY+cardH-32);

    // safe-area footnote
    ctx.fillStyle = PALETTE.textMuted;
    ctx.globalAlpha = 0.8;
    ctx.font = `400 12px Inter, sans-serif`;
    if (!hiRes) ctx.fillText("minimal footer • 56px tab safe-area • offline-first • canvas client-only", pad, H-18);
    ctx.globalAlpha = 1;

    if (!hiRes && expose) expose(c);
    if (hiRes) return canvas as HTMLCanvasElement;
    return undefined as any;
  }, [card, expose]);

  useEffect(()=>{
    // preview 900x1200, matches equities template aspect 3/4
    render(900,1200,false);
  }, [render]);

  const onExport = useCallback(async ()=>{
    const W=1080, H=1350;
    // IG export
    const out = render(W,H,true) as unknown as HTMLCanvasElement;
    if (!out){setToast("Export failed"); return;}
    try{
      const url = out.toDataURL("image/png");
      const a = document.createElement("a");
      const safeId = (card.id||card.title||"card").replace(/[^a-z0-9-_]/gi,"_");
      a.href = url; a.download = `card-${safeId}-${new Date().toISOString().slice(0,10)}.png`;
      a.click();
      setToast(`Exported 1080×1350 PNG`);
      setTimeout(()=>setToast(null),2000);
    }catch{
      setToast("Export blocked — try Chrome");
      setTimeout(()=>setToast(null),2500);
    }
  }, [render, card]);

  return (
    <div className="relative w-full">
      <canvas
        ref={ref}
        className="w-full h-auto rounded-[12px] border border-black/[0.08] bg-[#0F172A]"
        style={{ aspectRatio:"3/4", background:"#0F172A" }}
        aria-label={`${card.title} card preview with shape ${card.badge} triple-encoding`}
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-4 py-2 text-[14px] font-[650] text-white hover:bg-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#56B4E9] focus-visible:ring-offset-2"
          style={{ minHeight:44 }}
        >
          <span aria-hidden>⬇</span> Export PNG
        </button>
        <span className="text-[12px] text-[#94A3B8]">client-only • 1080×1350 IG • toDataURL</span>
        {toast && <span role="status" className="ml-auto text-[12px] font-[600] text-[#009E73]">{toast}</span>}
      </div>
    </div>
  );
}

export function exportPng(canvas: HTMLCanvasElement, filename: string){
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
}
