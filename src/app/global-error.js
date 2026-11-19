"use client";

import { BoxIcon } from "./[locale]/components/Icons";

/** Global error boundary for the entire app. */
export default function GlobalError({ error, reset }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center bg-accent-soft text-brand-dark">
        <BoxIcon className="h-7 w-7" />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-brand-dark">
        Something went wrong
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-7 bg-brand px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark"
      >
        Try again
      </button>
    </div>
  );
}