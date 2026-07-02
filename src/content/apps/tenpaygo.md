---
title: "TenPayGo: Tencent's Payment App for Foreign Visitors to China (2026)"
date: 2026-07-02
last_verified: 2026-07-02
verified_against:
  - https://apps.apple.com/us/app/tenpaygo/id6778755338
  - https://technode.com/2026/06/29/tencent-tests-tenpaygo-a-wechat-pay-based-app-for-overseas-visitors/
  - https://news.qq.com/rain/a/20260628A04PLZ00
  - raw/tenpaygo-in-app-guide-2026.md
sources:
  - https://apps.apple.com/us/app/tenpaygo/id6778755338
  - https://play.google.com/store/apps/details?id=com.tencent.wxpai
  - https://technode.com/2026/06/29/tencent-tests-tenpaygo-a-wechat-pay-based-app-for-overseas-visitors/
  - raw/tenpaygo-in-app-guide-2026.md
  - raw/tenpaygo-in-app-guide-2026.jpeg
related:
  - wiki/concepts/mobile-payment.md
  - wiki/entities/wechat.md
  - wiki/entities/alipay.md
volatility: high
review:
  status: audited
  page_audit: 2026-07-02
  citation_check: 2026-07-02
  notes: "New page created 2026-07-02 from the late-June-2026 TenPayGo launch. Press-confirmed facts (email-only signup; link Visa/Mastercard/Apple Pay; no Chinese number or bank account; pay at WeChat Pay merchants via scan-or-be-scanned — TechNode confirms BOTH directions ('generate QR codes for merchants to scan, or scan merchant QR codes themselves'); WeChat Pay rails; limited-test status) grounded to TechNode 2026-06-29 + Apple App Store listing (v1.0.4, listed iPhone-only) + Tencent's official 2026-06-28 response via qq.com. Platform: iOS (App Store) and Android (Google Play, com.tencent.wxpai). Android availability + successful card binding were firsthand-confirmed by the site owner on 2026-07-02 (downloaded from Google Play, bound a card successfully). The Google Play listing page itself is JS-gated and could not be auto-fetched for citation, so Android rests on this firsthand confirmation rather than a fetched listing — the Play URL is in sources as the download link, not in verified_against. The intro pitch claims only 'no Chinese phone number / no domestic bank account' (both source-confirmed); the 'no real-name/passport' looseness is kept only in the hedged Availability section as a testing-period observation, not stated as settled fact. Status is fast-moving: official word (2026-06-28) was 'still testing, not fully open'; a user's firsthand test on 2026-07-02 could register when blocked days earlier — framed here as an opening-but-not-formally-launched rollout, NOT a confirmed public release (no official launch announcement found in search). 2026-07-02 UPGRADE via the app's own in-app guide (app v1.0.4, captured by the site owner; verbatim screenshot + transcription in raw/tenpaygo-in-app-guide-2026.jpeg / .md, now in verified_against): the following are PRIMARY-confirmed and no longer community-hedged — card networks (Visa, Mastercard, American Express, Discover, Diners Club, JCB + Apple Pay, read directly off the Part Two logos), the three pay methods (scan / show pay code / merchant-website checkout), the 'service fee may apply, shown before you confirm' behavior, the per-transaction/day/year limit structure, and refund-to-original-card (Parts Five/Six). Still community/firsthand-reported and explicitly hedged: the specific 0%-under-¥200 / 3%-over fee AMOUNTS (the app publishes no amounts and the pattern appears to be in gray-scale testing) and the 'signup looseness will tighten' read (Zhihu column + Reddit r/travelchina). volatility: high — app is in active weekly iteration (v1.0 2026-06-21 → v1.0.4 2026-07-01); re-verify frequently."
description: >-
  TenPayGo is Tencent's new app for foreign visitors to China — email signup,
  link a foreign card or Apple Pay, pay at WeChat Pay merchants, no Chinese
  number needed.
faqs:
  - q: What is TenPayGo?
    a: >-
      TenPayGo is Tencent's payment app for overseas visitors to China. You
      register with just an email address and link an international Visa or
      Mastercard — or pay through a card already in Apple Pay — then scan a
      merchant's QR code (or show your own) to pay at the tens of millions of
      merchants that accept WeChat Pay, with no Chinese phone number or domestic
      bank account. It runs on Tencent's existing WeChat Pay network.
  - q: Is TenPayGo publicly available yet?
    a: >-
      Not formally. Tencent launched it as a limited test in late June 2026 and,
      as of early July 2026, has not announced a full public release — though
      the signup gate has been opening to more users, so some who were blocked
      days earlier can now register. Availability, onboarding and rules are
      still changing week to week, so treat it as an early-stage rollout.
  - q: Do I need TenPayGo if I can already use Alipay or WeChat Pay?
    a: >-
      Probably not. Since the April 2024 PBOC policy, foreigners can bind a
      foreign Visa or Mastercard directly to Alipay or WeChat Pay without a
      Chinese bank account. TenPayGo's main draw is a lighter, email-only
      signup, so it mainly helps if you want to skip the fuller Alipay/WeChat
      setup — if you already have those working, you likely don't need it.
  - q: What does TenPayGo charge in fees?
    a: >-
      Tencent has not published a fee schedule. Early testers report the same
      pattern as foreign cards on Alipay/WeChat — roughly no fee under ¥200 and
      about 3% above — but others report 3% on all amounts, and the rule appears
      to be in gray-scale testing. Go by the fee shown on your payment screen
      before you confirm.
category: app
---

# TenPayGo: Tencent's Payment App for Foreign Visitors to China (2026)

TenPayGo is a new payment app from **Tencent** (the company behind WeChat Pay), aimed squarely at foreign visitors to China. Its pitch: register with only an **email address**, link an international card or Apple Pay, and pay at the same tens of millions of merchants that already accept **WeChat Pay** — without the Chinese phone number or domestic bank account that have long been the friction points for tourists. It is brand new and moving fast: first listed in late June 2026 and still in an early-stage rollout.

## What is TenPayGo?

TenPayGo is Tencent's standalone app for overseas visitors. Its payment infrastructure is built on Tencent's existing WeChat Pay system (source: TechNode, 2026-06-29), so you are paying the same merchant network as WeChat Pay — but through a much lighter onboarding:

- **Sign up with just an email address** — no Chinese mobile number and no domestic bank account required.
- **Link an international card** — the in-app guide shows Visa, Mastercard, American Express, Discover, Diners Club and JCB — or pay through a card already stored in **Apple Pay** without binding a card at all.
- **Pay three ways**: scan a merchant's QR code, show your own pay code for the merchant to scan, or check out on a supported merchant website inside the app.
- Developer: **Tencent Technology (Shenzhen)**. Platforms: **iOS** (App Store; the iOS listing is iPhone-only) and **Android** (Google Play, package `com.tencent.wxpai`). Interface: **English**.

The supported card networks are confirmed by TenPayGo's own **in-app guide**, which shows **Visa, Mastercard, American Express, Discover, Diners Club International and JCB**, plus **Apple Pay** — the same set of foreign networks Alipay and WeChat Pay accept (source: TenPayGo in-app guide, app v1.0.4, captured 2026-07-02; see `raw/tenpaygo-in-app-guide-2026.md`).

## Is TenPayGo available yet?

**Not as a formal public launch — but the door is opening.** The status is genuinely fast-moving, so here it is by evidence:

- **Tencent's official word (2026-06-28):** TenPayGo is a "life-convenience assistant" for inbound visitors that is *still in a testing phase and not fully open to all users* (Tencent statement carried by Chinese tech media).
- **Late June 2026:** the app quietly appeared on the App Store; registration and core functions were gated behind an internal test.
- **Early July 2026:** the signup gate has been opening — travelers who hit an "internal testing" wall days earlier report being able to register normally. The app is also iterating quickly (v1.0 on 2026-06-21 → v1.0.4 around 2026-07-01).
- **No formal public-launch announcement** has been made as of early July 2026.

A practical caveat early users flag: the current **email-only, no-passport signup is most likely a testing-phase looseness**. When TenPayGo opens fully, passport/identity verification is widely expected to be added (as it already is on Alipay and WeChat Pay), so the easy onboarding may not last. Expect the app, its onboarding, and its rules to keep changing.

## Do you actually need TenPayGo?

For most visitors, **it is a convenience, not a necessity.** Since the **April 2024 PBOC policy**, foreigners can already bind a foreign Visa or Mastercard **directly to Alipay or WeChat Pay** — no Chinese bank account or phone number — and reach essentially the same merchants (see [[wiki/concepts/mobile-payment.md]]). TenPayGo does not unlock a payment network you otherwise couldn't reach.

What TenPayGo *does* offer is a **lighter setup**: email-only signup instead of the fuller Alipay/WeChat registration and passport flow. It is most interesting if you want minimal onboarding, or if you already keep a balance on an overseas card and want another everyday-spending outlet. If you already have Alipay or WeChat Pay working, there is little reason to switch.

## How do you set up and pay with TenPayGo?

Based on TenPayGo's own in-app guide (app v1.0.4) plus early reporting — the app is in active development, so the flow may change:

1. **Download TenPayGo** from the **App Store** (iOS) or **Google Play** (Android).
2. **Sign in with an email address**, then add a payment method. Early users commonly recommend a Gmail address, which has been the reliable way past the testing gate. You may be asked to verify your card or Apple Pay setup before your first payment.
3. **Link an international card or enable Apple Pay.** Add a Visa, Mastercard, Amex, Discover, Diners Club or JCB card, or pay through a card already in Apple Pay (no card-binding needed for the Apple Pay route).
4. **Pay** one of three ways: scan the merchant's QR code, show your own pay code for the cashier to scan, or check out on a supported merchant website inside the app. Review the merchant, amount, and any fees before you confirm; payment settles over the WeChat Pay network. **Safety tip from the app: never screenshot, save, or share your pay code.**

## What does TenPayGo cost, and what are the limits?

**Tencent has not published a specific fee schedule or spending caps.** The app's in-app guide sets the ground rules; community reports fill in the (still-unsettled) specifics:

- **What the app itself says:** a payment with an international card or Apple Pay **may include a service fee**, and the fee and final amount are **always shown before you confirm** — but no amounts are published (source: in-app guide, Part Five).
- **Community specifics (unsettled).** Some early testers report the familiar foreign-card pattern — **no fee under ¥200, about 3% above** (the same economics as a foreign card on Alipay/WeChat, since it settles over the WeChat Pay network). Others report **3% on every amount**. The rule appears to be in **gray-scale testing**, so the only reliable figure is the one on your own payment screen.
- **Limits.** The app states limits **may apply per transaction, per day, or per year**, and that some payment methods become unavailable once a limit is reached — but the numbers are not published (source: in-app guide, Part Five).
- **Refunds.** Refunds are initiated by the merchant and usually returned to the original card; arrival time depends on the merchant, card network, and issuing bank (source: in-app guide, Part Six).
- **Practical read:** if a fee-free small-payment range applies to your account, that is the sweet spot — a coffee, a metro ride, a shared bike. A 3% cut makes it less attractive for large purchases, where the same economics on Alipay/WeChat, or a foreign-card POS swipe, apply anyway.

## See Also

- [[wiki/concepts/mobile-payment.md]] — full foreign-visitor payment guide: Alipay/WeChat setup, PBOC policy, fees, limits, failure modes
- [[wiki/entities/wechat.md]] — WeChat Pay entity overview (TenPayGo runs on this network)
- [[wiki/entities/alipay.md]] — Alipay setup for foreigners
