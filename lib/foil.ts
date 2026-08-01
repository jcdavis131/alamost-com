/**
 * Foil Bloom — the shop's house pattern.
 *
 * A deterministic refraction fan, seeded from a card's own id, so every card
 * wears a pattern that is permanently and provably its own. Same seed, same
 * bloom, on every machine and in every year.
 *
 * Emitted as plain SVG geometry rather than canvas: it renders on the server,
 * costs no runtime dependency, scales to any size, and works with images
 * disabled. See art/foil-bloom.md for the philosophy this implements.
 */

/** FNV-1a. Turns a card id into the 32-bit seed the generator runs on. */
function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, and identical everywhere. */
function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hue origins are chosen, not random.
 *
 * The full hue circle is not a palette, it is the absence of one. These five
 * windows each sit in harmony with the shop's paper and terracotta, so any
 * two blooms on the same page read as the same hand.
 */
const HUE_ORIGINS = [34, 16, 330, 174, 208];

export type Bloom = {
  /** Angular sweep in radians for each ray, pivot-relative. */
  rays: { a0: number; a1: number; hue: number; alpha: number }[];
  lattice: number[];
  pivot: { x: number; y: number };
  hueOrigin: number;
  seed: number;
};

export const BLOOM_W = 100;
export const BLOOM_H = 125;

/**
 * Builds the bloom for a seed.
 *
 * The load-bearing quantity is angular drift: rays crowd into bright thickets
 * in some quadrants and open into quiet plains in others. Spaced evenly this
 * is clip-art; spaced too unevenly it collapses into a shard. The multiplier
 * below sits in the narrow band between the two.
 */
export function bloom(seedInput: string, rayCount = 44): Bloom {
  const seed = hashSeed(seedInput);
  const rand = rng(seed);

  // Never centred. A centred light source is a diagram; an off-centre one is
  // a photograph.
  const bias = 0.22 + rand() * 0.2;
  const dir = rand() * Math.PI * 2;
  const pivot = {
    x: BLOOM_W / 2 + Math.cos(dir) * BLOOM_W * bias,
    y: BLOOM_H / 2 + Math.sin(dir) * BLOOM_H * bias,
  };

  const hueOrigin = HUE_ORIGINS[Math.floor(rand() * HUE_ORIGINS.length)];
  const hueArc = 34 + rand() * 26;
  const drift = 0.62 + rand() * 0.3;
  const spin = rand() * Math.PI * 2;

  // Three seeded sine octaves stand in for a noise walk: continuous, cheap,
  // and periodic over a full turn so the fan closes on itself cleanly.
  const ph = [rand() * 6.283, rand() * 6.283, rand() * 6.283];
  const walk = (t: number) =>
    Math.sin(t * 2 * Math.PI + ph[0]) * 0.5 +
    Math.sin(t * 6 * Math.PI + ph[1]) * 0.3 +
    Math.sin(t * 11 * Math.PI + ph[2]) * 0.2;

  // Rays are placed by cumulative weight, not at even intervals. Small weights
  // pack rays into a bright thicket; large ones open a quiet plain. Working in
  // cumulative space is what guarantees the fan still closes on a full turn.
  const gaps: number[] = [];
  let total = 0;
  for (let i = 0; i < rayCount; i++) {
    const g = 0.12 + Math.pow((walk(i / rayCount) + 1.06) / 2.12, 2.6) * 3.4;
    gaps.push(g);
    total += g;
  }
  const mean = total / rayCount;

  const rays: Bloom["rays"] = [];
  let a = spin;
  for (let i = 0; i < rayCount; i++) {
    const t = i / rayCount;
    const gap = (gaps[i] / total) * Math.PI * 2;
    // Hue sweeps through the window as a triangle over the turn, so the arc is
    // bounded and there is no seam where the fan wraps.
    const sweep = 1 - Math.abs(t - 0.5) * 2;
    const hue = hueOrigin + sweep * hueArc + walk(t) * hueArc * 0.22;

    // Tight spacing burns brighter and fills more of its slot, so a thicket
    // fuses into one solid wedge of light. A plain thins to open paper. Both
    // fall out of the same quantity — the local gap against the mean.
    const density = Math.min(2.6, Math.pow(mean / gaps[i], 0.8));
    const fill = Math.max(0.28, Math.min(0.92, 0.58 * Math.pow(density, 0.55)));
    const margin = (1 - fill) / 2;

    rays.push({
      a0: a + gap * margin,
      a1: a + gap * (1 - margin),
      hue,
      alpha: Math.min(0.66, 0.1 + density * 0.22 * drift),
    });
    a += gap;
  }

  // Interference arcs on an irrational progression, so they never align with
  // the rays and never repeat. Individually invisible; collectively, surface.
  const lattice: number[] = [];
  const phi = 1.6180339887;
  let r = 5 + rand() * 4;
  while (r < 150) {
    lattice.push(r);
    r *= 1 + 0.155 * phi * (0.85 + rand() * 0.3);
  }

  return { rays, lattice, pivot, hueOrigin, seed };
}

const f = (n: number) => Math.round(n * 100) / 100;

/**
 * Renders a bloom as an SVG document string.
 *
 * `grain` adds the paper-tooth filter — the last one percent. It is real cost
 * per element, so it is opt-in: on for the single large bloom on a detail
 * page, off for a grid of forty tiles.
 */
export function bloomSvg(
  seedInput: string,
  opts: { rayCount?: number; grain?: boolean; paper?: string } = {},
): string {
  const { rayCount = 44, grain = false, paper = "#fcfbf9" } = opts;
  const b = bloom(seedInput, rayCount);
  const uid = b.seed.toString(36);
  const R = 190;

  const rays = b.rays
    .map((ray) => {
      const p = (a: number) =>
        `${f(b.pivot.x + Math.cos(a) * R)},${f(b.pivot.y + Math.sin(a) * R)}`;
      return `<polygon points="${f(b.pivot.x)},${f(b.pivot.y)} ${p(ray.a0)} ${p(ray.a1)}" fill="hsl(${f(ray.hue)} 64% 46%)" fill-opacity="${f(ray.alpha)}"/>`;
    })
    .join("");

  const arcs = b.lattice
    .map(
      (r) =>
        `<circle cx="${f(b.pivot.x)}" cy="${f(b.pivot.y)}" r="${f(r)}" fill="none" stroke="hsl(${b.hueOrigin} 60% 88%)" stroke-opacity="0.5" stroke-width="0.35"/>`,
    )
    .join("");

  // Saturation cools from pivot to perimeter. Tuned by eye — this curve is the
  // difference between something printed and a screenshot of maths.
  const falloff =
    `<radialGradient id="f${uid}" gradientUnits="userSpaceOnUse" cx="${f(b.pivot.x)}" cy="${f(b.pivot.y)}" r="118">` +
    `<stop offset="0" stop-color="${paper}" stop-opacity="0"/>` +
    `<stop offset="0.55" stop-color="${paper}" stop-opacity="0.12"/>` +
    `<stop offset="1" stop-color="${paper}" stop-opacity="0.82"/>` +
    `</radialGradient>`;

  const grainDef = grain
    ? `<filter id="g${uid}" x="0" y="0" width="100%" height="100%">` +
      `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${b.seed % 1000}"/>` +
      `<feColorMatrix type="saturate" values="0"/>` +
      `<feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer>` +
      `</filter>`
    : "";
  const grainRect = grain
    ? `<rect width="${BLOOM_W}" height="${BLOOM_H}" filter="url(#g${uid})"/>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BLOOM_W} ${BLOOM_H}" preserveAspectRatio="xMidYMid slice" role="presentation">` +
    `<defs>${falloff}${grainDef}</defs>` +
    `<rect width="${BLOOM_W}" height="${BLOOM_H}" fill="${paper}"/>` +
    `<g>${rays}</g>${arcs}` +
    `<rect width="${BLOOM_W}" height="${BLOOM_H}" fill="url(#f${uid})"/>${grainRect}` +
    `</svg>`
  );
}

/** Inline `background-image` form, for backdrops rather than elements. */
export function bloomDataUri(seedInput: string, opts?: Parameters<typeof bloomSvg>[1]) {
  return `url("data:image/svg+xml,${encodeURIComponent(bloomSvg(seedInput, opts))}")`;
}
