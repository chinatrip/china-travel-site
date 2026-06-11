# SEO/GEO Review Calibration

> Accepted / rejected **edge cases** that teach the reviewer *this project's tolerance*. The agent injects this alongside `standards.md`. **Curate via PR** whenever a human overrides a verdict — that is how the reviewer "learns" without retraining a model. Keep entries short and concrete.

Format per entry: **CALL** (ACCEPT / REJECT) — situation — why.

## faq_grounding / overclaims (the most-tuned area)

- **REJECT** — FAQ says a provider/app works "always" / "everywhere" / "for everyone" when the body says "usually" / "in most cities" / "as of 2026". Absolutes beyond what the body supports = `overclaims` → block.
- **ACCEPT** — FAQ carries the same hedge as the body ("as of June 2026", "most travelers report…", "verify your provider's current page"). Hedged-to-match-body is fine.
- **ACCEPT** — Standard conservative safety/consular phrasing ("carry your original passport", "confirm visa rules with your embassy") even if not verbatim in the body — common-sense advice, not a fabricated fact.
- **REJECT** — FAQ introduces a specific number/price/date/policy not present in the body (e.g. body gives no fee, FAQ states "3% fee"). Specifics must come from the body = otherwise `ungrounded`.

## meta_description

- **ACCEPT** — 120–160 chars, leads with the page's core question/intent, ends with a soft value hook ("Updated June 2026").
- **REJECT** — Missing (relies on the site's generic fallback), or a truncated/duplicated sentence, or keyword-stuffed.

## title_quality

- **ACCEPT** — Question or benefit-framed, specific ("Do You Need a Chinese Phone Number? +86 for Foreigners in 2026").
- **REJECT** — Bare entity with no intent ("Phone Numbers") or so long the ` | ChinaGuide.ai` suffix truncates in SERP.

## faq_wellformed / answer length

- **ACCEPT** — A short but accurate, front-loaded FAQ answer (e.g. ~30 words that fully answer "Can I use Apple Pay in China?"). Length alone is never a reason to fail `faq_wellformed`; pass it and add a `suggestions` item to expand toward 80–160 words with one concrete detail from the body so AI engines have enough context to cite it.

## faqpage_schema_readiness

- **REJECT** — An "FAQ" whose answer contains a marketing CTA ("Buy now", "Sign up at…") or whose question is not actually a question. Pollutes FAQPage rich results.

<!-- Append human-overridden calls below as they happen, newest first. -->
