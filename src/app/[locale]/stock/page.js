import { getMessages } from "@/lib/i18n";
import { getStockItems } from "@/lib/content";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SITE_URL, BUSINESS_NAME } from "@/lib/site";
import SectionHeading from "../components/SectionHeading";
import StockBrowser from "../components/StockBrowser";
import WhatsAppButton from "../components/WhatsAppButton";
import EmptyState from "../components/EmptyState";
import { BoxIcon } from "../components/Icons";

/** Build BreadcrumbList JSON-LD for stock page. */
function buildBreadcrumbJsonLd({ locale }) {
  const base = SITE_URL;
  const crumbs = [
    { position: 1, name: "Home", url: `${base}/${locale}` },
    { position: 2, name: "Stock", url: `${base}/${locale}/stock` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c) => ({
      "@type": "ListItem",
      position: c.position,
      name: c.name,
      item: c.url,
    })),
  };
}

/** Build ItemList + Product JSON-LD for stock items. */
function buildStockJsonLd({ locale, items, t }) {
  const base = SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${base}/${locale}/stock#list`,
    name: t.stock.heading,
    description: t.stock.sub,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        "@id": `${base}/${locale}/stock#${item._id}`,
        name: `${item.variety} — ${item.quality} (${item.quantity} ${item.unit})`,
        description: `${item.quality} grade ${item.variety} at ${item.location}`,
        brand: { "@type": "Brand", name: BUSINESS_NAME },
        offers: {
          "@type": "Offer",
          availability: item.available
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
          priceCurrency: "INR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            priceCurrency: "INR",
            description: "Rate on request — contact via WhatsApp",
          },
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Quality", value: item.quality },
          { "@type": "PropertyValue", name: "Location", value: item.location },
          { "@type": "PropertyValue", name: "Quantity", value: `${item.quantity} ${item.unit}` },
          { "@type": "PropertyValue", name: "Variety", value: item.variety },
        ],
      },
    })),
  };
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getMessages(locale);
  return { title: t.stock.heading, description: t.stock.sub };
}

export default async function StockPage({ params }) {
  const { locale } = await params;
  const t = getMessages(locale);
  const items = await getStockItems({ limit: 60 });

  // Build JSON-LD schemas
  const breadcrumbJsonLd = JSON.stringify(buildBreadcrumbJsonLd({ locale })).replace(/</g, "\\u003c");
  const stockJsonLd = JSON.stringify(buildStockJsonLd({ locale, items, t })).replace(/</g, "\\u003c");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stockJsonLd }}
      />
      <SectionHeading
        title={t.stock.heading}
        subtitle={t.stock.sub}
        action={
          <WhatsAppButton
            href={buildWhatsAppLink(t.whatsapp.stockEnquiry)}
            label={t.common.whatsappEnquiry}
            variant="outline"
            className="shrink-0"
          />
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={BoxIcon}
          title={t.stock.empty}
          text={t.common.noPricing}
          action={
            <WhatsAppButton
              href={buildWhatsAppLink(t.whatsapp.stockEnquiry)}
              label={t.common.whatsappEnquiry}
            />
          }
        />
      ) : (
        <>
          <StockBrowser items={items} locale={locale} t={t} />
          <p className="mt-8 bg-accent-soft px-4 py-3 text-center text-base font-medium text-brand-dark">
            {t.stock.requestRate}
          </p>
        </>
      )}
    </div>
  );
}