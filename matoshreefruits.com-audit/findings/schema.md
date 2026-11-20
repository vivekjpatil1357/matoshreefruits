# Schema.org Structured Data Audit — matoshreefruits.com

> **Implementation status updated 2026-11-20:** The zero-schema result below
> is historical. JSON-LD now exists in the locale layout and public listing
> pages; see [`../STATUS-UPDATE-2026-11-20.md`](../STATUS-UPDATE-2026-11-20.md).

> **Status vs repo (`ab454ed`, verified 2026-11-11):** **Still open.** No
> `application/ld+json`, microdata or RDFa anywhere in `src/` — none of the
> recommended schema types are implemented yet. The ready-to-paste snippets
> below still match the code's import surface (`@/lib/site` exports
> `BUSINESS_NAME`, `CONTACT`, `INSTAGRAM_URL`, `SITE_URL`).

## 1. Detection Results

| Page | JSON-LD Blocks | Microdata | RDFa | Status |
|------|----------------|-----------|------|--------|
| Homepage (`/hi`) | 0 | 0 | 0 | **Zero schema** |
| Contact (`/hi/contact`) | 0 | 0 | 0 | **Zero schema** |
| Stock (`/hi/stock`) | 0 | 0 | 0 | **Zero schema** |
| Gallery (`/hi/gallery`) | 0 | 0 | 0 | **Zero schema** |

**Source**: Raw HTML in `matoshreefruits.com-audit/homepage.html` — no `<script type="application/ld+json">` present.

---

## 2. Validation Summary

No schema to validate. All pages fail the baseline (F4: zero structured data).

---

## 3. Missing Opportunities — Recommended Schema Types

| Type | Priority | Reason |
|------|----------|--------|
| `LocalBusiness` + `FoodBusiness` + `GroceryStore` | **Critical** | Core entity for Google Local pack / Maps; banana wholesale is a grocery/food business |
| `Organization` | **Critical** | Brand entity; feeds Knowledge Panel |
| `WebSite` + `WebPage` | **High** | Enables Sitelinks Searchbox; page-level metadata |
| `BreadcrumbList` | **High** | All locale pages have clear hierarchy (`/hi/stock`, `/hi/gallery`, `/hi/contact`) |
| `ContactPage` (on `/contact`) | **Medium** | Explicit contact page markup |
| `ItemList` (on `/stock`, `/gallery`) | **Medium** | Product/media listings |
| `Product` (on `/stock` items) | **Medium** | Individual banana lots with quantity/quality/location |
| `ImageObject` / `VideoObject` (on `/gallery`) | **Medium** | Gallery media items |

---

## 4. Real Business Data (from repo)

```json
{
  "name": "Matoshree Fruits",
  "alternateName": "मातोश्री फ्रूट्स",
  "url": "https://www.matoshreefruits.com",
  "telephone": "+91 7000687576",
  "email": "info@matoshreefruits.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shreekrishna toll kata, Sarola",
    "addressLocality": "Burhanpur",
    "addressRegion": "Madhya Pradesh",
    "addressCountry": "IN",
    "postalCode": ""
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 21.3150,
    "longitude": 76.2200
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  ],
  "priceRange": "₹₹",
  "areaServed": {
    "@type": "Country",
    "name": "India"
  },
  "sameAs": [
    "https://wa.me/7000687576"
  ],
  "description": "Farmer-direct wholesale banana trading — daily fresh arrivals, quality graded lots, pan-India dispatch.",
  "knowsLanguage": ["hi", "mr", "en"]
}
```

> **Note**: Lat/long approximated to Burhanpur, MP centroid. Replace with exact coordinates when available.

---

## 5. Ready-to-Paste JSON-LD (Root Layout Injection)

Add to `src/app/[locale]/layout.js` inside the `<html>` or `<body>` — per Next.js 16 [JSON-LD guide](file:///C:/Users/vivek/OneDrive/Desktop/Projects/matoshreefruits/node_modules/next/dist/docs/01-app/02-guides/json-ld.md), use a native `<script>` tag with `dangerouslySetInnerHTML`.

```javascript
// In src/app/[locale]/layout.js — import at top
import { BUSINESS_NAME, CONTACT, INSTAGRAM_URL, SITE_URL } from '@/lib/site';

// Inside LocaleLayout component, before return:
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'FoodBusiness', 'GroceryStore'],
      '@id': `${SITE_URL}/#business`,
      name: BUSINESS_NAME,
      alternateName: 'मातोश्री फ्रूट्स',
      url: SITE_URL,
      telephone: CONTACT.phone,
      email: CONTACT.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shreekrishna toll kata, Sarola',
        addressLocality: 'Burhanpur',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 21.3150,
        longitude: 76.2200
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        opens: '00:00',
        closes: '23:59'
      },
      priceRange: '₹₹',
      areaServed: { '@type': 'Country', name: 'India' },
      sameAs: [
        'https://wa.me/7000687576',
        INSTAGRAM_URL || undefined
      ].filter(Boolean),
      description: 'Farmer-direct wholesale banana trading — daily fresh arrivals, quality graded lots, pan-India dispatch.',
      knowsLanguage: ['hi', 'mr', 'en'],
      currenciesAccepted: 'INR',
      paymentAccepted: 'Cash, UPI, Bank Transfer'
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: BUSINESS_NAME,
      alternateName: 'मातोश्री फ्रूट्स',
      inLanguage: ['hi', 'mr', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/{locale}/stock?q={search_term_string}` },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: BUSINESS_NAME,
      alternateName: 'मातोश्री फ्रूट्स',
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      sameAs: [
        'https://wa.me/7000687576',
        INSTAGRAM_URL || undefined
      ].filter(Boolean),
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: CONTACT.phone,
        contactType: 'customer service',
        availableLanguage: ['Hindi', 'Marathi', 'English'],
        areaServed: 'IN'
      }
    }
  ]
};

// In JSX, add inside <html> or <body>:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  }}
/>
```

---

## 6. Page-Specific JSON-LD (Add to Each Page)

### `/contact` — ContactPage

```javascript
const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${SITE_URL}/${locale}/contact#page`,
  name: t.contact.heading,
  description: t.contact.sub,
  mainEntity: { '@id': `${SITE_URL}/#business` }
};
```

### `/stock` — ItemList + Product (loop over stock items)

```javascript
const stockJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/${locale}/stock#list`,
  name: t.stock.heading,
  description: t.stock.sub,
  numberOfItems: stockItems.length,
  itemListElement: stockItems.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      '@id': `${SITE_URL}/${locale}/stock#${item.id}`,
      name: `Banana — ${item.quality} (${item.quantity} ${item.unit})`,
      description: `${item.quality} grade bananas at ${item.location}`,
      brand: { '@type': 'Brand', name: BUSINESS_NAME },
      offers: {
        '@type': 'Offer',
        availability: item.available ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
        priceCurrency: 'INR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          priceCurrency: 'INR',
          description: 'Rate on request — contact via WhatsApp'
        }
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Quality', value: item.quality },
        { '@type': 'PropertyValue', name: 'Location', value: item.location },
        { '@type': 'PropertyValue', name: 'Quantity', value: `${item.quantity} ${item.unit}` }
      ]
    }
  }))
};
```

### `/gallery` — ImageObject / VideoObject (loop over media)

```javascript
const galleryJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/${locale}/gallery#list`,
  name: t.gallery.heading,
  itemListElement: mediaItems.map((m, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: m.type === 'video' ? {
      '@type': 'VideoObject',
      '@id': `${SITE_URL}/${locale}/gallery#${m.id}`,
      name: m.caption || 'Matoshree Fruits gallery video',
      description: m.caption,
      thumbnailUrl: m.thumbnailUrl,
      contentUrl: m.videoUrl,
      uploadDate: m.createdAt
    } : {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/${locale}/gallery#${m.id}`,
      name: m.caption || 'Matoshree Fruits gallery photo',
      description: m.caption,
      contentUrl: m.imageUrl,
      thumbnailUrl: m.thumbnailUrl,
      datePublished: m.createdAt
    }
  }))
};
```

---

## 7. Next.js 16 Injection Convention (per bundled docs)

- **Do NOT** use `next/script` — JSON-LD is structured data, not executable JS.
- Use native `<script type="application/ld+json">` with `dangerouslySetInnerHTML`.
- Sanitize: `JSON.stringify(obj).replace(/</g, '\\u003c')`.
- Place in **layout.js** (site-wide) or **page.js** (page-specific).
- For locale-specific values, build the object inside the Server Component (has access to `params.locale` and messages).

---

## 8. Validation Checklist (Post-Implementation)

- [ ] Rich Results Test: `https://search.google.com/test/rich-results`
- [ ] Schema Markup Validator: `https://validator.schema.org/`
- [ ] Test each locale: `/hi`, `/mr`, `/en`
- [ ] Verify `@id` URIs are absolute and deduplicated across `@graph`
- [ ] Confirm `sameAs` only includes live profiles (Instagram is empty → omit)
- [ ] Check `geo` coordinates match actual location