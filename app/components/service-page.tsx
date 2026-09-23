import type { ReactNode } from "react";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Arrow, Closing, PageHero } from "@/app/components/ui";

export const SERVICE_INDEX = [
  { n: "01", title: "Needs assessments", href: "/services/needs-assessments" },
  { n: "02", title: "Benchmarking workflows that matter", href: "/services/benchmarking" },
  { n: "03", title: "Building custom solutions", href: "/services/custom-solutions" },
];

export default function ServicePage({
  n,
  title,
  lede,
  deliverables,
  howItRuns,
  whoFor,
  notIncluded,
  jsonLd,
}: {
  n: string;
  title: string;
  lede: ReactNode;
  deliverables: string[][];
  howItRuns: ReactNode;
  whoFor: ReactNode;
  notIncluded: string[];
  jsonLd: object;
}) {
  const i = SERVICE_INDEX.findIndex((s) => s.n === n);
  const prev = SERVICE_INDEX[(i + SERVICE_INDEX.length - 1) % SERVICE_INDEX.length];
  const next = SERVICE_INDEX[(i + 1) % SERVICE_INDEX.length];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main">
        <PageHero
          label={
            <>
              <a href="/#services" className="no-underline hover:text-[var(--accent-hover)]">
                Services
              </a>
              <span aria-hidden="true" className="mx-3 opacity-60">
                ·
              </span>
              <span className="[font-variant-numeric:tabular-nums]">{n}</span>
            </>
          }
          title={title}
        >
          <p className="lead">{lede}</p>
        </PageHero>

        {/* What you get — a ledger */}
        <section aria-labelledby="get" className="section pt-12 sm:pt-16">
          <div className="frame">
            <div className="reveal flex flex-col items-center text-center">
              <p className="label label-accent flanked">Deliverables</p>
              <h2 id="get" className="display t-section mt-6">
                What you get
              </h2>
            </div>
            <ol className="reveal mx-auto mt-14 max-w-5xl border-t border-[var(--line)] sm:mt-16">
              {deliverables.map(([t, b], k) => (
                <li
                  key={t}
                  className="grid gap-3 border-b border-[var(--line)] py-8 sm:grid-cols-12 sm:gap-8 sm:py-10"
                >
                  <span className="num text-lg sm:col-span-2">{String(k + 1).padStart(2, "0")}</span>
                  <h3 className="display t-item sm:col-span-4">{t}</h3>
                  <p className="body sm:col-span-6">{b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* How it runs / Who it's for — a symmetric pair either side of the axis */}
        <section className="band section">
          <div className="frame">
            <div className="reveal mx-auto grid max-w-5xl gap-14 md:grid-cols-[1fr_1px_1fr] md:gap-16">
              <div className="text-center md:text-left">
                <p className="label label-accent">Shape</p>
                <h2 className="display t-item mt-4">How it runs</h2>
                <p className="body mt-5">{howItRuns}</p>
              </div>
              <span aria-hidden="true" className="hidden bg-[var(--line)] md:block" />
              <div className="text-center md:text-left">
                <p className="label label-accent">Fit</p>
                <h2 className="display t-item mt-4">Who it&rsquo;s for</h2>
                <p className="body mt-5">{whoFor}</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="not" className="section">
          <div className="frame">
            <div className="reveal flex flex-col items-center text-center">
              <p className="label label-accent flanked">Boundaries</p>
              <h2 id="not" className="display t-section mt-6">
                What&rsquo;s explicitly not included
              </h2>
            </div>
            <ul className="reveal mx-auto mt-12 max-w-[var(--measure)] space-y-5">
              {notIncluded.map((x) => (
                <li key={x} className="grid grid-cols-[1.75rem_1fr] gap-2">
                  <span aria-hidden="true" className="mt-[0.8em] h-px w-4 bg-[var(--accent)]" />
                  <span className="body">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* sibling services */}
        <nav aria-label="Other services" className="hair-t no-print">
          <div className="frame grid grid-cols-2">
            <a
              href={prev.href}
              className="group flex flex-col gap-2 border-r border-[var(--line)] py-8 pr-4 text-left no-underline sm:py-10"
            >
              <span className="label">
                <span className="arrow inline-block transition-transform group-hover:-translate-x-1" aria-hidden="true">
                  ←
                </span>{" "}
                <span className="num">{prev.n}</span>
              </span>
              <span className="display text-lg leading-snug group-hover:text-[var(--accent)] sm:text-xl">
                {prev.title}
              </span>
            </a>
            <a
              href={next.href}
              className="group flex flex-col items-end gap-2 py-8 pl-4 text-right no-underline sm:py-10"
            >
              <span className="label">
                <span className="num">{next.n}</span> <Arrow />
              </span>
              <span className="display text-lg leading-snug group-hover:text-[var(--accent)] sm:text-xl">
                {next.title}
              </span>
            </a>
          </div>
        </nav>

        <Closing />
      </main>
      <Footer />
    </div>
  );
}
