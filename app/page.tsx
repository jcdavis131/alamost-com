import SiteHeader from "../components/site-header";
import Footer from "../components/footer";
import BrowseBar from "../components/browse-bar";
import CardTile from "../components/card-tile";
import Foil from "../components/foil";
import { isDatabaseConfigured } from "../lib/db";
import { ensureReady } from "../lib/bootstrap";
import { browse, facets, isKind, isSort, type Card, type CardKind, type Sort } from "../lib/cards-db";

// The storefront reflects inventory changes immediately.
export const dynamic = "force-dynamic";

type Params = { [key: string]: string | string[] | undefined };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function Page({ searchParams }: { searchParams: Params }) {
  if (!isDatabaseConfigured()) return <NotConfigured />;

  const q = one(searchParams.q).slice(0, 100);
  const rawKind = one(searchParams.kind);
  const kind: CardKind | "" = isKind(rawKind) ? rawKind : "";
  const sport = one(searchParams.sport).slice(0, 40);
  const rawSort = one(searchParams.sort);
  const sort: Sort = isSort(rawSort) ? rawSort : "newest";

  let cards: Card[] = [];
  let sports: string[] = [];
  let counts: Record<CardKind, number> = { homemade: 0, sports: 0 };
  let failed = false;
  try {
    await ensureReady();
    const [found, f] = await Promise.all([
      browse({ q, kind: kind || undefined, sport: sport || undefined, sort }),
      facets(),
    ]);
    cards = found;
    sports = f.sports;
    counts = f.counts;
  } catch {
    failed = true;
  }

  const stocked = counts.homemade + counts.sports;
  const searching = Boolean(q || kind || sport);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader count={failed ? undefined : stocked} />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pb-24 pt-8">
        {failed ? (
          <Notice>
            The shop cannot reach its database right now. Nothing has been lost — try again
            shortly.
          </Notice>
        ) : (
          <>
            {!searching && stocked > 0 && <Hero counts={counts} />}

            <BrowseBar
              q={q}
              kind={kind}
              sport={sport}
              sort={sort}
              sports={sports}
              counts={counts}
              total={cards.length}
            />

            {cards.length === 0 ? (
              searching ? (
                <Notice>
                  Nothing matches that yet. Try a shorter word — or{" "}
                  <a href="/" className="font-semibold underline underline-offset-4">
                    see everything
                  </a>
                  .
                </Notice>
              ) : (
                <EmptyShop />
              )
            ) : (
              <ul className="grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
                {cards.map((card) => (
                  <li key={card.id}>
                    <CardTile
                      card={card}
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 260px"
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

/**
 * The shop's one paragraph.
 *
 * It only appears on the unfiltered front page — once someone is searching,
 * they have already decided what the shop is and the words are in the way.
 */
function Hero({ counts }: { counts: Record<CardKind, number> }) {
  const both = counts.homemade > 0 && counts.sports > 0;
  return (
    <section className="mb-10 max-w-[52ch]">
      <h1 className="display text-[30px] leading-[1.15] sm:text-[38px]">
        Cards worth looking at twice.
      </h1>
      <p className="mt-3 text-[17px] leading-relaxed text-[var(--ink-muted)]">
        {both
          ? "Sports cards, and cards Lina made herself. Every one photographed at home, described properly, and sold once."
          : "Every card photographed at home, described properly, and sold once. There is only ever one of each."}
      </p>
    </section>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="hairline rounded-2xl px-6 py-16 text-center text-[17px] text-[var(--ink-muted)]">
      {children}
    </p>
  );
}

/**
 * Nothing on the shelves yet.
 *
 * Rendered as three empty sleeves rather than a line of grey text — the foil
 * is the one thing the shop can show before it has any stock, and an empty
 * shop that still looks like a shop reads as "opening soon", not "broken".
 */
function EmptyShop() {
  return (
    <div className="py-6 text-center">
      <ul className="mx-auto grid max-w-[560px] grid-cols-3 gap-5" aria-hidden="true">
        {["opening-1", "opening-2", "opening-3"].map((seed) => (
          <li key={seed} className="sleeve p-2" style={{ aspectRatio: "4 / 5" }}>
            <Foil seed={seed} className="foil" />
          </li>
        ))}
      </ul>
      <h2 className="display mt-9 text-[24px]">The shelves are ready.</h2>
      <p className="mx-auto mt-2 max-w-[38ch] text-[16px] text-[var(--ink-muted)]">
        Lina is photographing the first cards now. Come back shortly.
      </p>
    </div>
  );
}

/**
 * Shown before a database is attached, instead of a crash.
 *
 * This is a public page on a public domain, so it stays a plain "not open
 * yet" notice. Naming the environment variables here would tell every
 * visitor how the shop is wired; the setup steps live in the README, which
 * is where whoever is deploying it will be looking anyway.
 */
function NotConfigured() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="sleeve mb-9 w-[132px] p-2" style={{ aspectRatio: "4 / 5" }}>
        <Foil seed="alamost" className="foil" />
      </div>
      <h1 className="display text-[34px] sm:text-[40px]">Lina&apos;s Card Shop</h1>
      <p className="mt-3 max-w-[34ch] text-[18px] text-[var(--ink-muted)]">
        Not open yet. Come back soon.
      </p>
      <p className="label mt-10">Lina Davis · Proprietor · alamost.com</p>
    </div>
  );
}
