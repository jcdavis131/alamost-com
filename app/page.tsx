import Image from "next/image";
import SiteHeader from "../components/site-header";
import Footer from "../components/footer";
import { isDatabaseConfigured } from "../lib/db";
import { ensureReady } from "../lib/bootstrap";
import { formatPrice, listForSale, type Card } from "../lib/cards-db";

// The storefront reflects inventory changes immediately.
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!isDatabaseConfigured()) return <NotConfigured />;

  let cards: Card[] = [];
  let failed = false;
  try {
    await ensureReady();
    cards = await listForSale();
  } catch {
    failed = true;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader count={failed ? undefined : cards.length} />

      <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pb-20 pt-10">
        {failed ? (
          <Notice>
            The shop cannot reach its database right now. Nothing has been lost
            — try again shortly.
          </Notice>
        ) : cards.length === 0 ? (
          <Notice>The shop is empty right now. Come back soon.</Notice>
        ) : (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.id}>
                <article>
                  <div
                    className="hairline relative w-full overflow-hidden rounded-xl bg-white"
                    style={{ aspectRatio: "4 / 5" }}
                  >
                    <Image
                      src={card.photoUrl}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <h2 className="display min-w-0 break-words text-[21px] leading-snug">
                      {card.name}
                    </h2>
                    <p className="shrink-0 text-[16px] font-semibold text-[var(--accent)]">
                      {formatPrice(card.priceCents)}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
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
      <h1 className="display text-[34px] sm:text-[40px]">
        Lina&apos;s Card Shop
      </h1>
      <p className="mt-3 max-w-[34ch] text-[18px] text-[var(--ink-muted)]">
        Not open yet. Come back soon.
      </p>
      <p className="mt-10 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
        alamost.com
      </p>
    </div>
  );
}
