import { notFound } from "next/navigation";
import { Baloo_2, Mukta } from "next/font/google";
import { LOCALES, DEFAULT_LOCALE, getMessages, isValidLocale } from "@/lib/i18n";
import { INSTAGRAM_URL, CONTACT, BUSINESS_NAME, SITE_URL } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomBar from "./components/BottomBar";
import "../globals.css";

/* Display + body faces — both cover Devanagari (mr/hi) and Latin. */
const baloo = Baloo_2({
  subsets: ["latin", "devanagari"],
  display: "swap",
  variable: "--font-baloo",
});
const mukta = Mukta({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "devanagari"],
  display: "swap",
  variable: "--font-mukta",
});

/** Build site-wide JSON-LD @graph (LocalBusiness + Organization + WebSite). */
function buildJsonLd({ locale, t }) {
  const base = SITE_URL;
  const phone = CONTACT.phone || "+91 7000687576";
  const email = CONTACT.email || "info@matoshreefruits.com";
  const address = CONTACT.address || "Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh";
  const instagram = INSTAGRAM_URL || "";
  const whatsapp = phone.replace(/\D/g, "");

  // Coordinates from Google Maps embed (Shree Krushna toll kata)
  const lat = 21.34264468038633;
  const lng = 76.31677257526549;

  const graph = [
    {
      "@type": ["LocalBusiness", "FoodBusiness", "GroceryStore"],
      "@id": `${base}/#business`,
      name: BUSINESS_NAME,
      alternateName: "मातोश्री फ्रूट्स",
      url: base,
      telephone: phone,
      email: email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shreekrishna toll kata, Sarola",
        addressLocality: "Burhanpur",
        addressRegion: "Madhya Pradesh",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lng,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
      priceRange: "₹₹",
      areaServed: { "@type": "Country", name: "India" },
      sameAs: ["https://wa.me/" + whatsapp, instagram].filter(Boolean),
      description:
        "Farmer-direct wholesale banana trading — daily fresh arrivals from farms, quality graded lots, pan-India dispatch.",
      knowsLanguage: ["hi", "mr", "en"],
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI, Bank Transfer",
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name: BUSINESS_NAME,
      alternateName: "मातोश्री फ्रूट्स",
      inLanguage: ["hi", "mr", "en"],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${base}/{locale}/stock?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: BUSINESS_NAME,
      alternateName: "मातोश्री फ्रूट्स",
      url: base,
      logo: `${base}/icon.png`,
      sameAs: ["https://wa.me/" + whatsapp, instagram].filter(Boolean),
      contactPoint: {
        "@type": "ContactPoint",
        telephone: phone,
        contactType: "customer service",
        availableLanguage: ["Hindi", "Marathi", "English"],
        areaServed: "IN",
      },
    },
  ];

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c"
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getMessages(isValidLocale(locale) ? locale : DEFAULT_LOCALE);
  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.matoshreefruits.com";
  const canonical = `${BASE.replace(/\/$/, "")}/${locale}`;

  return {
    title: {
      default: t.meta.siteName,
      template: `%s | ${t.meta.siteName}`,
    },
    description: t.meta.description,
    metadataBase: new URL(BASE),
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [l, `${BASE.replace(/\/$/, "")}/${l}`])
        ),
        "x-default": `${BASE.replace(/\/$/, "")}/${DEFAULT_LOCALE}`,
      },
    },
  };
}

/** Mobile browser chrome: brand green + let content use the full notch area. */
export const viewport = {
  themeColor: "#2f6b30",
  viewportFit: "cover",
};

/** Root layout for the public site: header, nav, language switcher, footer. */
export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const t = getMessages(locale);
  const whatsappHref = buildWhatsAppLink(t.whatsapp.greeting);
  const phoneHref = CONTACT.phone ? `tel:${CONTACT.phone.replace(/\s/g, "")}` : "";
  const nav = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/stock`, label: t.nav.stock },
    { href: `/${locale}/gallery`, label: t.nav.gallery },
    { href: `/${locale}/feedback`, label: t.nav.feedback },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];

  // Build JSON-LD for this locale
  const jsonLd = buildJsonLd({ locale, t });

  return (
    <html lang={locale} className={`${baloo.variable} ${mukta.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
        {/* Google Tag Manager */}
        <script
          async
          src="https://www.googletagmanager.com/gtm.js?id=GTM-NJRGFT4R"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          {t.common.skipToContent}
        </a>
        <Header
          locale={locale}
          brand={t.meta.siteName}
          nav={nav}
          labels={{
            tagline: t.meta.tagline,
            menu: t.nav.menu,
            closeMenu: t.nav.closeMenu,
            language: t.nav.language,
            whatsapp: t.common.whatsappEnquiry,
            whatsappShort: t.common.whatsappEnquiry,
            call: t.common.call,
          }}
          whatsappHref={whatsappHref}
          phoneHref={phoneHref}
          instagramHref={INSTAGRAM_URL}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} nav={nav} t={t} />
        <BottomBar
          locale={locale}
          labels={{
            label: t.bar.label,
            whatsapp: t.bar.whatsapp,
            call: t.bar.call,
            stock: t.bar.stock,
          }}
          whatsappHref={whatsappHref}
          phoneHref={phoneHref}
        />
      </body>
    </html>
  );
}
