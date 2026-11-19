# Matoshree Fruits — argument + idea (design-taste-frontend steps 1–4)

Direction: `uneven-photographs` (seed 1304246111), palette + type kept from brand.

## Inventory (what only this client has)
- Name: मातोश्री / Matoshree — honored mother-figure; "from Matoshree" = from our own house.
- Product: banana lots (केळी/केले) — bunches, crates, grades Premium/A/B.
- Place: Shreekrishna toll kata, Sarola, Burhanpur (MP) — toll-plaza roadside, market yard trade.
- Constraint that defines it: **no public price, ever** — the rate exists only in the conversation.
- Ritual: bought directly from farmers' farms daily (early morning), sorted, loaded, dispatched — 24 hours.
- Numbers: grades (Premium/Grade A/B), quantity per crate/quintal/truck, 7-day temporary posts.
- Artefacts of its world: weighbridge slip, bilty (transport receipt), crate stencil, the trader's bahi.
- Audience: bulk traders on phones, many low-tech, mr/hi first.

## Argument (claim → proof → section)
1. Claim: We buy banana lots directly from farmers and supply traders in bulk.
   Proof: the day's actual lots — quantity, grade, location — on the first screen.
   Section: hero (photo prints + one line + live stock strip + WhatsApp/Call).
2. Claim: The stock is real, fresh and photographed today.
   Proof: the newest admin-uploaded lot photos, at uneven sizes like prints.
   Section: latest arrivals (staggered pairs — Phase 3).
3. Claim: The trade is simple and direct.
   Proof: three steps — bought directly from farms, sorted & graded, dispatched in bulk.
   Section: how it works (drag row — Phase 3).
4. Claim: No public pricing; ask and get a straight answer.
   Proof: one rates-on-request note (was 4×).
   Section: proof note (Phase 3 — dealt "plain names" blueprint needs names we don't have; will redraw via --alternatives).
5. Claim: Ready to talk.
   Proof: one sentence, one action.
   Section: cta (Phase 3).

## Idea
On this page, **the trader's own photographs of each day's lot** become **prints hung at uneven
heights on a dark leaf field — today's wall**. Competitor test: another vyapari has photos too,
but generic farm stock imagery can't stage *this* day's graded lots; the wall changes only when
Matoshree uploads.

## One live thing
The hero print crossfades through the newest lot photos (changes as admin uploads, differs per
visit), and the live stock strip beneath it shows what is actually available today. Plain
fallback: first photo static / branded leaf-pattern CSS surface. No JS required.

## Phase 1+2 copy deck (final wording, all three locales)
| key | en | mr | hi |
|---|---|---|---|
| hero.heading | Bananas straight from farmers | शेतकऱ्यांकडून थेट केळी | किसानों से सीधे केले |
| hero.sub | Bought directly from farmers' farms every day, supplied in bulk to traders. | रोज शेतकऱ्यांच्या शेतातून थेट खरेदी, व्यापाऱ्यांना थोक पुरवठा. | रोज़ किसानों के खेत से थेट खरीदी, व्यापारियों को थोक सप्लाई. |
| hero.stockTitle | Available today | आज उपलब्ध माल | आज उपलब्ध माल |
| hero.stockEmpty | No lots listed yet — ask us on WhatsApp. | अजून माल सूचीबद्ध नाही — व्हॉट्सअ‍ॅपवर विचारा. | अभी कोई माल नहीं — व्हाट्सएप पर पूछें। |
| common.call | Call now | आत्ता कॉल करा | अभी कॉल करें |
| bar.whatsapp | WhatsApp | व्हॉट्सअ‍ॅप | व्हाट्सएप |
| bar.call | Call | कॉल | कॉल |
| bar.stock | Stock | स्टॉक | स्टॉक |

Removed (orphaned by hero rebuild): hero.eyebrow, hero.chips, hero.primaryCta.

## Settled decisions
- Square corners site-wide (one radius), flat surfaces, no resting shadows, no gradients,
  no eyebrows, no emoji, sentence-case labels, body ≥16px, meta ≥13px.
- Hero = dark leaf field (brand's own deep green, committed band — not a random dark section),
  large 4:5 print right + dimmed 1:1 print left, headline flush bottom-left (clamp 28–40px,
  regular weight), sentence, live stock strip, then WhatsApp (solid) + Call (outline) —
  user-specified outline Call overrides "text link" blueprint.
- Header stays (multi-page working behaviour) but plain solid bar, no blur, one solid action.
- Motion: hero crossfade (signature) + staggered section entry + press feedback, all
  transform/opacity, reduced-motion respected.
