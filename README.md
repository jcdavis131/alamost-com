# alamost.com — Lina's Card Shop

A real shop. Lina photographs the cards she is selling, names and prices them, and they appear
publicly at alamost.com for anyone to browse.

## Roles

| Role | Can do |
|---|---|
| **Owner** | Everything, plus create and manage people |
| **Shopkeeper** (staff) | Add cards, mark sold, delete |
| **Buyer** | Browse, and keep a saved login |

Buyers self-register at `/join`. Shopkeepers and owners are created by an owner from `/manage` —
self-registration always produces a buyer, so it cannot be used to grant privilege.

The first owner is seeded from environment variables the first time the app runs. No credentials
are stored in this repo.

## What you must provision

The app needs two stores and four environment variables. Until they exist the site shows a
"being set up" page instead of crashing.

1. **Postgres** — any provider. Use the *pooled* connection string; a direct one will exhaust
   connections under serverless load.
2. **Blob storage** — Vercel Blob, for card photos.

```
DATABASE_URL=postgres://…        # pooled connection string
BLOB_READ_WRITE_TOKEN=…          # from the Blob store
OWNER_EMAIL=you@example.com      # seeds the first owner on first run
OWNER_PASSWORD=…                 # use a real password; change it after first sign-in
OWNER_NAME=Cam                   # optional, defaults to "Owner"
```

There is no migration step. The schema is created on first use and every statement is idempotent,
so deploying is just a git push.

> **Vercel project setting:** the project's *Output Directory* must be cleared (empty / auto).
> It is currently `out`, left over from when this was a static export. With it set, the Next.js
> builder fails looking for `routes-manifest.json` and no server code can deploy.

## Security notes

- Passwords are hashed with scrypt (N=32768, r=8, p=1) and a per-user random salt. `maxmem` is
  raised explicitly — the default is exactly at the limit for these parameters and throws.
- Sessions are random 256-bit tokens. Only their SHA-256 hash is stored, so a database leak does
  not hand over live sessions. Cookies are `httpOnly`, `Secure` in production, and `SameSite=Lax`.
- Sign-in returns the same message for a wrong password and an unknown email, so it cannot be used
  to discover which addresses have accounts.
- Every privileged action re-checks the role server-side. Hiding a button is not the control.
- Card photos are public and permanently fetchable once uploaded. Photograph cards on a plain
  surface — anything else in frame is public too.

## Develop

Requires a local Postgres. Without `BLOB_READ_WRITE_TOKEN`, photos are written to
`public/uploads` so the whole flow works offline; that fallback refuses to run in production,
where serverless filesystems are ephemeral.

```bash
npm install
cp .env.example .env.local     # then fill it in
npm run dev
```

## Deploy

Pushes to `main` deploy to alamost.com via Vercel.

Built solo.
