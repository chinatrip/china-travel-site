---
category: app
title: Amap (高德地图)
date: 2026-05-06
last_verified: 2026-05-06
verified_against:
  - https://mobile.amap.com
sources: []
related:
  - wiki/concepts/transportation.md
  - wiki/concepts/internet-connectivity.md
  - wiki/entities/didi.md
volatility: low
review:
  status: audited
  page_audit: 2026-05-06
  citation_check: null
---

# Amap (高德地图)

Amap (高德地图, also known as Gaode Maps) is China's most widely used navigation app, operated by Alibaba Group. It is the recommended mapping tool for foreign visitors because Google Maps is blocked by the Great Firewall and does not have reliable offline data for China.

## Why Foreigners Use It

- **Google Maps is blocked** in mainland China — Amap is the functional replacement.
- English-language UI mode is available.
- Real-time traffic, public transit routing, and turn-by-turn navigation work without a VPN.
- POI (point of interest) data for mainland China is far more complete and accurate than any internationally available map service.

## Download

Available outside China on both stores — install before you arrive:

- **iOS**: App Store → search "Amap" or "高德地图"
- **Android**: Google Play → search "Amap"

No account registration is required to use basic navigation.

## Key Features

### Turn-by-Turn Navigation

- Driving, cycling, and walking modes with voice guidance.
- Voice guidance defaults to Chinese; switch to English in **Settings → Voice → English**.
- Real-time traffic overlay and rerouting.

### English UI Mode

Enable via **Me → Settings → Language → English**. POI names in less-touristed areas may still display in Chinese characters; searching in either English or Chinese (pinyin or characters) works.

### Metro and Public Transit Routing

- Enter your start and end points; select the "Transit" tab for metro / bus combinations.
- Shows estimated fares, line transfers, and walking segments.
- Covers all major Chinese cities with metro systems.

### Restaurant Search and Dianping Integration

- Searching for restaurants in Amap shows ratings and reviews sourced from **Dianping** (大众点评), China's dominant restaurant review platform.
- Tap a result to see hours, photos, and user reviews; a "Book" button links through to reservation or delivery.

### Ride-Hailing Aggregation

- Amap aggregates multiple ride-hailing platforms (DiDi, Caocao, and others) in a single booking interface.
- Useful for price comparison — choose the lowest fare across services from one screen.
- Payment goes through whichever service you select; Alipay or WeChat Pay required.

### Offline Map Download

- **Me → Offline Maps → Download** — select a city or province.
- Offline maps allow navigation without mobile data; route recalculation still requires connectivity.
- Recommended for areas with spotty coverage or to avoid data charges.

## Searching: English vs Chinese

Both work well. Tips:

- **Hotel names**: type the English brand name (e.g., "Marriott Beijing") — it reliably resolves.
- **Attractions**: English names work for major sites; use Chinese characters (copy from your itinerary or booking confirmation) for smaller or rural destinations.
- **Addresses**: Chinese address format is province → city → district → street → number; pasting from a booking confirmation is the most reliable approach.

## Apple Maps vs Amap

**iPhone users:** Apple Maps works well in mainland China. Apple sources its China map data from Gaode (Amap), so routing accuracy is equivalent — you do not need to download Amap for basic point-to-point navigation.

However, Amap is still recommended for iPhone users when you need:
- Public transit routing with live departure times
- Dianping restaurant reviews directly in the map interface
- Ride-hailing aggregation (DiDi, Caocao, and others in one screen)
- Offline map download for areas with spotty coverage

**Android users:** Google Maps is blocked in mainland China and Google Play is unavailable without a VPN — Amap is required.

## Limitations vs Google Maps

- Coverage is **mainland China only** — no routing data for Hong Kong, Macau, or overseas destinations.
- Some POI names display only in Chinese characters even in English mode.
- Street-view imagery (panoramic view) is available but less polished than Google Street View in most areas.
- The app assumes you are in China — if you open it before landing the map may default to a seemingly random location.

## Integration with Other Services

- **DiDi**: tap the car icon in Amap to request a DiDi ride without switching apps.
- **Ele.me (food delivery)**: accessible via Amap's search results for restaurants.
- **Alipay**: if you are signed in with an Alipay/Taobao account, your saved addresses and payment method carry over.

## See Also

- [[wiki/concepts/transportation.md]] — transport overview including metro, train, and ride-hailing
- [[wiki/concepts/internet-connectivity.md]] — GFW context and VPN guidance
- [[wiki/entities/didi.md]] — ride-hailing via DiDi directly or through Amap aggregation
