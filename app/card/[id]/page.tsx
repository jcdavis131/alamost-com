import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../../components/site-header";
import Footer from "../../../components/footer";
import CardTile, { KindChip } from "../../../components/card-tile";
import Foil from "../../../components/foil";
import { currentUser } from "../../../lib/auth";
import { isDatabaseConfigured } from "../../../lib/db";
import { ensureReady } from "../../../lib/bootstrap";
import { countHolds, isHeldBy } from "../../../lib/holds";
import { findCard, formatPrice, related, type Card } from "../../../lib/cards-db";
import { askToHold, releaseMyHold } from "../../actions";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isDatabaseConfigured()) return {};
  const card = await findCard(params.id).catch(() => null);
  if (!card) return { title: "Card not found" };

  const attributes = attributeList(card)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
  return {
    // The layout's title template appends the shop's name.
    title: card.name,
    description: attributes || `${card.name}, ${formatPrice(card.priceCents)}.`,
    openGraph: {
      title: card.name,
      description: attributes,
      images: [{ url: card.photoUrl }],
      type: "website",
    },
  };
}

export default async function CardPage({ params }: Props) {
  if (!isDatabaseConfigured()) redirect("/");
  await ensureReady();

  const card = await findCard(params.id);
  // Hidden cards are hidden from everyone who is not holding the URL from the
  // back office, and a 404 is the honest answer for a card that is not for sale.
  if (!card || card.status === "hidden") notFound();

  const user = await currentUser().catch(() => null);
  const [nearby, held, holds] = await Promise.all([
    related(card),
    user ? isHeldBy(card.id, user.id) : Promise.resolve(false),
    countHolds(card.id),
  ]);

  const attributes = attributeList(card);
  const sold = card.status === "sold";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1120px] flex-1 px-6 pb-24 pt-7">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]"
        >
          <span aria-hidden="true">←</span> All cards
        </Link>

        <div className="mt-6 grid gap-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14">
          <div>
            <div className="sleeve p-4 sm:p-6" style={{ aspectRatio: "4 / 5" }}>
              <Foil seed={card.id} className="foil" rayCount={72} grain />
              <div className="sleeve-photo h-full w-full">
                <Image
                  src={card.photoUrl}
                  alt={card.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 520px"
                  className={`object-cover ${sold ? "opacity-75" : ""}`}
                  priority
                />
              </div>
            </div>
            <p className="mt-3 text-[12.5px] text-[var(--ink-muted)]">
              Photographed at home. The pattern behind the card is generated from this card&apos;s
              own id — no two are alike.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <KindChip card={card} />
              {sold && <span className="chip chip-sold">Sold</span>}
            </div>

            <h1 className="display mt-3 text-[32px] leading-[1.1] sm:text-[40px]">{card.name}</h1>

            <p className="mt-3 text-[26px] font-semibold text-[var(--accent)]">
              {formatPrice(card.priceCents)}
            </p>

            {attributes.length > 0 && (
              <dl className="hairline mt-7 divide-y divide-[var(--line)] rounded-2xl bg-[var(--paper-raised)]">
                {attributes.map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 px-5 py-3.5">
                    <dt className="label">{key}</dt>
                    <dd className="text-right text-[16px] font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {card.notes && (
              <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-[var(--ink-muted)]">
                {card.notes}
              </p>
            )}

            <div className="mt-8">
              <Hold card={card} signedIn={Boolean(user)} held={held} holds={holds} sold={sold} />
            </div>
          </div>
        </div>

        {nearby.length > 0 && (
          <section className="mt-20">
            <h2 className="display text-[24px] sm:text-[27px]">More in the shop</h2>
            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-6 md:grid-cols-4">
              {nearby.map((c) => (
                <li key={c.id}>
                  <CardTile card={c} sizes="(max-width: 768px) 50vw, 240px" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

/**
 * Asking for a card.
 *
 * No payment happens here and none is implied — the button says what it does.
 * A shop that took card details would be making a promise this one is not set
 * up to keep.
 */
function Hold({
  card,
  signedIn,
  held,
  holds,
  sold,
}: {
  card: Card;
  signedIn: boolean;
  held: boolean;
  holds: number;
  sold: boolean;
}) {
  if (sold) {
    return (
      <p className="hairline rounded-2xl bg-[var(--paper-raised)] px-5 py-4 text-[16px] text-[var(--ink-muted)]">
        This one has found its person. There was only ever one.
      </p>
    );
  }

  if (!signedIn) {
    return (
      <div className="hairline rounded-2xl bg-[var(--paper-raised)] px-5 py-5">
        <p className="text-[16px]">
          <Link href="/join" className="font-semibold underline underline-offset-4">
            Create an account
          </Link>{" "}
          or{" "}
          <Link href="/login" className="font-semibold underline underline-offset-4">
            sign in
          </Link>{" "}
          to ask Lina to hold this card for you.
        </p>
        <p className="mt-2 text-[14px] text-[var(--ink-muted)]">
          Nothing is charged. Asking just puts your name next to the card.
        </p>
      </div>
    );
  }

  if (held) {
    return (
      <div className="hairline rounded-2xl bg-[var(--accent-soft)] px-5 py-5">
        <p className="text-[16px] font-semibold">Lina knows you want this one.</p>
        <p className="mt-1 text-[14px] text-[var(--ink-muted)]">
          She will get in touch about it. Nothing has been charged.
        </p>
        <form action={releaseMyHold} className="mt-3">
          <input type="hidden" name="id" value={card.id} />
          <button
            type="submit"
            className="text-[14px] font-semibold text-[var(--ink-muted)] underline underline-offset-4 hover:text-[var(--accent)]"
          >
            Never mind
          </button>
        </form>
      </div>
    );
  }

  return (
    <form action={askToHold}>
      <input type="hidden" name="id" value={card.id} />
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--accent)] px-8 text-[17px] font-semibold text-[var(--accent-ink)] sm:w-auto"
        style={{ minHeight: 54 }}
      >
        Ask Lina to hold it
      </button>
      <p className="mt-2.5 text-[14px] text-[var(--ink-muted)]">
        Nothing is charged — this puts your name next to the card.
        {holds > 0 && ` ${holds} ${holds === 1 ? "person has" : "people have"} already asked.`}
      </p>
    </form>
  );
}

/** Only the attributes this card actually has. An empty row is a small lie. */
function attributeList(card: Card): [string, string][] {
  const rows: [string, string | number | null][] = [
    ["Player", card.player],
    ["Team", card.team],
    ["Sport", card.sport],
    ["Set", card.cardSet],
    ["Year", card.year],
    ["Card number", card.cardNumber ? `#${card.cardNumber.replace(/^#/, "")}` : null],
    ["Maker", card.manufacturer],
    ["Condition", card.condition],
  ];
  return rows
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([k, v]) => [k, String(v)]);
}
