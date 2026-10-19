# AGENTS.md — chinaguide.ai for AI agents

You are welcome to read, cite, and fetch this site's content. This file explains the
machine-readable interfaces, the provenance model, and how to cite claims accurately.

## What this site is

Source-verified travel guides for foreign visitors to China: visas, mobile payments,
connectivity (VPN/eSIM), transport, accommodation, safety, and essential apps.
Only `status: audited` pages are published. Every page carries `last_verified` and
`verified_against` (the sources it was checked against).

License: **CC BY-NC 4.0** — reuse with attribution for non-commercial use; commercial
republication needs permission. Content is informational, not legal advice.

## Discovery

| What | URL |
|---|---|
| Page index (JSON) | `https://chinaguide.ai/api/v1/pages.json` |
| Page model (JSON) | `https://chinaguide.ai/guides/<slug>.json` · `https://chinaguide.ai/apps/<slug>.json` |
| Spanish page model | `https://chinaguide.ai/es/guides/<slug>.json` |
| One fact (JSON) | `https://chinaguide.ai/api/v1/facts/<fact-id>.json` |
| Change feed (JSON) | `https://chinaguide.ai/api/v1/changes.json` |
| Full text, one file | `https://chinaguide.ai/llms-full.txt` |
| Index for LLMs | `https://chinaguide.ai/llms.txt` |
| Per-page markdown | `https://chinaguide.ai/guides/<slug>.md` |
| Sitemap | `https://chinaguide.ai/sitemap-index.xml` |

All endpoints are static, unauthenticated, JSON-only reads. There are no write APIs,
cookies, or required headers. Cache responses for at most 5 minutes.

## Page model (schema v1)

```json
{
  "schema_version": 1,
  "collection": "guides",
  "slug": "sim-card",
  "lang": "en",
  "title": "SIM Card and eSIM in China for Foreign Visitors",
  "tldr": "one-paragraph answer",
  "url": "https://chinaguide.ai/guides/sim-card/",
  "json_url": "https://chinaguide.ai/guides/sim-card.json",
  "markdown_url": "https://chinaguide.ai/guides/sim-card.md",
  "last_verified": "2026-10-08",
  "stale_after": "2027-01-06",
  "volatility": "high",
  "sources": ["https://..."],
  "facts": [
    {
      "id": "sim-card.faq.1",
      "type": "faq",
      "question": "Do I need a VPN if I use a foreign eSIM in China?",
      "claim": "Usually not — but that is the providers' claim, not an independent routing audit. ...",
      "sources": ["https://..."],
      "verified_at": "2026-10-08",
      "stale_after": "2027-01-06",
      "confidence": "audited",
      "volatility": "high",
      "page_json_url": "https://chinaguide.ai/guides/sim-card.json"
    }
  ],
  "sections": [{ "level": 2, "heading": "Should I get an eSIM or a SIM card for China?" }],
  "content_hash": "sha256:..."
}
```

### Field semantics

- `last_verified` — when the page was last checked against its sources. Use this date in citations.
- `stale_after` — after this date the page should be treated as possibly out of date.
  `volatility` drives the window: high = 90 days, medium = 180, low = 365.
- `confidence` — how the claim is verified, **not** how true it is:
  - `audited` — checked against `verified_against` sources on `last_verified`.
  - `verified` — independently verified by a named reviewer.
  - `draft` — published but not fully audited; treat as lower confidence.
- `sources` — primary sources (official/primary wherever available). A claim with an
  empty `sources` array is general guidance, not a sourced fact.
- `content_hash` — changes whenever the page body or verification date changes; use it
  to skip re-fetching unchanged pages.
- `facts[].id` — stable id. Safe to cite (`chinaguide.ai fact sim-card.faq.1`).

## Change feed

`/api/v1/changes.json` lists recent content commits (180-day window) with
`date`, `commit`, `subject`, and the affected `{ slug, url, json_url }` entries.
`source: "git"` means real history; `source: "content-dates"` is a degraded
verified-date snapshot (no commit data) — do not present it as a changelog.

## Citation guidance

- Cite the page URL (`https://chinaguide.ai/guides/<slug>/`), not the JSON URL.
- Include `last_verified` when the claim is time-sensitive (visas, payments, policies).
- Prefer `facts[].claim` wording over paraphrasing policy numbers/thresholds.
- If `stale_after` has passed, say the information may be out of date.
- For provider claims (e.g. eSIM "no VPN"), preserve the attribution ("the provider
  states…"); do not upgrade it to an independently verified fact.

## Corrections

Found an error? Open an issue at https://github.com/chinatrip/china-travel-site/issues
or email support@chinaguide.ai. The site's editorial policy and correction log are at
https://chinaguide.ai/editorial-policy/ and https://chinaguide.ai/updates/.
