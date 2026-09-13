import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

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

function Hero() {
  return (
    <section className="hero-grain">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 sm:pt-28">
        <p className="step-num mb-6">INDEPENDENT ADVISORY — AUSTIN, TEXAS</p>
        <h1 className="font-display max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Clarity for teams building with&nbsp;AI.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
          Alamo St Advisors helps product and data teams understand where machine
          learning and agentic systems create real leverage — then build them
          right. Strategy grounded in shipped systems, evaluation you can trust,
          and prototypes on real data.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="/contact"
            className="rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]"
          >
            Start a conversation
          </a>
          <a
            href="/#approach"
            className="rounded-full border border-[var(--line)] px-7 py-3.5 text-sm font-semibold transition-colors hover:border-[var(--ink)]"
          >
            How we work
          </a>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="rule">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <p className="step-num mb-4">SERVICES</p>
        <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Three ways to get sharper.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div
              key={s.n}
              className="lift rounded-2xl border border-[var(--line)] bg-white/60 p-8"
            >
              <p className="step-num">{s.n}</p>
              <h3 className="font-display mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--muted)]">{s.body}</p>
              <a
                href={s.href}
                className="mt-5 inline-block text-sm font-semibold text-[var(--accent-deep)] hover:underline"
              >
                What it includes →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" className="bg-[var(--dark)] text-[var(--dark-paper)]">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <p className="step-num mb-4">APPROACH</p>
        <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Short engagements. Working software. Clean handoff.
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="step-num text-2xl">{s.n}</p>
              <h3 className="font-display mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-3 leading-relaxed opacity-75">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-6 border-t border-white/15 pt-12 sm:grid-cols-2">
          {principles.map(([t, b]) => (
            <div key={t} className="flex gap-4">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm leading-relaxed opacity-70">{b}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="rule">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <p className="step-num mb-4">SELECTED WORK</p>
        <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Shipped systems, not slideware.
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-[var(--muted)]">
          A sample of production systems built and run by the principal — the
          same discipline advisory engagements get.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {work.map((w) => (
            <div
              key={w.title}
              className="lift flex flex-col rounded-2xl border border-[var(--line)] bg-white/60 p-8"
            >
              <h3 className="font-display text-xl font-bold">{w.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-[var(--muted)]">{w.body}</p>
              <a
                href={w.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 text-sm font-semibold text-[var(--accent-deep)] hover:underline"
              >
                {w.label} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="rule">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-24">
        <p className="step-num mb-4">FAQ</p>
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Fair questions.
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map(([q, a]) => (
            <details
              key={q}
              className="group rounded-2xl border border-[var(--line)] bg-white/60 px-6 py-5"
            >
              <summary className="cursor-pointer list-none font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {q}
                  <span className="text-[var(--accent)] transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-[var(--muted)]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="rule">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <p className="step-num mb-4">ABOUT</p>
        <div className="grid gap-10 sm:grid-cols-5">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:col-span-2 sm:text-4xl">
            Built by someone who ships.
          </h2>
          <div className="space-y-5 leading-relaxed text-[var(--muted)] sm:col-span-3">
            <p>
              Alamo St Advisors is led by{" "}
              <span className="font-semibold text-[var(--ink)]">JC Davis</span>,
              an independent advisor in Austin, Texas who builds and ships AI
              product systems — embedding-map games, forecasting models,
              agentic systems, and data pipelines that run on real data at
              full scale.
            </p>
            <p>
              The work is the credential: production machine-learning systems,
              rigorous held-out evaluation, and products people actually use.
              Advisory here means the same discipline, pointed at your hardest
              decisions.
            </p>
            <p>
              Engagements are deliberately limited — a few teams at a time, senior
              attention throughout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="hero-grain rule">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <p className="step-num mb-4">CONTACT</p>
        <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Tell us what you're trying to build.
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-[var(--muted)]">
          A short note about your team, your data, and the decision you're
          stuck on is the best way to start. Reach out on GitHub — you'll
          hear from the principal, not a sales team.
        </p>
        <a
          href="https://github.com/jcdavis131"
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block rounded-full bg-[var(--ink)] px-9 py-4 text-base font-semibold text-[var(--paper)] transition-colors hover:bg-[var(--accent-deep)]"
        >
          github.com/jcdavis131
        </a>
        <p className="mt-6 text-sm text-[var(--muted)]">Austin, Texas</p>
      </div>
    </section>
  );
}

export default function FirmPage() {
  return (
    <div id="top">
      <Header />
      <main>
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
