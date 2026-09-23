import { Mark } from "@/app/components/marks";
import MobileMenu from "@/app/components/mobile-menu";

export const NAV_LEFT = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/process", label: "Process" },
];

export const NAV_RIGHT = [
  { href: "/about", label: "About" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <header
        role="banner"
        className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] backdrop-blur-md"
      >
        <div className="frame grid h-[4.5rem] grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {NAV_LEFT.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="md:hidden">
            <MobileMenu links={[...NAV_LEFT, ...NAV_RIGHT]} />
          </div>

          <a
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 text-[var(--ink)] no-underline"
            aria-label="Alamo St Advisors — home"
          >
            <Mark className="h-7 w-6 transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:-translate-y-px" />
            <span className="display whitespace-nowrap text-[1.0625rem] leading-none sm:text-[1.1875rem] tracking-[-0.005em]">
              Alamo St Advisors
            </span>
          </a>

          <nav aria-label="Secondary" className="hidden items-center justify-end gap-9 md:flex">
            {NAV_RIGHT.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex justify-end md:hidden">
            <a href="/contact" className="nav-link !text-[var(--accent)]">
              Contact
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
