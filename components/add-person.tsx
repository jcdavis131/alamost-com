"use client";
import { useFormState, useFormStatus } from "react-dom";
import type { ActionState } from "../lib/action-state";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 rounded-full bg-[var(--accent)] px-7 text-[17px] font-semibold text-[var(--accent-ink)] disabled:opacity-60"
      style={{ minHeight: 52 }}
    >
      {pending ? "Adding…" : "Add person"}
    </button>
  );
}

export default function AddPerson({
  action,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction} className="hairline rounded-2xl bg-[var(--paper-raised)] p-5 sm:p-7">
      <h3 className="display text-[22px]">Add someone</h3>
      <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
        Set their first password here and tell them to change it once they are in.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
          Name
          <input
            name="displayName"
            required
            placeholder="Lina"
            className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[18px] font-medium normal-case tracking-normal text-[var(--ink)]"
            style={{ minHeight: 52 }}
          />
        </label>

        <label className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
          Role
          <select
            name="role"
            defaultValue="staff"
            className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[18px] font-medium normal-case tracking-normal text-[var(--ink)]"
            style={{ minHeight: 52 }}
          >
            <option value="staff">Shopkeeper</option>
            <option value="buyer">Buyer</option>
            <option value="owner">Owner</option>
          </select>
        </label>

        <label className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
          Email
          <input
            name="email"
            type="email"
            required
            className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[18px] font-medium normal-case tracking-normal text-[var(--ink)]"
            style={{ minHeight: 52 }}
          />
        </label>

        <label className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
          First password
          <input
            name="password"
            type="text"
            required
            minLength={8}
            autoComplete="off"
            placeholder="At least 8 characters"
            className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[18px] font-medium normal-case tracking-normal text-[var(--ink)]"
            style={{ minHeight: 52 }}
          />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="mt-4 text-[15px] font-medium text-[var(--accent)]">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p role="status" className="mt-4 text-[15px] font-medium text-[var(--ink-muted)]">
          {state.ok}
        </p>
      )}

      <Submit />
    </form>
  );
}
