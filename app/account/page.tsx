import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "../../components/site-header";
import Footer from "../../components/footer";
import AuthForm from "../../components/auth-form";
import { currentUser } from "../../lib/auth";
import { isDatabaseConfigured } from "../../lib/db";
import { ensureReady } from "../../lib/bootstrap";
import { changeOwnPassword } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your account — Lina's Card Shop" };

export default async function AccountPage() {
  if (!isDatabaseConfigured()) redirect("/");
  await ensureReady();

  const user = await currentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[440px] flex-1 px-6 pb-20 pt-10">
        <h1 className="display text-[30px]">Your account</h1>
        <p className="mt-2 text-[16px] text-[var(--ink-muted)]">
          {user.displayName} · {user.email}
        </p>

        <h2 className="display mt-9 text-[22px]">Change your password</h2>
        <p className="mt-1 text-[15px] text-[var(--ink-muted)]">
          Any other devices signed in as you will be signed out.
        </p>

        <div className="hairline mt-5 rounded-2xl bg-[var(--paper-raised)] p-6">
          <AuthForm
            action={changeOwnPassword}
            submitLabel="Change password"
            fields={[
              {
                name: "currentPassword",
                label: "Current password",
                type: "password",
                autoComplete: "current-password",
              },
              {
                name: "newPassword",
                label: "New password",
                type: "password",
                autoComplete: "new-password",
                placeholder: "At least 8 characters",
              },
              {
                name: "confirmPassword",
                label: "New password again",
                type: "password",
                autoComplete: "new-password",
              },
            ]}
          />
        </div>

        <p className="mt-8 text-[15px]">
          <Link href="/" className="text-[var(--ink-muted)] underline underline-offset-4">
            Back to the shop
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
