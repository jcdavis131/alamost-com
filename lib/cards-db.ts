import "server-only";
import { sql } from "./db";
import { newId } from "./auth";
import { putPhoto, deletePhoto } from "./storage";

export type CardStatus = "for_sale" | "sold" | "hidden";

/**
 * Two kinds of card share one table.
 *
 * A homemade card is whatever Lina drew; a sports card was printed by someone
 * else and carries attributes people search on. Every sports attribute is
 * nullable, because a card made of felt-tip and glitter has no manufacturer
 * and the shop should not invent one.
 */
export type CardKind = "homemade" | "sports";

export type Card = {
  id: string;
  name: string;
  kind: CardKind;
  priceCents: number;
  photoUrl: string;
  status: CardStatus;
  createdAt: string;
  player: string | null;
  team: string | null;
  sport: string | null;
  cardSet: string | null;
  year: number | null;
  cardNumber: string | null;
  manufacturer: string | null;
  condition: string | null;
  notes: string | null;
};

/** Everything a listing can carry beyond a name and a price. */
export type CardDetails = {
  kind: CardKind;
  player?: string | null;
  team?: string | null;
  sport?: string | null;
  cardSet?: string | null;
  year?: number | null;
  cardNumber?: string | null;
  manufacturer?: string | null;
  condition?: string | null;
  notes?: string | null;
};

type Row = {
  id: string;
  name: string;
  kind: CardKind;
  price_cents: number;
  photo_url: string;
  status: CardStatus;
  created_at: Date;
  player: string | null;
  team: string | null;
  sport: string | null;
  card_set: string | null;
  year: number | null;
  card_number: string | null;
  manufacturer: string | null;
  condition: string | null;
  notes: string | null;
};

const toCard = (r: Row): Card => ({
  id: r.id,
  name: r.name,
  kind: r.kind,
  priceCents: r.price_cents,
  photoUrl: r.photo_url,
  status: r.status,
  createdAt: r.created_at.toISOString(),
  player: r.player,
  team: r.team,
  sport: r.sport,
  cardSet: r.card_set,
  year: r.year,
  cardNumber: r.card_number,
  manufacturer: r.manufacturer,
  condition: r.condition,
  notes: r.notes,
});

/**
 * Built per call, not once at module scope.
 *
 * `sql` connects on first use, and a fragment is a use. Holding one in a
 * module-level constant would open a connection at import time and take the
 * whole build down wherever no database is attached — which is the exact
 * failure the lazy client in db.ts exists to prevent.
 */
const columns = () => sql`
  id, name, kind, price_cents, photo_url, status, created_at,
  player, team, sport, card_set, year, card_number, manufacturer, condition, notes
`;

export type Sort = "newest" | "price_asc" | "price_desc" | "name" | "year_desc";

export type Browse = {
  q?: string;
  kind?: CardKind;
  sport?: string;
  sort?: Sort;
  /** Sold cards stay browsable — a shop with a history reads as a real shop. */
  includeSold?: boolean;
};

/**
 * Turns what someone typed into a prefix tsquery.
 *
 * Prefix matching matters here more than usual: the people searching this shop
 * include a five-year-old, and "poke" has to find "Pokemon". Returns null when
 * the input has no usable word, so the caller drops the condition rather than
 * running a query that can only match nothing.
 */
function toTsQuery(input: string): string | null {
  const terms = input
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)
    .slice(0, 8)
    .map((w) => `${w}:*`);
  return terms.length ? terms.join(" & ") : null;
}

const SORTS = ["newest", "price_asc", "price_desc", "name", "year_desc"] as const;

/** Also built per call — see `columns` above for why. */
function order(sort: Sort) {
  switch (sort) {
    case "price_asc":
      return sql`price_cents ASC, created_at DESC`;
    case "price_desc":
      return sql`price_cents DESC, created_at DESC`;
    case "name":
      return sql`lower(name) ASC`;
    case "year_desc":
      return sql`year DESC NULLS LAST, created_at DESC`;
    default:
      return sql`created_at DESC`;
  }
}

export function isSort(value: unknown): value is Sort {
  return SORTS.includes(value as Sort);
}

export function isKind(value: unknown): value is CardKind {
  return value === "homemade" || value === "sports";
}

/** The public shop, filtered and sorted the way the browser asked for it. */
export async function browse(opts: Browse = {}): Promise<Card[]> {
  const status = opts.includeSold
    ? sql`status IN ('for_sale', 'sold')`
    : sql`status = 'for_sale'`;

  const ts = opts.q ? toTsQuery(opts.q) : null;
  // A bare ILIKE alongside the index catches what the stemmer will not: the
  // index finds whole words, this finds a fragment sitting inside one.
  const search = ts
    ? sql`AND (search @@ to_tsquery('english', ${ts}) OR name ILIKE ${"%" + opts.q + "%"})`
    : sql``;
  const kind = opts.kind ? sql`AND kind = ${opts.kind}` : sql``;
  const sport = opts.sport ? sql`AND lower(sport) = ${opts.sport.toLowerCase()}` : sql``;

  const rows = await sql<Row[]>`
    SELECT ${columns()} FROM cards
    WHERE ${status} ${search} ${kind} ${sport}
    ORDER BY ${order(opts.sort ?? "newest")}
    LIMIT 200
  `;
  return rows.map(toCard);
}

export async function findCard(id: string): Promise<Card | null> {
  const rows = await sql<Row[]>`SELECT ${columns()} FROM cards WHERE id = ${id}`;
  return rows[0] ? toCard(rows[0]) : null;
}

/**
 * Cards to show alongside one someone is looking at.
 *
 * Same player first, then same set, then same kind — the order a collector
 * would actually reach for. Never returns the card being viewed.
 */
export async function related(card: Card, limit = 4): Promise<Card[]> {
  const rows = await sql<Row[]>`
    SELECT ${columns()} FROM cards
    WHERE status = 'for_sale' AND id <> ${card.id}
    ORDER BY
      (player IS NOT NULL AND player = ${card.player}) DESC,
      (card_set IS NOT NULL AND card_set = ${card.cardSet}) DESC,
      (kind = ${card.kind}) DESC,
      created_at DESC
    LIMIT ${limit}
  `;
  return rows.map(toCard);
}

/** Back office: everything, including hidden. */
export async function listAll(): Promise<Card[]> {
  const rows = await sql<Row[]>`SELECT ${columns()} FROM cards ORDER BY created_at DESC`;
  return rows.map(toCard);
}

/**
 * The filter choices the current stock can actually support.
 *
 * Offering a sport nobody has a card in is a dead end dressed as a feature, so
 * the facets come off the shelf rather than out of a hardcoded list.
 */
export async function facets(): Promise<{ sports: string[]; counts: Record<CardKind, number> }> {
  const [sports, kinds] = await Promise.all([
    sql<{ sport: string }[]>`
      SELECT DISTINCT sport FROM cards
      WHERE status = 'for_sale' AND sport IS NOT NULL AND sport <> ''
      ORDER BY sport
    `,
    sql<{ kind: CardKind; n: number }[]>`
      SELECT kind, count(*)::int AS n FROM cards WHERE status = 'for_sale' GROUP BY kind
    `,
  ]);
  const counts: Record<CardKind, number> = { homemade: 0, sports: 0 };
  for (const row of kinds) counts[row.kind] = row.n;
  return { sports: sports.map((s) => s.sport), counts };
}

export async function createCard(opts: {
  name: string;
  priceCents: number;
  photo: Blob;
  userId: string;
  details: CardDetails;
}) {
  const id = newId("card");
  const stored = await putPhoto(id, opts.photo);
  const d = opts.details;
  await sql`
    INSERT INTO cards (
      id, name, price_cents, photo_url, photo_key, created_by,
      kind, player, team, sport, card_set, year, card_number, manufacturer, condition, notes
    ) VALUES (
      ${id}, ${opts.name}, ${opts.priceCents}, ${stored.url}, ${stored.key}, ${opts.userId},
      ${d.kind}, ${d.player ?? null}, ${d.team ?? null}, ${d.sport ?? null}, ${d.cardSet ?? null},
      ${d.year ?? null}, ${d.cardNumber ?? null}, ${d.manufacturer ?? null},
      ${d.condition ?? null}, ${d.notes ?? null}
    )
  `;
  return id;
}

export async function setStatus(id: string, status: CardStatus) {
  await sql`UPDATE cards SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

export async function updateCard(
  id: string,
  opts: { name: string; priceCents: number; details: CardDetails },
) {
  const d = opts.details;
  await sql`
    UPDATE cards SET
      name = ${opts.name}, price_cents = ${opts.priceCents}, kind = ${d.kind},
      player = ${d.player ?? null}, team = ${d.team ?? null}, sport = ${d.sport ?? null},
      card_set = ${d.cardSet ?? null}, year = ${d.year ?? null},
      card_number = ${d.cardNumber ?? null}, manufacturer = ${d.manufacturer ?? null},
      condition = ${d.condition ?? null}, notes = ${d.notes ?? null},
      updated_at = now()
    WHERE id = ${id}
  `;
}

export async function deleteCard(id: string) {
  const rows = await sql<{ photo_key: string }[]>`
    DELETE FROM cards WHERE id = ${id} RETURNING photo_key
  `;
  // Drop the photo too, so removing a card does not quietly accrue storage.
  const key = rows[0]?.photo_key;
  if (key) await deletePhoto(key);
}

/** "3.50" / "£3.50" / "50c" / "50" -> integer cents. */
export function parsePrice(input: string): number {
  const raw = input.trim().toLowerCase();
  if (!raw) return 0;
  const centsOnly = /^(\d+)\s*(c|p)$/.exec(raw);
  if (centsOnly) return Math.min(Number(centsOnly[1]), 10_000_000);
  const num = Number(raw.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.min(Math.round(num * 100), 10_000_000);
}

export function formatPrice(cents: number) {
  if (!cents) return "Free";
  return cents < 100 ? `${cents}c` : `$${(cents / 100).toFixed(2)}`;
}

/** A four-digit year, or null. Anything else is somebody mistyping. */
export function parseYear(input: string): number | null {
  const n = Number(input.trim());
  return Number.isInteger(n) && n >= 1850 && n <= 2100 ? n : null;
}

/**
 * The one-line summary under a card's name — "1989 Upper Deck · #1 · Mint".
 *
 * Assembled from whatever is present rather than a fixed template, so a card
 * carrying only a year does not render as "1989 ·  · ".
 */
export function cardLine(card: Card): string {
  return [
    [card.year, card.manufacturer].filter(Boolean).join(" "),
    card.cardSet,
    card.cardNumber ? `#${card.cardNumber.replace(/^#/, "")}` : null,
    card.condition,
  ]
    .map((part) => (part == null ? "" : String(part).trim()))
    .filter(Boolean)
    .join(" · ");
}
