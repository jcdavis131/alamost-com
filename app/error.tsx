"use client";

import { Arrow } from "@/app/components/ui";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="section">
      <div className="frame flex flex-col items-center text-center">
        <p className="label label-accent flanked">Something went wrong</p>
        <h1 className="display t-page mt-6 max-w-3xl">This page didn&rsquo;t load.</h1>
        <p className="lead mt-7 max-w-[var(--measure)]">
          A temporary fault on our side. Try again, or head back to the homepage.
        </p>
        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <a href="/" className="btn btn-quiet">
            Back home <Arrow />
          </a>
        </div>
      </div>
    </main>
  );
}
