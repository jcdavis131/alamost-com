import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Building custom solutions",
  description:
    "Working prototypes on your real data — embedding and search systems, forecasting models, production data pipelines with quality gates, agentic workflows with human approval gates. Built to hand off.",
};

const deliverables = [
  ["Working software, not slides", "A real system running on your real data — embedding and search systems, forecasting models, data pipelines with quality gates, agentic workflows with human approval gates. Your team can touch it, measure it, and argue with it."],
  ["Evaluation before and after", "Every prototype ships with the harness that proves what it does: baseline scores on your data, post-build scores, and the failure modes written up honestly."],
  ["Code your team can read", "Documented, boring-in-a-good-way code — the reasoning behind each decision written down, not locked in anyone's head."],
  ["Training for your team", "Working sessions with the people who will own the system: how it runs, how it fails, what to watch, and what to change first when the data drifts."],
  ["A clean handoff", "Runbooks, evaluation playbooks, and documentation — the work survives after the engagement ends because it was built to leave."],
];

const notIncluded = [
  "Ongoing maintenance and on-call. The prototype is yours; if you want a longer arrangement afterward, that's a separate conversation.",
  "Your infrastructure bills — cloud, data, and vendor costs stay on your accounts.",
  "Replacing your team. The point is to make them self-sufficient, not dependent.",
  "Financial, investment, legal, or tax advice — this is technical advisory only.",
];

export default function CustomSolutionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom AI solutions",
    serviceType: "AI systems development",
    provider: {
      "@type": "ProfessionalService",
      name: "Alamo St Advisors",
      url: "https://www.alamost.com",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    areaServed: "Worldwide",
    url: "https://www.alamost.com/services/custom-solutions",
    description: metadata.description,
  };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
            <p className="step-num mb-4"><a href="/#services" className="hover:underline">SERVICES</a> · 03</p>
            <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Building custom solutions
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              Working prototypes on your real data — embedding and search
              systems, forecasting models, production data pipelines with
              quality gates, agentic workflows with human approval gates. Built
              to hand off: documentation and training so your team owns it.
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
                Weeks, not quarters. The shape is always the same: diagnose the
                decision, build a working slice on real data, evaluate it
                honestly, then hand it over with your team trained to run it.
                Engagements are scoped to a single working system with a fixed
                price agreed upfront — you&apos;ll know exactly what
                you&apos;re getting before anything starts.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Who it&apos;s for</h2>
              <p className="mt-4 leading-relaxed text-[var(--muted)]">
                Teams that know the opportunity and need it built right — with
                evaluation you can trust and a handoff that sticks. If your
                team should build it themselves and just needs a senior pair of
                eyes, say so; that&apos;s a shorter engagement, not this one.
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
