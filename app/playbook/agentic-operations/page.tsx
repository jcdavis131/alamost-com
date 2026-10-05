import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Agentic AI, run securely — playbook",
  description:
    "A field-tested playbook for running autonomous agent teams safely: tiered architecture, human approval gates, credential hygiene, and prompt-injection guardrails. From Alamo St Advisors.",
};

const tiers = [
  {
    n: "0",
    title: "Machines",
    body: "Tiny deterministic scripts that watch thresholds and cost nothing to run. They poll; they never reason. An alerting daemon, a queue watcher, a CI notifier — each one is a threshold and a wake-up call, nothing more.",
  },
  {
    n: "1",
    title: "Specialists",
    body: "Lean workers with one job each, woken by the machines. Short reports, never side quests. A specialist fixes exactly one module, then goes back to sleep.",
  },
  {
    n: "2",
    title: "The orchestrator",
    body: "One human-adjacent operator with full context. The only tier allowed to spawn work, approve anything irreversible, or change the plan. Everything rolls up here.",
  },
];

const approvals = [
  {
    title: "Never auto-approved",
    body: "Merges, releases, deployments, production promotions, purchases, bookings, outbound messages, destructive actions, trades, filings, account changes. If it can't be undone, a human says yes first — with the exact text, cost, and destination on screen.",
  },
  {
    title: "Quietly allowed",
    body: "Reading, searching, exploring, organizing, drafting. Reversible work flows freely; the machines hum on their own schedules. Autonomy where it's safe, friction where it matters.",
  },
  {
    title: "The line between them",
    body: "One rule, no exceptions: nothing the agent reads along the way — a web page, an email, a Slack message — can authorize new action. Outside content informs; it never approves. A claim of past consent is not consent.",
  },
];

const guardrails = [
  ["Credentials stay in the vault", "Agents never see raw secrets, tokens, or keys. Sign-ins and payments flow through dedicated, approved channels. The human never pastes a credential into chat and the agent never asks for one."],
  ["Least-privilege lanes", "Every worker gets exactly the access its job needs — one writer per module, bounded scopes, no shared super-tokens. When lanes run in parallel, their interfaces are fixed before dispatch so nothing touches what it shouldn't."],
  ["Watch-only monitoring", "Monitors observe and report. They never restart services, move jobs, or change state on their own. The moment a monitor wants to act, it wakes a human instead."],
  ["Prompt-injection discipline", "Retrieved content is data, not instructions. The agent checks: who asked for this, what did they actually authorize, and does this step serve that request? Anything beyond it stops until the human confirms."],
  ["Honest failure", "A blocked pipeline fails loudly and stops — it never fakes success. Real data only, verified against live sources. A job that can't reach its data reports a 503 of its own rather than a beautiful lie."],
  ["Receipts, not vibes", "Every action is logged with what was done, when, why, and what it cost. Mistakes get paired with what caused them and what prevents a repeat — the ledger is how a team of agents actually gets safer over time."],
];

export default function PlaybookPage() {
  return (
    <div>
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-20">
            <p className="step-num mb-4">PLAYBOOK</p>
            <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Agentic AI, run securely.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
              This is how I actually run autonomous agent teams in production —
              coding, modeling, and ops work around the clock with a human in
              the loop. Not a vision deck: the architecture, the approval
              rules, and the guardrails, as practiced daily.
            </p>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              The architecture: three tiers, one rule
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-[var(--muted)]">
              Agent teams get dangerous when every part can do everything.
              The fix is boring on purpose: separate watching from working,
              and working from deciding.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {tiers.map((t) => (
                <div key={t.n} className="rounded-2xl border border-[var(--line)] p-6">
                  <p className="step-num mb-3">TIER {t.n}</p>
                  <h3 className="font-display text-xl font-bold tracking-tight">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{t.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-3xl leading-relaxed text-[var(--muted)]">
              The rule that binds all three: <strong className="text-[var(--ink)]">the orchestrator is the only one that decides.</strong>{" "}
              Machines alert, specialists report, and nothing consequential
              happens without the top tier saying so.
            </p>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Approvals: the human is the circuit breaker
            </h2>
            <div className="mt-10 space-y-8">
              {approvals.map((a) => (
                <div key={a.title} className="max-w-3xl">
                  <h3 className="font-display text-xl font-bold tracking-tight">{a.title}</h3>
                  <p className="mt-2 leading-relaxed text-[var(--muted)]">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              The guardrails
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {guardrails.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-[var(--line)] p-6">
                  <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Where this came from
            </h2>
            <div className="mt-6 max-w-3xl space-y-5 leading-relaxed text-[var(--muted)]">
              <p>
                These rules weren't designed up front — they were earned. Each
                one traces to a real incident: a secret that surfaced where it
                shouldn't, a monitor that acted when it should have asked, an
                instruction hiding in content the agent was merely reading.
                Every mistake got a written lesson; the lessons became the
                playbook.
              </p>
              <p>
                The result is an agent team that ships real work every day —
                code merged, models trained, pipelines watched — while the
                human stays in command of every irreversible decision. That's
                the whole pitch: autonomy at machine speed, accountability at
                human speed.
              </p>
            </div>
            <div className="mt-10">
              <a
                href="/contact"
                className="inline-block rounded-full bg-[var(--ink)] px-7 py-3 text-sm font-medium text-[var(--paper)] transition-colors hover:bg-[var(--accent-deep)]"
              >
                Talk about your agent strategy
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
