export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-10 text-sm text-[var(--muted)] sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display font-bold text-[var(--ink)]">Alamo St Advisors</p>
          <p className="mt-2">© 2026 Alamo St Advisors · Austin, Texas</p>
          <p className="mt-2 max-w-md text-xs leading-relaxed">
            AI strategy and technical advisory only — not financial, investment, legal, or tax advice.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="/#services" className="transition-colors hover:text-[var(--ink)]">Services</a>
          <a href="/#work" className="transition-colors hover:text-[var(--ink)]">Work</a>
          <a href="/about" className="transition-colors hover:text-[var(--ink)]">About</a>
          <a href="/process" className="transition-colors hover:text-[var(--ink)]">Process</a>
          <a href="/#faq" className="transition-colors hover:text-[var(--ink)]">FAQ</a>
          <a href="/contact" className="transition-colors hover:text-[var(--ink)]">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
