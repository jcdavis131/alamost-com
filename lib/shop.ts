// Lina's Card Shop — her own cards, added from photos she takes.
//
// There is no backend (static export, free tier), so cards live in this
// browser's localStorage. Photos are downscaled before saving, because a
// straight phone photo as a data URL would blow the ~5MB quota in two shots.

export type ShopCard = {
  id: string;
  name: string;
  /** Free text, so "50c" or "1 dollar" are both fine. Empty means unpriced. */
  price: string;
  /** JPEG data URL, cover-cropped to CARD_W x CARD_H. */
  photo: string;
  createdAt: number;
};

const KEY = "lina-shop-cards-v1";

/** Stored photo size. 4:5, matching how the cards are laid out. */
export const CARD_W = 864;
export const CARD_H = 1080;

export function loadCards(): ShopCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c) => c && typeof c.id === "string" && typeof c.photo === "string");
  } catch {
    return [];
  }
}

export type SaveResult = { ok: true } | { ok: false; reason: "full" | "failed" };

export function saveCards(cards: ShopCard[]): SaveResult {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cards));
    return { ok: true };
  } catch (err) {
    const full =
      err instanceof DOMException &&
      (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return { ok: false, reason: full ? "full" : "failed" };
  }
}

/**
 * Reads a photo from the camera or library and returns a downscaled,
 * cover-cropped JPEG data URL. Cover-crop rather than letterbox, so a card
 * photographed in any orientation still fills the frame.
 */
export function fileToPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not an image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = CARD_W;
      canvas.height = CARD_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no canvas"));
        return;
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, CARD_W, CARD_H);

      const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (CARD_W - w) / 2, (CARD_H - h) / 2, w, h);

      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}

export function newId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
