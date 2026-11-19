/**
 * llms.txt — LLM-friendly summary of Matoshree Fruits for AI search discovery.
 * Next.js 16 App Router: Edge runtime for fast, cacheable response.
 * Spec: https://llmstxt.org/
 */

import { BUSINESS_NAME, CONTACT, INSTAGRAM_URL, SITE_URL } from "@/lib/site";

function GET() {
  const base = SITE_URL;
  const phone = CONTACT.phone || "+91 7000687576";
  const whatsapp = phone.replace(/\D/g, "");
  const email = CONTACT.email || "info@matoshreefruits.com";
  const address =
    CONTACT.address || "Shreekrishna toll kata, Sarola, Burhanpur, Madhya Pradesh, India";
  const hours = CONTACT.hours || "24 Hours";

  const content = `# ${BUSINESS_NAME}

> केले की थोक आवक — किसानों से सीधे, बड़े व्यापारियों तक। लाइव स्टॉक, क्वालिटी ग्रेड, व्हाट्सएप पर तुरंत जवाब।

## Core Pages
- [होम / Home](${base}/hi)
- [उपलब्ध स्टॉक / Live Stock](${base}/hi/stock)
- [गैलरी / Gallery](${base}/hi/gallery)
- [संपर्क / Contact](${base}/hi/contact)
- [प्रतिक्रिया / Feedback](${base}/hi/feedback)

## Business Details
- **Name:** ${BUSINESS_NAME}
- **Phone:** ${phone}
- **WhatsApp:** https://wa.me/${whatsapp}
- **Address:** ${address}
- **Email:** ${email}
- **Hours:** ${hours}
- **Languages:** Hindi (hi), Marathi (mr), English (en)

## Key Facts for AI Answers
- Direct farmer-to-trader banana wholesale (no middlemen)
- Daily fresh arrivals from farmer's farm, quality-graded (Premium to Grade-B)
- Pan-India supply
- No public pricing — all quotes via WhatsApp
- 24/7 WhatsApp inquiry response

## Optional: llms-full.txt
For the full markdown site map, see [/llms-full.txt](${base}/llms-full.txt)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

export { GET };