"use client";
import { useFormState, useFormStatus } from "react-dom";
import type { ActionState } from "../lib/action-state";

type Field = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full rounded-full bg-[var(--accent)] px-7 text-[18px] font-semibold text-[var(--accent-ink)] disabled:opacity-60"
      style={{ minHeight: 56 }}
    >
      {pending ? "Working…" : label}
    </button>
  );
}

export default function AuthForm({
  action,
  fields,
  submitLabel,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: Field[];
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form action={formAction}>
      {fields.map((f) => (
        <label key={f.name} className="mt-5 block first:mt-0">
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)]">
            {f.label}
          </span>
          <input
            name={f.name}
            type={f.type ?? "text"}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            required
            className="hairline mt-2 w-full rounded-xl bg-[var(--paper)] px-4 text-[19px] text-[var(--ink)]"
            style={{ minHeight: 56 }}
          />
        </label>
      ))}

      {state.error && (
        <p role="alert" className="mt-5 text-[15px] font-medium text-[var(--accent)]">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p role="status" className="mt-5 text-[15px] font-medium text-[var(--ink-muted)]">
          {state.ok}
        </p>
      )}

      <Submit label={submitLabel} />
    </form>
  );
}
