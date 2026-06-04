---
description: "Alipay or WeChat Pay failing in China? The usual causes are a personal (not merchant) QR code, a VPN left on, the 3% surcharge over ¥200, or an unverified account. Diagnose and fix each, with fallbacks. Updated June 2026."
faqs:
  - q: "Why does my Alipay or WeChat Pay payment keep failing in China?"
    a: "The four common causes are: paying to a vendor's personal QR code (foreign-card wallets can only pay merchant codes), a VPN left switched on, the issuer declining the 3% surcharge on payments of ¥200 or more, or an unverified account hitting a low limit. Set up both apps, complete passport verification, and carry ¥200-500 cash as backup."
  - q: "Why can't I pay a small vendor or pay a friend back?"
    a: "Foreign-card-bound Alipay/WeChat accounts can pay merchant QR codes but cannot send money to a personal collect code or do P2P transfers — that needs a Chinese bank card. If a small vendor uses a personal code, pay with the other app, ask if they have a merchant code, or use cash."
  - q: "Why does my payment fail when my VPN is on?"
    a: "A non-Chinese IP from a VPN can trip Alipay/WeChat fraud checks and get a payment declined. Toggle the VPN off to pay, then back on. On a foreign eSIM with an always-on VPN you can't disable, pay over Chinese Wi-Fi or a Chinese SIM for that transaction."
  - q: "Why do payments of ¥200 or more get declined?"
    a: "Payments of ¥200+ carry a 3% foreign-card surcharge on the full amount, and some issuers decline it. Ask the merchant to split the bill into amounts under ¥200 (which have no surcharge), or switch to the other app."
  - q: "My card worked fine, then suddenly stopped — what happened?"
    a: "Platform risk-control or a regulatory spending limit can block a card with no warning. Try the other app, unbind and re-bind the card, complete passport verification if you haven't, or fall back to cash. Keeping both Alipay and WeChat Pay set up covers ~99% of merchants."
category: guide
title: "Why Did My Payment Fail in China? Troubleshooting for Foreigners (2026)"
date: 2026-06-04
last_verified: 2026-06-04
verified_against:
  - https://www.travelofchina.com/how-to-avoid-international-card-fees-on-alipay/
  - https://english.beijing.gov.cn/specials/paymentservices/news/202505/t20250528_4100629.html
related:
  - wiki/concepts/mobile-payment.md
  - wiki/concepts/foreign-exchange.md
  - wiki/concepts/internet-connectivity.md
volatility: high
review:
  status: audited
  page_audit: 2026-06-04
  notes: "New GEO troubleshooting page distilled from audited mobile-payment.md plus r/travelchina + r/chinalife research (2026-06). Fees/limits are high-volatility — recheck against mobile-payment.md before update."
---

# Why Did My Payment Fail in China? Troubleshooting for Foreigners

**Short answer:** four causes explain almost every foreign-card payment failure in China —

1. you're paying a **personal** QR code, not a **merchant** one,
2. your **VPN is on**,
3. the payment is **¥200 or more** and your bank declined the 3% surcharge, or
4. your account is **unverified** and hit a low limit.

Set up **both** Alipay and WeChat Pay, complete **passport verification**, and carry **¥200-500 cash** — between the two apps and cash you'll cover ~99% of situations. For full setup and fee detail, see [Mobile Payment](/guides/mobile-payment).

## Why is my Alipay or WeChat Pay payment failing?

Find your symptom:

| Symptom | Likely cause | Fix |
|---|---|---|
| Small vendor's QR won't accept payment | It's a **personal** collect code; foreign cards can't pay it | Use the other app, ask for a merchant code, or pay cash |
| Payment declined while connected | **VPN is on** and tripped fraud checks | Turn the VPN off to pay, then back on |
| Fails only on amounts **≥ ¥200** | Issuer declined the **3% surcharge** | Ask to split the bill into amounts under ¥200, or switch apps |
| Limit reached quickly / blocked early | Account **not passport-verified** | Complete ID verification in-app |
| Card was fine, then stopped | **Risk-control / spending limit** hit, no warning | Re-bind card, switch app, or use cash |
| Card binding rejected at setup | Issuer blocks the merchant code or needs 3-D Secure | Call your bank; notify them of China travel first |

## Why can't I pay a small vendor or pay a friend back?

This is the failure nobody warns you about. A foreign-card-bound Alipay or WeChat account can pay **merchant** QR codes, but **cannot send money to a personal collect code or do person-to-person transfers** — that requires a linked **Chinese bank card**.

So when a street stall, tiny restaurant, or individual shows a **personal** receive-QR, your foreign-card payment is refused even though the app works fine elsewhere.

**Fixes:**

- Try the **other app** — the vendor may have both a personal and a merchant option.
- Ask if they have a **merchant code** (商家码) instead of a personal one.
- Pay with **cash**.
- If you're paying a person back, have *them* pay the merchant directly and settle later, or use cash — you can *receive* RMB from a Chinese friend, but a foreign-card account can't *send* it. See [Mobile Payment → Receiving RMB from Friends](/guides/mobile-payment).

## Why does my payment fail when the VPN is on?

A VPN makes your traffic appear to come from outside China, which can trip Alipay/WeChat fraud detection and silently decline a payment.

- **Toggle the VPN off** to complete the payment, then turn it back on.
- On a **foreign eSIM with an always-on VPN** (e.g. Holafly) that you can't disable, do that one payment on **Chinese Wi-Fi** or a **Chinese SIM** instead. See [VPN or eSIM for China](/guides/vpn-or-esim).

## Why do payments of ¥200 or more get declined?

Payments **under ¥200 have no fee**, but at **¥200 or above** Alipay and WeChat add a **3% foreign-card surcharge on the full amount** — and some card issuers decline that surcharge.

- **Ask the merchant to split the bill** into amounts under ¥200 each — they're used to it, and it sidesteps the surcharge entirely.
- Or switch to the **other app**, or pay part in cash.
- A card with **0% foreign-transaction fees** avoids the issuer's portion, but the platform's 3% still applies above ¥200. See [Mobile Payment → fees](/guides/mobile-payment).

## My card worked, then suddenly stopped — why?

Alipay/WeChat risk-control or a regulatory spending cap can block a previously-working card **with no warning or error message**.

- Switch to the **other app** (if Alipay fails, WeChat usually works, and vice versa).
- **Unbind and re-bind** the card.
- Make sure your **passport ID verification** is complete — unverified accounts hit limits fast.
- Fall back to **cash** or, at covered venues (3-star+ hotels, 4A/5A attractions), a **foreign-card POS swipe**.

## What's my fallback when nothing works?

In rough order:

1. **The other wallet** — Alipay ↔ WeChat Pay; together they cover ~99% of merchants.
2. **Cash** — keep ¥200-500 in small bills; essential in tier-2/3 cities, taxis, and street stalls.
3. **Foreign-card POS swipe** — required at 3-star+ hotels and 4A/5A attractions under the 2024 PBOC mandate; ask for the manager if a covered venue refuses.
4. **Receive from a local** — a Chinese friend can send you RMB into your wallet balance (which then spends with no surcharge).
5. **UnionPay "Nihao China"** — a supplementary foreign-visitor app; treat as backup, not primary.

## See Also

- [Mobile Payment](/guides/mobile-payment) — full Alipay/WeChat setup, fees, limits
- [Foreign Exchange & Cash](/guides/foreign-exchange) — ATMs, cash limits, where cards work
- [VPN or eSIM for China](/guides/vpn-or-esim) — why a VPN can break payments
