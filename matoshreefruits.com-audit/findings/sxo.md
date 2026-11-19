# SXO (Search Experience Optimization) Audit: Matoshree Fruits

## 1. Executive Summary & Page-Type Mismatch
- **Target URL**: `https://www.matoshreefruits.com/hi` (with `/mr`, `/en` variants)
- **Primary Keyword Intent**: केला थोक (Banana wholesale), केला मंडी भाव (Banana mandi rates), banana wholesale mandi near me.
- **SERP Dominant Page Type**: Directory aggregator listings, agricultural mandi price boards, B2B wholesale directories (IndiaMART, Justdial, local APMC mandi portals).
- **Target Page Type**: Single-page B2B business landing page with static sections (stock, gallery, contact).
- **Mismatch Severity**: **HIGH**. B2B buyers searching for "केला मंडी भाव" or wholesale volume expect real-time daily rate tables, graded quality breakdowns (Robusta, Grand Nain), APMC mandi location details, and bulk RFQ forms, whereas the current page functions as a static brochure.

## 2. User Stories
1. **Bulk Buyer / Trader (Consideration Stage)**: As a fruit wholesaler, I want to see today's live banana rates per quintal/box so that I can compare mandi prices before placing an order. *(Signal: High transactional intent on price queries).*
2. **Local Mandi Buyer (Decision Stage)**: As a regional distributor, I want exact physical location details and direct contact numbers for the loading dock so I can arrange transport. *(Signal: "near me" and local geo-intent).*
3. **Farmer / Supplier (Awareness Stage)**: As a banana farmer, I want to know commission rates, payment terms, and daily unloading schedules so I can sell my produce here. *(Signal: Farmer-direct value proposition).*

## 3. Gap Analysis (SXO Gap Score: 58/100)
- **Page Type (8/15)**: Single-page layout fails to capture long-tail mandi queries or daily rate volatility.
- **Content Depth (7/15)**: Missing daily price ticker, crate/weight specifications, and variety breakdowns.
- **UX Signals (10/15)**: Clean mobile design with WhatsApp CTA, but lacks interactive stock calculators or live updates.
- **Schema (4/15)**: Zero structured data (missing LocalBusiness, Organization, Product).
- **Media (10/15)**: Gallery present, but lacks high-res grading videos and loading dock walkthroughs.
- **Authority (11/15)**: Mentions farmer-direct, but lacks APMC licenses, establishment years, or verified trader badges.
- **Freshness (8/10)**: Stock section exists, but frequency of updates is unclear to searchers.

## 4. Persona Scoring
| Persona | Relevance (25) | Clarity (25) | Trust (25) | Action (25) | Total (100) | Improvement Priority |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **1. Regional Mandi Trader** | 20 | 18 | 15 | 18 | **71** | Add daily rate table per kg/quintal |
| **2. Bulk Exporter / Processor** | 15 | 14 | 12 | 15 | **56** | Add export-grade sorting standards |
| **3. Local Retail Fruit Vendor** | 22 | 20 | 18 | 20 | **80** | Highlight minimum order quantity (MOQ) |
| **4. Banana Farmer / Supplier** | 18 | 16 | 14 | 15 | **63** | Add dedicated seller guidelines & timing |

## 5. Recommendations & Action Plan
1. **Daily Rate & Mandi Pricing Page**: Implement a dynamic table showing daily wholesale rates for Grand Nain / Robusta varieties.
2. **Local & Schema Optimization**: Add `LocalBusiness` and `Product` schema across all 15 locale variants with exact geo-coordinates.
3. **Minimum Order & Logistics Clarity**: Explicitly state truckload capacities, crate counts, and transport facilitation.
