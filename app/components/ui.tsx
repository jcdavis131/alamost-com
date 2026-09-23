import type { ReactNode } from "react";

/** A centred title card: flanked label, serif title, optional lede. */
export function SectionHead({
  label,
  title,
  lede,
  as: Tag = "h2",
  id,
}: {
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className="reveal mx-auto flex max-w-3xl flex-col items-center text-center">
      <p className="label label-accent flanked">{label}</p>
      <Tag id={id} className={`display mt-6 ${Tag === "h1" ? "t-page" : "t-section"}`}>
        {title}
      </Tag>
      {lede ? <p className="lead mx-auto mt-6 max-w-[var(--measure)]">{lede}</p> : null}
    </div>
  );
}

/** Interior-page opening frame. */
export function PageHero({
  label,
  title,
  children,
}: {
  label: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="section pb-0 sm:pb-0">
      <div className="frame flex flex-col items-center text-center">
        <p className="seq label label-accent flanked" style={{ ["--d" as string]: 0 }}>
          {label}
        </p>
        <h1 className="seq display t-page mt-7 max-w-4xl" style={{ ["--d" as string]: 120 }}>
          {title}
        </h1>
        {children ? (
          <div className="seq mt-8 w-full max-w-[var(--measure)]" style={{ ["--d" as string]: 260 }}>
            {children}
          </div>
        ) : null}
        <span className="axis mt-14 sm:mt-20" aria-hidden="true" />
      </div>
    </section>
  );
}

export function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span className="arrow" aria-hidden="true">
      {external ? "↗" : "→"}
    </span>
  );
}

/** The closing frame every page ends on. */
export function Closing({
  title = "Tell us what you’re trying to build.",
  body = "A short note about your team, your data, and the decision you’re stuck on is the best way to start. You’ll hear from the principal, not a sales team.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="section hair-t">
      <div className="frame reveal flex flex-col items-center text-center">
        <p className="label label-accent flanked">Begin</p>
        <h2 className="display t-section mt-6 max-w-2xl">{title}</h2>
        <p className="lead mt-6 max-w-[var(--measure)]">{body}</p>
        <a href="/contact" className="btn btn-primary mt-10">
          Start a conversation <Arrow />
        </a>
      </div>
    </section>
  );
}
