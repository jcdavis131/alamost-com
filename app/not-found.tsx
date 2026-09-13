import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist — head back home.",
};

export default function NotFound() {
  return (
    <div>
      <Header />
      <main>
        <section className="hero-grain">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
            <p className="step-num mb-6">404</p>
            <h1 className="font-display mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              This page isn&apos;t on the map.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              The link you followed doesn&apos;t point anywhere. The homepage
              has everything — services, work, and how to start a conversation.
            </p>
            <a
              href="/"
              className="mt-10 inline-block rounded-full bg-[var(--ink)] px-8 py-3.5 text-sm font-semibold text-[var(--paper)] transition-colors hover:bg-[var(--accent-deep)]"
            >
              Back home →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
