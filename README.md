# alamost.com — Lina's Card Shop

Printable picture cards for a small kid. Pick a card, download it as a PNG, print it, colour it in.

Three sets, twenty cards:

- **Animals** — big picture, the animal's name, and its first letter in a badge for letter practice.
- **Numbers** — the art repeats, so 1–5 can be counted out loud off the card.
- **Shapes** — circle, square, triangle, star, heart.

## How it works

Cards are drawn client-side with Canvas 2D and saved via `toDataURL`, so there is no server, no
image hosting, and nothing to pay for. The art is emoji, which means no asset pipeline and the
whole thing works offline once loaded.

Cards render on white at 1080×1350 so they print without draining a colour cartridge, and leave
room at the bottom to colour in.

Card content lives in one place — `lib/cards.ts`. Add an entry and it shows up in the shop.

Accent colours come from the Okabe-Ito palette, which stays distinguishable for colourblind
readers. Each hue is paired with an ink colour so large text keeps at least 3:1 contrast.

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
