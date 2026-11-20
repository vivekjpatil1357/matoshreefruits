/**
 * Shared page metadata for the public (`/[locale]`) routes.
 *
 * Why this exists: Next.js merges metadata from route segments **shallowly** —
 * a key a child defines replaces the parent's value wholesale, and a key the
 * child omits is inherited. `alternates` is one such key, so scoping it to
 * `/${locale}` in `[locale]/layout.js` meant every subpage inherited a
 * canonical *and* a full hreflang cluster that all pointed at the homepage —
 * telling search engines that /hi/stock, /mr/stock and /en/stock were all
 * duplicates of /hi. Each page now passes its own `path` so canonical and
 * hreflang are page-accurate.
 *
 * `openGraph` / `twitter` had the same inheritance hazard and were absent
 * entirely. Building them here alongside `alternates` keeps `og:url` and the
 * canonical in lockstep by construction.
 */
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { SITE_URL, BUSINESS_NAME } from "@/lib/site";

/** Landscape social card already shipped in /public. */
const OG_IMAGE = { width: 1600, height: 1032 };

/** Open Graph wants underscore locales (hi → hi_IN). */
const OG_LOCALE = { hi: "hi_IN", mr: "mr_IN", en: "en_IN" };

/** Absolute URL for one page. `path` may be given with or without a slash. */
function pageUrl(locale, path = "") {
  const suffix = path.replace(/^\/+|\/+$/g, "");
  return `${SITE_URL}/${locale}${suffix ? `/${suffix}` : ""}`;
}

/**
 * Full metadata for a page: title, description, canonical + hreflang cluster
 * (including x-default) and matching Open Graph / Twitter cards.
 *
 * @param {string} locale current locale
 * @param {string} path route path below the locale, e.g. `"stock"` ("" = home)
 * @param {string} title page title — the parent template renders it as
 *   `"<title> | <brand>"`, so it should NOT include the brand
 * @param {string} description meta description (also used for the cards)
 * @param {string} [socialTitle] final card title; defaults to
 *   `"<title> | <brand>"`. Pass it explicitly for titles that already carry
 *   the brand (the homepage), otherwise the brand renders twice.
 */
export function pageMetadata({ locale, path = "", title, description, socialTitle }) {
  const url = pageUrl(locale, path);
  const image = `${SITE_URL}/hero-leaves.jpg`;
  const cardTitle = socialTitle || `${title} | ${BUSINESS_NAME}`;

  return {
    // String, not URL: cacheComponents serializes generateMetadata returns.
    metadataBase: SITE_URL,
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, pageUrl(l, path)])),
        "x-default": pageUrl(DEFAULT_LOCALE, path),
      },
    },
    openGraph: {
      url,
      siteName: BUSINESS_NAME,
      title: cardTitle,
      description,
      locale: OG_LOCALE[locale] || OG_LOCALE[DEFAULT_LOCALE],
      type: "website",
      images: [{ url: image, width: OG_IMAGE.width, height: OG_IMAGE.height, alt: BUSINESS_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description,
      images: [image],
    },
  };
}
