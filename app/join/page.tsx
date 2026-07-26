import Link from "next/link";
import type { Metadata } from "next";
import AuthForm from "../../components/auth-form";
import { registerBuyer } from "../actions";

export const metadata: Metadata = { title: "Create an account — Lina's Card Shop" };

export default function JoinPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[440px] flex-col justify-center px-6 py-16">
      <h1 className="display text-[32px]">Create an account</h1>
      <p className="mt-2 text-[16px] text-[var(--ink-muted)]">
        So the shop remembers you next time. Buyers only — shopkeeper accounts are made by the owner.
      </p>

      <div className="hairline mt-7 rounded-2xl bg-[var(--paper-raised)] p-6">
        <AuthForm
          action={registerBuyer}
          submitLabel="Create account"
          fields={[
            { name: "displayName", label: "Your name", autoComplete: "name", placeholder: "Sam" },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            {
              name: "password",
              label: "Password",
              type: "password",
              autoComplete: "new-password",
              placeholder: "At least 8 characters",
            },
          ]}
        />
      </div>

      <p className="mt-6 text-center text-[15px] text-[var(--ink-muted)]">
        Already have one?{" "}
        <Link href="/login" className="font-semibold underline underline-offset-4">
          Sign in
        </Link>
      </p>
      <p className="mt-3 text-center text-[15px]">
        <Link href="/" className="text-[var(--ink-muted)] underline underline-offset-4">
          Back to the shop
        </Link>
      </p>
    </main>
  );
}
