import Link from "next/link";
import { WhatsAppIcon, PhoneIcon, BoxIcon } from "./Icons";

/**
 * Fixed mobile action bar — the short-tempered user's shortcut:
 * WhatsApp, Call and Stock are always one thumb away (below lg only;
 * the header carries the same actions on larger screens).
 * Items without an href (e.g. no phone configured) are dropped.
 */
export default function BottomBar({ locale, labels, whatsappHref, phoneHref }) {
  const items = [
    whatsappHref && {
      key: "whatsapp",
      href: whatsappHref,
      icon: WhatsAppIcon,
      label: labels.whatsapp,
      external: true,
      primary: true,
    },
    phoneHref && {
      key: "call",
      href: phoneHref,
      icon: PhoneIcon,
      label: labels.call,
      external: true,
    },
    {
      key: "stock",
      href: `/${locale}/stock`,
      icon: BoxIcon,
      label: labels.stock,
    },
  ].filter(Boolean);

  const cols = items.length >= 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <nav
      aria-label={labels.label}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className={`mx-auto grid max-w-6xl ${cols}`}>
        {items.map((item) => {
          const Icon = item.icon;
          const body = (
            <span
              className={`flex min-h-16 flex-col items-center justify-center gap-1 px-2 text-sm font-semibold transition ${
                item.primary
                  ? "bg-brand text-white"
                  : "text-brand-dark hover:bg-brand-soft"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </span>
          );
          return (
            <li key={item.key}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full active:scale-[0.98]"
                >
                  {body}
                </a>
              ) : (
                <Link href={item.href} className="block h-full active:scale-[0.98]">
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
