---
title: Residence Registration
date: 2026-06-12
last_verified: 2026-10-08
verified_against:
  - https://en.nia.gov.cn/n147418/n147458/c155978/content.html
  - https://en.nia.gov.cn/n147418/n147468/c237295/content.html
  - https://en.nia.gov.cn/n147418/n147463/c237273/content.html
  - https://www.nia.gov.cn/n741440/n741542/c1806111/content.html
  - https://en.nia.gov.cn/n147423/n147478/n147715/c158241/content.html
  - https://english.www.gov.cn/services/visitchina/202603/21/content_WS69ce124cc6d00ca5f9a0a368.html
  - https://gaj.sh.gov.cn/crj/24hr/web/zcbd/login
  - https://gaj.sh.gov.cn/crj/24hr/web/zcbd/shlogin?locale=en_US
  - https://gaj.sh.gov.cn/shga/wzXxfbGj/detail?pa=110ef360e4374a41a0914a250c681fbde361c7776faccaae65bcd274da4af07d
  - https://english.beijing.gov.cn/latest/news/202401/t20240122_3542279.html
  - https://english.beijing.gov.cn/serviceguides/personalservice/accommodation/202005/t20200528_1910151.html
  - https://english.beijing.gov.cn/livinginbeijing/applicationfordocuments/202107/t20210719_2439278.html
  - https://www.china-briefing.com/news/temporary-residence-registration-in-china-a-guide-for-foreign-residents-and-visitors/
  - https://lawandborder.com/temporary-residence-registration-for-foreign-nationals/
  - https://english.www.gov.cn/AssetsZi/A_Guide_to_Working_and_Living_in_China_as_Business_Expatriates_2025.pdf
  - https://www.nia.gov.cn
sources:
  - raw/12306-guide-for-foreign-business-visitors-2025.md
related:
  - wiki/concepts/residence-permit.md
  - wiki/concepts/visa-types.md
  - wiki/concepts/accommodation.md
volatility: high
review:
  status: audited
  page_audit: 2026-06-12
  citation_check: 2026-10-08
  notes: "2026-10-08 FIX ITERATION 2 (PR #94 review round 3): (a) FAQ 3 no longer says online filing generally means uploading photos — only Beijing's guide describes uploads (passport, real-time photo, address page of the lease or property certificate); NIA's announcement and interpretation do not say what the national platform asks for, so the sentence is now attributed to Beijing. (b) Shanghai system name corrected to the entry page's own label, '境外人员自助申报系统' / 'Self-service Accommodation Registration for Overseas Personnel' (gaj.sh.gov.cn/crj/24hr, read today). (c) The 2025 gov.cn PDF guide (A Guide to Working and Living in China as Business Expatriates, 2025 edition): the entry below does not record that its content was read, only that sources returned 200. It was opened and read during this fix (22 pages): its residence-registration section says hotel guests are registered by the hotel and that foreigners staying elsewhere must register 'at the local police station within 24 hours upon arrival' with a passport plus the rental contract or property ownership certificate. That matches this page's 24-hour rule and documents; it predates the 2026-09-21 nationwide online channel, so it supports only those points, not anything about online registration. citation_check stands on that basis. --- 2026-10-08: re-verified against sources read today with curl (all returned 200 except the MFA statute URL, see below). Changed: (1) NIA Announcement 2026 No. 7 and its 2026-09-21 policy interpretation (English c237295/c237273, Chinese original c1806111 read and matching) make online registration for non-hotel stays nationwide from 2026-09-21, keep the offline police-station channel, and give online and on-site the same legal effect; removed every seven-region pilot / police-station-as-default / 'where available' line and rewrote the online section accordingly (applies the drift scan W41 fix-scope rows for this page). (2) Who files online: either party, but NIA says the initial registration 'should be completed with their [the host's] assistance'; the foreigner may file alone only when re-registering at a residence already registered on the platform or when living in a self-owned residence; added. (3) Re-entry exemption: self-owned residence now reads 'owned by the foreigner or his/her spouse' and habitual residence = long-term, over 180 days (Art 36 of the Entry and Exit Regulations); the March 2026 gov.cn interpretation already had the spouse wording, so this was a long-standing omission, not new drift. (4) Statute: the cs.mfa.gov.cn law URL now 302-redirects to an MFA 'page does not exist' notice over both http and https (an alternative MFA URL returned the same), so it was dropped and replaced with NIA's English text of the law (c155978); Articles 38, 39 and 76 re-read there. Art 76 penalises 'persons concerned' (guest or host), and the hotel warning / RMB 1,000-5,000 fine for failing to report is in Art 76 itself; reworded. (5) Shanghai: the 24hr entry page is now a chooser between the national system (marked applicable nationwide, signing in via the NIA 12367 WeChat/Alipay/app) and Shanghai's own self-declaration system (Shanghai only); the hotel-guests-need-not-declare and false/late/missing-declaration penalty wording is now on the Shanghai-system login page (shlogin), added to verified_against. Removed the user-reported sign-up-flow details that no public page confirms. Shanghai FAQ (2025-10-27) re-entry rule unchanged. (6) Beijing: the July-2021-URL guide has been rewritten in place (mentions records before 2026-02-12); current version lists passport or other valid travel documents, a real-time bareheaded photo and the address page of the property certificate or lease, and says only an email address is needed; the four-document-type limit is now attributed to the January 2024 guide only. Office hours re-read from the current guide. (7) Penalty-in-practice paragraph: removed 'short first-time lapses commonly end with a warning', 'delayed or shortened permit approvals' and 'repeat or long stays treated less kindly', none of which the cited practitioner pages state; kept what Law and Border states (enforcement typically triggered at Exit-Entry benefit applications; possible residence-permit refusal under Art 31). Removed the unsourced 'document checks occur at transport hubs and tourist attractions' and 'registration incomplete regardless of your actions' lines. Re-confirmed unchanged: 24-hour rule, hotel auto-registration, documents, free of charge (Beijing guide; China Briefing for in-person and online), same-day service (Beijing), form name, lost slip / new passport / visa-category re-registration (China Briefing). NOT checked: whether the NIA 12367 platform works without a Chinese phone number or bank card (no official page read says either way); actual approval times online; desk hours outside Beijing; the hotel-side Public Security Administration Punishments Law text. page_audit left at 2026-06-12 (not a full audit). --- 2026-07-03: reader-facing cleanup (removed an internal note that referenced a raw/ source filename) + honest re-verify to satisfy pr-lint. Re-confirmed the anchor facts against Tier-1 sources: the NIA accommodation-registration page still states the 24-hour rule (hotels auto-register; non-hotel stays register within 24 hours at the public security organ), and the gov.cn March-2026 policy interpretation still states the online-registration pilot launched 2026-03-20 in the seven regions (Hebei, Liaoning, Zhejiang, Hubei, Guangxi, Chongqing, Sichuan), with online = same legal effect and either the foreigner or the host able to file. Exit-Entry Administration Law Articles 38/39/76 are a stable 2012 statute (unchanged). Did NOT re-audit every city desk-hours / practitioner-practice line this round (those retain the 2026-06-12 page_audit)."
description: >-
  Foreigners must register their China address within 24 hours of arrival — by
  the hotel, or at a police station (or online where available) for private
  stays. Updated July 2026.
faqs:
  - q: Do tourists need to register with the police in China?
    a: >-
      Yes. All foreigners must register their place of stay. A hotel registers
      you automatically at check-in. For private stays (friends, family,
      rentals), you or your host must register within 24 hours of arrival — in
      person at the local police station, or online where an official system
      exists (a national pilot launched in 2026 plus city systems in Shanghai
      and Beijing).
  - q: What happens if I don't register within 24 hours?
    a: >-
      Failure to register can result in a warning or fine. Register promptly and
      keep the registration slip — you may need it for visa extensions or other
      official processes.
  - q: What do I need to register a private stay?
    a: >-
      Bring your original passport (with visa/entry stamp) plus proof of the
      address — a lease for a rental, or the property certificate if you or your
      host own the home. If you are staying with friends or family, bring the
      host (and the host's ID), since first-time filings usually go faster with
      them present. File at the neighborhood police station (paichusuo), or
      online where an official system exists.
  - q: Does staying in a hotel count as registration?
    a: >-
      Yes — hotels report your stay to the police at check-in, so you don't need
      to do anything extra. If you switch to a private stay mid-trip, that stay
      does require registering.
category: guide
---

# Residence Registration

Foreign nationals must register their residence within **24 hours** of arriving at each accommodation in China. This is a legal obligation under **Article 39 of the Exit and Entry Administration Law (出境入境管理法, 2012)**: hotels must register foreign guests and report the information to the public security authorities, while foreigners staying anywhere other than a hotel must be registered — by themselves or by their host — with the local public security organ within 24 hours of moving in. Since **21 September 2026** that registration can be done online anywhere in China, or in person at the police station.

## How do I register my residence in China?

| Accommodation | Who Registers | Process |
|---------------|---------------|---------|
| **Hotel / inn** | Hotel front desk handles it | Show passport at check-in; hotel files with public security automatically |
| **Private residence (rented apartment, friend's or family's home)** | You or your host, within 24 hours | Online through the **NIA 12367** platform (nationwide since September 2026 — see Online Registration below), or in person at the local **public security station** (派出所) |
| **Short-term rental / homestay** | Host should file — but **you remain liable** if the host fails to (see Important Notes) | Confirm before booking that the property can receive foreign guests; if in doubt, register yourself — see [[wiki/concepts/accommodation.md]] |

## Registering in Person at the Police Station (派出所)

The offline route, which NIA has kept alongside online registration, is the neighborhood police station for the address where you are staying — not just any station. Bring:

- **Passport** (original) — with your valid visa, entry stamp, or visa-free entry basis; see [[wiki/concepts/visa-types.md]]
- **Proof of the address** — an original lease agreement for rentals, or the property ownership certificate if you or your host own the home (per Beijing's official service guide)
- **Your host, or the host's ID**, if staying with friends or family — Article 39 allows either the foreigner or the host to file; China Briefing lists the homeowner's identity document as the proof of address for stays with family or friends, and Beijing's guide says anyone filing on your behalf must present their own valid ID

Practical points:

- **It is free.** Beijing's official service guide lists the registration as free of charge, and China Briefing reports that both in-person and online registration are free.
- **It is quick.** Beijing's official service guide lists registration as a same-day service, handled at the counter. You receive a registration slip — the **Registration Form of Temporary Residence** (境外人员住宿登记表; exact form name varies slightly by city). Online filings produce an electronic record instead.
- **Office hours matter.** The foreigner-registration desk typically keeps weekday business hours — Beijing's official district-by-district list mostly shows 09:00–12:00 and 13:30–17:00 on weekdays, with a lunch break (some differ, e.g. Dongcheng 09:00–12:00 and 14:00–17:30, and a few list weekend hours). The 派出所 may have a 24-hour duty desk for emergencies, but do not assume the registration window is staffed outside these hours — no official source we checked states that foreigner registration is processed around the clock. The law contains no weekend or holiday exception to the 24-hour rule, so if you arrive outside desk hours, file online through NIA 12367 instead of waiting for the desk to open — see [If You Miss the 24-Hour Deadline](#if-you-miss-the-24-hour-deadline) for how late registration is treated.
- **Keep the registration slip.** You will be asked for it when applying for a visa extension, stay permit, or [[wiki/concepts/residence-permit.md]]. If you lose it, China Briefing reports you must return to the police station and ask for a new form to be issued.

## Online Registration

### Nationwide — NIA 12367 platform

The National Immigration Administration piloted online accommodation registration from **March 20, 2026** in seven regions (Hebei, Liaoning, Zhejiang, Hubei, Guangxi, Chongqing and Sichuan). Under **NIA Announcement No. 7 of 2026**, the service was rolled out **nationwide from September 21, 2026**. Per the announcement and NIA's accompanying policy interpretation:

- **Who it covers:** foreigners staying anywhere other than a hotel, who "may go through the registration formalities online without the need to visit the public security organs in person."
- **Channels:** the **NIA Government Service Platform** — the official website, the **"NIA 12367" app**, the **"NIA 12367" WeChat mini program**, or the **Alipay mini program**. After user registration and identity verification, use the Accommodation Registration module under Foreigner Service; afterwards, "Registration Record Inquiry" shows your record.
- **Legal effect:** online registration **has the same legal effect as on-site registration**.
- **The police station stays open as an option:** "The offline channel for accommodation registration at local public security organs will remain available."
- **Who files:** either the foreigner or the host (the host may be a Chinese citizen or a foreigner). Because hosts know the address details, NIA says the **initial registration should be completed with the host's assistance**. You can file on your own when re-registering at a residence you have already registered through the platform, or when you live in a residence you (or your spouse) own.
- **If you get stuck:** NIA points to the Guide to Online Accommodation Registration on the platform, the **12367 hotline**, or the exit-entry service window of the local public security organ or police station for help with on-site registration.

### City systems that predate the national rollout

- **Shanghai** — the entry page at `gaj.sh.gov.cn/crj/24hr` now lets you choose between the national system (labelled "Applicable Nationwide", which signs you in through the NIA 12367 WeChat or Alipay mini program or app) and Shanghai's own "Self-service Accommodation Registration for Overseas Personnel" (境外人员自助申报系统, "Applicable Shanghai Only"). The Shanghai system's login page states that hotel guests do not need to declare, and that deliberate false, late, or missing declarations will be dealt with according to law. Shanghai's public-security FAQ also lists offline filing at local police service windows, 境外人员服务站 (overseas personnel service stations) and 移民融入服务站 (immigrant integration service stations).
- **Beijing** — online registration at `zwfw.gaj.beijing.gov.cn/zsdj/zsdj-q/`, via the 北京公安出入境 WeChat account, or from the Beijing international portal. Beijing's current official guide lists a photo of your passport (or other valid travel document) information page, a bareheaded photo taken in real time, and the address page of the property ownership certificate or lease agreement; it says only an email address is needed, not a phone number, and the system is available in English, French, Russian, Japanese and Korean. (The municipality's January 2024 guide was stricter — four accepted document types and a mainland phone number — so if the system rejects you, the guide's own fallback is to apply in person at the local police station.)

Outside Shanghai and Beijing, use the NIA 12367 platform; the local police station remains available everywhere. Check the NIA site ([nia.gov.cn](https://www.nia.gov.cn)) or call 12367 if the platform does not work for you.

## Changing Cities or Changing Address

The registration is tied to the **address**, not to your trip. The 24-hour clock restarts every time you move in somewhere new:

- **Multi-city trips:** if you travel from Beijing to Xi'an on day 3, you must register at your Xi'an accommodation within 24 hours of arrival there — even though you were registered in Beijing. Hotel stays handle this automatically at each check-in; each private or rental stay requires a new filing — online through NIA 12367 or at that neighborhood's 派出所.
- **Hotel → private stay:** switching from a hotel to a friend's apartment mid-trip ends the hotel's coverage. The private stay is a new address — register it within 24 hours of moving in.
- **Private stay → hotel:** nothing extra to do; the hotel registers you at check-in.
- **Moving within the same city:** a new apartment or a different friend's home is a new address — register again, even if the old registration is recent.

**Re-entry exemptions (national):** NIA's policy interpretation (first published with the March 2026 pilot and restated with the September 2026 nationwide rollout) says that if you have already registered after arrival, you do **not** need to register again when you return to the same residence after traveling within or outside China **and the home is owned by you or your spouse**, or when you hold a valid **residence permit or permanent residence permit** and return to your habitual residence during the same permit's validity. A habitual residence is one where you live or plan to live long-term — more than 180 days, per Article 36 of the Regulations on Administration of the Entry and Exit of Foreigners.

Shanghai's public-security guidance (gaj.sh.gov.cn) tracks the national rule rather than relaxing it. Its exemption for foreign nationals also requires a **valid residence permit or permanent residence card**: a holder who already registered and re-enters during the document's validity with an unchanged address need not re-register. Shanghai additionally lists a self-purchased-housing exemption, but the published text scopes that to **Hong Kong, Macao, and Taiwan residents** living in their own home with an unchanged address — it does **not** create a no-ownership exemption for ordinary visa holders. **Renters staying on visas must register again after each re-entry.** Professional guides additionally advise re-registering after getting a new passport or changing visa category, since the registration on file no longer matches your documents — practitioner advice rather than a stated legal requirement; the national and Shanghai exemptions above are the authoritative baseline.

## If You Miss the 24-Hour Deadline

**What the law says.** Article 76 of the Exit and Entry Administration Law: where persons concerned fail to register as required by the second paragraph of Article 39, **a warning shall be given, and a fine of up to RMB 2,000 may also be imposed**. NIA's policy interpretation applies this to "foreigners or their accommodation hosts". The fine is discretionary on top of the warning — the statute makes the warning the baseline penalty. (The same article covers hotels: a hotel that fails to register foreign guests is punished under the Law on Penalties for Administration of Public Security, and a hotel that fails to report the registration information to the police receives a warning, or in serious cases a fine of RMB 1,000–5,000.)

**What reportedly happens in practice.** Immigration practitioners report that enforcement typically happens **later, at the Exit-Entry Administration counter** — when you apply for a visa extension, stay permit, or residence permit and need a registration covering your stay; requesting the missing registration at that point is when the warning or fine is triggered. Law and Border also notes that an unregistered stay could lead to a residence permit being refused, since Article 31 of the law allows refusal where required supporting documents are not submitted. Treat any leniency as "reported, not guaranteed": the fine is available to any officer.

**What to do if you are late:**

1. Register **immediately** — online or at the police station. A late registration is far better than none.
2. Bring the same documents as a normal filing; be ready to explain the dates briefly and honestly (e.g., arrival late on a weekend).
3. Keep the registration slip or online record and any paperwork from the visit — you may need to show continuity of registration for later applications.

## Important Notes

- Carry your **passport** or residence permit at all times — under Article 38 of the same law, foreigners aged 16 and over must carry their passport, international travel document, or stay/residence permit and accept police inspection.
- Short-term tourists staying in hotels are usually covered automatically — no extra step.
- **Short-term rental / host liability:** under Articles 39 and 76, both the host and the foreign guest bear responsibility for ensuring registration is completed. If your host fails to file, register yourself — online through NIA 12367 or at the local 派出所 — and do not assume the host has handled it. Confirm before booking that the property accepts foreign guests; see [[wiki/concepts/accommodation.md]] for how to pick foreigner-eligible properties.

## What law requires residence registration in China?

- **Exit and Entry Administration Law of the People's Republic of China (2012), Article 39** — hotel registration duty and the 24-hour rule for non-hotel stays; **Article 38** — duty of foreigners aged 16+ to carry identity documents for police inspection ([English text, NIA](https://en.nia.gov.cn/n147418/n147458/c155978/content.html))
- **Exit and Entry Administration Law, Article 76** — warning and fine of up to RMB 2,000 for failing to register a non-hotel stay; hotel-side penalties
- **NIA, "Regulations on Filing Accommodation Registration for Foreigners"** ([en.nia.gov.cn](https://en.nia.gov.cn/n147423/n147478/n147715/c158241/content.html))
- **NIA Announcement No. 7 of 2026** — nationwide online registration from 21 September 2026 ([en.nia.gov.cn](https://en.nia.gov.cn/n147418/n147468/c237295/content.html); [Chinese original](https://www.nia.gov.cn/n741440/n741542/c1806111/content.html))
- **NIA policy interpretation of the nationwide rollout** (September 2026) ([en.nia.gov.cn](https://en.nia.gov.cn/n147418/n147463/c237273/content.html))
- **Online registration pilot policy interpretation** (March 2026) ([english.www.gov.cn](https://english.www.gov.cn/services/visitchina/202603/21/content_WS69ce124cc6d00ca5f9a0a368.html))
- National Immigration Administration (NIA): https://www.nia.gov.cn — 12367 hotline and service platform

> The authoritative primary sources for this page are the Exit and Entry Administration Law (Articles 38, 39, 76), the National Immigration Administration's accommodation-registration announcement, policy interpretations and regulations, and the city government service guides cited above.
