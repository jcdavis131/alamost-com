import Link from "next/link";
import { currentUser, canManageInventory } from "../lib/auth";
import { signOut } from "../app/actions";

/**
 * The nameplate.
 *
 * The proprietor's byline is the whole brand in six words: a real shop, run by
 * a named person, who happens to be five. It sits under the wordmark on every
 * page rather than being buried in an About link nobody opens.
 */
export default async function SiteHeader({ count }: { count?: number }) {
  const user = await currentUser().catch(() => null);

  return (
    <header className="hairline border-x-0 border-t-0 bg-[var(--paper-raised)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-5">
        <Link href="/" className="group block">
          <span className="display block text-[26px] leading-none sm:text-[31px]">
            Lina&apos;s Card Shop
          </span>
          <span className="label mt-[7px] block">Lina Davis · Proprietor</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
          {typeof count === "number" && <span className="label">{count} in the shop</span>}
          {canManageInventory(user) && (
            <Link href="/manage" className="font-semibold underline underline-offset-4">
              Manage
            </Link>
          )}
          {user ? (
            <>
              <Link href="/account" className="font-semibold underline underline-offset-4">
                Account
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]"
                >
                  Sign out {user.displayName}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-semibold underline underline-offset-4">
                Sign in
              </Link>
              <Link
                href="/join"
                className="font-semibold text-[var(--ink-muted)] hover:text-[var(--accent)]"
              >
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
