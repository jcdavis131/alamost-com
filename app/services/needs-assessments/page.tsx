import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Needs assessments",
  description:
    "A clear-eyed look at where machine learning or agentic systems can actually move one of your business metrics — and where they can't — before anyone commits to building anything.",
};

const deliverables = [
  ["Opportunity map", "Every plausible use case scored against the business metric it would actually move — revenue, cost, risk, or time — ranked by impact and effort."],
  ["Data-readiness read", "An honest inventory of the data each opportunity would need, what you already have, what's missing, and what filling the gaps would cost."],
  ["Cost of being wrong", "For the top candidates: what a bad model does to your customers or your team, and whether the failure modes are survivable."],
  ["Buy, build, or skip", "A plain recommendation per opportunity — buy a vendor product, build it in-house, or skip it — with the reasoning written down so your team can argue with it."],
  ["First-step plan", "The smallest useful thing to do next, with the decision it answers and the evidence that would change it."],
];

const notIncluded = [
  "Model training or production builds — this is diagnosis, not construction.",
  "Vendor selection run as a paid referral. If a vendor product fits, you'll hear it; there's no commission riding on the answer.",
  "Financial, investment, legal, or tax advice — this is technical advisory only.",
];

export default function NeedsAssessmentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI needs assessment",
    serviceType: "AI strategy advisory",
    provider: {
      "@type": "ProfessionalService",
      name: "Alamo St Advisors",
      url: "https://alamost.com",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    areaServed: "Worldwide",
    url: "https://alamost.com/services/needs-assessments",
    description: metadata.description,
  };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
            <p className="step-num mb-4"><a href="/#services" className="hover:underline">SERVICES</a> · 01</p>
            <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Needs assessments
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              A clear-eyed look at where machine learning or agentic systems can
              actually move one of your business metrics — and where they
              can&apos;t. You get an honest map of the opportunities, the data
              they&apos;d need, and what it costs to be wrong, before anyone
              commits to building anything.
            </p>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">What you get</h2>
            <div className="mt-10 space-y-8">
              {deliverables.map(([t, b]) => (
                <div key={t} className="flex gap-5">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="mt-1 max-w-3xl leading-relaxed text-[var(--muted)]">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:grid-cols-2 sm:py-20">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">How it runs</h2>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                Two to four weeks, not quarters. Week one is conversations and
                data access: the decision you&apos;re stuck on, the team that
                would own the outcome, and a look at what you actually have in
                the warehouse. The rest is analysis and writing — the output is
                a document your leadership can read in twenty minutes and your
                engineers can argue with for a month.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Who it&apos;s for</h2>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                Teams with real AI curiosity and real data, but no clear picture
                of where the leverage is — or a leadership team that needs one
                trusted voice to separate the plausible from the theater before
                the budget gets spent.
              </p>
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">What&apos;s explicitly not included</h2>
            <ul className="mt-8 space-y-4">
              {notIncluded.map((n) => (
                <li key={n} className="flex gap-4 leading-relaxed text-[var(--muted)]">
                  <span className="font-semibold text-[var(--ink)]">—</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
            <a
              href="/contact"
              className="mt-12 inline-block rounded-full bg-[var(--ink)] px-8 py-3.5 text-sm font-semibold text-[var(--paper)] transition-colors hover:bg-[var(--accent-deep)]"
            >
              Start a conversation →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
