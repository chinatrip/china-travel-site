---
category: guide
title: Internet Access and the Great Firewall for Foreign Visitors
description: "What's blocked in China and how to prepare: VPN options, foreign eSIM bypass, app setup checklist — everything to stay connected behind the Great Firewall."
date: 2026-05-04
last_verified: 2026-05-04
verified_against:
  - https://chinasurvivalkit.com/blog/china-firewall-test-websites-apps-guide
  - https://nordvpn.com/blog/vpn-for-china/
  - https://landingin.syncosmic.com/blog/vpn-china-2026-what-actually-works
  - https://www.airalo.com/china-esim
sources:
  - raw/internet-gfw-guide-2026.md
related:
  - wiki/concepts/sim-card.md
  - wiki/concepts/mobile-payment.md
volatility: high
review:
  status: audited
  page_audit: 2026-05-04
  citation_check: 2026-05-06
---

# Internet Access and the Great Firewall for Foreign Visitors

China's internet is filtered by the **Great Firewall (GFW, 防火长城)** — a nationwide system that blocks thousands of foreign websites and apps. Every internet connection inside mainland China — hotel Wi-Fi, local SIM data — passes through it, **unless you use a foreign eSIM** (see [Foreign eSIM](#foreign-esim--the-vpn-free-alternative) below). This page covers what's blocked, what works natively, and how to prepare.

## What's Blocked

| Category | Blocked services |
|---|---|
| Search | Google, DuckDuckGo; Bing (intermittent) |
| Email | Gmail (app and web) |
| Messaging | WhatsApp, Telegram, Signal, Discord, Slack, Line |
| Social media | Facebook, Instagram, Twitter/X, Reddit, Snapchat, Pinterest, international TikTok |
| Video | YouTube, Netflix, Twitch, Vimeo |
| News | BBC, CNN, NYT, Reuters, Bloomberg, The Guardian and most major foreign outlets |
| Cloud / productivity | Google Drive, Docs, Sheets, Meet; Dropbox; Notion; Medium |
| Navigation | Google Maps, Google Translate (web and app) |
| VPN infrastructure | VPN provider websites, most VPN app store listings |

As of 2026, the GFW blocks thousands of domains and services (source: chinasurvivalkit.com). The list changes — services occasionally get blocked or unblocked without announcement.

## What Works Without a VPN

| Category | Working services |
|---|---|
| Email | Outlook / Hotmail, Yahoo Mail, Apple iCloud Mail |
| Messaging | **WeChat** (dominant — set up before arrival), iMessage between Apple devices via phone number (requires iMessage enabled and cellular or Wi-Fi data) |
| Navigation | **Amap / Gaode (高德地图)** ✅ recommended; Baidu Maps; Apple Maps |
| Translation | Baidu Translate, DeepL, Microsoft Translator, WeChat in-app translation |
| Payment | Alipay, WeChat Pay, most international banking apps |
| Video | Bilibili, iQiyi, Youku, Tencent Video (Chinese content) |
| Search | Baidu (Chinese-language results) |

**Public Wi-Fi note:** most free public Wi-Fi in China (airports, malls, metro stations) requires SMS authentication to a Chinese mobile number to connect. Without a local SIM you may not be able to use it. A foreign eSIM or hotel Wi-Fi (which typically uses room credentials) avoids this barrier.

## Before You Arrive — Pre-Departure Setup

**Install and set up these apps before you leave home.** Several key setup steps — binding a foreign card, SMS verification, the WeChat vouching step — are significantly easier or only possible while you're still on your home carrier with a non-Chinese IP address.

Once in China:
- Google Play is blocked (Android users without a VPN cannot download apps).
- App Store works but is region-restricted for some apps — the Chinese App Store version differs from the international one.
- SMS verification for new accounts is less reliable on a fresh Chinese SIM.

### Must-Have Apps

**1. Alipay** — Primary payment method. Accepted at the overwhelming majority of merchants, restaurants, transport, and attractions.

- Install: App Store / Google Play (available outside China)
- Register with your foreign phone number
- Complete passport identity verification in-app
- Bind a Visa or Mastercard under **Me → Bank Cards → Add Bank Card** (skip the "Tour Pass" prompt if it appears)
- Make a small test payment (≤ ¥10) to confirm the card works
- Call your card issuer to notify them of China travel — some issuers block the Alipay merchant code without pre-trip notification

See [[wiki/concepts/mobile-payment.md]] for fee details and limits.

**2. WeChat** — Messaging, WeChat Pay (second payment method), Mini Programs (embedded apps for DiDi, 12306, attractions, hotels), and receiving money from local contacts.

> **Attraction booking via Mini Programs:** Many major attractions in China — including Tiananmen Square, the Palace Museum, and popular sites during peak periods — require advance ticket reservation through WeChat Mini Programs. Walk-up entry is often unavailable. During Golden Week and national holidays, unreserved visitors are turned away. Complete WeChat setup before departure so you can reserve tickets in advance. (Source: Reddit r/travelchina, 2026-05-08)

- Install: App Store / Google Play
- Register with your foreign phone number
- WeChat may require an existing WeChat contact to scan a QR code to verify your new account — this is a risk-control step that is frequently triggered for foreign-number registrations. Your contact must be registered for 6+ months, have WeChat Pay for 3+ months, not have vouched for another account in the past month, and not be banned. Find a qualifying contact and complete this step **before departure** — it can take days if done mid-trip.
- Bind a Visa or Mastercard: **Me → Services → Wallet → Bank Cards → Add Bank Card**
- Complete passport identity verification

See [[wiki/entities/wechat.md]] and [[wiki/concepts/mobile-payment.md]].

**3. Amap (高德地图 / Gaode Maps)** — Google Maps is blocked by the Great Firewall. Amap is the standard replacement for turn-by-turn navigation, transit directions, and ride-hailing.

- Install: Search "Amap" or "Gaode Maps" on App Store / Google Play
- Open the app, switch to English (Settings → Language), and confirm the map loads your home city — this verifies the install is working before you need it in China

See [[wiki/entities/amap.md]].

**4. DiDi** — Main ride-hailing app. Cheaper and more available than taxis in most cities; English UI available.

- Install: App Store / Google Play. On Google Play, install the **China DiDi** version — the global version does not work properly in mainland China.
- Register with your foreign phone number
- Bind a payment method (Alipay, WeChat Pay, or a foreign card directly in DiDi)
- Set the app to English: Settings → Language
- **Shortcut:** DiDi is also available as a Mini Program inside Alipay — if Alipay is already set up, you can hail rides directly from there without a separate DiDi app.

See [[wiki/entities/didi.md]].

**5. 12306 (China Railway)** — Required for purchasing high-speed rail (高铁) tickets. Foreigners can book directly with a passport number.

- Install: Search "12306" on App Store. On Android outside China, the Google Play version may have limited availability — install the APK from 12306.cn if needed, or book via the English website at [www.12306.cn](https://www.12306.cn)
- Register an account with your passport number
- Add passenger information under **My → My Passengers**
- Confirm you can search routes — try a Beijing → Shanghai search to verify the account works

See [[wiki/entities/12306.md]].

**6. VPN (2+ providers)** — If you need access to blocked services (Google, Gmail, WhatsApp, Instagram, Facebook, YouTube, most Western news sites).

- **Critical:** Download and test your VPN **before departure**. The VPN provider's own website is often blocked in China, making it impossible to download or purchase from within China.
- Install your chosen VPN (see [VPN Setup](#vpn-setup) below for provider recommendations)
- Subscribe to a plan and verify it connects in your home country
- Keep the app updated — outdated VPN apps often stop working after firewall updates
- Note: using a VPN for payment apps (Alipay, WeChat Pay) can occasionally trigger fraud detection. Disable the VPN when completing payments if a transaction is declined unexpectedly.

### Recommended Apps

**7. Meituan (美团)** — Food delivery, hotel booking, bike-sharing, and local entertainment in one app.

- Install: App Store / Google Play. The international version has partial English support; the full Chinese version has more features.
- Register with your foreign phone number. An English-language interface is available in Settings, though some menus remain in Chinese.

See [[wiki/entities/meituan.md]].

**8. UnionPay "Nihao China"** — Supplementary payment app launched December 2025, designed specifically for foreign visitors. Accepts international Visa, Mastercard, and UnionPay cards. Useful as a backup if Alipay or WeChat Pay fails, and includes transit card top-up in major cities.

- Install: Search "Nihao China" or "UnionPay Nihao China" on App Store / Google Play
- Register and bind a card. Coverage is still expanding — treat it as a backup, not a primary.

### Translation Apps

| App | Works without VPN | Notes |
|---|---|---|
| **Baidu Translate** | ✅ Yes | Best VPN-free option; camera/photo translation included; free but ad-heavy |
| **WeChat translate** | ✅ Yes | Tap-to-translate inside WeChat conversations; also translates menus via camera in the WeChat scan feature |
| **Google Translate** | VPN required | Photo/camera mode works and is accurate; slower than native apps. Download language packs offline before arrival. |
| **DeepL** | ✅ Yes | Good for European languages; limited Chinese UX |
| **Microsoft Translator** | ✅ Yes | Solid camera translation; less popular but reliable |

**Practical tip for restaurants:** QR-code menus are nearly universal in China and are in Chinese only. Google Translate camera mode (with a VPN) or Baidu Translate camera mode (no VPN needed) both work for photographing and translating menus. Baidu is slower but requires no VPN.

### Additional Pre-Departure Checklist

- [ ] **Download offline maps** (Apple Maps or Google Maps offline areas — for reference when VPN is down)
- [ ] **Download Google Translate offline packs** for the languages you need
- [ ] **Download entertainment** (Netflix shows, music) for offline use — assume VPN may fail at times
- [ ] **Download Baidu Translate** as a VPN-free translation fallback

## VPN Setup

### Why You Need a VPN

Without a VPN you lose access to Gmail, WhatsApp, Google Maps, YouTube, and most Western communication tools. For many visitors these are essential. A working VPN restores full internet access.

### Install Before Arrival

VPN provider websites are blocked in China. App stores remove VPN apps for users on Chinese accounts. **You cannot download or set up a VPN after arrival.** Install at least two VPN apps and purchase subscriptions before your flight.

### Reliable Providers (2026)

| Provider | Protocol for China | Approx. cost | Notes |
|---|---|---|---|
| **ExpressVPN** | Lightway with obfuscation | ~$8–13/month | Consistently reliable track record in China |
| **Astrill** | StealthVPN | ~$15–30/month | Frequently cited as most reliable for China; higher price |
| **NordVPN** | Obfuscated servers | ~$4–8/month | Enable obfuscation in settings; standard servers are often blocked |
| **Surfshark** | NoBorders mode | ~$3–5/month | Good performance; enable NoBorders before arriving |

Check current reviews from China-focused tech sites (e.g. VPNmentor, Comparitech China guides) immediately before travel — GFW detection improves constantly and provider rankings shift.

### How Reliable Are VPNs?

VPN reliability in China is not guaranteed. The GFW uses machine learning to detect and block VPN traffic. Connections degrade around politically sensitive dates (National Day, Party Congress, major anniversaries). Even reliable VPNs experience outages. Keep two providers installed and switch if one fails.

### Legal Status for Foreign Visitors

Using a personal VPN as a foreign tourist is technically in a legal grey area. Enforcement focuses on VPN providers and Chinese citizens who distribute VPN services — not individual foreign visitors using VPNs for personal communication. Multiple China-focused travel and expat sources (including nordvpn.com and chinasurvivalkit.com) note no documented pattern of foreign tourists being penalised for personal VPN use; however, no guarantee can be given and the situation can change. Thousands of foreign residents and business travelers use VPNs daily as a practical matter.

## Foreign eSIM — The VPN-Free Alternative

A foreign eSIM (Airalo, Holafly, Ubigi — see [[wiki/concepts/sim-card.md]] for pricing and comparison) routes all data through gateways outside mainland China, bypassing the GFW entirely without a VPN. Google, WhatsApp, YouTube, and all other services work natively. Typical cost: $5–25 USD for a 1–4 week data plan.

**Trade-off:** eSIMs provide data only — no Chinese phone number (+86). If you need a +86 number for app registrations or SMS verification, you will need a local physical SIM in addition.

For visitors staying up to a few weeks who don't need a local number, the eSIM approach is the most reliable connectivity solution.

## Quick Reference: Blocked → Alternative

| Blocked | Use instead | VPN needed? |
|---|---|---|
| Google Maps | Amap (高德地图) | No |
| Google Translate | Baidu Translate / WeChat translate | No |
| WhatsApp | WeChat | No |
| Gmail | Outlook or Yahoo Mail | No (or VPN) |
| YouTube | VPN, or Bilibili for Chinese content | Yes for YouTube |
| Google Search | VPN | Yes |
| Instagram / Twitter | VPN | Yes |

## Hong Kong, Macau, Taiwan

The GFW does **not** apply in Hong Kong, Macau, or Taiwan. All standard international services work normally in these territories without a VPN.

## See Also

- [[wiki/concepts/sim-card.md]] — foreign eSIM options that bypass GFW natively; local SIM options
- [[wiki/concepts/mobile-payment.md]] — WeChat and Alipay setup before arrival
