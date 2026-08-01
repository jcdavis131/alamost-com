import "server-only";
import { sql } from "./db";
import { createUser, isDuplicate } from "./auth";

/**
 * Creates the schema and the owner account if they are missing.
 *
 * Runs lazily on first use rather than as a separate migration step, so
 * deploying is just a git push. Every statement is idempotent, and concurrent
 * cold starts racing each other is safe.
 */
let ready: Promise<void> | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('owner', 'staff', 'buyer')),
  display_name  TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (lower(email));

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS cards (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  photo_url   TEXT NOT NULL,
  photo_key   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'sold', 'hidden')),
  created_by  TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cards_status_created_idx ON cards (status, created_at DESC);

-- Sports trading cards carry attributes a homemade card does not. They are all
-- nullable: a card drawn in felt-tip has no manufacturer, and pretending it
-- does would make the shop lie about its own stock.
ALTER TABLE cards ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'homemade'
  CHECK (kind IN ('homemade', 'sports'));
ALTER TABLE cards ADD COLUMN IF NOT EXISTS player       TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS team         TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS sport        TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_set     TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS year         INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_number  TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS manufacturer TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS condition    TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS notes        TEXT;

-- Researching a card means searching across everything printed on it, not just
-- its display name. A stored generated column keeps the index in step with the
-- row automatically, so there is no trigger to forget.
ALTER TABLE cards ADD COLUMN IF NOT EXISTS search tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(player, '') || ' ' ||
      coalesce(team, '') || ' ' ||
      coalesce(sport, '') || ' ' ||
      coalesce(card_set, '') || ' ' ||
      coalesce(manufacturer, '') || ' ' ||
      coalesce(card_number, '') || ' ' ||
      coalesce(year::text, '') || ' ' ||
      coalesce(condition, '') || ' ' ||
      coalesce(notes, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS cards_search_idx ON cards USING GIN (search);
CREATE INDEX IF NOT EXISTS cards_kind_idx ON cards (kind);

-- A buyer asking Lina to hold a card. This is not a sale: no money moves here,
-- and the shopkeeper still decides. It exists so "I want that one" survives the
-- browser tab being closed.
CREATE TABLE IF NOT EXISTS holds (
  id         TEXT PRIMARY KEY,
  card_id    TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS holds_card_user_idx ON holds (card_id, user_id);
CREATE INDEX IF NOT EXISTS holds_card_idx ON holds (card_id);
`;

async function run() {
  await sql.unsafe(SCHEMA);

  // Seed the owner from environment. Never hardcode credentials; if the vars
  // are absent the shop still runs, it just has nobody who can sign in yet.
  const email = process.env.OWNER_EMAIL?.trim();
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password) return;

  const existing = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM users WHERE role = 'owner'`;
  if (existing[0]?.n > 0) return;

  try {
    await createUser({
      email,
      password,
      role: "owner",
      displayName: process.env.OWNER_NAME?.trim() || "Owner",
    });
  } catch (err) {
    // Another cold start won the race — that is the desired end state anyway.
    if (!isDuplicate(err)) throw err;
  }
}

export function ensureReady() {
  if (!ready) {
    ready = run().catch((err) => {
      // Reset so the next request retries rather than caching the failure.
      ready = null;
      throw err;
    });
  }
  return ready;
}
