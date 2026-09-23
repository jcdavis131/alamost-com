"use client";

import { useEffect, useRef } from "react";

type Link = { href: string; label: string };

/**
 * A disclosure menu for narrow screens. Built on <details> so it works before
 * hydration; the script only closes it on navigation, Escape, or outside click.
 */
export default function MobileMenu({ links }: { links: Link[] }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const close = () => el.removeAttribute("open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.open) {
        close();
        el.querySelector("summary")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (el.open && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <details ref={ref} className="menu group">
      <summary
        className="nav-link flex cursor-pointer list-none items-center gap-2.5 [&::-webkit-details-marker]:hidden"
        aria-label="Menu"
      >
        <span aria-hidden="true" className="relative block h-2 w-4">
          <span className="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500 group-open:translate-y-1 group-open:rotate-45" />
          <span className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500 group-open:-translate-y-1 group-open:-rotate-45" />
        </span>
        Menu
      </summary>
      <nav
        aria-label="Site"
        className="absolute inset-x-0 top-full border-b border-[var(--line)] bg-[var(--paper)]"
      >
        <ul className="frame flex flex-col items-center py-6">
          {links.map((l) => (
            <li key={l.href} className="w-full">
              <a
                href={l.href}
                onClick={() => ref.current?.removeAttribute("open")}
                className="display block py-3 text-center text-2xl text-[var(--ink)] no-underline hover:text-[var(--accent)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
