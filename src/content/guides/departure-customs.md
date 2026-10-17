---
title: Leaving China — Departure & Home Country Customs
date: 2026-06-04
sources:
  - raw/realchinaguide-leaving-china-2026.md
related:
  - wiki/concepts/shopping-tax-refund.md
  - wiki/concepts/trip-planning.md
  - wiki/concepts/transportation.md
volatility: low
verified_against:
  - http://english.customs.gov.cn/
  - http://english.customs.gov.cn/service/guide
  - http://english.customs.gov.cn/statics/e8965bc3-b0df-4394-901e-f8e863f17546.html
  - https://www.cbp.gov/travel/us-citizens/know-before-you-go
  - https://www.cbp.gov/travel/us-citizens/know-before-you-go/prohibited-and-restricted-items
  - https://www.gov.uk/bringing-goods-into-uk-personal-use
last_verified: 2026-09-20
review:
  status: audited
  page_audit: 2026-06-17
  citation_check: null
  notes: "2026-09-20 (review fix): I had widened GACC's hedge into an unconditional safe line. The text read 'so anything made after 1949 is ordinary goods', which changed the source in two ways: 'artifacts and replicas' became 'anything', and 'may be managed as general articles' became 'is'. Cultural-relic export is a compliance risk — a reader who bought a non-replica antique dated 1955 and read that sentence as clearance would have been misled by us, not by the seller. The quotation now stands on its own with an explicit instruction to read it narrowly, and the page says a 1949 date is a reason to expect fewer problems and NOT a guarantee. Generalising a source's hedge is the same error this repo caught on Alipay fee terms in #83 and on the Shigatse permit scope in #86: three times in one week, each time by widening a qualified statement into an unqualified one. --- 2026-09-20: the antiques claim is verified against GACC for the first time, after discovering that this page's primary source was never actually unreachable. Four drift scans (W32, W35, W37, W38) recorded english.customs.gov.cn as TLS-broken; the host serves fine over http:// and fails only over https://, and WebFetch upgrades http to https, so it could never reach the working endpoint. REPLACED: 'Items older than certain thresholds may require export permits' — vague, unsourced, and the 'thresholds' were doing work no source supported. GACC states the actual rule: relics are precious or general; precious relics, revolutionary relics and items detrimental to national honour or unity are prohibited from export outright; general relics need special approval from the State Administration of Cultural Heritage; and verbatim, 'Artifacts and replicas produced after the founding of the People's Republic of China do not fall into cultural relics and may be managed as general articles' — so 1949 is the line that matters to a shopper. NOT WRITTEN IN: the pre-1911 threshold that circulates widely in secondary sources. It does not appear on this GACC page. NARROWED after review: I first wrote that no reachable primary source states it, which overstated what I checked — wiki/qa/audits/departure-customs.md attributes 1795/1911 to the Cultural Relics Protection Law, a different instrument I have NOT read. The accurate position is that the customs source does not carry the threshold and the law that reportedly does has not been checked. Read the law before writing any year threshold in. The GACC page is dated 2005-08-30 — old, but it is the rule they currently publish, and the page says so rather than implying freshness. SCOPE: last_verified BUMPED to 2026-09-20 for the cultural-relic anchor only. Home-country duty-free limits (US/UK/CA figures), departure logistics, and the lithium-battery carry-on rules were NOT re-verified and retain their 2026-06-04 state; page_audit and citation_check unchanged. STILL OPEN: the currency and duty-free-allowance claims on foreign-exchange.md and shopping-tax-refund.md, which cite the same host and are now equally verifiable — not done in this pass."
description: >-
  Leaving China: airport departure steps, home-country duty-free limits,
  high-risk items like traditional medicine and unpermitted antiques, and what
  to declare.
faqs:
  - q: What can't I take out of China?
    a: >-
      High-risk items include traditional Chinese medicines (often confiscated
      by home customs), antiques without an export permit, and counterfeits
      (which risk confiscation and fines at home). Lithium batteries and power
      banks are allowed but must go in carry-on, never checked luggage.
  - q: Will I be taxed on what I bought in China?
    a: >-
      Only if you exceed your home country's duty-free limit — for example
      US$800 for the US, €430 for the EU, or £390 for the UK. Above the limit
      you pay duty on the excess, so keep receipts for purchases over $100 and
      use the Red channel when in doubt.
  - q: Do I need to declare my laptop when leaving China?
    a: >-
      No — a laptop you already owned before the trip doesn't need declaring.
      Declaration is about new purchases that exceed your home country's
      duty-free allowance.
  - q: How early should I get to the airport to leave China?
    a: >-
      Arrive about 3 hours before an international flight. Exit immigration
      usually takes 5–15 minutes, and duty-free shopping is available after you
      clear it. Online check-in opens 24 hours ahead.
category: guide
---

# Leaving China — Departure & Home Country Customs

> Leaving China is easier than arriving, but you need to know: duty-free limits for your home country, prohibited Chinese exports, what to declare, and departure logistics.

---

## Airport Departure Process

1. **Arrive:** 3 hours before international flights
2. **Check-in:** Counter or online (24h before)
3. **Security:** Standard screening
4. **Exit immigration:** Present passport; typically 5-15 minutes
5. **Duty-free shopping:** Available after immigration
6. **Boarding**

---

## Duty-Free Limits by Country

| Country | Duty-Free Limit | Alcohol | Key Notes |
|---------|----------------|---------|-----------|
| USA | $800 | 1L | Tariffs stricter in 2025 |
| EU (Italy, Spain, Germany, France) | 430 EUR | 1L spirits | VAT 20-22% on excess |
| UK | 390 GBP | 42L beer | Post-Brexit rules |
| Canada | CAD $800 | 1.5L wine | Only if absent 7+ days |
| Australia | AUD $900 | 2.25L | Very strict biosecurity |
| Argentina | $500 | - | Electronics often checked |
| Brazil | $500 | - | 50% tax on excess |
| Mexico | $300 | 3L | - |
| Chile | $500 | - | 19% VAT on electronics |

---

## Estimated Duty Costs (If Over Limits)

- **US traveler, $1,200 in purchases:** Excess $400 at ~3% = **$12**
- **EU traveler, 800 EUR laptop:** Excess 370 EUR at 22% VAT = **81 EUR**
- **Canadian traveler, CAD $1,500:** Excess $700, variable rate = **CAD $70-140**

---

## Prohibited & Restricted Exports from China

### High-Risk Items
- **Traditional Chinese medicines:** Likely confiscated by home-country customs; unknown ingredients may contain controlled substances
- **Antiques and cultural relics:** China Customs divides cultural relics into *precious* and *general*. **Precious relics, revolutionary relics, and items judged detrimental to national honour or unity are prohibited from export outright.** General relics may leave only with **special approval from the State Administration of Cultural Heritage**. On post-1949 items GACC says, verbatim: *"Artifacts and replicas produced after the founding of the People's Republic of China do not fall into cultural relics and may be managed as general articles."* Read that narrowly — it covers **artifacts and replicas**, and says they **may be** managed as general articles, not that everything made after 1949 is automatically clear. A 1949 date is a reason to expect fewer problems, **not a guarantee**. Buy from a dealer who can document the date and category, keep the receipt, and do not rely on a market seller's word. (GACC service guide, page dated 2005-08-30 — old, but it is the current published rule.)
- **Counterfeits:** Risk confiscation + fines at home country

### Restricted (Require Care)
- **Lithium batteries:** Must be in carry-on, not checked luggage
- **Power banks:** Carry-on only
- **Alcohol (baijiu):** Check home-country limit; pack in checked bag
- **Tea:** 1-2 kg fine for most countries
- **Food products:** Check biosecurity rules (especially Australia)

---

## Common Questions

| Question | Answer |
|----------|--------|
| Declare my laptop? | No, if you already owned it before the trip |
| Can I bring tea home? | Yes, 1-2 kg is fine for most countries |
| Traditional Chinese medicine? | High risk of confiscation — likely problems |
| Will I be taxed on purchases? | Only if exceeding your country's duty-free limit |
| Forgot to declare something? | Declare retroactively if caught; cooperation reduces penalties |

---

## Consequences of Not Declaring

- **Minor violation, first offense:** Warning
- **Standard violation:** Fine (typically 25-40% of item value)
- **Serious violation:** Confiscation of goods
- **Extremely serious:** Criminal charges (drugs, weapons, endangered species, large-scale smuggling)

> When in doubt, always declare. Honest mistakes with cooperation result in minimal consequences.

---

## Departure Checklist

### 3 Days Before
- [ ] Check flight status on Trip.com or airline app
- [ ] Review customs rules for home country
- [ ] Decide what you're bringing back (within duty-free limit?)
- [ ] Pack restricted items properly (alcohol in checked, batteries in carry-on)
- [ ] Organize receipts for purchases over $100

### 1 Day Before
- [ ] Online check-in (24h before flight)
- [ ] Confirm duty-free limit and what needs declaring
- [ ] Pack lithium batteries and power banks in carry-on
- [ ] Charge all devices

### Day of Departure
- [ ] Arrive 3 hours before international flight
- [ ] Exit immigration (5-15 min)
- [ ] Fill out arrival/customs card on plane for home country
- [ ] Keep receipts accessible for customs if needed

---

## Key Recommendations

### Do
- Keep all receipts for purchases over $100
- Declare items when in doubt
- Pack lithium batteries in carry-on (never checked bag)
- Research home country customs rules before shopping
- Be honest with customs officers
- Use Red channel if over duty-free limit

### Do Not
- Buy traditional medicines with unknown ingredients
- Buy counterfeits (risk confiscation + fines at home)
- Pack power banks in checked luggage
- Try to hide purchases
- Buy antiques without expert verification
- Lie to customs officers

---

## See Also

- [[wiki/concepts/shopping-tax-refund.md]] — VAT refund before departure, eligible goods
- [[wiki/concepts/trip-planning.md]] — Overall trip planning
- [[wiki/concepts/transportation.md]] — Getting to the airport
