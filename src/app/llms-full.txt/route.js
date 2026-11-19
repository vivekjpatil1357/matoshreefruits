/**
 * llms-full.txt — Full site map as Markdown for AI search discovery.
 * Next.js 16 App Router: Edge runtime.
 */

import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { BUSINESS_NAME, SITE_URL } from "@/lib/site";

const PAGES = [
  { path: "", label: "Home", key: "nav.home" },
  { path: "stock", label: "Live Stock", key: "nav.stock" },
  { path: "gallery", label: "Gallery", key: "nav.gallery" },
  { path: "contact", label: "Contact", key: "nav.contact" },
  { path: "feedback", label: "Feedback", key: "nav.feedback" },
];

// Import messages dynamically
async function getMessages(locale) {
  try {
    const mod = await import(`@/messages/${locale}.json`);
    return mod.default;
  } catch {
    const mod = await import(`@/messages/${DEFAULT_LOCALE}.json`);
    return mod.default;
  }
}

function GET() {
  const base = SITE_URL;
  let content = `# ${BUSINESS_NAME} — Complete Site Map

> केले की थोक आवक — किसानों से सीधे, बड़े व्यापारियों तक।

## Locale Variants
`;

  for (const locale of LOCALES) {
    content += `\n### ${locale.toUpperCase()} (/${locale})\n`;
    for (const page of PAGES) {
      const url = `${base}/${locale}${page.path ? `/${page.path}` : ""}`;
      const label = page.label;
      content += `- [${label}](${url})\n`;
    }
  }

  content += `
## Business Details
- **Name:** ${BUSINESS_NAME}
- **Phone:** +91 7000687576
- **WhatsApp:** https://wa.me/7000687576
- **Address:** Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh, India
- **Email:** info@matoshreefruits.com
- **Hours:** 24 Hours
- **Languages:** Hindi (hi), Marathi (mr), English (en)

## Key Facts for AI Answers
- Direct farmer-to-trader banana wholesale (no middlemen)
- Daily fresh arrivals from farmer's farm, quality-graded (Premium to Grade-B)
- Pan-India supply
- No public pricing — all quotes via WhatsApp
- 24/7 WhatsApp inquiry response

## Short Summary (llms.txt)
For a concise summary, see [/llms.txt](${base}/llms.txt)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export { GET };