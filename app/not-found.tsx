import type { Metadata } from "next";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import { Corridor } from "@/app/components/marks";
import { Arrow } from "@/app/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist — head back home.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div>
      <Header />
      <main id="main">
        <section className="section">
          <div className="frame flex flex-col items-center text-center">
            <Corridor className="w-[12rem] text-[var(--ink)] opacity-80 sm:w-[14rem]" />
            <p className="seq label label-accent flanked mt-10 [font-variant-numeric:tabular-nums]" style={{ ["--d" as string]: 400 }}>
              404 · Not found
            </p>
            <h1 className="seq display t-page mt-6 max-w-3xl" style={{ ["--d" as string]: 550 }}>
              This page isn&rsquo;t on the map.
            </h1>
            <p className="seq lead mt-7 max-w-[var(--measure)]" style={{ ["--d" as string]: 700 }}>
              The link you followed doesn&rsquo;t point anywhere. The homepage
              has everything — services, work, and how to start a conversation.
            </p>
            <div className="seq mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row" style={{ ["--d" as string]: 850 }}>
              <a href="/" className="btn btn-primary">
                Back home <Arrow />
              </a>
              <a href="/contact" className="btn btn-quiet">
                Contact
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
