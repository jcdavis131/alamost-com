import "server-only";
import { sql } from "./db";
import { newId } from "./auth";
import { putPhoto, deletePhoto } from "./storage";

export type CardStatus = "for_sale" | "sold" | "hidden";

export type Card = {
  id: string;
  name: string;
  priceCents: number;
  photoUrl: string;
  status: CardStatus;
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  price_cents: number;
  photo_url: string;
  status: CardStatus;
  created_at: Date;
};

const toCard = (r: Row): Card => ({
  id: r.id,
  name: r.name,
  priceCents: r.price_cents,
  photoUrl: r.photo_url,
  status: r.status,
  createdAt: r.created_at.toISOString(),
});

/** Public storefront: only what is actually for sale. */
export async function listForSale(): Promise<Card[]> {
  const rows = await sql<Row[]>`
    SELECT id, name, price_cents, photo_url, status, created_at
    FROM cards WHERE status = 'for_sale' ORDER BY created_at DESC
  `;
  return rows.map(toCard);
}

/** Back office: everything, including sold and hidden. */
export async function listAll(): Promise<Card[]> {
  const rows = await sql<Row[]>`
    SELECT id, name, price_cents, photo_url, status, created_at
    FROM cards ORDER BY created_at DESC
  `;
  return rows.map(toCard);
}

export async function createCard(opts: {
  name: string;
  priceCents: number;
  photo: Blob;
  userId: string;
}) {
  const id = newId("card");
  const stored = await putPhoto(id, opts.photo);
  await sql`
    INSERT INTO cards (id, name, price_cents, photo_url, photo_key, created_by)
    VALUES (${id}, ${opts.name}, ${opts.priceCents}, ${stored.url}, ${stored.key}, ${opts.userId})
  `;
  return id;
}

export async function setStatus(id: string, status: CardStatus) {
  await sql`UPDATE cards SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

export async function updateCard(id: string, opts: { name: string; priceCents: number }) {
  await sql`
    UPDATE cards SET name = ${opts.name}, price_cents = ${opts.priceCents}, updated_at = now()
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
