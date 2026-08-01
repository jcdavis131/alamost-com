"use client";
import { useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { preparePhoto } from "../lib/photo";
import type { ActionState, Suggestion, SuggestResult } from "../lib/action-state";

/** Every text field the form can carry. Kept as one object so autofill is one merge. */
type Fields = {
  kind: "homemade" | "sports";
  name: string;
  price: string;
  player: string;
  team: string;
  sport: string;
  cardSet: string;
  year: string;
  cardNumber: string;
  manufacturer: string;
  condition: string;
  notes: string;
};

const EMPTY: Fields = {
  kind: "homemade",
  name: "",
  price: "",
  player: "",
  team: "",
  sport: "",
  cardSet: "",
  year: "",
  cardNumber: "",
  manufacturer: "",
  condition: "",
  notes: "",
};

const SPORTS = ["Baseball", "Basketball", "Football", "Hockey", "Soccer", "Racing", "Other"];

function Submit({ hasPhoto }: { hasPhoto: boolean }) {
  const { pending } = useFormStatus();
  const enabled = hasPhoto && !pending;
  return (
    <button
      type="submit"
      disabled={!enabled}
      className={`rounded-full px-7 text-[17px] font-semibold transition-colors ${
        enabled
          ? "bg-[var(--accent)] text-[var(--accent-ink)]"
          : "hairline cursor-not-allowed bg-[var(--paper)] text-[var(--ink-muted)]"
      }`}
      style={{ minHeight: 54 }}
    >
      {pending ? "Adding…" : "Put it in the shop"}
    </button>
  );
}

export default function AddCard({
  action,
  suggest,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  /** Absent when no vision key is configured — the form still works, just unassisted. */
  suggest?: (form: FormData) => Promise<SuggestResult>;
}) {
  const [state, formAction] = useFormState(action, {});
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [filled, setFilled] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  // Controlled so a suggestion can populate them; the shopkeeper can overwrite.
  const [f, setF] = useState<Fields>(EMPTY);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setF((prev) => ({ ...prev, [key]: value }));
    setFilled((prev) => prev.filter((k) => k !== key));
  };

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setLocalError(null);
    setFilled([]);
    try {
      const prepared = await preparePhoto(file);
      setBlob(prepared.blob);
      setPreview(prepared.previewUrl);
      if (suggest) void fill(prepared.blob);
    } catch {
      setLocalError("That photo would not open. Try taking it again.");
    } finally {
      setBusy(false);
    }
  }

  /** Reads the photo and pre-fills the form. Never blocks adding the card. */
  async function fill(photo: Blob) {
    if (!suggest) return;
    setReading(true);
    try {
      const body = new FormData();
      body.set("photo", photo, "card.jpg");
      const { suggestion, error } = await suggest(body);
      if (error) setLocalError(error);
      if (suggestion) applySuggestion(suggestion);
    } catch {
      // Suggestion is a convenience; failing it is not worth surfacing.
    } finally {
      setReading(false);
    }
  }

  /** Fills only what is still blank — never overwrites something already typed. */
  function applySuggestion(s: NonNullable<Suggestion>) {
    const touched: string[] = [];
    setF((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(EMPTY) as (keyof Fields)[]) {
        if (key === "kind" || key === "notes") continue;
        const value = s[key as keyof typeof s];
        if (!prev[key] && typeof value === "string" && value.trim()) {
          next[key] = value.trim();
          touched.push(key);
        }
      }
      // The kind is a classification, not a blank to fill, so it always follows
      // the photo — but only until the shopkeeper picks one herself.
      if (!prev.player && !prev.cardSet && s.kind) next.kind = s.kind;
      return next;
    });
    setFilled(touched);
  }

  function submit(form: FormData) {
    // The file input still holds the original multi-megabyte photo.
    if (blob) form.set("photo", blob, "card.jpg");
    formAction(form);
    setPreview(null);
    setBlob(null);
    setF(EMPTY);
    setFilled([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  const error = localError ?? state.error;
  const sports = f.kind === "sports";

  return (
    <form
      action={submit}
      className="hairline rounded-2xl bg-[var(--paper-raised)] p-5 sm:p-7"
      aria-labelledby="add-heading"
    >
      <h2 id="add-heading" className="display text-[26px] sm:text-[30px]">
        Add a card
      </h2>
      <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
        {suggest
          ? "Photograph the card and the listing fills itself in."
          : "Photograph the card you want to sell."}
      </p>

      {/* capture="environment" opens the back camera straight away on a phone. */}
      <input
        ref={fileRef}
        type="file"
        name="photo"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />

      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="sm:w-[230px] sm:shrink-0">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
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

          {reading && (
            <p className="mt-3 text-[14px] font-medium text-[var(--accent)]" role="status">
              Reading the card…
            </p>
          )}
          {!reading && filled.length > 0 && (
            <p className="mt-3 text-[14px] text-[var(--ink-muted)]" role="status">
              Filled in {filled.length} {filled.length === 1 ? "field" : "fields"} for you. Check
              them before publishing.
            </p>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <fieldset>
            <legend className="label mb-2">What kind of card</legend>
            <div className="flex gap-2">
              {(
                [
                  ["homemade", "Handmade"],
                  ["sports", "Sports card"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors ${
                    f.kind === value
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "hairline bg-[var(--paper)] text-[var(--ink-muted)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="kind"
                    value={value}
                    checked={f.kind === value}
                    onChange={() => set("kind", value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label={sports ? "Listing name" : "Name"}
              name="name"
              value={f.name}
              onChange={(v) => set("name", v)}
              placeholder={sports ? "Ken Griffey Jr." : "Rainbow unicorn"}
              highlight={filled.includes("name")}
            />
            <Field
              label="Price"
              name="price"
              value={f.price}
              onChange={(v) => set("price", v)}
              placeholder="50c"
              inputMode="decimal"
              highlight={filled.includes("price")}
            />
          </div>

          {sports && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Player"
                name="player"
                value={f.player}
                onChange={(v) => set("player", v)}
                placeholder="Ken Griffey Jr."
                highlight={filled.includes("player")}
              />
              <Field
                label="Team"
                name="team"
                value={f.team}
                onChange={(v) => set("team", v)}
                placeholder="Seattle Mariners"
                highlight={filled.includes("team")}
              />

              <label className="block">
                <span className="label">Sport</span>
                <select
                  name="sport"
                  value={f.sport}
                  onChange={(e) => set("sport", e.target.value)}
                  className={`field mt-2 ${filled.includes("sport") ? "ring-1 ring-[var(--accent)]" : ""}`}
                >
                  <option value="">Not sure</option>
                  {/* A sport the model read that is not on the list is still valid. */}
                  {f.sport && !SPORTS.includes(f.sport) && <option value={f.sport}>{f.sport}</option>}
                  {SPORTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Set"
                name="cardSet"
                value={f.cardSet}
                onChange={(v) => set("cardSet", v)}
                placeholder="Upper Deck Series 1"
                highlight={filled.includes("cardSet")}
              />
              <Field
                label="Year"
                name="year"
                value={f.year}
                onChange={(v) => set("year", v)}
                placeholder="1989"
                inputMode="numeric"
                highlight={filled.includes("year")}
              />
              <Field
                label="Card number"
                name="cardNumber"
                value={f.cardNumber}
                onChange={(v) => set("cardNumber", v)}
                placeholder="1"
                inputMode="numeric"
                highlight={filled.includes("cardNumber")}
              />
              <Field
                label="Maker"
                name="manufacturer"
                value={f.manufacturer}
                onChange={(v) => set("manufacturer", v)}
                placeholder="Upper Deck"
                highlight={filled.includes("manufacturer")}
              />
              <Field
                label="Condition"
                name="condition"
                value={f.condition}
                onChange={(v) => set("condition", v)}
                placeholder="Near mint, or PSA 9"
                highlight={filled.includes("condition")}
              />
            </div>
          )}

          <label className="mt-5 block">
            <span className="label">Anything to say about it</span>
            <textarea
              name="notes"
              value={f.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              placeholder={
                sports ? "Corners are sharp. Kept in a sleeve." : "Lina drew this one on a Sunday."
              }
              className="field mt-2 resize-y py-3"
              style={{ minHeight: 72 }}
            />
          </label>

          <div className="mt-6 flex flex-wrap gap-3">
            <Submit hasPhoto={Boolean(blob)} />
            {preview && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="hairline rounded-full bg-[var(--paper)] px-7 text-[17px] font-semibold"
                style={{ minHeight: 54 }}
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
          {state.ok && !error && (
            <p role="status" className="mt-3 text-[15px] font-medium text-[var(--ink-muted)]">
              {state.ok}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  inputMode,
  highlight,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "decimal" | "numeric";
  highlight?: boolean;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
        // A ring, not a fill: it marks what the photo suggested without making
        // the field look disabled or already approved.
        className={`field mt-2 ${highlight ? "ring-1 ring-[var(--accent)]" : ""}`}
      />
    </label>
  );
}
