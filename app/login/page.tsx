import Link from "next/link";
import type { Metadata } from "next";
import AuthForm from "../../components/auth-form";
import { signIn } from "../actions";

export const metadata: Metadata = { title: "Sign in — Lina's Card Shop" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[440px] flex-col justify-center px-6 py-16">
      <h1 className="display text-[32px]">Sign in</h1>
      <p className="mt-2 text-[16px] text-[var(--ink-muted)]">
        Shopkeepers manage the shop. Buyers can save a login to come back to.
      </p>

      <div className="hairline mt-7 rounded-2xl bg-[var(--paper-raised)] p-6">
        <AuthForm
          action={signIn}
          submitLabel="Sign in"
          fields={[
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            {
              name: "password",
              label: "Password",
              type: "password",
              autoComplete: "current-password",
            },
          ]}
        />
      </div>

      <p className="mt-6 text-center text-[15px] text-[var(--ink-muted)]">
        No account yet?{" "}
        <Link href="/join" className="font-semibold underline underline-offset-4">
          Create one
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
