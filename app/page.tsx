"use client";
import { useEffect, useState } from "react";
import { loadCards, saveCards, type ShopCard } from "../lib/shop";
import { downloadShopCard } from "../components/card-canvas";
import AddCard from "../components/add-card";
import Footer from "../components/footer";

export default function Page() {
  const [cards, setCards] = useState<ShopCard[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Cards live in localStorage, so they can only be read once mounted.
  useEffect(() => {
    setCards(loadCards());
    setReady(true);
  }, []);

  function commit(next: ShopCard[]) {
    setCards(next);
    const res = saveCards(next);
    if (!res.ok) {
      setNotice(
        res.reason === "full"
          ? "The shop is full on this device. Remove a card to add another."
          : "That did not save. Your browser may be blocking storage.",
      );
    } else {
      setNotice(null);
    }
  }

  const add = (card: ShopCard) => commit([card, ...cards]);
  const remove = (id: string) => commit(cards.filter((c) => c.id !== id));

  return (
    <div className="min-h-screen">
      <header className="hairline border-x-0 border-t-0 bg-[var(--paper-raised)]">
        <div className="mx-auto flex max-w-[1080px] items-baseline justify-between gap-4 px-6 py-7">
          <h1 className="display text-[30px] leading-none sm:text-[38px]">Lina&apos;s Card Shop</h1>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
            {ready && cards.length > 0 ? `${cards.length} for sale` : "Open"}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-6 pb-20 pt-8">
        <AddCard onAdd={add} />

        {notice && (
          <p role="alert" className="mt-5 text-[15px] font-medium text-[var(--accent)]">
            {notice}
          </p>
        )}

        <h2 className="display mt-14 text-[26px] sm:text-[30px]">For sale</h2>

        {ready && cards.length === 0 && (
          <p className="hairline mt-5 rounded-2xl px-6 py-14 text-center text-[17px] text-[var(--ink-muted)]">
            No cards yet. Take a photo above to put your first one in the shop.
          </p>
        )}

        <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
          {cards.map((card) => (
            <li key={card.id}>
              <article>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.photo}
                  alt={card.name}
                  className="hairline w-full rounded-xl bg-white object-cover"
                  style={{ aspectRatio: "4 / 5" }}
                />
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="display min-w-0 break-words text-[21px] leading-snug">
                    {card.name}
                  </h3>
                  {card.price && (
                    <p className="shrink-0 text-[16px] font-semibold text-[var(--accent)]">
                      {card.price}
                    </p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadShopCard(card)}
                    className="hairline rounded-full bg-[var(--paper-raised)] px-5 text-[15px] font-semibold"
                    style={{ minHeight: 48 }}
                  >
                    Save picture
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(card.id)}
                    className="rounded-full px-5 text-[15px] font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]"
                    style={{ minHeight: 48 }}
                  >
                    Remove
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </main>

      <Footer />
    </div>
  );
}
