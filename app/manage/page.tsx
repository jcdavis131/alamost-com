import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../components/site-header";
import Footer from "../../components/footer";
import AddCard from "../../components/add-card";
import AddPerson from "../../components/add-person";
import { canManageInventory, canManagePeople, currentUser } from "../../lib/auth";
import { isDatabaseConfigured, sql } from "../../lib/db";
import { ensureReady } from "../../lib/bootstrap";
import { formatPrice, listAll } from "../../lib/cards-db";
import { addCard, changeStatus, createPerson, removeCard } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manage — Lina's Card Shop" };

const statusLabel = { for_sale: "For sale", sold: "Sold", hidden: "Hidden" } as const;

export default async function ManagePage() {
  if (!isDatabaseConfigured()) redirect("/");
  await ensureReady();

  const user = await currentUser();
  if (!canManageInventory(user)) redirect("/login");

  const cards = await listAll();
  const people = canManagePeople(user)
    ? await sql<{ id: string; email: string; role: string; display_name: string }[]>`
        SELECT id, email, role, display_name FROM users ORDER BY
          CASE role WHEN 'owner' THEN 0 WHEN 'staff' THEN 1 ELSE 2 END, display_name
      `
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1080px] flex-1 px-6 pb-20 pt-9">
        <p className="text-[15px] text-[var(--ink-muted)]">
          Signed in as {user!.displayName} · {user!.role === "owner" ? "Owner" : "Shopkeeper"}
        </p>

        <div className="mt-6">
          <AddCard action={addCard} />
        </div>

        <h2 className="display mt-14 text-[26px] sm:text-[30px]">Inventory</h2>
        {cards.length === 0 ? (
          <p className="hairline mt-5 rounded-2xl px-6 py-14 text-center text-[17px] text-[var(--ink-muted)]">
            Nothing yet. Add the first card above.
          </p>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.id}>
                <div
                  className="hairline relative w-full overflow-hidden rounded-xl bg-white"
                  style={{ aspectRatio: "4 / 5" }}
                >
                  <Image
                    src={card.photoUrl}
                    alt={card.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 320px"
                    className="object-cover"
                  />
                  {card.status !== "for_sale" && (
                    <span className="absolute left-2 top-2 rounded-full bg-[var(--ink)]/85 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
                      {statusLabel[card.status]}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="display min-w-0 break-words text-[20px] leading-snug">{card.name}</h3>
                  <p className="shrink-0 text-[15px] font-semibold text-[var(--accent)]">
                    {formatPrice(card.priceCents)}
                  </p>
                </div>

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
            ))}
          </ul>
        )}

        {canManagePeople(user) && (
          <>
            <h2 className="display mt-16 text-[26px] sm:text-[30px]">People</h2>
            <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
              Shopkeepers can add and sell cards. Buyers can only browse.
            </p>

            <ul className="hairline mt-5 divide-y divide-[var(--line)] rounded-2xl bg-[var(--paper-raised)]">
              {people.map((p) => (
                <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-4">
                  <span className="text-[17px] font-semibold">{p.display_name}</span>
                  <span className="text-[15px] text-[var(--ink-muted)]">{p.email}</span>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {p.role}
                  </span>
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
