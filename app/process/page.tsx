import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Process",
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

export default function ProcessPage() {
  return (
    <div>
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
            <p className="step-num mb-4">PROCESS</p>
            <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Short engagements. Working software. Clean handoff.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              Every engagement follows the same shape: understand the decision,
              build a working slice, prove what it does, and leave your team
              holding it. Weeks, not quarters — fixed scope, agreed upfront.
            </p>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Before first contact</h2>
            <div className="mt-6 max-w-3xl space-y-5 leading-relaxed text-[var(--muted)]">
              <p>
                Nothing formal. Read the site, kick the tires on the public
                work — the embedding-map game, the Atlas — and decide whether
                this is the kind of rigor you want pointed at your problem. A
                short note about your team, your data, and the decision
                you&apos;re stuck on is the whole application.
              </p>
              <p>
                The first conversation is a conversation, not a pitch. If
                there&apos;s no fit — wrong problem, wrong timing, wrong firm —
                you&apos;ll hear that quickly and honestly, with a pointer to
                what would actually help.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--dark)] text-[var(--dark-paper)]">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">The three phases</h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-3">
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

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">After handoff</h2>
            <div className="mt-6 max-w-3xl space-y-5 leading-relaxed text-[var(--muted)]">
              <p>
                The engagement ends when your team can run, evaluate, and
                extend the work without help — documentation, training, and
                evaluation playbooks in hand. That&apos;s the actual
                deliverable; the software is just the proof it works.
              </p>
              <p>
                If you want a longer arrangement afterward — a second phase, a
                periodic review, a standing evaluation loop — that&apos;s a new
                conversation with its own fixed scope. What never happens by
                default: a retainer that quietly becomes a dependency.
              </p>
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
