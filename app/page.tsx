"use client";
import { useMemo, useState } from "react";
import { accents, cardsManifest, kinds, type CardKind } from "../lib/cards";
import CardCanvas, { downloadCard } from "../components/card-canvas";
import Footer from "../components/footer";

type Filter = CardKind | "all";

export default function Page() {
  const [filter, setFilter] = useState<Filter>("all");
  const [got, setGot] = useState<string | null>(null);

  const shown = useMemo(
    () => (filter === "all" ? cardsManifest : cardsManifest.filter((c) => c.kind === filter)),
    [filter],
  );

  function take(id: string) {
    const card = cardsManifest.find((c) => c.id === id);
    if (!card) return;
    if (downloadCard(card)) {
      setGot(id);
      window.setTimeout(() => setGot((g) => (g === id ? null : g)), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <header className="border-b-4 border-[#0072B2] bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-7 text-center">
          <h1 className="text-[40px] font-extrabold leading-tight tracking-tight text-[#111110] sm:text-[56px]">
            <span aria-hidden="true">🌈</span> Lina&apos;s Card Shop
          </h1>
          <p className="mx-auto mt-2 max-w-[28ch] text-[19px] font-semibold text-[#4A4A44] sm:text-[22px]">
            Pick a card. Print it. Colour it in.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 pb-16 pt-7">
        <h2 className="sr-only">Choose what to look at</h2>
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {kinds.map((k) => {
            const on = filter === k.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => setFilter(k.id)}
                aria-pressed={on}
                className={`inline-flex items-center gap-2.5 rounded-full border-4 px-6 text-[21px] font-extrabold transition-colors ${
                  on
                    ? "border-[#0072B2] bg-[#0072B2] text-white"
                    : "border-[#D9D6CC] bg-white text-[#111110] hover:border-[#0072B2]"
                }`}
                style={{ minHeight: 64 }}
              >
                <span aria-hidden="true" className="text-[26px]">
                  {k.art}
                </span>
                {k.label}
              </button>
            );
          })}
        </div>

        <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((card) => {
            const accent = accents[card.accent];
            const mine = got === card.id;
            return (
              <li
                key={card.id}
                className="flex flex-col rounded-[20px] border-4 border-[#EDE9DE] bg-white p-4"
              >
                <CardCanvas card={card} />
                <button
                  type="button"
                  onClick={() => take(card.id)}
                  className="mt-4 w-full rounded-[14px] text-[22px] font-extrabold text-white transition-transform active:scale-[0.98]"
                  style={{ minHeight: 68, background: mine ? "#009E73" : accent.bg, color: mine ? "#FFFFFF" : accent.ink }}
                >
                  {mine ? (
                    <>
                      <span aria-hidden="true">🎉</span> Got it!
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">⬇</span> Get {card.name}
                    </>
                  )}
                </button>
                <p role="status" className="sr-only">
                  {mine ? `${card.name} card saved.` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </main>

      <Footer />
    </div>
  );
}
