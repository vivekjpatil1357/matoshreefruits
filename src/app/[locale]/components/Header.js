"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import WhatsAppButton from "./WhatsAppButton";
import { MenuIcon, CloseIcon, InstagramIcon, WhatsAppIcon, PhoneIcon } from "./Icons";

/**
 * Site header: brand, primary nav, language switcher and the WhatsApp CTA.
 * Collapses into a drawer on mobile.
 *
 * @param {Array<{href: string, label: string}>} nav
 */
export default function Header({ locale, brand, nav, labels, whatsappHref, phoneHref, instagramHref }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === `/${locale}`
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
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
              priority
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold tracking-tight text-brand-dark sm:text-base">
              {brand}
            </span>
            <span className="hidden text-[13px] text-muted xl:block">
              {labels.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-brand-soft text-brand-dark"
                    : "text-muted hover:bg-brand-soft/60 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={labels.language} />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labels.whatsapp}
            className="hidden h-12 w-12 place-items-center bg-brand text-white transition hover:bg-brand-dark active:scale-[0.98] lg:grid"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          {phoneHref && (
            <a
              href={phoneHref}
              aria-label={labels.call || "Call"}
              className="hidden h-12 w-12 place-items-center border border-line bg-background text-brand-dark transition hover:bg-brand-soft active:scale-[0.98] lg:grid"
            >
              <PhoneIcon className="h-5 w-5" />
            </a>
          )}
          {instagramHref && (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hidden h-12 w-12 place-items-center border border-line bg-background text-brand-dark transition hover:bg-brand-soft hover:text-brand active:scale-[0.98] lg:grid"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? labels.closeMenu : labels.menu}
            className="grid h-12 w-12 place-items-center border border-line bg-background text-brand-dark transition hover:bg-brand-soft active:scale-[0.98] xl:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface px-4 pb-5 pt-3 xl:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`px-3 py-3.5 text-base font-medium transition ${
                    active
                      ? "bg-brand-soft text-brand-dark"
                      : "text-foreground hover:bg-brand-soft/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <WhatsAppButton
              href={whatsappHref}
              label={labels.whatsapp}
              size="lg"
              className="w-full"
            />
            {phoneHref && (
              <a
                href={phoneHref}
                className="inline-flex w-full items-center justify-center gap-2 border border-brand/40 px-7 py-3.5 text-base font-semibold text-brand-dark transition hover:bg-brand-soft active:scale-[0.98] sm:w-auto"
              >
                <PhoneIcon className="h-5 w-5" />
                {labels.call || "Call"}
              </a>
            )}
          </div>
          {instagramHref && (
            <div className="mt-2">
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-12 w-12 place-items-center border border-line bg-background text-brand-dark transition hover:bg-brand-soft hover:text-brand"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
