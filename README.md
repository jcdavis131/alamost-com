# alamost.com — Lina's Card Shop

A real shop, run by Lina Davis, proprietor. Sports trading cards and cards she made herself,
photographed at home, described properly, and sold once — there is only ever one of each.

## What the shop does

**Browse.** A grid of everything for sale, matted on the shop's generative foil pattern.

**Research.** Full-text search across everything printed on a card — player, team, sport, set,
year, card number, maker — with prefix matching, so "grif" finds Ken Griffey Jr. and "poke"
finds Pokemon. Filter by kind and sport, sort by price, year or name. Every combination is a
shareable URL, which is how you send someone "the 1989 baseball ones".

**Look properly.** Each card has its own page with a full attribute table, the shopkeeper's
notes, and related cards ordered the way a collector would reach for them — same player first,
then same set, then same kind.

**Ask for one.** A signed-in buyer can ask Lina to hold a card. This is deliberately not a
checkout: no money moves through this site, because taking payments means taking on refunds,
chargebacks and somebody else's card details. A hold records that a named person wants a
specific card and hands the decision to the shopkeeper, who sees the names in the back office.

## Roles

| Role | Can do |
|---|---|
| **Owner** | Everything, plus create and manage people |
| **Shopkeeper** (staff) | Add cards, mark sold, delete |
| **Buyer** | Browse, ask for a card to be held, keep a saved login |

Buyers self-register at `/join`. Shopkeepers and owners are created by an owner from `/manage` —
self-registration always produces a buyer, so it cannot be used to grant privilege.

The first owner is seeded from environment variables the first time the app runs. No credentials
are stored in this repo.

## Photo-assisted listing

Photograph a card and the listing fills itself in. The photo goes to Claude, which decides
whether it is a sports card or something handmade and transcribes what is printed on it —
player, team, sport, set, year, card number, maker. The shopkeeper can overwrite anything before
publishing, and only blank fields are ever filled.

Two things the model is explicitly told not to do, because a buyer will read both as facts about
the object in the photograph:

- **Never guess at market value.** A price is suggested only when one is physically printed on
  the card or its packaging.
- **Never assess condition from a photograph.** Condition is filled in only by reading a grade
  off a professional grading slab, such as "PSA 9". A raw card gets an empty field.

This is strictly an assist. If `ANTHROPIC_API_KEY` is unset, the call fails, or the model
declines, the form simply stays blank and gets typed in by hand — adding a card never depends
on it.

## Foil Bloom

Every card wears a generative refraction pattern derived from its own id, so the same card
carries the same pattern forever and no two cards share one. It renders as plain SVG on the
server: no canvas, no runtime dependency, no extra request, and it scales to any size.

- `art/foil-bloom.md` — the algorithmic philosophy, and the conceptual seed underneath it
- `art/foil-bloom.html` — an interactive p5.js viewer with seed navigation and live parameters
- `lib/foil.ts` — the production implementation

## What you must provision

The app needs two stores and a handful of environment variables. Until they exist the site shows
a "not open yet" page instead of crashing.

1. **Postgres** — any provider. Use the *pooled* connection string; a direct one will exhaust
   connections under serverless load.
2. **Blob storage** — Vercel Blob, for card photos.

```
DATABASE_URL=postgres://…        # pooled connection string
BLOB_READ_WRITE_TOKEN=…          # from the Blob store
OWNER_EMAIL=you@example.com      # seeds the first owner on first run
OWNER_PASSWORD=…                 # use a real password; change it after first sign-in
OWNER_NAME=Cam                   # optional, defaults to "Owner"
ANTHROPIC_API_KEY=…              # optional — enables photo-assisted listing
```

There is no migration step. The schema is created on first use and every statement is
idempotent — including the `ALTER TABLE … ADD COLUMN IF NOT EXISTS` that carries an existing
shop forward — so deploying is just a git push.

> **Why `vercel.json` pins `outputDirectory`:** the Vercel project still has an Output Directory
> of `out`, left over from when this was a static export, and that setting applies to a build
> which now emits `.next`. Setting `outputDirectory` to `.next` in `vercel.json` overrides it from
> the repository, so no dashboard change is needed. Clearing the project setting is the tidier end
> state — at which point the key can be dropped.

## Security notes

- Passwords are hashed with scrypt (N=32768, r=8, p=1) and a per-user random salt. `maxmem` is
  raised explicitly — the default is exactly at the limit for these parameters and throws.
- Sessions are random 256-bit tokens. Only their SHA-256 hash is stored, so a database leak does
  not hand over live sessions. Cookies are `httpOnly`, `Secure` in production, and `SameSite=Lax`.
- Sign-in returns the same message for a wrong password and an unknown email, so it cannot be used
  to discover which addresses have accounts.
- Every privileged action re-checks the role server-side. Hiding a button is not the control.
- Cancelling a hold is scoped to the caller's own user id, so it can only ever cancel your own.
- Card photos are public and permanently fetchable once uploaded. Photograph cards on a plain
  surface — anything else in frame is public too.

## Run it on your own machine

The shop runs fully offline — no Vercel, no cloud database, no API keys. Photos are written to
`public/uploads` instead of Blob storage, and the listing autofill is simply off. That fallback
deliberately refuses to run in production, where serverless filesystems are ephemeral and
per-instance.

```bash
npm install
npm run db:up                  # Postgres 16 in Docker on port 5433
cp .env.example .env.local
npm run dev                    # http://localhost:3000
```

Put this in `.env.local` — it matches what `db:up` starts:

```
DATABASE_URL=postgres://shop:shop@localhost:5433/shop?sslmode=disable
OWNER_EMAIL=you@example.com
OWNER_PASSWORD=pick-something
```

`sslmode=disable` matters: without it the client requires TLS, which a local Postgres will not
offer. Port 5433 rather than 5432 so it never collides with a Postgres you already run.

First page load creates the schema and seeds the owner, so there is nothing to migrate. Sign in
at `/login`, then change the password at `/account`.

`npm run db:down` stops it; `npm run db:reset` wipes the data and starts clean.

**One thing local hosting cannot do:** serve the shop at alamost.com. Buyers can't reach your
machine, so this is the right setup for developing and for using the shop on your own network —
not for a shop other people browse. That needs a hosted database.

Already have Postgres and would rather not use Docker? Skip `db:up` and point `DATABASE_URL` at
whatever you have.

## Deploy

Pushes to `main` deploy to alamost.com via Vercel.

Built solo.
