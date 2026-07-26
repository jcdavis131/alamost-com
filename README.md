# alamost.com — Lina's Card Shop

Lina photographs the cards she is selling and they show up in her shop, each with a name and a price.

Take a photo → name it → price it → it's for sale. Any card can also be saved as a picture (photo,
name, price, shop mark) to send to someone.

## How it works

Static export, no backend, free tier. That shapes two things:

**Photos are stored in the browser.** Cards live in `localStorage` on the device that added them.
They survive a reload and closing the tab, but they do not sync between her tablet and a phone, and
nobody else sees them by visiting the site. A real multi-device shop would need a backend and
somewhere to put the images.

**Photos are downscaled before saving.** A straight phone photo as a data URL would exhaust the
~5MB localStorage quota in about two shots, so `lib/shop.ts` cover-crops each photo to 864×1080 and
encodes it as JPEG at 0.82. That lands around 20 cards per device. When the quota is hit the shop
says so instead of silently dropping a card.

Card capture uses `<input type="file" accept="image/*" capture="environment">`, which opens the back
camera directly on a phone and falls back to the photo library elsewhere.

## Design

Warm paper, near-black ink, one terracotta accent, and a serif only for the wordmark and card names.
Hairline rules rather than heavy borders. The accent is 5.4:1 on paper and white is 5.4:1 on the
accent, so it is safe as both text and a solid button. Controls are 48–56px tall — she is five.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```

## Deploy

Pushes to `main` deploy to alamost.com via Vercel.

`vercel.json` sets `"framework": null` on purpose. The Vercel project has an Output Directory of
`out`, which conflicts with the Next.js framework preset (that preset expects `.next` and the build
fails looking for `routes-manifest.json`). With no framework preset, Vercel serves the static export
in `out/` directly. If you ever want the real Next.js builder, clear the Output Directory setting in
the Vercel project **and** drop `"framework": null` — they have to change together.

Built solo • free-tier.
