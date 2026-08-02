# Foil Bloom

*An algorithmic philosophy for alamost.com — the house pattern of Lina's Card Shop.*

---

## The movement

**Foil Bloom** holds that identity is not shape but light. Two objects may share every
measurable structure — the same silhouette, the same proportion, the same print — and still
be worth entirely different things to the person holding them, because of how each one
answers the light that falls on it. The algorithm is built to make that idea visible: one
generative armature, unchanging across every run, and a refraction layer that makes each run
unrepeatable. Nothing about the geometry varies. Everything about the shine does.

This is a system of **radial refraction**. A single pivot is placed off-centre — never at the
middle, because a centred light source is a diagram and an off-centre one is a photograph.
From that pivot, rays sweep outward through a full turn, but they do not sweep evenly. Their
angular spacing is driven by a low-frequency noise walk, so the fan crowds into dense
bright thickets in some quadrants and opens into long quiet plains in others. That uneven
angular density is the single most important tuned quantity in the whole system, and it is
the product of painstaking optimisation: too even and the result is a sunburst clip-art; too
uneven and the composition collapses into a shard. The correct value sits in a narrow band
that only reveals itself after many hundreds of iterations, and finding it is the difference
between an algorithm and a meticulously crafted algorithm.

Each ray carries a **phase**, and phase is what becomes colour. Hue advances along the ray's
angle through a bounded arc of the spectrum rather than the full wheel — a master of
computational aesthetics knows that the entire hue circle is not a palette, it is an absence
of one. The arc is narrow, seeded, and rotated per run, so one bloom reads as warm brass and
copper while its neighbour reads as cold nickel and sea-glass, and both are unmistakably the
same hand. Saturation falls off with radius following a curve tuned by eye, not by formula,
so the pivot burns and the perimeter cools to near-paper. This falloff is where the work
either looks printed or looks like a screenshot of maths, and getting it right is
painstaking, iterative, and invisible when done well.

Over the ray field lies an **interference lattice** — a second, far quieter system of
concentric arcs whose radii follow an irrational progression, so they never align with the
rays and never repeat. Where lattice crosses ray, the algorithm brightens by a fraction of a
percent. Individually these crossings are imperceptible. Collectively they produce the faint
moiré shimmer that the eye reads as *surface*: the sense that light is sitting on top of the
work rather than being emitted from behind it. This is the layer that separates a competent
generative pattern from one that appears to have taken countless hours to develop, because it
is the layer nobody consciously sees and everybody feels.

Temporal evolution is deliberately withheld. Foil Bloom does not animate, loop, or breathe.
It resolves — the algorithm runs to completion and stops, the way a print stops. The process
is alive; the artefact is still. A card does not shimmer on its own. It shimmers when someone
turns it toward the window, and the person turning it is the animation. Every parameter here
was refined with care by someone at the absolute top of their field precisely so that the
stillness reads as intent rather than as a system that ran out of things to do.

**Reproducibility is the ethic, not the feature.** Seed *n* must produce, byte for byte, the
same bloom on every machine and in every year. A generative work that cannot be re-derived is
a screenshot with extra steps. In this shop the seed is the card's own identity, so each card
carries a pattern that is permanently and provably its own — a master-level implementation in
which the art and the inventory are the same fact expressed twice.

---

## The conceptual seed

In sports cards, a **refractor** is the parallel — the same photograph, the same player, the
same print run, laid down on a prismatic substrate that scatters incident light. Structurally
it is identical to the base card. It can be worth forty times as much.

That is the entire soul of this algorithm, and it is never stated on the page. The armature
is constant; only the light varies; the light is what people are actually buying. A collector
will feel it before they can name it. Everyone else sees a beautiful pattern, which is the
correct outcome — a reference that announces itself is not a reference, it is a caption.

---

## Parameters worth tuning

| Parameter | What it governs |
|---|---|
| `rayCount` | Population of the refraction fan — density of the surface |
| `angularDrift` | How unevenly the rays crowd. The load-bearing parameter. |
| `hueArc` | Width of the spectral window. Narrow is jewellery; wide is a toy. |
| `hueOrigin` | Where on the wheel the window sits — brass, plum, sea-glass |
| `falloff` | Rate at which saturation cools from pivot to perimeter |
| `latticeCount` | Concentric interference arcs — the shimmer layer |
| `pivotBias` | Distance of the light source from centre. Never zero. |
| `grain` | Paper tooth. The last one percent, and the one that sells it. |

## Where it lives in production

`lib/foil.ts` re-implements this philosophy as deterministic SVG, seeded from each card's
id. Same armature, same maths, no canvas and no runtime dependency — so every card in the
shop wears its own refractor, and the same card wears the same one forever.
