import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hairline border-x-0 border-b-0 bg-[var(--paper-raised)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-baseline justify-between gap-x-8 gap-y-3 px-6 py-8">
        <div>
          <p className="display text-[18px]">Lina&apos;s Card Shop</p>
          <p className="label mt-1.5">Lina Davis · Proprietor · alamost.com</p>
        </div>
        <p className="max-w-[38ch] text-[14px] text-[var(--ink-muted)]">
          Every card is photographed here, in this house, on this table. What you see is the
          one you get — there is only ever one of each.
        </p>
        <Link href="/" className="text-[14px] font-semibold underline underline-offset-4">
          Browse the shop
        </Link>
      </div>
    </footer>
  );
}
