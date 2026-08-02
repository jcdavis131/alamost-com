import "server-only";
import { sql } from "./db";
import { newId } from "./auth";

/**
 * "Please hold this one for me."
 *
 * Deliberately not a checkout. No money moves through this site and none
 * should: taking payments means taking on refunds, chargebacks and somebody
 * else's card details, none of which belong in a shop run from a kitchen
 * table. A hold records that a named, signed-in person wants a specific card,
 * and hands the decision to the shopkeeper.
 */

export async function hold(cardId: string, userId: string) {
  await sql`
    INSERT INTO holds (id, card_id, user_id) VALUES (${newId("hold")}, ${cardId}, ${userId})
    ON CONFLICT (card_id, user_id) DO NOTHING
  `;
}

export async function releaseHold(cardId: string, userId: string) {
  await sql`DELETE FROM holds WHERE card_id = ${cardId} AND user_id = ${userId}`;
}

export async function isHeldBy(cardId: string, userId: string) {
  const rows = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM holds WHERE card_id = ${cardId} AND user_id = ${userId}
  `;
  return (rows[0]?.n ?? 0) > 0;
}

export async function countHolds(cardId: string) {
  const rows = await sql<{ n: number }[]>`
    SELECT count(*)::int AS n FROM holds WHERE card_id = ${cardId}
  `;
  return rows[0]?.n ?? 0;
}

export type Asker = { cardId: string; displayName: string; email: string; createdAt: Date };

/** Who has asked for what — the shopkeeper's view, ordered by who asked first. */
export async function askers(): Promise<Asker[]> {
  const rows = await sql<
    { card_id: string; display_name: string; email: string; created_at: Date }[]
  >`
    SELECT h.card_id, u.display_name, u.email, h.created_at
    FROM holds h JOIN users u ON u.id = h.user_id
    ORDER BY h.created_at ASC
  `;
  return rows.map((r) => ({
    cardId: r.card_id,
    displayName: r.display_name,
    email: r.email,
    createdAt: r.created_at,
  }));
}
