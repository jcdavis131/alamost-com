"use client";
import type { ShopCard } from "../lib/shop";

const OUT_W = 1080;
const OUT_H = 1350;

const SANS = `ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
const SERIF = `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("photo failed to load"));
    img.src = src;
  });
}

/** Shrinks the font until the text fits, so a long card name stays on one line. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  weight: string,
  startPx: number,
  maxW: number,
) {
  let size = startPx;
  for (;;) {
    ctx.font = `${weight} ${size}px ${font}`;
    if (ctx.measureText(text).width <= maxW || size <= startPx * 0.45) return size;
    size -= 2;
  }
}

/**
 * Renders a shareable card: her photo, the name, the price, and the shop mark.
 * Square photo with the type beneath it — the photo is the point, so it gets
 * the space and everything else stays quiet.
 */
export async function renderShopCard(card: ShopCard): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas context");

  ctx.fillStyle = "#FCFBF9";
  ctx.fillRect(0, 0, OUT_W, OUT_H);

  const m = 66;
  const inW = OUT_W - m * 2;

  // Photo, cover-cropped square.
  const img = await loadImage(card.photo);
  const size = inW;
  ctx.save();
  ctx.beginPath();
  ctx.rect(m, m, size, size);
  ctx.clip();
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, m + (size - w) / 2, m + (size - h) / 2, w, h);
  ctx.restore();

  ctx.strokeStyle = "#E5E1D8";
  ctx.lineWidth = 2;
  ctx.strokeRect(m + 1, m + 1, size - 2, size - 2);

  // Name.
  const textTop = m + size + 74;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const nameSize = fitFont(ctx, card.name, SERIF, "600", 76, inW);
  ctx.fillStyle = "#14130E";
  ctx.font = `600 ${nameSize}px ${SERIF}`;
  ctx.fillText(card.name, m, textTop);

  // Price, right-aligned against the name so the row reads as one line.
  if (card.price.trim()) {
    ctx.textAlign = "right";
    ctx.font = `600 44px ${SANS}`;
    ctx.fillStyle = "#B4472B";
    ctx.fillText(card.price, OUT_W - m, textTop);
  }

  // Rule and shop mark.
  ctx.textAlign = "left";
  ctx.strokeStyle = "#E5E1D8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(m, textTop + 44);
  ctx.lineTo(OUT_W - m, textTop + 44);
  ctx.stroke();

  ctx.fillStyle = "#6E6A5F";
  ctx.font = `500 30px ${SANS}`;
  ctx.letterSpacing = "0.14em";
  ctx.fillText("LINA'S CARD SHOP", m, textTop + 102);
  ctx.letterSpacing = "0px";

  return canvas;
}

/** Renders the card and downloads it as a PNG. */
export async function downloadShopCard(card: ShopCard) {
  const canvas = await renderShopCard(card);
  const slug = card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "card";
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = `lina-${slug}.png`;
  a.click();
}
