import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with Alamo St Advisors: a short note about your team, your data, and the decision you're stuck on.",
};

const includeList = [
  ["Your team", "Who would own the outcome — size, roles, and how technical the room is. This decides whether the work is a prototype, an evaluation, or a read on what to do first."],
  ["Your data", "What you have, roughly where it lives, and who can grant access. You don't need it perfectly organized — knowing the shape of it is enough to start."],
  ["The decision you're stuck on", "The one sentence version. If the answer is “should we build this,” say so; if it's “will this work,” say that. The first conversation works best when the question is sharp."],
  ["Your timeline", "When a decision has to be made. Engagements run in weeks, not quarters — knowing the real deadline keeps the scope honest."],
];

export default function ContactPage() {
  return (
    <div>
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 pb-16 pt-16 text-center sm:pt-20">
            <p className="step-num mb-4">CONTACT</p>
            <h1 className="font-display mx-auto max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              Tell us what you&apos;re trying to build.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              A short note about your team, your data, and the decision
              you&apos;re stuck on is the best way to start. Reach out on
              GitHub — you&apos;ll hear from the principal, not a sales team.
            </p>
            <a
              href="https://github.com/jcdavis131"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-block rounded-full bg-[var(--ink)] px-10 py-4 text-base font-semibold text-[var(--paper)] transition-colors hover:bg-[var(--accent-deep)]"
            >
              github.com/jcdavis131
            </a>
            <p className="mt-6 text-sm text-[var(--muted)]">Austin, Texas</p>
          </div>
        </section>

        <section className="rule">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              What to include in the first note
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              Four short things. No deck, no RFP, no procurement theater —
              just enough to tell whether there&apos;s a fit.
            </p>
            <div className="mt-10 space-y-8">
              {includeList.map(([t, b]) => (
                <div key={t} className="flex gap-5">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="mt-1 leading-relaxed text-[var(--muted)]">{b}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 rounded-2xl border border-[var(--line)] bg-white/60 p-8">
              <p className="font-semibold">What happens next</p>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">
                A reply from the principal, usually within a couple of days. If
                there&apos;s a fit, the next step is a conversation about the
                decision — then a fixed-scope proposal you can read in ten
                minutes. If there&apos;s no fit, you&apos;ll hear that too,
                with a pointer to what would actually help.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
