import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Closing, PageHero } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Process",
  alternates: { canonical: "/process" },
  description:
    "How Alamo St Advisors works: diagnose, prototype, hand off — short engagements on real data, with principles that keep the work honest.",
};

const steps = [
  {
    n: "I",
    title: "Diagnose",
    body: "A needs assessment on your data, your models, and your team. You get a plain-spoken read: what's working, what's theater, and what to do first. Sometimes the right answer is “you don't need AI for this” — that's the answer you'll get, along with what would actually move the needle.",
  },
  {
    n: "II",
    title: "Prototype",
    body: "A working slice on real data — not slides. Something your team can touch, measure, and argue with within weeks, not quarters, built against an evaluation harness so you know what it actually does before it grows.",
  },
  {
    n: "III",
    title: "Hand off",
    body: "Your team owns it. Documentation, training, and the reasoning behind every decision, so the work survives after the engagement ends. Built to leave — deliberately.",
  },
];

const principles = [
  ["Real data only", "No synthetic demos, no mock results. If it can't run on your data, it doesn't ship."],
  ["Honest evals", "Metrics you'd bet the roadmap on — held out, reproducible, and reported straight, including the bad news."],
  ["Senior only", "You work directly with the principal. No bench, no handoffs, no juniors learning on your budget."],
  ["No theater", "If the answer is “you don't need AI for this,” that's the answer you'll get. The firm's only repeat business is the kind earned honestly."],
];

function Prose({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="frame">
      <div className="reveal flex flex-col items-center text-center">
        <p className="label label-accent flanked">{label}</p>
        <h2 className="display t-section mt-6">{title}</h2>
      </div>
      <div className="reveal body mx-auto mt-10 max-w-[var(--measure)] space-y-6">{children}</div>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <div>
      <Header />
      <main id="main">
        <PageHero label="Process" title="Short engagements. Working software. Clean handoff.">
          <p className="lead">
            Every engagement follows the same shape: understand the decision,
            build a working slice, prove what it does, and leave your team
            holding it. Weeks, not quarters — fixed scope, agreed upfront.
          </p>
        </PageHero>

        <section className="section pt-12 sm:pt-16">
          <Prose label="Before" title="Before first contact">
            <p>
              Nothing formal. Read the site, kick the tires on the public
              work — the embedding-map game, the Atlas — and decide whether
              this is the kind of rigor you want pointed at your problem. A
              short note about your team, your data, and the decision
              you&rsquo;re stuck on is the whole application.
            </p>
            <p>
              The first conversation is a conversation, not a pitch. If
              there&rsquo;s no fit — wrong problem, wrong timing, wrong firm —
              you&rsquo;ll hear that quickly and honestly, with a pointer to
              what would actually help.
            </p>
          </Prose>
        </section>

        <section className="band section">
          <div className="frame">
            <div className="reveal flex flex-col items-center text-center">
              <p className="label label-accent flanked">During</p>
              <h2 className="display t-section mt-6">The three phases</h2>
            </div>
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
                  <p className="body mt-4 max-w-[22rem]">{s.body}</p>
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
          </div>
        </section>

        <section className="section">
          <Prose label="After" title="After handoff">
            <p>
              The engagement ends when your team can run, evaluate, and
              extend the work without help — documentation, training, and
              evaluation playbooks in hand. That&rsquo;s the actual
              deliverable; the software is just the proof it works.
            </p>
            <p>
              If you want a longer arrangement afterward — a second phase, a
              periodic review, a standing evaluation loop — that&rsquo;s a new
              conversation with its own fixed scope. What never happens by
              default: a retainer that quietly becomes a dependency.
            </p>
          </Prose>
        </section>

        <Closing />
      </main>
      <Footer />
    </div>
  );
}
