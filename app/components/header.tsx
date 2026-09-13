export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <span className="font-display text-xl font-bold tracking-tight">
            Alamo&nbsp;St&nbsp;Advisors
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] sm:flex">
          <a href="/#services" className="transition-colors hover:text-[var(--ink)]">Services</a>
          <a href="/#work" className="transition-colors hover:text-[var(--ink)]">Work</a>
          <a href="/about" className="transition-colors hover:text-[var(--ink)]">About</a>
          <a href="/process" className="transition-colors hover:text-[var(--ink)]">Process</a>
          <a href="/#faq" className="transition-colors hover:text-[var(--ink)]">FAQ</a>
        </nav>
        <a
          href="/contact"
          className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--accent-deep)]"
        >
          Start a conversation
        </a>
      </div>
    </header>
  );
}
