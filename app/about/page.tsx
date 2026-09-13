import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Alamo St Advisors is led by JC Davis, an independent advisor in Austin, Texas. The work is the credential: shipped AI systems, rigorous evaluation, and products people use.",
};

const creds = [
  {
    title: "Vector Hoops — an embedding-map game",
    body: "A basketball strategy game played on a live 3D embedding map of 12,966 player-seasons: daily guessing games, pack battles, a twenty-questions mode, all served from one champion embedding model with rigorous held-out evaluation.",
    href: "https://hoops.dumbmodel.com",
    label: "Play it live",
  },
  {
    title: "Embedding Atlas — layered 3D data maps",
    body: "One 3D map, many layers: aircraft, ships, satellites, earthquakes, launches, plus jobs and wages across 393 US metros on real labor data — switchable, combinable layers over live feeds.",
    href: "https://eye.jcamd.com",
    label: "Live view",
  },
  {
    title: "Forecasting models",
    body: "Multivariate time-series forecasting with modern foundation models — trained, held-out evaluated, and shipped behind live product features, never demo-ware.",
    href: "https://github.com/jcdavis131/vector-hoops",
    label: "Repository",
  },
  {
    title: "Production data pipelines",
    body: "Ingestion and quality gates over real sources at full scale — labor statistics, sports data, research papers — with honest failure modes at every step of the pipeline.",
    href: "https://github.com/jcdavis131",
    label: "GitHub",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "JC Davis",
    jobTitle: "Independent AI strategy and technical advisor",
    description: metadata.description,
    url: "https://www.alamost.com/about",
    homeLocation: {
      "@type": "Place",
      name: "Austin, Texas",
      address: { "@type": "PostalAddress", addressLocality: "Austin", addressRegion: "TX", addressCountry: "US" },
    },
    sameAs: ["https://github.com/jcdavis131", "https://jcamd.com"],
    worksFor: { "@type": "ProfessionalService", name: "Alamo St Advisors", url: "https://www.alamost.com" },
  };
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
            <p className="step-num mb-4">ABOUT</p>
            <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Built by someone who ships.
            </h1>
            <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-[var(--muted)]">
              <p>
                Alamo St Advisors is led by{" "}
                <span className="font-semibold text-[var(--ink)]">JC Davis</span>,
                an independent advisor in Austin, Texas who builds and ships AI
                product systems — embedding-map games, forecasting models,
                agentic systems, and data pipelines that run on real data at
                full scale.
              </p>
              <p>
                The work is the credential. Production machine-learning
                systems, rigorous held-out evaluation, and products people
                actually use — the same discipline advisory engagements get,
                pointed at your hardest decisions.
              </p>
              <p>
                Engagements are deliberately limited: a few teams at a time, and
                you work directly with the principal throughout. No bench, no
                handoffs, no juniors learning on your budget.
              </p>
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              The work behind the advice
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-[var(--muted)]">
              A sample of production systems built and run by the principal —
              public work you can inspect before you ever start a conversation.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {creds.map((c) => (
                <div
                  key={c.title}
                  className="lift flex flex-col rounded-2xl border border-[var(--line)] bg-white/60 p-8"
                >
                  <h3 className="font-display text-xl font-bold">{c.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-[var(--muted)]">{c.body}</p>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 text-sm font-semibold text-[var(--accent-deep)] hover:underline"
                  >
                    {c.label} →
                  </a>
                </div>
              ))}
            </div>
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
