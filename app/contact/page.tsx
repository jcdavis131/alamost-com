import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Arrow, PageHero } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
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
      <main id="main">
        <PageHero label="Contact" title="Tell us what you’re trying to build.">
          <p className="lead">
            A short note about your team, your data, and the decision
            you&rsquo;re stuck on is the best way to start. Reach out on
            GitHub — you&rsquo;ll hear from the principal, not a sales team.
          </p>
          <div className="mt-10 flex flex-col items-center">
            <a
              href="https://github.com/jcdavis131"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary w-full sm:w-auto"
            >
              github.com/jcdavis131 <Arrow external />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="label mt-6">Austin, Texas</p>
          </div>
        </PageHero>

        <section aria-labelledby="include" className="section pt-12 sm:pt-16">
          <div className="frame">
            <div className="reveal flex flex-col items-center text-center">
              <p className="label label-accent flanked">The first note</p>
              <h2 id="include" className="display t-section mt-6">
                What to include in the first note
              </h2>
              <p className="lead mt-6 max-w-[var(--measure)]">
                Four short things. No deck, no RFP, no procurement theater —
                just enough to tell whether there&rsquo;s a fit.
              </p>
            </div>
            <ol className="ruled reveal mx-auto mt-16 max-w-5xl sm:mt-20 md:grid-cols-2">
              {includeList.map(([t, b], i) => (
                <li key={t} className="px-1 py-10 sm:px-10 sm:py-12">
                  <p className="num text-lg">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display t-item mt-4">{t}</h3>
                  <p className="body mt-4">{b}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="band section">
          <div className="frame reveal flex flex-col items-center text-center">
            <p className="label label-accent flanked">What happens next</p>
            <p className="display mt-8 max-w-3xl text-[length:var(--step-2)] leading-[1.5]">
              A reply from the principal, usually within a couple of days. If
              there&rsquo;s a fit, the next step is a conversation about the
              decision — then a fixed-scope proposal you can read in ten
              minutes. If there&rsquo;s no fit, you&rsquo;ll hear that too,
              with a pointer to what would actually help.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
