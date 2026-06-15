---
title: Internet Access and the Great Firewall for Foreign Visitors
date: 2026-05-04
last_verified: 2026-06-15
verified_against:
  - https://chinasurvivalkit.com/blog/china-firewall-test-websites-apps-guide
  - https://nordvpn.com/blog/vpn-for-china/
  - https://landingin.syncosmic.com/blog/vpn-china-2026-what-actually-works
  - https://www.airalo.com/china-esim
  - https://www.airalo.com/help/using-managing-esims/ZSEEHBT5HW6F/stay-connected-in-china-your-guide-to-unfiltered-internet-access-is-a-vpn-required/ZDZBNIKI4TFP
sources:
  - raw/internet-gfw-guide-2026.md
  - raw/realchinaguide-vpn-guide-2026.md
  - raw/realchinaguide-remote-work-2026.md
  - raw/realchinaguide-tech-setup-2026.md
  - raw/realchinaguide-troubleshooting-2026.md
related:
  - wiki/concepts/sim-card.md
  - wiki/concepts/mobile-payment.md
  - wiki/concepts/remote-work-china.md
  - wiki/concepts/language-barrier.md
volatility: high
review:
  status: audited
  page_audit: 2026-06-15
  citation_check: 2026-05-06
description: >-
  What China's Great Firewall blocks (Google, WhatsApp, Instagram), which VPNs
  still work after the 2026 crackdown, and why a foreign eSIM bypasses it with
  no VPN. Updated June 2026.
faqs:
  - q: 'Do I need a VPN to access Google, WhatsApp and Instagram in China?'
    a: >-
      Only if you connect through a Chinese SIM or local Wi-Fi. A foreign eSIM
      (Airalo, Holafly, Nomad) routes your data via international roaming
      through gateways outside mainland China, so it bypasses the Great Firewall
      and blocked services work without a VPN. With a Chinese SIM or local Wi-Fi
      you do need a working VPN.
  - q: Which VPNs still work in China in 2026?
    a: >-
      VPN reliability is a moving target — a service that works one week can be
      blocked the next, and the 2026 crackdown disrupted many. As of June 2026,
      Astrill (StealthVPN) and ExpressVPN (Lightway) are the most consistently
      reported to work; only providers with TLS-based obfuscation reliably
      bypass the firewall. Install and test two VPNs before you fly.
  - q: Can I download a VPN once I'm already in China?
    a: >-
      It's very hard — app stores and VPN websites are largely blocked from
      inside China. Download and test your VPN before arrival. If your only VPN
      stops working, options include a different-region App Store account or
      having someone send you the installer file.
  - q: Is it legal for tourists to use a VPN in China?
    a: >-
      Officially it's restricted, not freely legal: the US State Department
      (2026) warns VPN use is illegal in most cases and could lead to device
      confiscation, a fine, or detention, and China requires VPNs to be
      government-licensed. In practice, enforcement has targeted providers and
      distributors rather than individual tourists using a VPN for personal
      communication, and airport security doesn't check devices — but weigh the
      risk yourself and check your country's official travel advisory.
category: guide
---

# Internet Access and the Great Firewall for Foreign Visitors

China's internet is filtered by the **Great Firewall (GFW, 防火长城)** — a nationwide system that blocks thousands of foreign websites and apps. Every internet connection inside mainland China — hotel Wi-Fi, local SIM data — passes through it, **unless you use a foreign eSIM** (see [Foreign eSIM](#how-does-a-foreign-esim-get-online-without-a-vpn) below). This page covers what's blocked, what works natively, and how to prepare.

## What is blocked in China?

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

## What works in China without a VPN?

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

## What should I set up before arriving in China?

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
- Install your chosen VPN (see [VPN Setup](#how-do-i-set-up-a-vpn-for-china) below for provider recommendations)
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

## How do I set up a VPN for China?

### Why You Need a VPN

Without a VPN you lose access to Gmail, WhatsApp, Google Maps, YouTube, and most Western communication tools. For many visitors these are essential. A working VPN restores full internet access.

### Install Before Arrival

VPN provider websites are blocked in China. App stores remove VPN apps for users on Chinese accounts. **You cannot download or set up a VPN after arrival.** Install at least two VPN apps and purchase subscriptions before your flight.

### Reliable Providers (as of June 2026)

Approximate monthly costs below are typical long-term plan rates and shift with promotions — check each provider's site before buying. Rankings reflect the China-focused expat and traveler community as of June 2026 and change as the GFW evolves.

| Provider | Protocol for China | Approx. cost | Reliability | Notes |
|---|---|---|---|---|
| **Astrill** | StealthVPN | ~$15–30/month | Often rated most consistently reliable by the China expat community; stealth protocol | Long track record against the GFW; expensive |
| **ExpressVPN** | Lightway with obfuscation | ~$8–13/month | Well-regarded; Lightway protocol; frequent updates for China | 30-day money-back guarantee; in-app chat works even when VPN is down |
| **Surfshark** | NoBorders mode | ~$2–5/month | Mixed reports; NoBorders mode helps but inconsistent | Budget option; enable NoBorders before arriving |
| **NordVPN** | Obfuscated servers | ~$4–8/month | Has had significant difficulties in China in recent years; not recommended as primary | China's deep packet inspection has outpaced NordVPN's obfuscation; keep as backup only. |
| **Shadowsocks** | SOCKS5 proxy | Self-hosted / varies | Very high (self-hosted) | Technical option for advanced users; harder to block than commercial VPNs; not user-friendly |

> Note: A general crackdown in 2026 ("the Great Unplug") tightened detection further — standard WireGuard, OpenVPN, and IKEv2 are now blocked with near-total accuracy inside China, so providers relying only on those protocols (without TLS-based obfuscation) increasingly fail.

VPN reliability changes rapidly as the GFW evolves. No provider guarantees connectivity. Performance degrades during politically sensitive periods (National Day, NPC sessions, etc.). Always install 2+ providers before departure.

**Free VPNs do not work.** Free VPNs consistently fail in China — they lack the obfuscation needed to evade the GFW and are typically blocked within days. Experienced travelers overwhelmingly report that only paid, China-tested providers stand a chance.

Check current reviews from China-focused tech sites (e.g. VPNmentor, Comparitech China guides) immediately before travel — GFW detection improves constantly and provider rankings shift.

### Multi-VPN Backup Strategy

**Subscribe to at least 2 VPN providers** (~$10–15/month total). This is the single most important VPN recommendation from experienced China travelers.

- If one VPN gets blocked, switch immediately to the backup.
- Recommended combinations: ExpressVPN + Astrill, or ExpressVPN + Surfshark.
- Multiple travelers report catastrophic failures with single-VPN setups (stuck without Western internet for days, unable to download alternatives because VPN websites are also blocked).
- During politically sensitive periods (National Day Oct 1, Party Congress), even the best VPNs struggle — backups become critical.

### How Reliable Are VPNs?

VPN reliability in China is not guaranteed. The GFW uses machine learning to detect and block VPN traffic. Connections degrade around politically sensitive dates (National Day, Party Congress, major anniversaries). Even reliable VPNs experience outages. Keep two providers installed and switch if one fails.

**Peak-hour degradation:** VPN speeds often become unusable during 7–10 PM when network congestion is highest. Plan data-heavy tasks (video calls, streaming) outside these hours.

**Battery drain:** Maintaining a VPN connection continuously drains battery significantly. Carry a power bank.

### Legal Status for Foreign Visitors

**Legal status (important):** The US State Department (updated May 2026) states that VPN use in China is 'illegal in most cases and may result in confiscation of your device, a fine, or detention.' The UK FCDO notes that VPNs need to be licensed by the Chinese government. In practice, enforcement has historically targeted VPN providers and distributors rather than individual foreign tourists using VPNs for personal communication. However, travelers should be aware of the legal risk and make their own informed decision. This wiki provides information only — consult your country's official travel advisory.

Airport security does not check for VPN apps on devices.

### VPN Troubleshooting

When your VPN stops working in China, try these steps in order:

1. **Switch server locations** — try Hong Kong, Japan, Singapore, or US servers.
2. **Change protocols** — cycle through OpenVPN, Lightway (ExpressVPN), IKEv2, L2TP.
3. **Force close and restart** the VPN app.
4. **Clear browser cache and cookies** — some apps cache blocks even with VPN active. Try incognito/private browsing mode.
5. **Restart your device** — sometimes the network stack needs a full reset.
6. **Contact VPN support** — ExpressVPN and Astrill offer 24/7 chat. ExpressVPN's in-app chat works even when the VPN itself is down. Save support email addresses offline as backup.
7. **Switch to backup VPN** — if the primary fails for 30+ minutes, activate your second provider.

**Common timing issues:** VPN that worked yesterday may not work today — the GFW updates blocking lists continuously. Try again later; often connections restore within hours.

### If You Forgot to Install VPN Before China

This is a difficult situation because VPN provider websites are themselves blocked. Options:

1. **Ask your hotel** — some hotels will help guests set up VPN on their devices, or offer business center computers with VPN access.
2. **Use saved mirror links** — ExpressVPN provides special China mirror download URLs to subscribers. If you saved these in your notes app before arrival, they may still work.
3. **Wait until Hong Kong or Macau** — the GFW does not apply there; you can freely download and configure VPN apps, then return to the mainland.
4. **Airport WiFi** — upon landing, airport WiFi may allow initial VPN connections. Test immediately before leaving the airport.
5. **Use another traveler's device** — as a last resort, briefly access a VPN website from a device that already has VPN working.

**Prevention:** Save VPN setup guides as offline PDFs. Save mirror links in your notes app. Email VPN download links to yourself (accessible via Outlook/Yahoo which work without VPN).

## How does a foreign eSIM get online without a VPN?

A foreign eSIM (Airalo, Holafly, Ubigi) routes all data through gateways outside mainland China, bypassing the GFW entirely without a VPN. Google, WhatsApp, YouTube, and all other services work natively. Costs run from a few dollars for a small fixed-data pack to roughly $70 for a 30-day unlimited plan (as of June 2026) — the current per-provider pricing table and comparison live in [[wiki/concepts/sim-card.md]].

**Trade-off:** eSIMs provide data only — no Chinese phone number (+86). If you need a +86 number for app registrations or SMS verification, you will need a local physical SIM in addition.

For visitors staying up to a few weeks who don't need a local number, the eSIM approach is the most reliable connectivity solution.

### eSIM + VPN Combinations

All three providers below bypass the GFW via international roaming — none *requires* a VPN. The "built-in VPN" column indicates whether the provider also bundles a VPN app for added redundancy.

| eSIM Provider | Built-in VPN? | Best for | Notes |
|---|---|---|---|
| **Holafly** | Yes (bundled) | Travelers who want zero setup hassle | Frequently recommended in traveler communities. Unlimited data. The bundled VPN can be slower than a dedicated VPN during peak evening hours — some carry a backup VPN. |
| **Airalo** | No | Budget travelers comfortable with tech | Popular budget choice. Works without any VPN via roaming. Current plan pricing is maintained in [[wiki/concepts/sim-card.md]]. |
| **Nomad** | No | Budget alternative | Works via roaming, no VPN needed; often cheaper than Holafly. |

**How the bypass works:** A foreign travel eSIM connects via *international roaming*, not China's domestic network — your data is routed through gateways outside mainland China (typically Hong Kong or Singapore), so to the GFW you appear as an international roaming user. This means a standalone data eSIM like Airalo bypasses the firewall on its own: Google, WhatsApp, and social media work without any VPN. Airalo's own documentation confirms "a VPN is NOT required" with its China eSIM (source: airalo.com, accessed June 2026). A bundled VPN (as with Holafly) is a convenience, not a requirement — and some travelers still carry a separate VPN as a backup in case roaming routing is degraded.

**VPN data overhead:** On capped data plans, VPN encryption adds roughly 20–30% extra data usage. Factor this into your data plan choice.

**Dual-SIM strategy:** Some travelers buy Holafly eSIM for data + VPN convenience, plus a local China Mobile physical SIM (~$10) for a Chinese phone number (needed for Alipay registration and some services). Best of both worlds.

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

## Does the Great Firewall apply in Hong Kong, Macau, and Taiwan?

The GFW does **not** apply in Hong Kong, Macau, or Taiwan. All standard international services work normally in these territories without a VPN.

## See Also

- [[wiki/concepts/sim-card.md]] — foreign eSIM options that bypass GFW natively; local SIM options
- [[wiki/concepts/mobile-payment.md]] — WeChat and Alipay setup before arrival
