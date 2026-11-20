import { getMessages } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT, BUSINESS_NAME, SITE_URL } from "@/lib/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import SectionHeading from "../components/SectionHeading";
import WhatsAppButton from "../components/WhatsAppButton";
import { PhoneIcon, MapPinIcon, ClockIcon, MailIcon, GlobeIcon } from "../components/Icons";

/** Build BreadcrumbList JSON-LD for contact page. */
function buildBreadcrumbJsonLd({ locale }) {
  const base = SITE_URL;
  const crumbs = [
    { position: 1, name: "Home", url: `${base}/${locale}` },
    { position: 2, name: "Contact", url: `${base}/${locale}/contact` },
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

/** Build ContactPage + FAQPage JSON-LD for contact page. */
function buildContactJsonLd({ locale, t }) {
  const base = SITE_URL;
  const phone = CONTACT.phone || "+91 7000687576";
  const email = CONTACT.email || "info@matoshreefruits.com";
  const address = CONTACT.address || "Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh";
  const hours = CONTACT.hours || "24 Hours";
  const whatsapp = phone.replace(/\D/g, "");

  const faqs = [
    {
      question: t.contact.faq?.q1 || "What are your business hours?",
      answer: t.contact.faq?.a1 || hours,
    },
    {
      question: t.contact.faq?.q2 || "Where are you located?",
      answer: t.contact.faq?.a2 || address,
    },
    {
      question: t.contact.faq?.q3 || "How can I get a price quote?",
      answer: t.contact.faq?.a3 || t.common.noPricing || "Pricing is not public — all quotes via WhatsApp.",
    },
    {
      question: t.contact.faq?.q4 || "What is the minimum order quantity?",
      answer: t.contact.faq?.a4 || "We supply in bulk — typical minimum is one truckload (200+ crates). Contact us for specifics.",
    },
    {
      question: t.contact.faq?.q5 || "Do you arrange transport?",
      answer: t.contact.faq?.a5 || "Yes, we can help coordinate loading and dispatch. Discuss on WhatsApp.",
    },
    {
      question: t.contact.faq?.q6 || "How do I place an order?",
      answer: t.contact.faq?.a6 || "Send your requirement (variety, grade, quantity, delivery location) on WhatsApp. We'll reply with availability and next steps.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${base}/${locale}/contact#page`,
        name: t.contact.heading,
        description: t.contact.sub,
        mainEntity: { "@id": `${base}/#business` },
      },
      {
        "@type": "FAQPage",
        "@id": `${base}/${locale}/contact#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
  };
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = getMessages(locale);
  return pageMetadata({
    locale,
    path: "contact",
    title: t.contact.heading,
    description: t.contact.sub,
  });
}

function ContactCard({ icon: Icon, label, value, href, unavailableLabel }) {
  const body = (
    <span className="flex items-start gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center bg-brand-soft text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-muted">
          {label}
        </span>
        <span
          className={`mt-1 block break-words text-sm font-semibold sm:text-base ${
            value ? "text-foreground" : "text-muted"
          }`}
        >
          {value || unavailableLabel}
        </span>
      </span>
    </span>
  );

  return (
    <div className="border border-line bg-surface p-5 sm:p-6">
      {href ? (
        <a href={href} className="block transition hover:text-brand">
          {body}
        </a>
      ) : (
        body
      )}
    </div>
  );
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = getMessages(locale);

  const cards = [
    {
      icon: PhoneIcon,
      label: t.contact.phone,
      value: CONTACT.phone,
      href: CONTACT.phone ? `tel:${CONTACT.phone.replace(/\s/g, "")}` : "",
    },
    {
      icon: MapPinIcon,
      label: t.contact.address,
      value: CONTACT.address,
      href: "",
    },
    { icon: ClockIcon, label: t.contact.hours, value: CONTACT.hours, href: "" },
    {
      icon: MailIcon,
      label: t.contact.email,
      value: CONTACT.email,
      href: CONTACT.email ? `mailto:${CONTACT.email}` : "",
    },
    { icon: GlobeIcon, label: t.contact.business, value: BUSINESS_NAME, href: "" },
  ];

  // Build JSON-LD schemas
  const breadcrumbJsonLd = JSON.stringify(buildBreadcrumbJsonLd({ locale })).replace(/</g, "\\u003c");
  const contactJsonLd = JSON.stringify(buildContactJsonLd({ locale, t })).replace(/</g, "\\u003c");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: contactJsonLd }}
      />
      <SectionHeading
        as="h1"
        title={t.contact.heading}
        subtitle={t.contact.sub}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <ContactCard key={c.label} {...c} unavailableLabel={t.contact.unavailable} />
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="bg-brand p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">{t.contact.whatsapp}</h2>
          <p className="mt-2 text-base text-white/85">{t.contact.note}</p>
          <div className="mt-6">
            <WhatsAppButton
              href={buildWhatsAppLink(t.whatsapp.greeting)}
              label={t.common.whatsappEnquiry}
              size="lg"
              variant="light"
            />
          </div>
        </div>

        <div className="border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-brand-dark">{t.stock.heading}</h2>
          <p className="mt-2 text-base leading-relaxed text-muted">{t.stock.sub}</p>
          <p className="mt-4 bg-accent-soft px-4 py-3 text-base font-medium text-brand-dark">
            {t.stock.requestRate}
          </p>
          <p className="mt-4 text-base text-muted">{t.common.noPricing}</p>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-brand-dark mb-4">{t.contact.map || 'Our Location'}</h2>
        <div className="w-full aspect-video md:aspect-[4/3] rounded-lg overflow-hidden border border-line">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.267428111592!2d76.31677257526549!3d21.34264468038633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd82d35573b7925%3A0x63ad09ff2083f883!2sShree%20Krushna%20toll%20kata!5e1!3m2!1sen!2sin!4v1795090477877!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t.contact.map || "Matoshree Fruits location"}
          />
        </div>
      </div>
    </div>
  );
}