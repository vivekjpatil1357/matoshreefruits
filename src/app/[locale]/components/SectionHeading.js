/** Section header used across the public pages. */
export default function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-xl text-base text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
