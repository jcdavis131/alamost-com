import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Arrow, Closing, PageHero, SectionHead } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
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
      <main id="main">
        <PageHero label="About the principal" title="Built by someone who ships.">
          <div className="space-y-6 text-left">
            <p className="display text-[length:var(--step-2)] leading-[1.45]">
              Alamo St Advisors is led by JC Davis, an independent advisor in
              Austin, Texas who builds and ships AI product systems —
              embedding-map games, forecasting models, agentic systems, and data
              pipelines that run on real data at full scale.
            </p>
            <p className="body">
              The work is the credential. Production machine-learning
              systems, rigorous held-out evaluation, and products people
              actually use — the same discipline advisory engagements get,
              pointed at your hardest decisions.
            </p>
            <p className="body">
              Engagements are deliberately limited: a few teams at a time, and
              you work directly with the principal throughout. No bench, no
              handoffs, no juniors learning on your budget.
            </p>
          </div>
        </PageHero>

        <section className="section pt-12 sm:pt-16">
          <div className="frame">
            <SectionHead
              label="Public work"
              title="The work behind the advice"
              lede="A sample of production systems built and run by the principal — public work you can inspect before you ever start a conversation."
            />
            <ul className="ruled reveal mt-16 sm:mt-20 md:grid-cols-2">
              {creds.map((c) => (
                <li key={c.title} className="cell flex flex-col px-1 py-10 sm:px-10 sm:py-12">
                  <h3 className="display t-item">
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer"
                      className="no-underline after:absolute after:inset-0 after:content-['']"
                    >
                      {c.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </h3>
                  <p className="body mt-4 flex-1">{c.body}</p>
                  <p className="link mt-8" aria-hidden="true">
                    {c.label} <Arrow external />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <Closing />
      </main>
      <Footer />
    </div>
  );
}
