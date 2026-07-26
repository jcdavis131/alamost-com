"use client";
import { useCallback, useEffect, useRef } from "react";
import { accents, type KidCard } from "../lib/cards";

type Props = { card: KidCard; expose?: (canvas: HTMLCanvasElement) => void };

/** Preview and export share this aspect, so what she sees is what prints. */
export const CARD_ASPECT = 4 / 5;
const PREVIEW_W = 900;
const EXPORT_W = 1080;

const kindLabel: Record<KidCard["kind"], string> = {
  animal: "ANIMAL",
  number: "NUMBER",
  shape: "SHAPE",
};

const FONT = `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Shrink the font until the text fits maxW, so long words like ELEPHANT stay on one line. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, weight: number, startPx: number, maxW: number) {
  let size = startPx;
  for (;;) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxW || size <= startPx * 0.4) return size;
    size -= Math.max(1, Math.round(startPx * 0.02));
  }
}

/** Draws the full card at any width; every measure is relative so preview and export match. */
function paint(ctx: CanvasRenderingContext2D, card: KidCard, W: number) {
  const H = Math.round(W / CARD_ASPECT);
  const accent = accents[card.accent];

  // Paper background — white so the card is cheap to print and easy to colour on.
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  const m = W * 0.045;
  const cardW = W - m * 2;
  const cardH = H - m * 2;
  const radius = W * 0.06;

  // Thick accent frame.
  ctx.fillStyle = accent.bg;
  roundRect(ctx, m, m, cardW, cardH, radius);
  ctx.fill();

  // Inner paper, leaving the frame visible as a border.
  const b = W * 0.022;
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, m + b, m + b, cardW - b * 2, cardH - b * 2, radius - b);
  ctx.fill();

  const inX = m + b;
  const inW = cardW - b * 2;
  const inY = m + b;
  const inH = cardH - b * 2;

  // Category banner across the top.
  const bannerH = inH * 0.1;
  ctx.save();
  roundRect(ctx, inX, inY, inW, bannerH + radius, radius - b);
  ctx.clip();
  ctx.fillStyle = accent.bg;
  ctx.fillRect(inX, inY, inW, bannerH);
  ctx.restore();

  ctx.fillStyle = accent.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${W * 0.045}px ${FONT}`;
  ctx.fillText(kindLabel[card.kind], inX + inW / 2, inY + bannerH / 2);

  // Letter badge, for sounding out the first letter.
  const badgeR = W * 0.072;
  const badgeCx = inX + inW - badgeR - W * 0.05;
  const badgeCy = inY + bannerH + badgeR * 0.9;
  ctx.fillStyle = accent.bg;
  ctx.beginPath();
  ctx.arc(badgeCx, badgeCy, badgeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = accent.ink;
  ctx.font = `800 ${badgeR * 1.15}px ${FONT}`;
  ctx.fillText(card.letter, badgeCx, badgeCy + badgeR * 0.04);

  // Art. Number cards repeat the art so it can be counted out loud.
  const artZoneTop = inY + bannerH;
  const artZoneH = inH * 0.46;
  const artCy = artZoneTop + artZoneH / 2;
  const n = card.count ?? 1;

  if (n === 1) {
    ctx.font = `400 ${W * 0.34}px ${FONT}`;
    ctx.fillText(card.art, inX + inW / 2, artCy);
  } else {
    // Two rows once past three, so five items don't shrink to nothing.
    const perRow = n <= 3 ? n : Math.ceil(n / 2);
    const rows = Math.ceil(n / perRow);
    const glyph = Math.min(W * 0.17, (inW * 0.82) / perRow);
    ctx.font = `400 ${glyph}px ${FONT}`;
    const rowH = glyph * 1.15;
    let startY = artCy - ((rows - 1) * rowH) / 2;
    // A full top row reaches under the letter badge, so drop the rows clear of it.
    const clearOf = badgeCy + badgeR + glyph * 0.5;
    if (startY < clearOf) startY = clearOf;
    let drawn = 0;
    for (let r = 0; r < rows; r++) {
      const inRow = Math.min(perRow, n - drawn);
      const startX = inX + inW / 2 - ((inRow - 1) * glyph * 1.1) / 2;
      for (let i = 0; i < inRow; i++) {
        ctx.fillText(card.art, startX + i * glyph * 1.1, startY + r * rowH);
      }
      drawn += inRow;
    }
  }

  // The big word.
  const nameSize = fitFont(ctx, card.name, 800, W * 0.15, inW * 0.84);
  ctx.fillStyle = "#111110";
  ctx.font = `800 ${nameSize}px ${FONT}`;
  ctx.fillText(card.name, inX + inW / 2, artZoneTop + artZoneH + inH * 0.1);

  // One simple sentence.
  const factSize = fitFont(ctx, card.fact, 500, W * 0.052, inW * 0.86);
  ctx.fillStyle = "#3F3F3A";
  ctx.font = `500 ${factSize}px ${FONT}`;
  ctx.fillText(card.fact, inX + inW / 2, artZoneTop + artZoneH + inH * 0.2);

  // Shop mark.
  ctx.fillStyle = accent.bg;
  ctx.font = `700 ${W * 0.036}px ${FONT}`;
  ctx.fillText("Lina's Card Shop", inX + inW / 2, inY + inH - inH * 0.055);
}

export default function CardCanvas({ card, expose }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = PREVIEW_W;
    c.height = Math.round(PREVIEW_W / CARD_ASPECT);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    paint(ctx, card, PREVIEW_W);
    expose?.(c);
  }, [card, expose]);

  return (
    <canvas
      ref={ref}
      className="h-auto w-full rounded-[14px]"
      style={{ aspectRatio: "4 / 5" }}
      role="img"
      aria-label={`${card.name} card. ${card.fact} Starts with the letter ${card.letter}.`}
    />
  );
}

/** Renders the card fresh at print size and downloads it. */
export function downloadCard(card: KidCard) {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_W;
  canvas.height = Math.round(EXPORT_W / CARD_ASPECT);
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  paint(ctx, card, EXPORT_W);
  try {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `lina-${card.id}.png`;
    a.click();
    return true;
  } catch {
    return false;
  }
}
