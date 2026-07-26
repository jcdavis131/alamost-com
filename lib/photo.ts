/**
 * Client-side photo preparation.
 *
 * A raw phone photo is several megabytes and arbitrarily oriented. Downscaling
 * in the browser before upload keeps the request small, keeps Blob storage
 * down, and means every card photo is the same shape.
 */

export const PHOTO_W = 1080;
export const PHOTO_H = 1350;

export type PreparedPhoto = { blob: Blob; previewUrl: string };

export function preparePhoto(file: File): Promise<PreparedPhoto> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("not an image"));
      return;
    }
    const src = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(src);
      const canvas = document.createElement("canvas");
      canvas.width = PHOTO_W;
      canvas.height = PHOTO_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("no canvas"));
        return;
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, PHOTO_W, PHOTO_H);

      // Cover-crop, so a card shot in landscape still fills the frame.
      const scale = Math.max(PHOTO_W / img.width, PHOTO_H / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (PHOTO_W - w) / 2, (PHOTO_H - h) / 2, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("could not encode"));
            return;
          }
          resolve({ blob, previewUrl: canvas.toDataURL("image/jpeg", 0.7) });
        },
        "image/jpeg",
        0.85,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("could not read image"));
    };
    img.src = src;
  });
}
