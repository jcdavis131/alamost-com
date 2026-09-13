import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Benchmarking workflows that matter",
  description:
    "Evaluation harnesses built on your own data: champion vs. challenger, held-out metrics, human-in-the-loop checks — tied to business outcomes, not leaderboard scores.",
};

const deliverables = [
  ["A harness on your data", "An evaluation pipeline built on your own examples, your own edge cases, your own failure history — the situations a generic benchmark never covers."],
  ["Champion vs. challenger", "Your current approach scored head-to-head against the candidate: the model you're considering, the agent workflow you're prototyping, the vendor you're evaluating. Same data, same metrics, no spin."],
  ["Held-out metrics, reported straight", "The numbers measured on data neither side saw during development — including the ones that make a candidate look bad. Metrics you could bet the roadmap on."],
  ["Human-in-the-loop checks", "Where outputs touch customers or decisions, structured human review: sampled, scored, and priced against the error budget. You learn what review costs before you're committed to it."],
  ["A rerun playbook", "Documentation your team can run themselves next quarter — new data in, new scores out — so the evaluation keeps working after the engagement ends."],
];

const notIncluded = [
  "Training a model from scratch as part of the evaluation — the harness judges candidates, it doesn't build them.",
  "A deployment or integration plan. The answer to “does it work” comes first; wiring it in is a separate engagement.",
  "Financial, investment, legal, or tax advice — this is technical advisory only.",
];

export default function BenchmarkingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI evaluation and benchmarking",
    serviceType: "AI model evaluation",
    provider: {
      "@type": "ProfessionalService",
      name: "Alamo St Advisors",
      url: "https://www.alamost.com",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    areaServed: "Worldwide",
    url: "https://www.alamost.com/services/benchmarking",
    description: metadata.description,
  };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
            <p className="step-num mb-4"><a href="/#services" className="hover:underline">SERVICES</a> · 02</p>
            <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Benchmarking workflows that matter
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              Evaluation harnesses built on your own data: champion vs.
              challenger, held-out metrics, human-in-the-loop checks — tied to
              business outcomes, not leaderboard scores. Know what a model or
              an agent will do for your customers before it ever touches them.
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
                Three to six weeks. First the harness: your data turned into
                scored test sets with the metrics that matter to the business.
                Then the matchup: champion vs. challenger run cleanly, with
                held-out data and the failure cases written up plainly. You get
                a report a product lead can act on — ship it, fix it, or kill
                it — and a playbook so your team can rerun the whole thing.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Who it&apos;s for</h2>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                Teams about to ship — or about to buy — an AI system and
                needing an honest answer first. Model vendors and internal
                champions bring demos; this engagement brings the part demos
                skip: what it does on <em>your</em> customers&apos; data, with
                the bad news included.
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
