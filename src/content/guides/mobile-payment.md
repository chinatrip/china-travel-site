---
title: Mobile Payment for Foreign Visitors (Alipay, WeChat Pay)
date: 2026-06-15
last_verified: 2026-07-17
verified_against:
  - https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html
  - https://english.beijing.gov.cn/specials/paymentservices/news/202505/t20250528_4100629.html
  - https://www.trip.com/guide/phone/how-to-use-alipay.html
  - https://render.alipay.com/p/c/k0mtcsgi/1572520436172.html
  - https://render.alipay.com/p/c/k2ffmmxp
  - https://www.chinavigators.com/wechat-pay-foreigners-guide/
  - https://m.unionpayintl.com/ZT/en/NHCAPP/
  - https://www.unionpayintl.com/cn/mediaCenter/newsCenter/companyNews/3016318.shtml
  - https://wise.com/en-cn/blog/alipay-fee-international-cards
  - https://wise.com/sg/blog/link-wise-card-alipay-wechat-china
  - https://wise.com/us/blog/alipay-limit
  - https://english.beijing.gov.cn/specials/paymentservices/news/202404/t20240429_3645653.html
  - https://www.dragontrail.com/resources/blog/how-to-get-a-wechat-account-from-overseas
  - https://www.airalo.com/blog/access-google-china
sources:
  - raw/12306-guide-for-foreign-business-visitors-2025.md
  - raw_posts/2026-W18/travelchina.json
  - raw/wechat-paypal-integration-2026.md
  - raw/shuimu-foreign-card-payment-guide-2026.md
  - raw/realchinaguide-payment-guide-2026.md
  - raw/realchinaguide-tech-setup-2026.md
  - raw/realchinaguide-money-costs-2026.md
  - raw/realchinaguide-troubleshooting-2026.md
related:
  - wiki/concepts/payment-failures.md
  - wiki/concepts/foreign-exchange.md
  - wiki/entities/alipay.md
  - wiki/entities/wechat.md
  - wiki/entities/tenpaygo.md
  - wiki/concepts/remote-work-china.md
  - wiki/concepts/sim-card.md
volatility: high
review:
  status: audited
  page_audit: 2026-06-15
  citation_check: 2026-07-02
  notes: "2026-07-17: Added two reader-facing sections per traveler feedback — (1) a 'Which payment method works where?' scenario matrix grounded in the existing Quick Decision / 'Where Mobile Pay Doesn't Work' / PBOC-mandate content (no new claims), and (2) an 'Is it safe to link a foreign card?' section framing card-linking as pay-as-you-go authorization rather than a stored balance, with device-bound security described as a layer not a guarantee (consistent with the Lost Phone section) and binding a foreign card recommended over opening a domestic account. No new external source added; other sections not re-verified this round; page_audit unchanged. --- 2026-07-02: focused re-verify with the TenPayGo addition — re-confirmed anchor Tier-1 facts (gov.cn April 2024 $5,000/$50,000 caps + foreign-card POS mandate; ¥200/3% threshold via the Beijing May 2025 circular); no policy reversal since the 2026-06-15 audit. Limit tables, refund windows, and failure modes retain their 2026-06-15 page_audit."
description: >-
  Foreign visitors can bind a Visa/Mastercard to Alipay or WeChat Pay since the
  April 2024 PBOC policy. 0% fee under ¥200, 3% over, plus how to fix failed
  payments. Updated May 2026.
faqs:
  - q: >-
      Can foreigners use Alipay or WeChat Pay in China without a Chinese bank
      account?
    a: >-
      Yes. Since the April 2024 PBOC policy you can bind a foreign Visa,
      Mastercard, JCB, Diners Club or Discover card directly to Alipay or WeChat
      Pay — no Chinese bank account or Chinese SIM needed. You register with
      your own foreign mobile number.
  - q: Why does my Alipay or WeChat Pay payment keep failing in China?
    a: >-
      One common cause is paying to a vendor's personal QR code, which
      foreign-card wallets cannot send to — only merchant codes work. A
      turned-on VPN can also block payments, so switch it off when paying.
  - q: How much does it cost to pay with a foreign card on Alipay or WeChat Pay?
    a: >-
      Transactions under ¥200 have no fee; transactions of ¥200 or more carry
      about a 3% surcharge. To avoid it, ask the merchant to split the bill into
      amounts below ¥200.
  - q: Should I still bring cash to China?
    a: >-
      Mobile pay is accepted almost everywhere, but carry ¥200-500 in small
      bills as a backup for small vendors, older taxis, and the occasional
      payment failure. Tier-1 cities almost never need it; tier-2 and below
      occasionally do.
category: guide
---

# Mobile Payment for Foreign Visitors (Alipay, WeChat Pay)

China runs on QR-code mobile payment. Since a major People's Bank of China (PBOC) policy shift in **April 2024**, foreign visitors can pay almost anywhere by binding a regular Visa or Mastercard directly to **Alipay** or **WeChat Pay** — no Chinese bank account, no prepaid wallet, no Chinese SIM required.

## How should foreigners pay in China?

| Option | Best for | Setup time | Foreign cards accepted | Key fees |
|---|---|---|---|---|
| **Alipay** + foreign card | First choice; widest merchant acceptance | 5–10 min in-app | Visa, Mastercard, JCB, Diners Club, Discover; AMEX bindable but limited merchant acceptance | 0% on payments < ¥200; **3% surcharge on the full amount** for payments ≥ ¥200 (plus your card's FX fee) |
| **WeChat Pay** + foreign card | Pair with chat, Mini Programs; receive transfers from contacts | 5–10 min in-app | Visa, Mastercard, JCB, Diners Club, Discover; AMEX bindable but limited merchant acceptance | Same 0% / 3% threshold as Alipay |
| **Foreign card swipe at POS** | 3-star+ hotels, 4A/5A attractions, tourist resorts (mandated by PBOC 2024) | None | Visa, Mastercard (mandated); JCB widely accepted at POS but not covered by the mandate | No app surcharge; your card's FX fee applies |
| **RMB cash** | Small-vendor fallback; some taxis, street stalls | Withdraw at ATM | n/a | ATM withdrawal fee + FX spread |

For both Alipay and WeChat Pay, **AMEX is bindable but merchant acceptance is uneven** — keep a Visa or Mastercard as primary and treat AMEX as backup.

**Set up both Alipay and WeChat Pay before arrival.** Different merchants accept different apps, SMS verification is more reliable on a foreign carrier than on a fresh Chinese SIM, and WeChat may trigger a contact-vouching step during registration from a foreign number — arrange a qualifying contact before departure if possible.

## Which payment method works where?

Foreign cards behave differently by venue. This maps everyday situations to what actually works — ✅ works, ⚠️ conditional, ❌ won't work — and where cash is the safe fallback. Alipay and WeChat Pay behave almost identically, so they share a column.

| Where you're paying | Alipay / WeChat Pay + foreign card | Foreign card at POS / tap | Cash |
|---|---|---|---|
| Big stores, chains, sit-down restaurants (scan a QR) | ✅ | ⚠️ larger malls & hotels | ✅ |
| Street stalls, small vendors | ⚠️ merchant QR only — a personal collect code will refuse | ❌ | ✅ safest |
| Older street-hail taxis | ⚠️ many have no working QR | ❌ | ✅ |
| DiDi ride-hailing | ✅ paid inside the app | ❌ | — |
| Metro, Tier-1 cities (Beijing, Shanghai, etc.) | ✅ via the metro mini-program QR | ⚠️ some gates take foreign contactless tap — see [[wiki/concepts/transportation.md]] | ✅ ticket machine |
| Metro, smaller cities | ❌ often a local-card-only system | ❌ | ✅ ticket machine or local transit card |
| 3-star-plus hotels | ✅ | ✅ required to accept foreign cards (PBOC 2024) | ✅ |
| 4A/5A attraction ticketing | ✅ | ✅ required (PBOC 2024) | ✅ |
| Hospital registration desk | ⚠️ often domestic UnionPay only | ⚠️ international patient desk at big Grade-3 hospitals only | ✅ |
| Government services (visa, residence) | ❌ | ✅ swipe where available | ✅ |

The single most useful habit: **set up both Alipay and WeChat Pay, and carry ¥200–500 in small bills.** Between the two apps and a little cash, nearly every situation above is covered.

## What did the 2024 PBOC policy change for foreign visitors?

The April 2024 circular jointly issued by the PBOC and several ministries reset the foreign-tourist payment story:

- Single-transaction cap raised: **$1,000 → $5,000 USD** (~¥36,000)
- Annual cumulative cap raised: **$10,000 → $50,000 USD** (~¥360,000)
- 3-star and above tourist hotels, 4A/5A national attractions, and national / provincial tourist resorts are required to accept foreign bank cards at POS
- Alipay's in-app interface expanded from 2 to **16 languages** (source: english.www.gov.cn April 2024 circular)

The earlier **Alipay Tour Pass** prepaid-wallet option is **no longer the recommended path** for most visitors — direct card binding is simpler and has higher per-transaction limits than the prepaid-wallet approach (source: trip.com Alipay guide; the official Tour Pass agreements on render.alipay.com document the prepaid-card mechanics). Tour Pass still exists in some app flows, but it is unnecessary for most visitors. If you encounter a Tour Pass prompt during onboarding, dismiss it and proceed to the regular Bank Cards flow instead.

**Tour Pass fee note**: the underlying Bank of Shanghai prepaid-card service charges a **5% service fee on each top-up** ("5% of the card purchase amount … charged in RMB at one time" — not per spending transaction), significantly higher than the 3% surcharge on direct card binding. The service is valid for **90 days**, after which Bank of Shanghai automatically converts any remaining balance back at the prevailing exchange rate and refunds it to the original card — any exchange-rate difference is borne by the user. (Source: Bank of Shanghai "Prepaid Card" User Service Agreement and the official "Tour Pass" IT Service Agreement)

**Two-layer limit structure to keep in mind**:

1. **PBOC ceiling** (regulatory): $5,000 / single, $50,000 / year **per platform** (Alipay and WeChat each have their own independent ceiling — the caps are not aggregated across both apps). Above this, the platform must reject.
2. **Platform internal limit** (Alipay or WeChat's own cap, lower in some cases): per-account caps below the PBOC ceiling, depending on whether your passport ID is verified.

The per-platform tables below separate the **PBOC regulatory ceiling** (the maximum any platform may allow per transaction or per year) from **your actual account limit**. Alipay's and WeChat's own per-account limits are not publicly disclosed, and third-party reports of effective limits vary widely — one guide reports WeChat annual caps around ¥50,000–65,000 (chinavigators.com), far below the regulatory ceiling. Assume your effective limit may be much lower than the PBOC maximum; check in-app after completing ID verification to confirm your current account limit.

## Is it safe to link a foreign card to Alipay or WeChat Pay?

For most visitors, yes — with the same care you'd give any app that holds a card. What linking actually does, and the honest limits:

- **You're authorizing pay-as-you-go charges, not handing over a balance.** Binding a card lets the app charge it for each payment you approve — you are not pre-loading money or giving the platform control of an account. Every payment shows the RMB amount and the FX rate before you confirm, so you approve each charge individually.
- **You don't need a Chinese bank account or a stored balance.** Binding a foreign Visa or Mastercard directly is enough (see [[wiki/concepts/foreign-exchange.md]]) — there's no need to open a domestic account or move money into a wallet balance, which keeps your exposure to just the linked card.
- **Device-bound security helps, but isn't a guarantee.** Both apps tie payments to your device with a PIN or biometric, which limits unauthorized charges if you lose the phone — treat it as a safety layer, not a promise. If your phone is lost or stolen, remotely sign out or freeze the account (both apps let you do this from a browser, covered further below) and call your card issuer to flag the card.
- **Keep your exposure small and recoverable.** Prefer a card with low foreign-transaction fees, watch the in-app amount on every payment, and remember your card issuer's dispute process is the final backstop — cross-border refunds and chargebacks still route back to the original card.

If you'd rather not link a card at all, you can still receive RMB from a local contact into your balance and spend that, or fall back to cash.

## How do I set up Alipay as a foreigner?

### Setup

1. Install **Alipay** (App Store / Google Play; available outside China).
2. Register with your **foreign mobile number** — a Chinese SIM is not required.
3. Complete passport-based identity verification inside the app.
4. Bind a foreign card: **Me → Bank Cards → Add Bank Card** (use direct binding; ignore any legacy "Tour Pass" prompt).
5. Make a small test payment (≤ ¥10) to confirm before relying on it for larger purchases.

### Limits and Fees (2026)

Two different numbers govern what you can spend, and they are easy to confuse:

| | PBOC regulatory ceiling (the legal maximum any platform may allow) | Your actual Alipay account limit |
|---|---|---|
| Single transaction | **$5,000 USD** (~¥36,000) for verified users — "transaction limits for foreign nationals in China has been increased from USD 1,000 to USD 5,000 for a single transaction" (Beijing municipal government) | **Not publicly disclosed** and set at or below the ceiling; check in-app after ID verification for your current figure |
| Annual | **$50,000 USD** (~¥360,000) — "from USD 10,000 to USD 50,000 annually" (Beijing municipal government) | **Not publicly disclosed**; third-party reports of effective caps vary widely (see the limit-structure note above) |
| Before ID verification | n/a (these caps apply to verified accounts) | low — unverified foreign accounts are reported capped around ~$500/transaction and ~$2,000/year (Wise); complete passport verification before any purchase |

**Do not treat the ~¥36,000 / ~¥360,000 ceilings as your spendable limit.** They are the regulatory maximum; your platform account limit is set somewhere at or below them and is not published, so confirm it in-app after ID verification rather than planning a large payment off the ceiling figure. Submitting your passport for ID verification is essential — do it at first setup or you will hit limits quickly.

| Fee | Note |
|---|---|
| Single payment **under ¥200** (i.e., up to ¥199.99) | **0%** Alipay fee on merchant payments. The ¥200 fee-exemption threshold is confirmed for the foreign-card 3% fee by the Beijing municipal circular (May 2025); Alipay is widely reported to apply the same ¥200 threshold, though Alipay does not publish an Alipay-specific fee schedule confirming it (traveler-/guide-reported for Alipay specifically, not independently verified from an Alipay source) |
| Single payment **¥200 or over** | **3%** Alipay foreign-card surcharge **on the full amount** — Wise documents Alipay charging "a flat rate of 3% of the transaction amount as a service fee," and that the fee is "only charged on the amount paid by credit card" (i.e., the full card amount, not just the portion above ¥200) |
| Card-issuer foreign-transaction fee | Typically **1–3%**, set by your bank — not Alipay (trip.com Alipay guide) |
| FX rate | Shown in-app before you confirm each payment — check the displayed amount for large purchases. |

Limits are tied to the verified passport identity.

### Where Alipay Works

- In-store QR payment at the overwhelming majority of merchants
- Online checkout on Chinese-domestic sites
- Public transit in Beijing, Shanghai, Guangzhou, Shenzhen, Chongqing, Chengdu metros (and many more — see [[wiki/concepts/transportation.md]])
- DiDi, 12306, attraction ticketing through embedded Mini Programs
- Bike-sharing (Hello Bike, Meituan Bike)

### Refunds

Refunds clear back to the original foreign card after the merchant initiates the return. Cross-border settlement can take up to **30 days** (a widely cited travel-guide figure; Alipay's official refund policy may reflect a shorter or different window — check the app's Help center for the current figure). If the refund has not appeared after 30 days, escalate in this order: (1) contact the merchant directly, (2) raise a dispute in the Alipay app under Help → Dispute, (3) dispute the charge with your card issuer. Don't close the bound card until in-flight refunds have all landed.

## How do I set up WeChat Pay as a foreigner?

### Setup

1. Install **WeChat** (App Store / Google Play).
2. Register with your foreign number. WeChat may require an existing contact to scan a QR code to verify your new account — this is a risk-control measure, not always triggered, but the probability is high for foreign-number registrations. The vouching contact must meet WeChat's conditions: signed up for WeChat **over 1 month ago** (international user) or **over 6 months ago** (Chinese mainland user); has **activated WeChat Pay** if they are a Chinese mainland user; **hasn't done "Help Friend Register" for others in the past month** (one user can help a maximum of 3 people to register per year); and **hasn't been blocked in the past month** (source: Dragon Trail International, "How to Get a WeChat Account from Overseas"). In practice these conditions are strict enough that many overseas contacts do not qualify. If you cannot find a qualifying contact, WeChat's in-app customer support can reportedly unlock the account, though the timeline is traveler-reported and not independently verified.
3. Complete passport identity verification.
4. **Me → Services → Wallet → Bank Cards → Add Bank Card.**
5. Bind a Visa, Mastercard, JCB, Diners Club, or Discover card; AMEX is bindable but support is inconsistent — Visa or Mastercard is the safest default.

### Limits and Fees (2026)

Same two-number distinction as Alipay (regulatory ceiling vs. your account limit):

| | PBOC regulatory ceiling (legal maximum any platform may allow) | Your actual WeChat Pay account limit |
|---|---|---|
| Single transaction | **$5,000 USD** (~¥36,000) for verified users (Beijing municipal government) | **Not publicly disclosed**; set at or below the ceiling — check in-app (Wallet → Pay → Settings → Daily Limit) |
| Annual | **$50,000 USD** (~¥360,000) (Beijing municipal government) | **Not publicly disclosed and often far lower** — one guide reports effective WeChat annual caps around **¥50,000–65,000** for foreign-card users (chinavigators), well below the ceiling |
| Before ID verification | n/a | low — complete passport verification before any purchase |

**Plan large payments off your in-app limit, not the ~¥36,000 / ~¥360,000 regulatory ceilings** — WeChat's effective cap is reported to be much lower than the PBOC maximum.

| Fee | Note |
|---|---|
| Single payment **under ¥200** (i.e., up to ¥199.99) | **0%** WeChat fee (confirmed by Beijing municipal circular, May 2025) |
| Single payment **¥200 or over** | **3%** WeChat foreign-card surcharge on the full transaction amount — a payment of exactly ¥200 is subject to the 3% fee (confirmed by Beijing municipal circular, May 2025) |
| Card-issuer foreign-transaction fee | Typically **1–3%**, set by your bank |
| FX rate | Shown in-app before you confirm — check the displayed RMB amount for large purchases. |

### Where WeChat Pay Works

- In-store QR payment (essentially universal)
- Mini Programs — DiDi, 12306, many hotels and attractions are integrated
- Receiving transfers (转账) and red packets (红包) from contacts — see **Receiving RMB from Friends** section below
- Note: outbound P2P transfers from a foreign-card-only account follow the same restriction as Alipay — a Chinese bank card is required to initiate transfers to other users

### Refunds

Refunds clear back to the original foreign card after the merchant initiates the return. Cross-border settlement follows the same timeline as Alipay — up to **30 days** (widely cited by travel guides; verify the current timeline in WeChat's in-app Help center). Escalate in this order if the refund does not appear: (1) contact the merchant, (2) raise a dispute via WeChat Pay → Help → Dispute a Payment, (3) dispute with your card issuer. Don't close the bound card until in-flight refunds have landed.

## How do I receive money from a friend on Alipay or WeChat?

Both apps support receiving RMB from a Chinese friend — useful when a specific merchant rejects your foreign card.

**Alipay**: tap **Pay/Collect → Receive**, show the QR code for your friend to scan, or share your registered phone number so they can search and send. Funds land in your Alipay balance instantly. Balance payments use RMB directly — no foreign card transaction is involved — so the 3% surcharge mechanism does not apply. Note: foreign-card accounts cannot initiate outbound P2P transfers to other Alipay users; a linked Chinese bank card is required for that.

**WeChat Pay**:
- **WeChat Transfer** (转账) — instant, no fee
- **Face-to-face collection** (面对面收款) — show your receive-QR, friend scans to send

Foreign-card-bound accounts have lower receive limits than mainland-resident accounts, but the path works for typical tourist amounts.

## How do QR-code payments work in China?

Two distinct QR flows confuse first-time visitors:

- **Scan-to-pay** (you scan the merchant's QR with your phone): default at large stores, restaurants, attractions — there is a static QR code posted or shown on a screen.
- **Be scanned** (you show your phone's payment QR for the merchant to scan with their device): default at small vendors, taxis, market stalls — no static QR exists.

Both apps support both flows. If a small vendor doesn't see a QR for you to scan, open the **payment / pay** button in the app to show your personal QR for them to scan instead.

## Can I use Apple Pay, Google Pay, or PayPal in China?

These are **not replacements** for Alipay or WeChat Pay — treat them as supplementary options.

**Apple Pay** works at POS terminals that accept UnionPay tap-to-pay (NFC). Coverage is real but limited: larger hotels, shopping malls, some convenience stores. Street vendors and small restaurants typically have no NFC terminal. Apple Pay does not bridge to Alipay or WeChat Pay.

**Google Pay** does not function in mainland China — Google services are blocked by the Great Firewall (source: airalo.com). Do not rely on it as a backup.

**UnionPay "Nihao China"** — UnionPay officially launched a dedicated app for foreign visitors on December 19, 2025 (source: UnionPay International official announcement). It supports top-up from international Visa, Mastercard, and UnionPay cards issued outside mainland China, and includes real-time English–Chinese translation and metro/bus QR access in 43 major cities. Coverage and reliability are still expanding; it is not yet as universal as Alipay or WeChat Pay, but worth installing as a supplementary option. The in-app **Tour Wallet** holds the topped-up balance for QR spending at UnionPay merchants (source: UnionPay International).

**TenPayGo (Tencent, new — in testing 2026)** — In late June 2026 Tencent began testing **TenPayGo**, a standalone app for overseas visitors that lets you register with **just an email** and link a foreign Visa, Mastercard, or Apple Pay, then pay at the same **WeChat Pay merchant network** — no Chinese phone number or domestic bank account. As of early July 2026 the signup gate is opening to more users, but Tencent has **not announced a formal public launch**, and fees and limits are not yet officially published (early testers report a ¥200 / 3% pattern that appears to be in gray-scale testing — go by the amount your payment screen shows). Because foreigners can already bind a foreign card directly to Alipay and WeChat Pay (above), TenPayGo is a **lighter-onboarding alternative, not a must-have**. See [[wiki/entities/tenpaygo.md]] for the full picture.

**PayPal (via TenPay Global × PayPal World integration, 2026)** — As of May 27, 2026, Tencent's cross-border platform **TenPay Global** and **PayPal World** are interoperable: PayPal users can pay at **tens of millions of WeChat Pay merchants** in China using their PayPal account. Initially open to **US users**; rollout to other countries is unconfirmed. The specific scan flow (whether it uses standard WeChat Pay merchant QR codes or a separate PayPal entry point) and fee structure (whether the 3% foreign-card surcharge applies) are not yet publicly documented — verify at the PayPal or WeChat Pay help center before relying on this as your primary payment method. Source: Tencent VP announcement at the 20th Shenzhen International Financial Expo, May 2026.

**International partner wallets (scan-direct, no card binding required)** — Alipay supports direct QR-code payment from the following overseas wallets without binding a separate card. Useful for travelers who already use these apps at home:

AlipayHK · WeChat Pay HK · Kakao Pay (South Korea) · Touch'n Go eWallet (Malaysia) · HiPay (Philippines) · Changi Pay (Singapore) · OCBC Pay Anyone (Singapore) · Naver Pay (South Korea) · Toss Pay (South Korea) · TrueMoney (Thailand) · GCash (Philippines) · Kaspi (Kazakhstan) · NayaPay (Pakistan)

> Source: *A Guide to Working and Living in China as Business Expatriates 2025* (11-ministry joint publication, english.www.gov.cn). Verify partner wallet availability in-app before your trip — the list updates periodically.

**Digital yuan (e-CNY)** — China's central bank digital currency (CBDC) wallet accepts foreign passport registration in participating pilot cities and has been promoted at some airports and major event venues. In practice, merchant acceptance remains patchy and its advantages over Alipay/WeChat Pay are not material for a short-term tourist. It is not recommended as a primary payment method; note it exists if you encounter e-CNY top-up kiosks at airports or event venues.

## Where does mobile pay not work in China?

| Scenario | Why | Fallback |
|---|---|---|
| Older taxis (street-hail yellow / green) | Driver may not have a working QR placard; meter shows cash amount | RMB cash |
| Some street-stall vendors | No QR signage | RMB cash |
| Hospital admission counters | Often domestic UnionPay only | Pay in cash, or ask for the **international patient services desk** (large Grade 3 hospitals — 三级医院, the highest grade in China's classification — typically have one and can process foreign cards; smaller or community hospitals generally cannot) |
| Government services (visa, residence) | Cash or POS only | RMB cash; foreign card swipe |
| Smaller-city subway gates | Local transit-card-only systems | Cash for ticket machine; local transit card sold at the station |

**Working rule: carry ¥200–500 in small bills as backup.** Tier-1 cities almost never need it; tier-2 and below occasionally do.

## Which venues must accept foreign cards in China?

Independent of mobile pay, the 2024 circular requires the following categories of venue to accept foreign bank cards (Visa / Mastercard) at the POS:

- 3-star and above tourist hotels
- 4A and 5A national tourist attractions
- National and provincial tourist resorts
- National tourism and leisure districts

Some merchants at covered venues may claim the POS machine "doesn't work" or produce a long-unused, uncharged device — this can be deliberate avoidance of higher interchange fees on foreign-card transactions. If a covered venue refuses, asking for the manager and citing the 2024 PBOC circular resolves most cases on the spot. For formal complaints, China's general government services hotline is **12345** (the nationwide government complaint and services line, operated by local government offices — verify it is still active at gov.cn before your trip); the PBOC operates a dedicated financial consumer rights line — verify the current number at pbc.gov.cn/en before your trip.

## How do I make sure I can always pay in China?

Foreign users occasionally experience payment failures due to card verification issues, daily transaction limits, or network problems. Having a backup payment method (second app, cash ¥200-500, or physical card) is recommended. When Alipay fails, WeChat Pay almost always works (and vice versa) — with both apps set up, nearly every merchant accepts at least one of them.

**Recommended redundancy strategy**: Alipay (primary for most payments) + WeChat Pay (backup) + ¥200-500 cash for rare edge cases. If a payment fails anyway, see [[wiki/concepts/payment-failures.md]] for the full troubleshooting path.

**Fee-minimization tip**: Cards with 0% foreign transaction fees (e.g., Chase Sapphire, Capital One Venture) eliminate the card-issuer portion of the fee — though the platform's 3% surcharge on payments over ¥200 still applies.

**European low-FX-fee options**: **Wise** debit cards (Visa or Mastercard branded, virtual or physical) can be linked to both Alipay and WeChat Pay — Wise documents the setup officially: passport-based real-name verification, no Chinese bank account or Chinese phone number required (source: wise.com "Link Your Wise Card to Alipay & WeChat"). Note Wise is not fee-free: it converts at the mid-market rate plus a small conversion fee, rather than charging a flat foreign-transaction fee. For **Revolut** and **N26**, neither issuer officially documents Alipay/WeChat Pay binding, and user reports are mixed — some travelers bind them like any other Visa/Mastercard, others hit "foreign banks are not allowed" errors (according to user reports, not independently verified). Test-bind before departure and carry a second card as backup.

## Why is my payment failing in China?

The handful of causes behind almost every failed foreign-card payment:

- **Personal vs merchant QR code** — foreign-card wallets can only pay **merchant** codes; a small vendor's personal collect code will refuse your payment (chinavigators marks "Split bills with friends" and "P2P transfers to contacts" as unavailable to foreign-card accounts — "receiving only possible"). Try the other app (the vendor may have a merchant code there), ask for a merchant code (商家码), or pay cash.
- **VPN left on** — VPN traffic raises the fraud-detection risk score and can silently decline a payment ("an active VPN causes geographic IP mismatches that trigger fraud detection" — chinavigators). Toggle the VPN off for the payment, then back on.
- **Payment ≥ ¥200 declined** — the 3% surcharge is rejected by some card issuers. Split the bill into amounts under ¥200 or switch to the other app.
- **Risk-control blocks a previously working card with no warning** (traveler-reported, not independently verified — Shuimu BBS 2026-05-11) — unbind and re-bind the card, try the other platform, or fall back to cash / POS swipe.
- **Setup-stage failures** — card binding rejected (call your issuer, give a travel notification first) or WeChat registration stuck at contact-vouching (see the WeChat Pay setup section above).

For the full symptom → cause → fix table — including SMS verification delays, refunds stuck past 30 days, cards that bind but can't be selected at checkout, and third-party apps that filter out foreign cards — see [[wiki/concepts/payment-failures.md]].

## Why can't I register for Chinese apps with a foreign number?

Even when the payment method is valid, many Chinese services (food delivery, ticketing, some transit apps) require account registration before any payment screen is reached. Registration typically requires:

- A **mainland China mobile number (+86)**
- Sometimes **real-name verification** with a Chinese national ID (国内身份证)

Foreign visitors generally cannot complete either step. This blocks access to services entirely, independent of which payment method they carry. The workaround is to use the visitor-facing entry points where they exist (e.g., Alipay Mini Programs inside the Alipay app, which inherit the already-verified Alipay account identity) or ask a local contact to place the order on your behalf.

(Source: Shuimu BBS 2026-05-11)

## City Metro Mini-Programs (Quick Reference)

Metro systems in major cities use dedicated mini-programs accessible through both WeChat and Alipay. Generate a QR code, scan at turnstile entry, scan again at exit — payment auto-deducts from your linked card. In addition, some Tier-1 city gates now accept a foreign contactless card tapped directly at the turnstile (Beijing's full network and Shanghai, as of mid-2026) — see [[wiki/concepts/transportation.md]] for which cities and cards support it.

For the complete city-by-city metro mini-program table (with sources), see [[wiki/concepts/transportation.md#city-by-city-metro-apps]].

## What should I do with my payment apps before leaving China?

- **Accounts persist** — there is no mandatory closure step for either app. Neither Alipay nor WeChat publicly documents a dormancy deactivation timeline for foreign-linked accounts; to be safe, log in at least once a year if you plan to reuse the account on future visits.
- **Wait for in-flight refunds** to clear back to the original card (up to 30 days) before closing the card itself.
- To remove a bound card without deleting the account: **Wallet → Bank Cards → remove**. Re-bind on the next visit.

## What should I do if I lose my phone in China?

Both apps support remote sign-out and device-binding management:

- **Alipay**: log into alipay.com on a desktop, **Account Security → Manage Devices** → remove the lost device. Then change the login password.
- **WeChat**: WeChat freezes account access through **WeChat Security Center** (weixin110.qq.com) → **Freeze Account**, which you can reach from any browser. Note that signing in on a new device usually requires confirmation from your old phone, so if the device is truly lost, use the freeze flow rather than a fresh login. Once you regain access on a replacement device, remove the old one under **Settings → Account Security → Manage Devices** and reset your WeChat Pay PIN. (WeChat's account-recovery flows change periodically — verify the current freeze path in WeChat's Help Center.)

If you cannot regain access at all, both apps use device-bound authentication (PIN/biometric tied to the registered device), which significantly limits unauthorized charge risk — but do not rely on this as a guarantee. Call your card issuer to block or flag the card regardless.

## See Also

- [[wiki/entities/alipay.md]] — entity overview, Tour Pass legacy detail, language support
- [[wiki/entities/wechat.md]] — entity overview, communication features
- [[wiki/concepts/foreign-exchange.md]] — cash withdrawal, ATM access, currency exchange
