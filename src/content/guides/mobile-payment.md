---
category: guide
title: Mobile Payment for Foreign Visitors (Alipay, WeChat Pay)
date: 2026-05-02
last_verified: 2026-05-28
verified_against:
  - https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html
  - https://english.beijing.gov.cn/specials/paymentservices/news/202505/t20250528_4100629.html
  - https://help.wechat.com/cgi-bin/micromsg-bin/oshelpcenter?opcode=2&id=2307252mur7f2307257zfyfe&lang=en
  - https://www.trip.com/guide/phone/how-to-use-alipay.html
  - https://chinatravelpack.com/guides/alipay-tour-pass-guide
  - https://www.chinavigators.com/wechat-pay-foreigners-guide/
  - https://www.travelofchina.com/how-to-avoid-international-card-fees-on-alipay/
  - https://www.visahq.com/news/2025-12-24/cn/unionpay-debuts-nihao-china-super-app-to-simplify-payments-for-foreign-visitors/
  - https://wise.com/en-cn/blog/alipay-fee-international-cards
  - https://www.airalo.com/blog/access-google-china
sources:
  - raw/12306-guide-for-foreign-business-visitors-2025.md
  - raw_posts/2026-W18/travelchina.json
  - raw/wechat-paypal-integration-2026.md
related:
  - wiki/concepts/foreign-exchange.md
  - wiki/entities/alipay.md
  - wiki/entities/wechat.md
volatility: high
review:
  status: audited
  page_audit: 2026-05-03
  citation_check: 2026-05-06
---

# Mobile Payment for Foreign Visitors (Alipay, WeChat Pay)

China runs on QR-code mobile payment. Since a major People's Bank of China (PBOC) policy shift in **April 2024**, foreign visitors can pay almost anywhere by binding a regular Visa or Mastercard directly to **Alipay** or **WeChat Pay** — no Chinese bank account, no prepaid wallet, no Chinese SIM required.

## Quick Decision

| Option | Best for | Setup time | Foreign cards accepted | Key fees |
|---|---|---|---|---|
| **Alipay** + foreign card | First choice; widest merchant acceptance | 5–10 min in-app | Visa, Mastercard, JCB, Diners Club, Discover; AMEX bindable but limited merchant acceptance | 0% on payments < ¥200; **3% surcharge on the full amount** for payments ≥ ¥200 (plus your card's FX fee) |
| **WeChat Pay** + foreign card | Pair with chat, Mini Programs; receive transfers from contacts | 5–10 min in-app | Visa, Mastercard, JCB, Diners Club, Discover; AMEX bindable but limited merchant acceptance | Same 0% / 3% threshold as Alipay |
| **Foreign card swipe at POS** | 3-star+ hotels, 4A/5A attractions, tourist resorts (mandated by PBOC 2024) | None | Visa, Mastercard (mandated); JCB widely accepted at POS but not covered by the mandate | No app surcharge; your card's FX fee applies |
| **RMB cash** | Small-vendor fallback; some taxis, street stalls | Withdraw at ATM | n/a | ATM withdrawal fee + FX spread |

For both Alipay and WeChat Pay, **AMEX is bindable but merchant acceptance is uneven** — keep a Visa or Mastercard as primary and treat AMEX as backup.

**Set up both Alipay and WeChat Pay before arrival.** Different merchants accept different apps, SMS verification is more reliable on a foreign carrier than on a fresh Chinese SIM, and WeChat may trigger a contact-vouching step during registration from a foreign number — arrange a qualifying contact before departure if possible.

## What Changed (2024–2025 PBOC Policy)

The April 2024 circular jointly issued by the PBOC and several ministries reset the foreign-tourist payment story:

- Single-transaction cap raised: **$1,000 → $5,000 USD** (~¥36,000)
- Annual cumulative cap raised: **$10,000 → $50,000 USD** (~¥360,000)
- 3-star and above tourist hotels, 4A/5A national attractions, and national / provincial tourist resorts are required to accept foreign bank cards at POS
- Alipay's in-app interface expanded from 2 to **16 languages** (source: english.www.gov.cn April 2024 circular)

The earlier **Alipay Tour Pass** prepaid-wallet option is **no longer the recommended path** for most visitors — direct card binding (introduced for foreign cards in 2024) is simpler and has higher per-transaction limits than the prepaid-wallet approach (source: trip.com Alipay guide; chinatravelpack.com Tour Pass guide). Tour Pass still exists in some app flows, but it is unnecessary for most visitors. If you encounter a Tour Pass prompt during onboarding, dismiss it and proceed to the regular Bank Cards flow instead.

**Two-layer limit structure to keep in mind**:

1. **PBOC ceiling** (regulatory): $5,000 / single, $50,000 / year **per platform** (Alipay and WeChat each have their own independent ceiling — the caps are not aggregated across both apps). Above this, the platform must reject.
2. **Platform internal limit** (Alipay or WeChat's own cap, lower in some cases): per-account caps below the PBOC ceiling, depending on whether your passport ID is verified.

The verified-tier figures below show the **PBOC regulatory ceilings** — the maximum any platform may allow per transaction or per year. Alipay's and WeChat's own per-account limits are not publicly disclosed but in practice closely track these ceilings for verified accounts; your effective limit may be lower. Check in-app after completing ID verification to confirm your current account limit.

## Alipay (Recommended First)

### Setup

1. Install **Alipay** (App Store / Google Play; available outside China).
2. Register with your **foreign mobile number** — a Chinese SIM is not required.
3. Complete passport-based identity verification inside the app.
4. Bind a foreign card: **Me → Bank Cards → Add Bank Card** (use direct binding; ignore any legacy "Tour Pass" prompt).
5. Make a small test payment (≤ ¥10) to confirm before relying on it for larger purchases.

### Limits and Fees (2026)

| Limit | Unverified | Verified (passport ID submitted) |
|---|---|---|
| Single transaction | not officially published; travel guides report ~¥6,000 (travelofchina.com) — treat as estimate only; complete ID verification before any purchase | up to ~**¥36,000** per the PBOC $5,000 USD ceiling — check in-app for your current account limit |
| Monthly / Annual | lower | annual ceiling up to ~**¥360,000** (the PBOC $50,000 USD ceiling) |

The verified-tier figures above are the **PBOC regulatory ceilings** ($5,000 and $50,000 USD), not Alipay's internally-set account limits. Alipay's per-account caps are always at or below these ceilings; the exact internal values are not publicly disclosed but in practice closely track the PBOC limits for verified accounts. Submitting your passport for ID verification is essential — do it at first setup or you will hit limits quickly.

| Fee | Note |
|---|---|
| Single payment **under ¥200** (i.e., up to ¥199.99) | **0%** Alipay fee (source: wise.com; threshold introduced following the PBOC April 2024 policy directive) |
| Single payment **¥200 or over** | **3%** Alipay foreign-card surcharge **on the full amount** — a ¥200 or ¥201 payment incurs 3% on the entire amount, not just the portion at or above ¥200 (Alipay's rate per wise.com; WeChat's equivalent confirmed by Beijing circular May 2025) |
| Card-issuer foreign-transaction fee | Typically **1–3%**, set by your bank — not Alipay |
| FX rate | Shown in-app before you confirm each payment — check the displayed amount for large purchases. |

Limits are tied to the verified passport identity.

### Where Alipay Works

- In-store QR payment at the overwhelming majority of merchants
- Online checkout on Chinese-domestic sites
- Public transit in Beijing, Shanghai, Guangzhou, Shenzhen, Chongqing, Chengdu metros (and many more — see [[wiki/concepts/transportation.md]])
- DiDi, 12306, attraction ticketing through embedded Mini Programs
- Bike-sharing (Hello Bike, Meituan Bike)

### Refunds

Refunds clear back to the original foreign card after the merchant initiates the return. Cross-border settlement can take up to **30 days** (widely cited by travel guides including travelofchina.com; Alipay's official refund policy at alipay.com may reflect a shorter or different window — check the app's Help center for the current figure). If the refund has not appeared after 30 days, escalate in this order: (1) contact the merchant directly, (2) raise a dispute in the Alipay app under Help → Dispute, (3) dispute the charge with your card issuer. Don't close the bound card until in-flight refunds have all landed.

## WeChat Pay

### Setup

1. Install **WeChat** (App Store / Google Play).
2. Register with your foreign number. WeChat may require an existing contact to scan a QR code to verify your new account — this is a risk-control measure, not always triggered, but the probability is high for foreign-number registrations. The vouching contact must meet **all four** of WeChat's official conditions: (1) registered for more than 6 months; (2) WeChat Pay activated for more than 3 months; (3) has not vouched for another account in the past month; (4) has not been banned in the past 6 months. (Verify current conditions in WeChat Help Center → Account Security — the source URL used at page creation is no longer accessible as of 2026-05-06.) There is no nationality or residency requirement, but in practice these conditions are strict enough that many overseas contacts do not qualify. If you cannot find a qualifying contact, WeChat's in-app customer support can potentially unlock the account, but the process takes several days.
3. Complete passport identity verification.
4. **Me → Services → Wallet → Bank Cards → Add Bank Card.**
5. Bind a Visa, Mastercard, JCB, or AMEX (AMEX support is inconsistent — Visa or Mastercard is the safest default).

### Limits and Fees (2026)

| Limit | Unverified | Verified (passport ID submitted) |
|---|---|---|
| Single transaction | not officially published; travel guides report ~¥6,000 (travelofchina.com) — treat as estimate only; complete ID verification before any purchase | up to ~**¥36,000** per the PBOC $5,000 USD ceiling — check in-app for your current account limit |
| Daily | varies (check in-app: Wallet → Pay → Settings → Daily Limit) | higher; exact tier not published |
| Monthly / Annual | lower | annual ceiling up to ~**¥360,000** (the PBOC $50,000 USD ceiling) |

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

## Receiving RMB from Friends (Both Apps)

Both apps support receiving RMB from a Chinese friend — useful when a specific merchant rejects your foreign card.

**Alipay**: tap **Pay/Collect → Receive**, show the QR code for your friend to scan, or share your registered phone number so they can search and send. Funds land in your Alipay balance instantly. Balance payments use RMB directly — no foreign card transaction is involved — so the 3% surcharge mechanism does not apply. Note: foreign-card accounts cannot initiate outbound P2P transfers to other Alipay users; a linked Chinese bank card is required for that.

**WeChat Pay**:
- **WeChat Transfer** (转账) — instant, no fee
- **Face-to-face collection** (面对面收款) — show your receive-QR, friend scans to send

Foreign-card-bound accounts have lower receive limits than mainland-resident accounts, but the path works for typical tourist amounts.

## How Payment Flows Work

Two distinct QR flows confuse first-time visitors:

- **Scan-to-pay** (you scan the merchant's QR with your phone): default at large stores, restaurants, attractions — there is a static QR code posted or shown on a screen.
- **Be scanned** (you show your phone's payment QR for the merchant to scan with their device): default at small vendors, taxis, market stalls — no static QR exists.

Both apps support both flows. If a small vendor doesn't see a QR for you to scan, open the **payment / pay** button in the app to show your personal QR for them to scan instead.

## Alternative Wallets (Apple Pay, Google Pay, PayPal, UnionPay Nihao China, e-CNY)

These are **not replacements** for Alipay or WeChat Pay — treat them as supplementary options.

**Apple Pay** works at POS terminals that accept UnionPay tap-to-pay (NFC). Coverage is real but limited: larger hotels, shopping malls, some convenience stores. Street vendors and small restaurants typically have no NFC terminal. Apple Pay does not bridge to Alipay or WeChat Pay.

**Google Pay** does not function in mainland China — Google services are blocked by the Great Firewall (source: airalo.com). Do not rely on it as a backup.

**UnionPay "Nihao China"** — UnionPay launched a dedicated app for foreign visitors on December 24, 2025 (source: VisaHQ). It accepts international Visa, Mastercard, and UnionPay cards issued outside mainland China, and includes real-time English–Chinese translation and transit card top-up in major cities. Coverage and reliability are still expanding; it is not yet as universal as Alipay or WeChat Pay, but worth installing as a supplementary option. UnionPay's app also offers an **E-Money Card** product that can be recharged for spending at UnionPay merchants.

**PayPal (via TenPay Global × PayPal World integration, 2026)** — As of May 27, 2026, Tencent's cross-border platform **TenPay Global** and **PayPal World** are interoperable: PayPal users can pay at **tens of millions of WeChat Pay merchants** in China using their PayPal account. Initially open to **US users**; rollout to other countries is unconfirmed. The specific scan flow (whether it uses standard WeChat Pay merchant QR codes or a separate PayPal entry point) and fee structure (whether the 3% foreign-card surcharge applies) are not yet publicly documented — verify at the PayPal or WeChat Pay help center before relying on this as your primary payment method. Source: Tencent VP announcement at the 20th Shenzhen International Financial Expo (raw/wechat-paypal-integration-2026.md).

**International partner wallets (scan-direct, no card binding required)** — Alipay supports direct QR-code payment from the following overseas wallets without binding a separate card. Useful for travelers who already use these apps at home:

AlipayHK · WeChat Pay HK · Kakao Pay (South Korea) · Touch'n Go eWallet (Malaysia) · HiPay (Philippines) · Changi Pay (Singapore) · OCBC Pay Anyone (Singapore) · Naver Pay (South Korea) · Toss Pay (South Korea) · TrueMoney (Thailand) · GCash (Philippines) · Kaspi (Kazakhstan) · NayaPay (Pakistan)

> Source: *A Guide to Working and Living in China as Business Expatriates 2025* (11-ministry joint publication, english.www.gov.cn). Verify partner wallet availability in-app before your trip — the list updates periodically.

**Digital yuan (e-CNY)** — China's central bank digital currency (CBDC) wallet accepts foreign passport registration in participating pilot cities and has been promoted at some airports and major event venues. In practice, merchant acceptance remains patchy and its advantages over Alipay/WeChat Pay are not material for a short-term tourist. It is not recommended as a primary payment method; note it exists if you encounter e-CNY top-up kiosks at airports or event venues.

## Where Mobile Pay Doesn't Work (Both Apps)

| Scenario | Why | Fallback |
|---|---|---|
| Older taxis (street-hail yellow / green) | Driver may not have a working QR placard; meter shows cash amount | RMB cash |
| Some street-stall vendors | No QR signage | RMB cash |
| Hospital admission counters | Often domestic UnionPay only | Pay in cash, or ask for the **international patient services desk** (large Grade 3 hospitals — 三级医院, the highest grade in China's classification — typically have one and can process foreign cards; smaller or community hospitals generally cannot) |
| Government services (visa, residence) | Cash or POS only | RMB cash; foreign card swipe |
| Smaller-city subway gates | Local transit-card-only systems | Cash for ticket machine; local transit card sold at the station |

**Working rule: carry ¥200–500 in small bills as backup.** Tier-1 cities almost never need it; tier-2 and below occasionally do.

## PBOC Merchant Mandate (Foreign Card POS)

Independent of mobile pay, the 2024 circular requires the following categories of venue to accept foreign bank cards (Visa / Mastercard) at the POS:

- 3-star and above tourist hotels
- 4A and 5A national tourist attractions
- National and provincial tourist resorts
- National tourism and leisure districts

Some merchants at covered venues may claim the POS machine "doesn't work" or produce a long-unused, uncharged device — this can be deliberate avoidance of higher interchange fees on foreign-card transactions. If a covered venue refuses, asking for the manager and citing the 2024 PBOC circular resolves most cases on the spot. For formal complaints, China's general government services hotline is **12345** (the nationwide government complaint and services line, operated by local government offices — verify it is still active at gov.cn before your trip); the PBOC operates a dedicated financial consumer rights line — verify the current number at pbc.gov.cn/en before your trip.

## Common Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| Card binding rejected | Issuer blocks the merchant code, requires 3-D Secure, or hasn't been notified of overseas use | Call your card issuer before the trip; some banks require pre-trip travel notification for Chinese merchants |
| SMS verification doesn't arrive | Carrier SMS gateway delays; foreign-routed SMS sometimes filtered | Resend; if persistent, register on a foreign carrier before arrival |
| Payment fails for amounts ≥ ¥200 | 3% surcharge declined by card issuer (or hits issuer's foreign-transaction-fee threshold) | Split into smaller payments (each under ¥200 sidesteps the surcharge entirely) or switch to the other app |
| WeChat registration stuck at "ask a friend to scan" | Risk-control vouching step — frequently triggered for foreign-number registrations; the contact must be registered 6+ months, have WeChat Pay 3+ months, not have vouched in the past month, and not been banned in 6 months | Find a qualifying contact before arrival; if none available, WeChat in-app support can unlock but takes several days |
| Refund stuck for >30 days | Cross-border settlement delay | Wait the full 30 days, then dispute via the merchant first, the app second, the card issuer third |
| Card binds successfully but cannot be selected at checkout | Alipay/WeChat risk-control silently blocks the card for that merchant or transaction type; no error message | Try the other app; fall back to POS card swipe or cash |
| Card stops working suddenly after several successful payments | Platform risk-control or regulatory spending limit hit; no advance warning given (source: Shuimu BBS 2026-05-11) | Try unbinding and re-binding the card; try the other platform; switch to cash |
| Third-party app redirects to Alipay/WeChat at checkout but only domestic cards appear | The redirect flow passes a filter that excludes foreign cards, even if one is already bound to the wallet | Open Alipay/WeChat directly and complete the payment from there instead |
| Payment fails while using a VPN | VPN traffic raises the risk score in Alipay/WeChat Pay's fraud-detection system; combined with other factors (new account, first large payment, unfamiliar merchant) it can push a transaction over the rejection threshold | For most users this is not an issue in practice — try disabling the VPN for the payment if a transaction is declined unexpectedly |

## Registration Wall

Even when the payment method is valid, many Chinese services (food delivery, ticketing, some transit apps) require account registration before any payment screen is reached. Registration typically requires:

- A **mainland China mobile number (+86)**
- Sometimes **real-name verification** with a Chinese national ID (国内身份证)

Foreign visitors generally cannot complete either step. This blocks access to services entirely, independent of which payment method they carry. The workaround is to use the visitor-facing entry points where they exist (e.g., Alipay Mini Programs inside the Alipay app, which inherit the already-verified Alipay account identity) or ask a local contact to place the order on your behalf.

(Source: Shuimu BBS 2026-05-11)

## Account Closure / Departure

- **Accounts persist** — there is no mandatory closure step for either app. Neither Alipay nor WeChat publicly documents a dormancy deactivation timeline for foreign-linked accounts; to be safe, log in at least once a year if you plan to reuse the account on future visits.
- **Wait for in-flight refunds** to clear back to the original card (up to 30 days) before closing the card itself.
- To remove a bound card without deleting the account: **Wallet → Bank Cards → remove**. Re-bind on the next visit.

## Lost Phone

Both apps support remote sign-out and device-binding management:

- **Alipay**: log into alipay.com on a desktop, **Account Security → Manage Devices** → remove the lost device. Then change the login password.
- **WeChat**: on a friend's phone or desktop wechat.com, sign in via your number → **Settings → Account Security → Manage Devices** → remove the lost device. WeChat Pay specifically can also be locked via **Wallet → Pay → Forgot password** to invalidate the existing PIN until you reset.

If you cannot regain access at all, both apps use device-bound authentication (PIN/biometric tied to the registered device), which significantly limits unauthorized charge risk — but do not rely on this as a guarantee. Call your card issuer to block or flag the card regardless.

## See Also

- [[wiki/entities/alipay.md]] — entity overview, Tour Pass legacy detail, language support
- [[wiki/entities/wechat.md]] — entity overview, communication features
- [[wiki/concepts/foreign-exchange.md]] — cash withdrawal, ATM access, currency exchange
