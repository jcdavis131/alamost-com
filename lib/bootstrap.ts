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
