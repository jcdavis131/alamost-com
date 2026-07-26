import Link from "next/link";
import { currentUser, canManageInventory } from "../lib/auth";
import { signOut } from "../app/actions";

export default async function SiteHeader({ count }: { count?: number }) {
  const user = await currentUser().catch(() => null);

  return (
    <header className="hairline border-x-0 border-t-0 bg-[var(--paper-raised)]">
      <div className="mx-auto flex max-w-[1080px] flex-wrap items-baseline justify-between gap-x-6 gap-y-3 px-6 py-6">
        <Link href="/" className="display text-[28px] leading-none sm:text-[34px]">
          Lina&apos;s Card Shop
        </Link>

        <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[14px]">
          {typeof count === "number" && (
            <span className="font-semibold uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              {count} for sale
            </span>
          )}
          {canManageInventory(user) && (
            <Link href="/manage" className="font-semibold underline underline-offset-4">
              Manage
            </Link>
          )}
          {user ? (
            <form action={signOut}>
              <button type="submit" className="font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]">
                Sign out {user.displayName}
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="font-semibold underline underline-offset-4">
                Sign in
              </Link>
              <Link href="/join" className="font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]">
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
