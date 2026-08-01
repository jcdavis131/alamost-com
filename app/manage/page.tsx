import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../components/site-header";
import Footer from "../../components/footer";
import AddCard from "../../components/add-card";
import AddPerson from "../../components/add-person";
import Foil from "../../components/foil";
import { KindChip } from "../../components/card-tile";
import { canManageInventory, canManagePeople, currentUser } from "../../lib/auth";
import { isDatabaseConfigured, sql } from "../../lib/db";
import { ensureReady } from "../../lib/bootstrap";
import { askers, type Asker } from "../../lib/holds";
import { cardLine, formatPrice, listAll } from "../../lib/cards-db";
import { addCard, changeStatus, createPerson, removeCard, suggestCard } from "../actions";
import { isVisionConfigured } from "../../lib/vision";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage" };

const statusLabel = { for_sale: "For sale", sold: "Sold", hidden: "Hidden" } as const;

export default async function ManagePage() {
  if (!isDatabaseConfigured()) redirect("/");
  await ensureReady();

  const user = await currentUser();
  if (!canManageInventory(user)) redirect("/login");

  const [cards, waiting] = await Promise.all([listAll(), askers()]);

  const byCard = new Map<string, Asker[]>();
  for (const a of waiting) {
    const list = byCard.get(a.cardId) ?? [];
    list.push(a);
    byCard.set(a.cardId, list);
  }

  const people = canManagePeople(user)
    ? await sql<{ id: string; email: string; role: string; display_name: string }[]>`
        SELECT id, email, role, display_name FROM users ORDER BY
          CASE role WHEN 'owner' THEN 0 WHEN 'staff' THEN 1 ELSE 2 END, display_name
      `
    : [];

  const forSale = cards.filter((c) => c.status === "for_sale").length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pb-24 pt-9">
        <p className="text-[15px] text-[var(--ink-muted)]">
          Signed in as {user!.displayName} · {user!.role === "owner" ? "Owner" : "Shopkeeper"} ·{" "}
          {forSale} of {cards.length} on the shelves
        </p>

        {waiting.length > 0 && (
          <p className="mt-4 rounded-2xl bg-[var(--accent-soft)] px-5 py-4 text-[16px]">
            <strong className="font-semibold">
              {waiting.length} {waiting.length === 1 ? "person is" : "people are"} waiting
            </strong>{" "}
            on a card. Their names are next to the cards below.
          </p>
        )}

        <div className="mt-6">
          <AddCard action={addCard} suggest={isVisionConfigured() ? suggestCard : undefined} />
        </div>

        <h2 className="display mt-14 text-[26px] sm:text-[30px]">Inventory</h2>
        {cards.length === 0 ? (
          <p className="hairline mt-5 rounded-2xl px-6 py-14 text-center text-[17px] text-[var(--ink-muted)]">
            Nothing yet. Add the first card above.
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {cards.map((card) => {
              const asked = byCard.get(card.id) ?? [];
              const line = cardLine(card);
              return (
                <li key={card.id}>
                  <Link href={`/card/${card.id}`} className="group block">
                    <div className="sleeve p-[9px] sm:p-3" style={{ aspectRatio: "4 / 5" }}>
                      <Foil seed={card.id} className="foil" />
                      <div className="sleeve-photo h-full w-full">
                        <Image
                          src={card.photoUrl}
                          alt={card.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 260px"
                          className="object-cover"
                        />
                      </div>
                      {card.status !== "for_sale" && (
                        <span className="absolute left-3 top-3 rounded-full bg-[var(--ink)]/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                          {statusLabel[card.status]}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <h3 className="display min-w-0 break-words text-[19px] leading-snug group-hover:text-[var(--accent)]">
                        {card.name}
                      </h3>
                      <p className="shrink-0 text-[15px] font-semibold text-[var(--accent)]">
                        {formatPrice(card.priceCents)}
                      </p>
                    </div>
                  </Link>

                  {line && (
                    <p className="mt-1 truncate text-[13px] text-[var(--ink-muted)]" title={line}>
                      {line}
                    </p>
                  )}

                  <div className="mt-2">
                    <KindChip card={card} />
                  </div>

                  {asked.length > 0 && (
                    <p className="mt-2 text-[13px] font-medium text-[var(--accent)]">
                      Asked for by {asked.map((a) => a.displayName).join(", ")}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <form action={changeStatus}>
                      <input type="hidden" name="id" value={card.id} />
                      <input
                        type="hidden"
                        name="status"
                        value={card.status === "for_sale" ? "sold" : "for_sale"}
                      />
                      <button
                        type="submit"
                        className="hairline rounded-full bg-[var(--paper-raised)] px-5 text-[14px] font-semibold"
                        style={{ minHeight: 44 }}
                      >
                        {card.status === "for_sale" ? "Mark sold" : "Put back"}
                      </button>
                    </form>
                    <form action={removeCard}>
                      <input type="hidden" name="id" value={card.id} />
                      <button
                        type="submit"
                        className="rounded-full px-4 text-[14px] font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]"
                        style={{ minHeight: 44 }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {canManagePeople(user) && (
          <>
            <h2 className="display mt-16 text-[26px] sm:text-[30px]">People</h2>
            <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
              Shopkeepers can add and sell cards. Buyers can browse and ask for a card to be held.
            </p>

            <ul className="hairline mt-5 divide-y divide-[var(--line)] rounded-2xl bg-[var(--paper-raised)]">
              {people.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4"
                >
                  <span className="text-[17px] font-semibold">{p.display_name}</span>
                  <span className="text-[15px] text-[var(--ink-muted)]">{p.email}</span>
                  <span className="label text-[var(--accent)]">{p.role}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <AddPerson action={createPerson} />
            </div>
          </>
        )}

        <p className="mt-14 text-[15px]">
          <Link href="/" className="text-[var(--ink-muted)] underline underline-offset-4">
            View the shop
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
