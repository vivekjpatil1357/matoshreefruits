import { WhatsAppIcon } from "./Icons";

/* One shape (square), one fill per variant, all targets ≥48px tall. */
const SIZES = {
  sm: "px-4 py-3 text-sm gap-2",
  md: "px-6 py-3 text-base gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

const VARIANTS = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  accent: "bg-accent text-brand-dark hover:brightness-105",
  outline: "border border-brand/40 bg-surface text-brand-dark hover:bg-brand-soft",
  light: "bg-white text-brand-dark hover:bg-accent-soft",
  ghost: "bg-transparent text-brand-dark hover:bg-brand-soft",
};

/** WhatsApp enquiry CTA — opens wa.me in a new tab. Never contains pricing. */
export default function WhatsAppButton({
  href,
  label,
  size = "md",
  variant = "primary",
  className = "",
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[0.98] ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      <WhatsAppIcon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      <span>{label}</span>
    </a>
  );
}
