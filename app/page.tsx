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
            The shop cannot reach its database right now. Nothing has been lost — try again shortly.
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
                    <h2 className="display min-w-0 break-words text-[21px] leading-snug">{card.name}</h2>
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

/** Shown before a database has been attached, instead of a crash. */
function NotConfigured() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="hairline max-w-[520px] rounded-2xl bg-[var(--paper-raised)] p-8">
        <h1 className="display text-[30px]">Lina&apos;s Card Shop</h1>
        <p className="mt-3 text-[17px] text-[var(--ink-muted)]">
          The shop is being set up. It needs a database before it can open.
        </p>
        <p className="mt-4 text-[15px] text-[var(--ink-muted)]">
          Set <code className="font-mono text-[14px]">DATABASE_URL</code>,{" "}
          <code className="font-mono text-[14px]">BLOB_READ_WRITE_TOKEN</code>,{" "}
          <code className="font-mono text-[14px]">OWNER_EMAIL</code> and{" "}
          <code className="font-mono text-[14px]">OWNER_PASSWORD</code> in the project&apos;s
          environment variables, then redeploy.
        </p>
      </div>
    </div>
  );
}
