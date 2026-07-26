import "server-only";
import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { sql } from "./db";

/**
 * promisify() resolves to the 3-argument overload and drops the options
 * object, so wrap the callback form directly instead.
 */
function scrypt(
  password: string,
  salt: Buffer,
  keylen: number,
  opts: { N: number; r: number; p: number },
) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCb(
      password,
      salt,
      keylen,
      // scrypt needs roughly 128 * N * r bytes. At N=32768, r=8 that is 32MB,
      // which is exactly the default maxmem and throws. Give it headroom.
      { ...opts, maxmem: 96 * 1024 * 1024 },
      (err, key) => (err ? reject(err) : resolve(key as Buffer)),
    );
  });
}

export type Role = "owner" | "staff" | "buyer";
export type User = { id: string; email: string; role: Role; displayName: string };

export const SESSION_COOKIE = "shop_session";
const SESSION_DAYS = 30;

/** scrypt parameters. N=2^15 keeps a hash around 100ms on Vercel's runtime. */
const N = 32768;
const R = 8;
const P = 1;
const KEYLEN = 32;

export function newId(prefix: string) {
  return `${prefix}_${randomBytes(12).toString("hex")}`;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  try {
    const [scheme, n, r, p, saltB64, keyB64] = stored.split("$");
    if (scheme !== "scrypt") return false;
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(keyB64, "base64");
    const actual = await scrypt(password.normalize("NFKC"), salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/** Sessions are looked up by hash, so the raw token only ever lives in the cookie. */
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (${hashToken(token)}, ${userId}, ${expires})
  `;
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
  cookies().delete(SESSION_COOKIE);
}

/** Returns the signed-in user, or null. Expired sessions are treated as absent. */
export async function currentUser(): Promise<User | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const rows = await sql<
      { id: string; email: string; role: Role; display_name: string }[]
    >`
      SELECT u.id, u.email, u.role, u.display_name
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > now()
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return null;
    return { id: row.id, email: row.email, role: row.role, displayName: row.display_name };
  } catch {
    return null;
  }
}

/** Staff and owner can manage inventory; only owner can manage people. */
export function canManageInventory(user: User | null) {
  return user?.role === "owner" || user?.role === "staff";
}

export function canManagePeople(user: User | null) {
  return user?.role === "owner";
}

export async function createUser(opts: {
  email: string;
  password: string;
  role: Role;
  displayName: string;
}) {
  const email = opts.email.trim().toLowerCase();
  const id = newId("u");
  await sql`
    INSERT INTO users (id, email, password_hash, role, display_name)
    VALUES (${id}, ${email}, ${await hashPassword(opts.password)}, ${opts.role}, ${opts.displayName.trim()})
  `;
  return id;
}

export async function findUserByEmail(email: string) {
  const rows = await sql<
    { id: string; email: string; password_hash: string; role: Role; display_name: string }[]
  >`SELECT id, email, password_hash, role, display_name FROM users WHERE lower(email) = ${email
    .trim()
    .toLowerCase()} LIMIT 1`;
  return rows[0] ?? null;
}

/** Postgres unique-violation, i.e. the email is already registered. */
export function isDuplicate(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}
