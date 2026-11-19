# Content Quality & On-Page SEO Audit — matoshreefruits.com

## Executive Summary
- **Overall Content Score:** 91 / 100 (high quality, authentic B2B fruit wholesale copy, server-rendered)
- **Top Issue (F6):** Homepage title tag is brand-only (`<title>मातोश्री फ्रूट्स</title>`) with zero keyword modifiers (e.g. केला थोक व्यापारी / Banana Wholesaler Burhanpur)
- **Strengths:** 325+ words server-rendered without JS, clear value proposition (farmer-direct, no middleman, quality grading), multi-lingual support (Hindi, Marathi, English) with native phrasing.

---

## 1. Title Tag & Meta Description Audit

| Page | Locale | Title | Meta Description | Finding |
|------|--------|-------|------------------|---------|
| `/` (`/hi`) | `hi` | `मातोश्री फ्रूट्स` | `मातोश्री फ्रूट्स — किसानों से सीधे मिलने वाले केलों की थोक आवक, उपलब्धता और फ़ोटो/वीडियो अपडेट।` | **F6 (Critical):** Brand-only title, missing keyword intent |
| `/hi/stock` | `hi` | `उपलब्ध स्टॉक — मातोश्री फ्रूट्स` | `अभी उपलब्ध केलों की मात्रा, क्वालिटी और स्थान।` | Good sub-page title |
| `/hi/gallery` | `hi` | `फ़ोटो और वीडियो गैलरी — मातोश्री फ्रूट्स` | `ताज़ी आवक, किसानों के खेत और पैकिंग के असली फ़ोटो।` | Good |
| `/hi/contact` | `hi` | `संपर्क करें — मातोश्री फ्रूट्स` | `फ़ोन, पता और व्यवसाय की जानकारी।` | Good |
| `/en` | `en` | `Matoshree Fruits` | `Matoshree Fruits — farmer-direct wholesale banana stock, availability and photo/video updates.` | Brand-only title |
| `/mr` | `mr` | `मातोश्री फ्रूट्स` | `मातोश्री फ्रूट्स — शेतकऱ्यांकडून थेट मिळणारी केळ्यांची थोक आवक...` | Brand-only title |

### Title Fix Recommendation
In `src/messages/hi.json:3` (and `en.json`, `mr.json`), update default site title and template:
- **Current:** `"siteName": "मातोश्री फ्रूट्स"`
- **Recommended:** `"siteName": "मातोश्री फ्रूट्स — किसानों से सीधे केले थोक सप्लाई | बुरहानपुर"`
- **English:** `"Matoshree Fruits — Wholesale Bananas Direct from Farmers | Burhanpur"`

---

## 2. E-E-A-T & Wholesale Intent Assessment

- **Experience & Expertise:** High authenticity. Copy accurately details agricultural banana trading processes (Grade A/B, G9 Cavendish, direct farm arrival and loading).
- **Authoritativeness:** Clear business location ("Shreekrishna toll kata, Sarola, Burhanpur"), direct phone (+91 7000687576), and WhatsApp connection.
- **Trustworthiness:** Transparent policy — "no public prices, daily rates on request via WhatsApp" clearly reflects the direct wholesale process.

---

## 3. Keyword Opportunities & Content Gaps

1. **Local & Keyword Title Modifiers:**
   - Target terms: `केला थोक सप्लायर` (Banana Wholesale Supplier), `बुरहानपुर सीधे किसान केला सप्लाई` (Burhanpur Direct-Farm Banana Supply), `G9 Banana Supplier India`.
2. **Dedicated FAQs Section:**
   - Missing explicit FAQ blocks for wholesale buyers (minimum order quantity, transport arrangements, loading charges, payment terms).
3. **Daily Availability Page/Section:**
   - A dedicated page for daily farm-direct availability (`/hi/stock`) should clearly show variety, grade, quantity and source updates.

---

## 4. Prioritized Action Plan

1. **[High]** Update brand title in `messages/hi.json`, `mr.json`, and `en.json` with target keywords.
2. **[Medium]** Add structured FAQ block to `/contact` and homepage with clear B2B trade terms.
3. **[Medium]** Create a `/stock` landing section targeting "Banana Wholesale Supplier Madhya Pradesh".
