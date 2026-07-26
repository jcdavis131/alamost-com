import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

/**
 * Postgres connection. Works with any provider that hands out a standard
 * connection string — Neon, Supabase, Vercel Postgres, or a local server.
 *
 * Use the *pooled* connection string in serverless: each invocation gets its
 * own client, and a direct connection would exhaust the server's connection
 * limit under load.
 */
declare global {
  // eslint-disable-next-line no-var
  var __shopSql: Sql | undefined;
}

function connect(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres store to the project and expose its pooled connection string.",
    );
  }
  const client = postgres(url, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    // Providers terminate plaintext connections; `require` avoids needing a CA bundle.
    ssl: url.includes("sslmode=disable") ? false : "require",
  });
  // Reused across hot reloads in dev so a file save does not leak connections.
  if (process.env.NODE_ENV !== "production") globalThis.__shopSql = client;
  return client;
}

function client(): Sql {
  return globalThis.__shopSql ?? connect();
}

/**
 * Connects on first query rather than on import. Pages that never touch the
 * database — the sign-in form, for one — must still build when no database is
 * attached yet, and a module-scope connection would throw during the build.
 */
export const sql = new Proxy(function () {} as unknown as Sql, {
  apply(_target, _thisArg, args: unknown[]) {
    // Tagged-template call: sql`SELECT ...`
    return (client() as unknown as (...a: unknown[]) => unknown)(...args);
  },
  get(_target, prop: string | symbol) {
    const c = client() as unknown as Record<string | symbol, unknown>;
    const value = c[prop];
    return typeof value === "function" ? (value as (...a: unknown[]) => unknown).bind(c) : value;
  },
}) as Sql;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
