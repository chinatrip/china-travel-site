---
title: "Why Did My Payment Fail in China?"
date: 2026-06-15
last_verified: 2026-09-17
verified_against:
  - https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html
  - https://english.beijing.gov.cn/specials/paymentservices/news/202505/t20250528_4100629.html
  - https://english.beijing.gov.cn/travellinginbeijing/essentials/inboundtourismfacilitationmeasures/202603/t20260326_4566766.html
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
  notes: "2026-09-17 re-verification of the fee and limit anchors, prompted by the page crossing its 90-day high-volatility threshold (94 days) and blocking --ci-mode repo-wide. The notes below asked for exactly this: 'Fees/limits are high-volatility — recheck against mobile-payment.md before update.' THE NUMBERS SURVIVED; THE ATTRIBUTIONS DID NOT. (1) The ¥200 / 3% terms are still current, and now rest on a NEWER official source than before: Beijing municipal government 2026-03-26, verbatim 'All international bank card users are eligible for a waiver of the 3 percent transaction fee on every single transaction under 200 yuan' (added to verified_against; the May-2025 notice is kept as the earlier record). Also confirmed there that the threshold is PER TRANSACTION. (2) OVERCLAIM CORRECTED: the page asserted the ¥200/3% terms for 'Alipay and WeChat' and cited the Beijing notice as confirmation. That notice — and its March 2026 successor — cover WeChat Pay ONLY. The Alipay consumer help pages reachable from global.alipay.com describe merchant settlement, not foreign-card consumer fees, and the 3% in our Wise citation is Taobao/Tmall e-commerce, not offline merchant QR. Also tried: bjchy.gov.cn overseas-cards page (HTTP 473), english.shanghai.gov.cn banking-services page (content not extractable). Alipay's terms are now stated as the uniform secondary-source report they are, explicitly not as officially confirmed. The figure was NOT changed — only the strength of the claim. (3) UNDERCLAIM CORRECTED, opposite direction: the $5,000/transaction and $50,000/year figures were attributed to Wise and hedged as verification 'may be able to increase your limit to' them. They are the regulatory ceiling raised by the State Council in April 2024, and english.www.gov.cn — already in verified_against — states them verbatim. The hedge was removed and the attribution moved to the official source. The unverified-tier figures (~$500 / ~$2,000) remain Wise-only and are still attributed that way; that Wise page is dated 2025-07-30 and self-labels as over a year old. (4) ADDED, officially sourced and previously absent: the 60-consecutive-day full waiver on daily sub-¥1,000 transactions for new WeChat Pay users, capped at ¥30 per transaction. It explains the common 'my companion was not charged' case. Added to the body and to the ¥200 FAQ. SCOPE: last_verified BUMPED to 2026-09-17 because the fee and limit anchors genuinely were re-fetched today. NOTHING ELSE was re-checked — the merchant-vs-personal-QR rule, P2P send/receive asymmetry, VPN risk-control, SMS blocking, bank-blocks-binding and all six traveler-reported items retain their 2026-06-15 status, and page_audit (2026-06-12) and citation_check (2026-06-15) are unchanged. (5) CROSS-CHECK RESULT, and it inverts what I first assumed: mobile-payment.md had ALREADY made this distinction correctly and needs no fix. Its Alipay fee table says the Beijing circular confirms the threshold for the foreign-card 3% fee, then adds verbatim that 'Alipay is widely reported to apply the same ¥200 threshold, though Alipay does not publish an Alipay-specific fee schedule confirming it (traveler-/guide-reported for Alipay specifically, not independently verified from an Alipay source)'. It also already books $5,000/$50,000 as the regulatory PBOC ceiling. So payment-failures.md was the DEGRADED copy of a distinction its sibling already drew — and this page's own notes have said 'recheck against mobile-payment.md before update' since 2026-06-15, which is exactly the check that would have caught it. Worth naming as a gate blind spot: the two pages agreed on every NUMBER, so no consistency check flags them; they differed only in how strongly each claimed its evidence, and nothing compares that. mobile-payment.md is left unmodified here (its claims are sound); it could optionally cite the 2026-03-26 notice in place of the May-2025 one. Found by /wiki-lint 2026-09-17. --- Adopted into the wiki from the site GEO page (issue #18): site-route links converted to [[wiki/...]], and the full failure table consolidated here from mobile-payment.md (issue #22 item 3). Fix iteration 1 (2026-06-15): the 9 NOT_FOUND claims from the first Type-3 run were each resolved — merchant/personal-QR + P2P (receive-only), VPN-trips-fraud, unverified-account limits, 3%-on-full-amount, SMS-blocked, bank-blocks-binding, and balance-no-surcharge are now sourced to chinavigators / Wise / China Survival Kit (added to verified_against); the multi-week refund window, the platform-risk-control silent block, the redirect-filter, the checkout-unselectable card, and the WeChat contact-vouching framing are degraded in text to 'traveler-reported, not independently verified' (Shuimu BBS, outside verified_against). Re-run Type-3 (2026-06-15): 16 supported / 0 contradicted / 6 NOT_FOUND, where all 6 NOT_FOUND are the explicitly traveler-reported items (silent risk-control block, 3-D Secure binding step, checkout-unselectable card, redirect filter, WeChat contact-vouching, multi-week refund). Fees/limits are high-volatility — recheck against mobile-payment.md before update."
description: >-
  Alipay or WeChat Pay failing in China? A personal QR code, a VPN on, a likely
  3% fee at ¥200 or more, or an unverified account — plus the fix. Sept 2026.
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
      Usually your card issuer refused the 3% foreign-card surcharge the wallet
      adds above ¥200. WeChat Pay officially waives that fee on every
      transaction under ¥200; Alipay is uniformly reported at the same threshold
      but publishes no confirmation. Ask the merchant to split the bill under
      ¥200 — WeChat's threshold is per transaction, so several small payments
      each stay fee-free — or switch apps. New WeChat Pay users also get a
      60-day full waiver on daily transactions under ¥1,000, which is why a
      companion may be charged when you are not.
  - q: 'My card worked fine, then suddenly stopped — what happened?'
    a: >-
      Platform risk-control or a spending limit can block a card with no warning
      — this one is traveler-reported rather than independently verified. Try
      the other app, unbind and re-bind the card, complete passport verification
      if you haven't, or fall back to cash. With both Alipay and WeChat Pay set
      up, nearly every merchant accepts at least one.
category: guide
---

# Why Did My Payment Fail in China? Troubleshooting for Foreigners

**Short answer:** four causes explain most everyday foreign-card payment failures in China —

1. you're paying a **personal** QR code, not a **merchant** one,
2. your **VPN is on**,
3. the payment is **¥200 or more** and your bank declined the wallet's 3% surcharge, or
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

**Short answer: your card issuer refused the surcharge.** Above a ¥200 threshold the
wallet adds a 3% foreign-card fee on the full amount paid by card, and some issuers
decline the surcharged total.

**How firmly that ¥200 threshold is established differs by app**, so this section states
the two separately rather than as a single rule — the figures below are official for
WeChat Pay and reported-but-unconfirmed for Alipay.

**WeChat Pay — confirmed by an official notice.** Beijing's municipal government,
26 March 2026: "All international bank card users are eligible for a waiver of the
3 percent transaction fee on every single transaction under 200 yuan." The threshold is
**per transaction**, so several separate sub-¥200 payments in one day each stay fee-free.

**New to WeChat Pay? You may pay nothing at all for 60 days.** The same notice
describes "a full waiver of the 3 percent transaction fee on daily transactions under
1,000 yuan for 60 consecutive days starting from their first transactions", capped at
¥30 saved per transaction. If a travel companion is being charged and you are not, a
different waiver window is the likely reason — not a fault with either card.

**Alipay — widely reported at the same ¥200 / 3% terms, but we could not confirm it in
an official source.** Every government page we could reach on this (Beijing municipal,
May 2025 and March 2026) states the ¥200 waiver for WeChat Pay only; the Alipay
consumer help pages we could reach cover merchant settlement rather than foreign-card
consumer fees; and the 3% figure in our Wise citation describes Taobao/Tmall
**e-commerce** purchases, not offline merchant QR payments. Treat ¥200 / 3% as the
working assumption for Alipay — it is what secondary sources uniformly report — but
budget for the possibility that its terms differ, and do not quote it as official.

- **Ask the merchant to split the bill** into amounts under ¥200 each — they're used to it. On WeChat Pay that removes the fee outright; Alipay is reported to behave the same way, so it is still the first thing to try there.
- Or switch to the **other app**, or pay part in cash.
- A card with **0% foreign-transaction fees** avoids the issuer's portion but not the wallet's — WeChat Pay's 3% applies from ¥200 up, and Alipay is reported to match.
- If a Chinese friend can send you RMB, **wallet-balance payments don't carry the foreign-card surcharge** — Wise states the handling fee is "only charged on the amount paid by credit card," while spending from the Alipay account balance is "not calculated for handling fees" (that wording is from Wise's e-commerce fee page, so read it as the fee attaching to the card rather than to the wallet, not as an offline-specific guarantee; see fallback #4 below).

## My card worked, then suddenly stopped — why?

Travelers report that Alipay/WeChat risk-control or a regulatory spending cap can block a previously-working card **with no warning or error message** (not independently verified).

- Switch to the **other app** (if Alipay fails, WeChat usually works, and vice versa).
- **Unbind and re-bind** the card.
- Make sure your **passport ID verification** is complete. Unverified foreign accounts are capped low — Wise reports roughly **$500 per transaction / $2,000 per year**. The verified ceiling is not a third-party estimate but a regulatory limit, raised in April 2024 and stated verbatim on `english.www.gov.cn`: "The single transaction limit for overseas visitors using mobile payments on payment platforms has now been raised from 1,000 U.S. dollars to **5,000 dollars**. The annual cumulative transaction cap has been increased from 10,000 dollars to **50,000 dollars**." Verification does not merely "may be able to" raise your limit — it moves you onto that published ceiling.
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
