import Image from "next/image";
import Link from "next/link";
import Foil from "./foil";
import { cardLine, formatPrice, type Card } from "../lib/cards-db";

/**
 * One card on a shelf.
 *
 * The photograph is matted on the card's own generative foil rather than on
 * flat white — it reads as a card in a sleeve, and it means a grid of very
 * different photographs still scans as one shop.
 */
export default function CardTile({ card, sizes }: { card: Card; sizes?: string }) {
  const line = cardLine(card);
  const sold = card.status === "sold";

  return (
    <Link href={`/card/${card.id}`} className="group block">
      <div className="sleeve p-[9px] sm:p-3" style={{ aspectRatio: "4 / 5" }}>
        <Foil seed={card.id} className="foil" />
        <div className="sleeve-photo h-full w-full">
          <Image
            src={card.photoUrl}
            alt={card.name}
            fill
            sizes={sizes ?? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"}
            className={`object-cover transition-transform duration-200 group-hover:scale-[1.02] ${
              sold ? "opacity-70" : ""
            }`}
          />
        </div>
        {sold && <span className="chip chip-sold absolute left-3 top-3">Sold</span>}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="display min-w-0 break-words text-[19px] leading-snug group-hover:text-[var(--accent)] sm:text-[21px]">
          {card.name}
        </h3>
        <p className="shrink-0 text-[15px] font-semibold text-[var(--accent)]">
          {formatPrice(card.priceCents)}
        </p>
      </div>

      {line && (
        <p className="mt-1 truncate text-[13px] text-[var(--ink-muted)]" title={line}>
          {line}
        </p>
      )}
    </Link>
  );
}

/** The category mark. One word, its own ink, never doing the job of a button. */
export function KindChip({ card }: { card: Card }) {
  return card.kind === "sports" ? (
    <span className="chip chip-sport">{card.sport || "Sports"}</span>
  ) : (
    <span className="chip chip-made">Handmade</span>
  );
}
