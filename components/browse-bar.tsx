"use client";
import { useRef } from "react";
import type { CardKind, Sort } from "../lib/cards-db";

/**
 * Search, filter and sort — as one plain GET form.
 *
 * It is a client component only so a change to a filter submits immediately
 * instead of needing a button press. Everything still works with JavaScript
 * off: the submit button is real, the inputs are real, and the URL that comes
 * back is shareable. That matters here because a URL is how you send someone
 * "the 1989 baseball ones".
 */
export default function BrowseBar({
  q,
  kind,
  sport,
  sort,
  sports,
  counts,
  total,
}: {
  q: string;
  kind: CardKind | "";
  sport: string;
  sort: Sort;
  sports: string[];
  counts: Record<CardKind, number>;
  total: number;
}) {
  const form = useRef<HTMLFormElement>(null);
  const submit = () => form.current?.requestSubmit();

  const all = counts.homemade + counts.sports;
  const kinds: { value: CardKind | ""; label: string; n: number }[] = [
    { value: "", label: "Everything", n: all },
    { value: "homemade", label: "Handmade", n: counts.homemade },
    { value: "sports", label: "Sports", n: counts.sports },
  ];

  const filtered = Boolean(q || kind || sport || sort !== "newest");

  return (
    <form ref={form} action="/" method="get" className="mb-9">
      <div className="flex flex-wrap items-center gap-3">
        {/* Narrow enough that the button stays on the same line on a phone. */}
        <div className="relative min-w-[150px] flex-1">
          <label htmlFor="q" className="sr-only">
            Search the shop
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search a player, a set, a year, a unicorn…"
            className="field pl-11"
            autoComplete="off"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-[var(--accent)] px-6 text-[15px] font-semibold text-[var(--accent-ink)]"
          style={{ minHeight: 48 }}
        >
          Search
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-3">
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Kind of card</legend>
          {kinds.map((k) => {
            const on = kind === k.value;
            return (
              <label
                key={k.value || "all"}
                className={`cursor-pointer rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
                  on
                    ? "bg-[var(--ink)] text-[var(--paper)]"
                    : "hairline bg-[var(--paper-raised)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
              >
                <input
                  type="radio"
                  name="kind"
                  value={k.value}
                  defaultChecked={on}
                  onChange={submit}
                  className="sr-only"
                />
                {k.label}
                <span className={`ml-2 tabular-nums ${on ? "opacity-70" : "opacity-60"}`}>
                  {k.n}
                </span>
              </label>
            );
          })}
        </fieldset>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {sports.length > 0 && (
            <>
              <label htmlFor="sport" className="sr-only">
                Sport
              </label>
              <select
                id="sport"
                name="sport"
                defaultValue={sport}
                onChange={submit}
                className="field w-auto text-[14px]"
                style={{ minHeight: 40 }}
              >
                <option value="">Any sport</option>
                {sports.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            onChange={submit}
            className="field w-auto text-[14px]"
            style={{ minHeight: 40 }}
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Cheapest first</option>
            <option value="price_desc">Priciest first</option>
            <option value="year_desc">Newest year</option>
            <option value="name">A to Z</option>
          </select>
        </div>
      </div>

      {filtered && (
        <p className="mt-4 text-[14px] text-[var(--ink-muted)]">
          {total} {total === 1 ? "card" : "cards"}
          {q && (
            <>
              {" "}
              matching <span className="font-semibold text-[var(--ink)]">{q}</span>
            </>
          )}
          .{" "}
          <a href="/" className="font-semibold underline underline-offset-4">
            Clear
          </a>
        </p>
      )}
    </form>
  );
}
