import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Corridor } from "@/app/components/marks";
import { Arrow, SectionHead } from "@/app/components/ui";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const services = [
  {
    n: "01",
    title: "Needs assessments",
    href: "/services/needs-assessments",
    body: "A clear-eyed look at where machine learning or agentic systems can actually move one of your business metrics — and where they can't. You get an honest map of the opportunities, the data they'd need, and what it costs to be wrong, before anyone commits to building anything.",
  },
  {
    n: "02",
    title: "Benchmarking workflows that matter",
    href: "/services/benchmarking",
    body: "Evaluation harnesses built on your own data: champion vs. challenger, held-out metrics, human-in-the-loop checks — tied to business outcomes, not leaderboard scores. Know what a model or an agent will do for your customers before it ever touches them.",
  },
  {
    n: "03",
    title: "Building custom solutions",
    href: "/services/custom-solutions",
    body: "Working prototypes on your real data — embedding and search systems, forecasting models, production data pipelines with quality gates, agentic workflows with human approval gates. Built to hand off: documentation and training so your team owns it.",
  },
];

const steps = [
  {
    n: "I",
    title: "Diagnose",
    body: "A needs assessment on your data, your models, and your team. You get a plain-spoken read: what's working, what's theater, and what to do first.",
  },
  {
    n: "II",
    title: "Prototype",
    body: "A working slice on real data — not slides. Something your team can touch, measure, and argue with within weeks, not quarters.",
  },
  {
    n: "III",
    title: "Hand off",
    body: "Your team owns it. Documentation, training, and the reasoning behind every decision, so the work survives after the engagement ends.",
  },
];

const principles = [
  ["Real data only", "No synthetic demos, no mock results. If it can't run on your data, it doesn't ship."],
  ["Honest evals", "Metrics you'd bet the roadmap on — held out, reproducible, and reported straight."],
  ["Senior only", "You work directly with the principal. No bench, no handoffs, no juniors learning on your budget."],
  ["No theater", "If the answer is 'you don't need AI for this,' that's the answer you'll get."],
];

const work = [
  {
    title: "Embedding-map games",
    body: "Vector Hoops: a basketball strategy game played on a live 3D embedding map of 12,966 player-seasons — daily guessing games, pack battles, and a twenty-questions mode, all served from one champion model.",
    href: "https://hoops.dumbmodel.com",
    label: "Play it live",
  },
  {
    title: "Embedding Atlas",
    body: "One 3D map, many layers — aircraft, ships, satellites, earthquakes, launches, plus jobs and wages across 393 US metros on real labor data. Switchable, combinable layers over live feeds.",
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
    title: "Data pipelines",
    body: "Production-grade ingestion and quality gates over real sources at full scale — labor statistics, sports data, research papers — with honest failure modes at every step.",
    href: "https://github.com/jcdavis131",
    label: "GitHub",
  },
];

const faqs = [
  [
    "How do engagements start?",
    "With a conversation about the decision you're stuck on. If there's a fit, the first step is a focused diagnosis — your data, your models, your team — and a plain-spoken read on what to do first.",
  ],
  [
    "How long do engagements run?",
    "Weeks, not quarters. Each phase ends with something working on your data: a prototype your team can touch and measure, then a clean handoff.",
  ],
  [
    "What does it cost?",
    "Fixed scope, agreed upfront. You know exactly what you're getting and what it costs before anything starts — no hourly billing theater.",
  ],
  [
    "Who does the work?",
    "The principal, directly. No bench, no handoffs, no juniors learning on your budget. Engagements are deliberately limited to a few teams at a time.",
  ],
  [
    "Do you write production code?",
    "Yes — working slices on real data, not slideware. Then documentation and training so your team owns it after the handoff.",
  ],
  [
    "What won't you take on?",
    "Theater. If the honest answer is that you don't need AI for the problem, that's the answer you'll get — along with what would actually move the needle.",
  ],
  [
    "Where are you based, and do you work remotely?",
    "Austin, Texas — and yes, engagements run remotely with clients anywhere. Working on your real data doesn't require a plane ticket, and the deliverables are written to be read and argued with asynchronously.",
  ],
  [
    "Will you sign an NDA?",
    "Yes. A mutual NDA is standard before any detailed data access, and I'm happy to start under yours. The first conversation about your decision doesn't need one — keep it at the level you're comfortable with.",
  ],
  [
    "How do you handle our data?",
    "Carefully, and in your systems whenever possible. Your data stays in client-provided systems with the least access needed; any local copies are minimized and deleted within 30 days of the engagement ending. It's never used to train models or shared with third parties without your written consent, and it's never pasted into public AI tools under default training settings — where AI tooling touches your data, it runs under your tenant or an account with training disabled.",
  ],
  [
    "How does fixed-scope pricing work?",
    "The scope and the price are agreed in writing before anything starts — you know exactly what you're getting and what it costs. No hourly billing, no meter running, no change-order theater. If the scope genuinely changes midstream, we agree a new scope and a new price with the same clarity, before the extra work starts.",
  ],
  [
    "What happens after the handoff?",
    "Your team owns everything: working software, documentation, training, and evaluation playbooks they can rerun themselves. There's no default retainer and no quiet dependency. If you want a second phase or a standing review, that's a separate fixed-scope conversation — never an automatic renewal.",
  ],
  [
    "Do you provide financial or investment advice?",
    "No. Alamo St Advisors is an AI strategy and technical advisory firm — we help teams design, evaluate, and ship AI systems. We don't provide financial, investment, legal, or tax advice, and nothing on this site should be read that way. (The name similarity to any investment adviser is coincidental; we're not affiliated with any registered investment adviser.)",
  ],
];


const disciplines = ["AI strategy", "Model evaluation", "Data pipelines", "Embedding & search"];

function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="frame flex min-h-[calc(100svh-4.5rem)] flex-col items-center justify-center pb-10 pt-10 text-center">
        <Corridor className="w-[14rem] text-[var(--ink)] sm:w-[16rem]" />
        <p className="seq label label-accent flanked flanked-wide mt-9 sm:mt-10" style={{ ["--d" as string]: 500 }}>
          <span>
            Independent advisory
            <span className="hidden sm:inline"> · </span>
            <br className="sm:hidden" />
            Austin, Texas
          </span>
        </p>
        <h1
          id="hero-title"
          className="seq display t-page mt-6 max-w-[14ch] sm:max-w-[16ch]"
          style={{ ["--d" as string]: 650 }}
        >
          Clarity for teams building with&nbsp;AI.
        </h1>
        <p className="seq lead mt-7 max-w-[var(--measure)] lg:max-w-[42rem]" style={{ ["--d" as string]: 800 }}>
          Alamo St Advisors helps product and data teams understand where
          machine learning and agentic systems create real leverage — then
          build them right. Strategy grounded in shipped systems, evaluation
          you can trust, and prototypes on real data.
        </p>
        <div
          className="seq mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row"
          style={{ ["--d" as string]: 950 }}
        >
          <a href="/contact" className="btn btn-primary">
            Start a conversation <Arrow />
          </a>
          <a href="/#approach" className="btn btn-quiet">
            How we work
          </a>
        </div>
        <ul
          aria-label="Practice areas"
          className="seq mt-14 grid w-full max-w-4xl grid-cols-2 gap-px border-y border-[var(--line)] bg-[var(--line)] sm:mt-12 sm:grid-cols-4"
          style={{ ["--d" as string]: 1100 }}
        >
          {disciplines.map((d) => (
            <li key={d} className="label bg-[var(--paper)] px-2 py-4">
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section hair-t">
      <div className="frame">
        <SectionHead
          label="Services"
          title="Three ways to get sharper."
          lede="Each engagement is fixed in scope and ends with something your team can use: a map, a verdict, or a working system."
        />
        <ol className="ruled reveal mt-16 sm:mt-20 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.n} className="cell flex flex-col px-1 py-10 sm:px-10 sm:py-12 lg:px-9">
              <p className="num text-lg">{s.n}</p>
              <h3 className="display t-item mt-5 lg:min-h-[2.4em]">
                <a href={s.href} className="no-underline after:absolute after:inset-0 after:content-['']">
                  {s.title}
                </a>
              </h3>
              <p className="body mt-4 flex-1">{s.body}</p>
              <p className="link mt-8" aria-hidden="true">
                What it includes <Arrow />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="section hair-t">
      <div className="frame">
        <SectionHead
          label="Selected work"
          title="Shipped systems, not slideware."
          lede="A sample of production systems built and run by the principal — the same discipline advisory engagements get."
        />
        <ul className="ruled reveal mt-16 sm:mt-20 md:grid-cols-2">
          {work.map((w) => (
            <li key={w.title} className="cell flex flex-col px-1 py-10 sm:px-10 sm:py-12">
              <h3 className="display t-item">
                <a
                  href={w.href}
                  target="_blank"
                  rel="noreferrer"
                  className="no-underline after:absolute after:inset-0 after:content-['']"
                >
                  {w.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </h3>
              <p className="body mt-4 flex-1">{w.body}</p>
              <p className="link mt-8" aria-hidden="true">
                {w.label} <Arrow external />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="band section">
      <div className="frame">
        <SectionHead label="Approach" title="Short engagements. Working software. Clean handoff." />
        <ol className="reveal relative mt-16 grid gap-14 sm:mt-20 md:grid-cols-3 md:gap-10">
          <span
            aria-hidden="true"
            className="absolute left-[16.66%] right-[16.66%] top-[0.6875rem] hidden h-px bg-[var(--line)] md:block"
          />
          {steps.map((s) => (
            <li key={s.n} className="relative flex flex-col items-center text-center">
              <span
                aria-hidden="true"
                className="block h-[1.375rem] w-[1.375rem] rounded-full border border-[var(--accent)] bg-[var(--band)] p-[5px]"
              >
                <span className="block h-full w-full rounded-full bg-[var(--accent)]" />
              </span>
              <p className="num mt-6 text-xl">{s.n}</p>
              <h3 className="display t-item mt-3">{s.title}</h3>
              <p className="body mt-4 max-w-[21rem]">{s.body}</p>
            </li>
          ))}
        </ol>
        <ul className="ruled reveal mt-20 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(([t, b]) => (
            <li key={t} className="px-1 py-8 sm:px-8">
              <p className="label !text-[var(--ink)]">{t}</p>
              <p className="body mt-3 text-[length:var(--step--1)] leading-relaxed">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-center">
          <a href="/process" className="link">
            The full process <Arrow />
          </a>
        </p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="frame">
        <SectionHead label="About the principal" title="Built by someone who ships." />
        <div className="reveal mx-auto mt-12 max-w-[var(--measure)] space-y-6 sm:mt-14">
          <p className="display text-[length:var(--step-2)] leading-[1.45] text-[var(--ink)]">
            Alamo St Advisors is led by JC Davis, an independent advisor in
            Austin, Texas who builds and ships AI product systems —
            embedding-map games, forecasting models, agentic systems, and data
            pipelines that run on real data at full scale.
          </p>
          <p className="body">
            The work is the credential: production machine-learning systems,
            rigorous held-out evaluation, and products people actually use.
            Advisory here means the same discipline, pointed at your hardest
            decisions.
          </p>
          <p className="body">
            Engagements are deliberately limited — a few teams at a time, senior
            attention throughout.
          </p>
          <p className="pt-4 text-center">
            <a href="/about" className="link">
              More about the principal <Arrow />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="section hair-t">
      <div className="frame">
        <SectionHead label="Questions" title="Fair questions." />
        <div className="faq reveal mx-auto mt-14 max-w-3xl border-t border-[var(--line)] sm:mt-16">
          {faqs.map(([q, a]) => (
            <details key={q} className="border-b border-[var(--line)]">
              <summary className="flex items-center justify-between gap-6 py-6">
                <span className="q display text-[1.1875rem] leading-snug sm:text-[1.3125rem]">{q}</span>
                <span className="plus" aria-hidden="true" />
              </summary>
              <p className="body -mt-1 max-w-[var(--measure)] pb-7">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section hair-t">
      <div className="frame reveal flex flex-col items-center text-center">
        <p className="label label-accent flanked">Contact</p>
        <h2 className="display t-section mt-6 max-w-2xl">
          Tell us what you&rsquo;re trying to build.
        </h2>
        <p className="lead mt-6 max-w-[var(--measure)]">
          A short note about your team, your data, and the decision you&rsquo;re
          stuck on is the best way to start. Reach out on GitHub — you&rsquo;ll
          hear from the principal, not a sales team.
        </p>
        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <a href="https://github.com/jcdavis131" target="_blank" rel="noreferrer" className="btn btn-primary">
            github.com/jcdavis131 <Arrow external />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <a href="/contact" className="btn btn-quiet">
            What to include
          </a>
        </div>
        <p className="label mt-8">Austin, Texas</p>
      </div>
    </section>
  );
}

export default function FirmPage() {
  return (
    <div id="top">
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Work />
        <Approach />
        <About />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
