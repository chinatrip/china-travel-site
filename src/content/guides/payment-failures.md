---
title: "Why Did My Payment Fail in China? Troubleshooting for Foreigners (2026)"
date: 2026-06-15
last_verified: 2026-06-15
verified_against:
  - https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html
  - https://english.beijing.gov.cn/specials/paymentservices/news/202505/t20250528_4100629.html
  - https://wise.com/sg/blog/link-wise-card-alipay-wechat-china
  - https://m.unionpayintl.com/ZT/en/NHCAPP/
  - https://www.unionpayintl.com/cn/mediaCenter/newsCenter/companyNews/3016318.shtml
  - https://www.chinavigators.com/wechat-pay-foreigners-guide/
  - https://wise.com/us/blog/alipay-limit
  - https://wise.com/en-cn/blog/alipay-fee-international-cards
  - https://www.chinasurvival.com/en/blog/why-wechat-and-alipay-fail-with-foreign-numbers-and-how-to-fix-it
sources:
  - raw_posts/2026-W18/travelchina.json
  - raw/shuimu-foreign-card-payment-guide-2026.md
related:
  - wiki/concepts/mobile-payment.md
  - wiki/concepts/foreign-exchange.md
  - wiki/concepts/internet-connectivity.md
volatility: high
review:
  status: audited
  page_audit: 2026-06-12
  citation_check: 2026-06-15
  notes: "Adopted into the wiki from the site GEO page (issue #18): site-route links converted to [[wiki/...]], and the full failure table consolidated here from mobile-payment.md (issue #22 item 3). Fix iteration 1 (2026-06-15): the 9 NOT_FOUND claims from the first Type-3 run were each resolved — merchant/personal-QR + P2P (receive-only), VPN-trips-fraud, unverified-account limits, 3%-on-full-amount, SMS-blocked, bank-blocks-binding, and balance-no-surcharge are now sourced to chinavigators / Wise / China Survival Kit (added to verified_against); the multi-week refund window, the platform-risk-control silent block, the redirect-filter, the checkout-unselectable card, and the WeChat contact-vouching framing are degraded in text to 'traveler-reported, not independently verified' (Shuimu BBS, outside verified_against). Re-run Type-3 (2026-06-15): 16 supported / 0 contradicted / 6 NOT_FOUND, where all 6 NOT_FOUND are the explicitly traveler-reported items (silent risk-control block, 3-D Secure binding step, checkout-unselectable card, redirect filter, WeChat contact-vouching, multi-week refund). Fees/limits are high-volatility — recheck against mobile-payment.md before update."
description: >-
  Why Alipay or WeChat Pay fails in China: a personal QR code, a VPN left on,
  the ¥200 3% surcharge, or an unverified account — and how to fix each. Updated
  June 2026.
faqs:
  - q: Why does my Alipay or WeChat Pay payment keep failing in China?
    a: >-
      The four common causes are: paying to a vendor's personal QR code
      (foreign-card wallets can only pay merchant codes), a VPN left switched
      on, the issuer declining the 3% surcharge on payments of ¥200 or more, or
      an unverified account hitting a low limit. Set up both apps, complete
      passport verification, and carry ¥200-500 cash as backup.
  - q: Why can't I pay a small vendor or pay a friend back?
    a: >-
      Foreign-card-bound Alipay/WeChat accounts can pay merchant QR codes but
      cannot send money to a personal collect code or do P2P transfers — that
      needs a Chinese bank card. If a small vendor uses a personal code, pay
      with the other app, ask if they have a merchant code, or use cash.
  - q: Why does my payment fail when my VPN is on?
    a: >-
      A non-Chinese IP from a VPN can trip Alipay/WeChat fraud checks and get a
      payment declined. Toggle the VPN off to pay, then back on. On a foreign
      eSIM with an always-on VPN you can't disable, pay over Chinese Wi-Fi or a
      Chinese SIM for that transaction.
  - q: Why do payments of ¥200 or more get declined?
    a: >-
      Payments of ¥200+ carry a 3% foreign-card surcharge on the full amount,
      and some issuers decline it. Ask the merchant to split the bill into
      amounts under ¥200 (which have no surcharge), or switch to the other app.
  - q: 'My card worked fine, then suddenly stopped — what happened?'
    a: >-
      Platform risk-control or a regulatory spending limit can block a card with
      no warning. Try the other app, unbind and re-bind the card, complete
      passport verification if you haven't, or fall back to cash. Keeping both
      Alipay and WeChat Pay set up covers ~99% of merchants.
category: guide
---

# Why Did My Payment Fail in China? Troubleshooting for Foreigners

**Short answer:** four causes explain most everyday foreign-card payment failures in China —

1. you're paying a **personal** QR code, not a **merchant** one,
2. your **VPN is on**,
3. the payment is **¥200 or more** and your bank declined the 3% surcharge, or
4. your account is **unverified** and hit a low limit.

Set up **both** Alipay and WeChat Pay, complete **passport verification**, and carry **¥200-500 cash** — between the two apps and cash, you are covered in nearly every payment situation a visitor encounters. The symptom table below also covers setup-stage and edge-case failures. For full setup and fee detail, see [[wiki/concepts/mobile-payment.md]].

## Why is my Alipay or WeChat Pay payment failing?

Find your symptom:

| Symptom | Likely cause | Fix |
|---|---|---|
| Small vendor's QR won't accept payment | It's a **personal** collect code; foreign cards can't pay it (chinavigators lists "Split bills with friends" and "P2P transfers to contacts" as ✗ for foreign cards — "receiving only possible") | Try the other app (the vendor may have a merchant code there), ask for a merchant code, or pay cash |
| Payment declined while connected | **VPN is on** and tripped fraud checks ("An active VPN causes geographic IP mismatches that trigger fraud detection" — chinavigators) | Turn the VPN off to pay, then back on |
| Fails only on amounts **≥ ¥200** | Issuer declined the **3% surcharge** | Ask to split the bill into amounts under ¥200, or switch apps |
| Limit reached quickly / blocked early | Account **not passport-verified** (unverified foreign accounts are capped at ~$500/transaction and ~$2,000/year; verification raises this — Wise) | Complete ID verification in-app |
| Card was fine, then stopped | **Risk-control / spending limit** hit, no warning (traveler-reported, not independently verified — Shuimu BBS 2026-05-11) | Re-bind card, switch app, or use cash |
| Card binding rejected at setup | Your **home bank blocks it** as overseas fraud ("your home bank might block it as overseas fraud" — China Survival Kit); a 3-D Secure approval step is sometimes involved (traveler-reported, not independently verified) | Call your bank; notify them of China travel first |
| SMS verification code never arrives | Your carrier flags Chinese SMS servers as spam and blocks the text ("the SMS black hole" — China Survival Kit) | Resend; if persistent, register on a foreign carrier before arrival |
| Card binds but can't be selected at checkout | Alipay/WeChat risk-control silently blocks the card for that merchant or transaction type; no error message (traveler-reported, not independently verified — Shuimu BBS 2026-05-11) | Try the other app; fall back to POS card swipe or cash |
| Third-party app redirects to Alipay/WeChat but only domestic cards appear | The redirect flow passes a filter that excludes foreign cards, even if one is already bound to the wallet (traveler-reported, not independently verified — Shuimu BBS 2026-05-11) | Open Alipay/WeChat directly and complete the payment from there instead |
| WeChat registration stuck at "ask a friend to scan" | A contact-vouching step, reportedly triggered often for foreign-number registrations (traveler-reported, not independently verified) | Find a qualifying contact before arrival; WeChat in-app support can reportedly unlock it but may take several days (traveler-reported) — see [[wiki/concepts/mobile-payment.md]] for the vouching conditions |
| Refund hasn't arrived | Cross-border refunds must clear currency conversion and compliance checks, so they can run slow (a specific multi-week window is traveler-reported, not independently verified) | Dispute via the merchant first, the app second, the card issuer third |

## Why can't I pay a small vendor or pay a friend back?

This is the failure nobody warns you about. A foreign-card-bound Alipay or WeChat account can pay **merchant** QR codes, but **cannot send money to a personal collect code or do person-to-person transfers** — that requires a linked **Chinese bank card**. (chinavigators marks "Split bills with friends," "Send red packets," and "P2P transfers to contacts" all as unavailable to foreign-card accounts — "receiving only possible.")

So when a street stall, tiny restaurant, or individual shows a **personal** receive-QR, your foreign-card payment is refused even though the app works fine elsewhere.

**Fixes:**

- Try the **other app** — the vendor may have both a personal and a merchant option.
- Ask if they have a **merchant code** (商家码) instead of a personal one.
- Pay with **cash**.
- If you're paying a person back, have *them* pay the merchant directly and settle later, or use cash — you can *receive* RMB from a Chinese friend, but a foreign-card account can't *send* it. See [[wiki/concepts/mobile-payment.md#receiving-rmb-from-friends-both-apps]].

## Why does my payment fail when the VPN is on?

A VPN makes your traffic appear to come from outside China, which can trip Alipay/WeChat fraud detection and silently decline a payment. As chinavigators puts it, "an active VPN causes geographic IP mismatches that trigger fraud detection."

- **Toggle the VPN off** to complete the payment, then turn it back on.
- On a **foreign eSIM with an always-on VPN** (e.g. Holafly) that you can't disable, do that one payment on **Chinese Wi-Fi** or a **Chinese SIM** instead. See [[wiki/concepts/internet-connectivity.md]].

## Why do payments of ¥200 or more get declined?

Payments **under ¥200 have no fee**, but at **¥200 or above** Alipay and WeChat add a **3% foreign-card surcharge on the full amount paid by card** (the ¥200 threshold and 3% rate are confirmed by the Beijing municipal payment-services notice, May 2025; that the fee is charged on the full card amount — not just the portion above ¥200 — is stated by Wise: "handling fee is only charged on the amount paid by credit card") — and some card issuers decline the surcharged amount.

- **Ask the merchant to split the bill** into amounts under ¥200 each — they're used to it, and it sidesteps the surcharge entirely.
- Or switch to the **other app**, or pay part in cash.
- A card with **0% foreign-transaction fees** avoids the issuer's portion, but the platform's 3% still applies from ¥200 up.
- If a Chinese friend can send you RMB, **wallet-balance payments don't carry the foreign-card surcharge** — Wise notes the 3% handling fee is "only charged on the amount paid by credit card," while spending from the Alipay account balance is "not calculated for handling fees" (see fallback #4 below).

## My card worked, then suddenly stopped — why?

Travelers report that Alipay/WeChat risk-control or a regulatory spending cap can block a previously-working card **with no warning or error message** (not independently verified).

- Switch to the **other app** (if Alipay fails, WeChat usually works, and vice versa).
- **Unbind and re-bind** the card.
- Make sure your **passport ID verification** is complete — Wise reports unverified foreign accounts are capped low (~$500 per transaction / ~$2,000 per year) and that verification "may be able to increase your limit to 5,000 USD per transaction or 50,000 USD per year."
- Fall back to **cash** or, at covered venues (3-star+ hotels, 4A/5A attractions, national/provincial tourist resorts), a **foreign-card POS swipe**.

## What's my fallback when nothing works?

In rough order:

1. **The other wallet** — Alipay ↔ WeChat Pay; with both set up, nearly every merchant accepts at least one of them.
2. **Cash** — keep ¥200-500 in small bills; essential in tier-2/3 cities, taxis, and street stalls.
3. **Foreign-card POS swipe** — under the April 2024 PBOC-led circular, all 3-star-and-above tourist hotels, 4A/5A national tourist attractions, and national/provincial tourist resorts must accept overseas bank cards at POS (source: english.www.gov.cn, April 2024); ask for the manager if a covered venue refuses.
4. **Receive from a local** — a Chinese friend can send RMB into your wallet balance (chinavigators confirms receiving is possible for foreign-card accounts even though sending is not); balance is spent as RMB directly, and the foreign-card surcharge does not apply to it (Wise: the 3% handling fee is "only charged on the amount paid by credit card," not on Alipay account balance).
5. **UnionPay "Nihao China"** — UnionPay's official foreign-visitor app (launched December 19, 2025; supports top-up from international Visa/Mastercard/UnionPay cards — source: UnionPay International, accessed 2026-06-12); treat as backup, not primary.

## See Also

- [[wiki/concepts/mobile-payment.md]] — full Alipay/WeChat setup, fees, limits
- [[wiki/concepts/foreign-exchange.md]] — ATMs, cash limits, where cards work
- [[wiki/concepts/internet-connectivity.md]] — why a VPN can break payments, eSIM options
