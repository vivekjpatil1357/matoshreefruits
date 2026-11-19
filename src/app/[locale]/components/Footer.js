import Link from "next/link";
import Image from "next/image";
import { CONTACT, BUSINESS_NAME } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";
import WhatsAppButton from "./WhatsAppButton";
import { PhoneIcon, MapPinIcon, ClockIcon, MailIcon } from "./Icons";

/**
 * Site footer: quick links, contact details and the WhatsApp CTA.
 * @param {Array<{href: string, label: string}>} nav
 */
export default function Footer({ locale, nav, t }) {
  const year = 2026;
  const details = [
    CONTACT.phone && {
      icon: PhoneIcon,
      label: t.contact.phone,
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
    },
    CONTACT.address && {
      icon: MapPinIcon,
      label: t.contact.address,
      value: CONTACT.address,
    },
    CONTACT.hours && { icon: ClockIcon, label: t.contact.hours, value: CONTACT.hours },
    CONTACT.email && {
      icon: MailIcon,
      label: t.contact.email,
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
  ].filter(Boolean);

  return (
    <footer className="mt-auto border-t border-line bg-surface min-h-[400px]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden bg-white"
            >
              <Image
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="text-base font-bold text-brand-dark">{BUSINESS_NAME}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.meta.tagline}</p>
          <p className="mt-4 bg-accent-soft px-3 py-2 text-[13px] font-medium text-brand-dark">
            {t.footer.note}
          </p>
          <div className="mt-4">
            <WhatsAppButton
              href={`https://wa.me/${CONTACT.whatsapp}`}
              label={t.common.whatsappEnquiry}
              variant="outline"
              size="sm"
            />
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-brand-dark">
            {t.footer.quickLinks}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-base text-foreground transition hover:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-brand-dark">
            {t.footer.contact}
          </h2>
          <ul className="mt-4 space-y-3">
            {details.length > 0 ? (
              details.map((d) => {
                const Icon = d.icon;
                const body = (
                  <span className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    <span>
                      <span className="block text-[13px] text-muted">
                        {d.label}
                      </span>
                      <span className="text-base text-foreground">{d.value}</span>
                    </span>
                  </span>
                );
                return (
                  <li key={d.label}>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="block text-base transition hover:text-brand"
                      >
                        {body}
                      </a>
                    ) : (
                      body
                    )}
                  </li>
                );
              })
            ) : (
              <li className="text-base text-muted">{t.contact.unavailable}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-line pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-[13px] text-muted">
            © {year} {BUSINESS_NAME}. {t.footer.rights}{" "}
            <Link
              href="/admin/login"
              className="text-[13px] text-muted/50 transition hover:text-muted"
            >
              Admin
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-muted">{t.footer.languages}</span>
            <LanguageSwitcher locale={locale} label={t.footer.languages} />
          </div>
        </div>
      </div>
    </footer>
  );
}
