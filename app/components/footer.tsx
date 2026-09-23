import { Mark } from "@/app/components/marks";
import { NAV_LEFT, NAV_RIGHT } from "@/app/components/header";

export default function Footer() {
  return (
    <footer className="hair-t">
      <div className="frame flex flex-col items-center py-16 text-center sm:py-20">
        <Mark className="h-9 w-8 text-[var(--ink)]" />
        <p className="display mt-5 text-2xl">Alamo St Advisors</p>
        <p className="label mt-3">Independent AI advisory · Austin, Texas</p>

        <nav aria-label="Footer" className="no-print mt-10">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-1">
            {[...NAV_LEFT, ...NAV_RIGHT].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="nav-link">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <span className="axis mt-10" aria-hidden="true" />

        <p className="mx-auto mt-8 max-w-md text-[length:var(--step--1)] leading-relaxed text-[var(--ink-2)]">
          AI strategy and technical advisory only — not financial, investment,
          legal, or tax advice.
        </p>
        <p className="label mt-4 [font-variant-numeric:tabular-nums]">
          © 2026 Alamo St Advisors
        </p>
      </div>
    </footer>
  );
}
