---
category: guide
title: SIM Card and eSIM in China for Foreign Visitors
description: "Best eSIM and SIM card options for China travel 2026: pricing, carriers, setup steps, and how to bypass the Great Firewall without a VPN."
date: 2026-05-02
last_verified: 2026-05-02
verified_against:
  - https://www.airalo.com/china-esim
  - https://esim.holafly.com/esim-china/
  - https://cellulardata.ubigi.com/travel-to-china/internet-and-esim-data-plans-china/
  - https://chinaguidelines.com/en/posts/sim
  - https://www.trip.com/guide/phone/china-sim-card.html
  - https://www.china-briefing.com/news/the-essential-mobile-numbers-in-china-for-foreigners
sources:
  - raw/12306-guide-for-foreign-business-visitors-2025.md
  - raw_posts/2026-W18/travelchina.json
related:
  - wiki/concepts/mobile-payment.md
  - wiki/concepts/internet-connectivity.md
volatility: high
review:
  status: audited
  page_audit: 2026-05-02
  citation_check: null
---

# SIM Card and eSIM in China for Foreign Visitors

Foreign visitors have three connectivity options in mainland China, each with different setup, cost, and Great Firewall implications.

## Quick Decision

| Option | Best for | GFW bypass | Setup time |
|---|---|---|---|
| **Foreign eSIM** (Airalo, Holafly, Ubigi) | Trips ≤ 30 days; visitors who don't need a +86 phone number | ✅ Yes — data routes through gateways outside mainland China, so Google / YouTube / Gmail / WhatsApp work without a separate VPN | ~2 minutes (QR install) |
| **Local physical SIM** | Stays > 30 days; anyone signing up for Alipay / WeChat Pay accounts that prefer +86 numbers, or apps gated by SMS-to-+86 | ❌ No — Chinese-network traffic; needs a separate VPN for blocked sites | 15–30 minutes (in-person, passport + biometric) |
| **International roaming** | Stays under a week with light data needs | Carrier-dependent (usually no) | None |

A Chinese phone number is more useful than it looks: many domestic services (12306 train booking, DiDi tour mode, attraction ticketing, hotel front-desk WeChat groups) fall back to SMS verification on a +86 number. Alipay and WeChat Pay both accept foreign numbers in 2026, but some sub-features remain +86-only.

## Foreign eSIM (Recommended for Most Tourists)

These eSIMs route data through gateways outside mainland China, so blocked sites work natively — no VPN required.

| Provider | Network used | Sample plans (2026-05) | Coverage |
|---|---|---|---|
| **Airalo** | China Unicom | 1 GB / 3d for **$4**; 5 GB / 7d for **$14.50**; 20 GB / 30d for **$40**; 50 GB / 30d for **$49** | Mainland only |
| **Holafly** | China Mobile (CMCC) | Unlimited / 3d for **$11.70**; / 7d for **$27.30**; / 30d for **$74.90** (with 1 GB/day hotspot share) | Mainland only — no Hong Kong or Taiwan |
| **Ubigi** | China Mobile / Unicom | 1 GB / 7d for **€4**; 3 GB / 30d for **€8**; 20 GB / month for **€19**; unlimited 7d for **€26** | Mainland; some plans extend region-wide |

**How to activate.** Install the eSIM by QR before departure. The eSIM stays inactive until you arrive in mainland China and toggle data on — at that moment the validity clock starts. Phone must be eSIM-capable (iPhone XS or newer, Pixel 3 or newer, recent Samsung Galaxy).

**Trade-off.** A foreign eSIM gives you data only — no +86 phone number. If you need one for Chinese-app sign-ups, get a physical SIM in addition.

## Local Physical SIM

### The Three State Carriers

China's mobile market is split among three state-owned operators. For a short-term tourist, none is dramatically better than the others — pick by store proximity unless you have a specific need.

| Carrier | Strengths | Customer hotline |
|---|---|---|
| China Mobile (CMCC) | Widest rural / inland coverage | 10086 |
| China Unicom | Historically the most foreign-phone-friendly; Airalo's eSIM partner | 10010 |
| China Telecom | Strong urban and southern China; English support on hotline | 10000 |

### Where to Buy

| Channel | Cost | Speed | Notes |
|---|---|---|---|
| **Airport carrier counter** (PEK, PVG, CAN, CTU, CKG, etc.) | ~20–30% premium over city stores | 15–20 min | Convenient on arrival; English-speaking staff in tier-1 airports |
| **Carrier flagship store in the city** | Lowest | 30–45 min | More plan options; English support is hit-or-miss outside tier-1 cities |
| **Hotel desk / unauthorized reseller** | Variable | Fast but risky | Often resells previously-registered numbers — **avoid** unless verified by a trusted hotel |

### Required Documents

- Original passport (no copies accepted)
- A valid Chinese visa or entry stamp
- A Chinese address — your hotel is fine; required for the registration form

### Real-Name Registration

Every Chinese SIM has been tied to a verified identity since 2019. At the carrier counter you will:

1. Have your passport scanned.
2. Sit for a live face photo, which is matched in real time against the passport photo.
3. Sign a Chinese-language customer agreement (the agent will translate the key clauses verbally).

Activation takes 15–30 minutes. There is **no remote / online registration path** for a foreign passport — it has to be in person.

### Typical Prepaid Plans (2026, RMB)

| Plan style | Example | Price | Best channel |
|---|---|---|---|
| Tourist short-term | 7 days, 30 GB + 100 voice min | ~¥100 | Airport counter, city flagship |
| Standard monthly | 30 days, 30–50 GB | ¥30–100 | Any carrier store |
| Premium monthly | 30 days, 100+ GB + ample voice | ¥100–300 | Carrier app or store |

Most prepaid plans **do not auto-charge** — if your balance hits zero, the number suspends and only re-activates after a top-up.

### Top-Up

- Carrier app (China Mobile / Unicom / Telecom — all have English UI)
- Alipay or WeChat Pay → *Mobile Recharge* mini-program (works once your wallet is set up; see [[wiki/concepts/mobile-payment.md]])
- Convenience-store self-service kiosks (Chinese-only UI)
- Carrier store counter (cash or card)

## Common Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| Registration rejected at counter | Passport not yet stamped (border-control hiccup), or visa expired | Resolve entry status first; some stores require the entry stamp visible |
| SMS verification codes don't arrive | Carrier's anti-spam filter on overseas-relayed SMS, or roaming gateway issue | Receive on a different carrier briefly, or use a Chinese friend's number |
| Data works but Google / YouTube don't | Expected — Chinese SIM goes through the Great Firewall | Use a VPN, or run a foreign eSIM in parallel |
| eSIM QR scanned but no service | eSIM activated before arrival; the validity clock started early | Most providers reset on first in-country tower attach — contact provider support if not |
| Number suspended after months unused | Carriers auto-reclaim long-dormant prepaids | Top up at least every 90 days; otherwise expect a fresh number next visit |

## Hong Kong, Macau, and Taiwan

Mainland Chinese SIMs **do not work** in Hong Kong, Macau, or Taiwan without a separate roaming add-on — these are different jurisdictions despite the "China" branding. Travelers crossing the border should plan for separate connectivity (a dedicated HK SIM, a roaming pack, or one of Airalo / Ubigi's separate Hong Kong / Asia regional eSIM plans).

## Connectivity and the Great Firewall

A Chinese SIM gives you Chinese-network internet, which blocks most non-Chinese services:

- Google (Search, Gmail, YouTube, Maps, Drive)
- Meta (Facebook, Instagram, WhatsApp, Threads)
- X / Twitter, the global version of TikTok, Reddit
- Most non-Chinese news sites

To access these on a Chinese SIM you need a VPN. Practically: install one **before** you arrive, since most commercial VPN provider sites and app store entries are themselves blocked from inside China. A foreign eSIM sidesteps this entirely.

See also: [[wiki/concepts/internet-connectivity.md]] for a full breakdown of the Great Firewall, VPN options, and apps that work without a VPN.
