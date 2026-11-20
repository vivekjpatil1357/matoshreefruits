/**
 * Section header used across the public pages.
 * `as` swaps the heading level — pass `"h1"` where this is the page's main
 * heading (subpages); in-page sections stay `h2`.
 */
export default function SectionHeading({ title, subtitle, action, as: Heading = "h2" }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Heading className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
          {title}
        </Heading>
        {subtitle && <p className="mt-2 max-w-xl text-base text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
