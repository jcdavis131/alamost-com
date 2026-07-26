"use client";
import { useRef, useState } from "react";
import { fileToPhoto, newId, type ShopCard } from "../lib/shop";

type Props = { onAdd: (card: ShopCard) => void };

export default function AddCard({ onAdd }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      setPhoto(await fileToPhoto(file));
    } catch {
      setError("That photo would not open. Try taking it again.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPhoto(null);
    setName("");
    setPrice("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function add() {
    if (!photo) return;
    onAdd({
      id: newId(),
      name: name.trim() || "My card",
      price: price.trim(),
      photo,
      createdAt: Date.now(),
    });
    reset();
  }

  return (
    <section
      className="hairline rounded-2xl bg-[var(--paper-raised)] p-5 sm:p-7"
      aria-labelledby="add-heading"
    >
      <h2 id="add-heading" className="display text-[26px] sm:text-[30px]">
        Add a card
      </h2>
      <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
        Take a photo of the card you want to sell.
      </p>

      {/* capture="environment" opens the back camera straight away on a phone. */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="sm:w-[220px] sm:shrink-0">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="The card you just photographed"
              className="hairline w-full rounded-xl object-cover"
              style={{ aspectRatio: "4 / 5" }}
            />
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="hairline flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-[var(--paper)] text-[17px] font-semibold disabled:opacity-60"
              style={{ aspectRatio: "4 / 5", minHeight: 200 }}
            >
              <svg
                aria-hidden="true"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.3 4.7h5.4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45h2.2A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" />
                <circle cx="12" cy="12.8" r="3.6" />
              </svg>
              {busy ? "Opening…" : "Take a photo"}
            </button>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rainbow card"
              className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[19px] font-medium normal-case tracking-normal text-[var(--ink)]"
              style={{ minHeight: 56 }}
            />
          </label>

          <label className="mt-4 block text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            Price
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="50c"
              className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[19px] font-medium normal-case tracking-normal text-[var(--ink)]"
              style={{ minHeight: 56 }}
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={add}
              disabled={!photo}
              className={`rounded-full px-7 text-[18px] font-semibold transition-colors ${
                photo
                  ? "bg-[var(--accent)] text-[var(--accent-ink)]"
                  : "hairline cursor-not-allowed bg-[var(--paper)] text-[var(--ink-muted)]"
              }`}
              style={{ minHeight: 56 }}
            >
              Put it in the shop
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="hairline rounded-full bg-[var(--paper)] px-7 text-[18px] font-semibold"
                style={{ minHeight: 56 }}
              >
                Retake
              </button>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-3 text-[15px] font-medium text-[var(--accent)]">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
