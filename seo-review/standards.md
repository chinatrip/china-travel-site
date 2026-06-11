# SEO/GEO Review Standards — ChinaGuide.ai

> **Living document.** The SEO/GEO review agent (`scripts/seo-review.mjs`) loads this file and injects it as its rubric. **Edit this file to evolve the standards — no code change needed.** Pair it with `calibration.md` (accepted/rejected edge cases) and `decisions.jsonl` (per-page history).

## Site context

English-language, source-verified travel guides for foreign visitors to China. The site targets **both Google Search and AI answer engines (GEO)** — it auto-emits Article + BreadcrumbList + **FAQPage** JSON-LD, publishes an `llms.txt` index, and allowlists AI crawlers (GPTBot, ClaudeBot, PerplexityBot, …). House style: **question-form H2 headings** and a **FAQ block** on most pages. The page **body is already fact-audited upstream in the wiki** — this review judges the *SEO/GEO quality and internal consistency* of the published artifact, **not** the truth of the underlying facts.

## How verdicts work

The model scores each criterion 0–5 with a one-sentence rationale and a `passed` boolean. **Code (`evaluatePageVerdict`) decides the gate**, not the model: a page FAILS only if a **BLOCKING** criterion fails. ADVISORY criteria are reported but never block.

## BLOCKING criteria (must be clean)

1. **`faq_grounding`** ⭐ (the priority rule) — Every FAQ answer must be **grounded in the page BODY only**. Do NOT use outside knowledge to rescue a claim. Classify each FAQ answer:
   - `grounded` — every claim traceable to the body;
   - `partially_grounded` — partly supported;
   - `ungrounded` — introduces facts absent from the body;
   - `overclaims` — states something more strongly/absolutely than the body supports (body says "in most cities / usually" → FAQ says "everywhere / always").
   **Blocks** if any FAQ is `ungrounded` or `overclaims`. When support is unclear, do NOT mark `grounded`.

2. **`faq_wellformed`** — `q` is a genuine question a foreign traveler would ask/search; `a` is concise and **answers the question in its first sentence** (front-loaded — critical for FAQ rich results and AI extraction). **Blocks** if an answer doesn't answer its question or buries the answer.
   *Length guidance — informational only; answer length never makes this criterion fail and must not affect `passed` or `score`:* the ideal FAQ answer is **80–160 words**. If an answer is under ~40 words, it usually lacks the surrounding context AI engines need to cite it — add an item to `suggestions` proposing a concrete expansion (one example, one caveat, or one number from the body). If it exceeds ~200 words, the direct answer drowns — suggest trimming the tail while keeping the front-loaded first sentence. In both cases report via `suggestions` only.

3. **`meta_description`** — Present (not relying on the layout's generic fallback), ~120–160 chars, conveys the page's primary intent, reads as a compelling SERP snippet. **Blocks** if missing or grossly out of range. *(Length is machine-checked: missing or <50 / >180 chars hard-blocks; quality within range is your judgment.)*

4. **`faqpage_schema_readiness`** — The `faqs` feed FAQPage JSON-LD automatically, so they must produce valid, non-spammy markup: every Q is a real question, no duplicate questions, answers self-contained, **no marketing/CTA text** in answers. **Blocks** if the faqs would yield invalid or policy-violating FAQPage markup.

5. **`title_quality`** — Specific, intent-matching, not generic; `"{title} | ChinaGuide.ai"` should stay within ~60 chars of display budget. **Blocks** only if missing, uselessly generic, or so long it truncates badly.

## ADVISORY criteria (report only — never block)

6. **`h2_question_form`** — Most H2 headings should be natural-language questions a traveler would search (house style; strong for "People Also Ask" + AI extraction). Score intent alignment. (A non-question utility heading like "See Also" is fine.)
7. **`direct_answer_geo`** — Does each section lead with a direct, self-contained, quotable answer in the first 1–2 sentences, so an AI engine can lift a clean citation? Are key facts standalone statements rather than buried in narrative? *Background: analyses of AI-cited passages put the sweet spot at roughly **134–167 words** per self-contained, quotable passage — sections (and FAQ answers) near that range are the likeliest to be lifted whole. Treat it as a target when suggesting rewrites, not as a pass/fail line.*
8. **`internal_linking`** — Relevant `[[wiki/...]]` links and a "See Also" section; links relevant, not excessive.
9. **`keyword_intent_match`** — Does the page actually answer the query implied by its title/slug, and cover the obvious sub-questions a foreign traveler has?
10. **`no_keyword_stuffing`** — Flag unnatural keyword repetition, robotic phrasing, over-optimization.
11. **`faqs_present`** — Pages should carry a few FAQs covering top traveler questions (encouraged, not mandated — don't force low-value FAQs onto thin pages).

## Rationale for the split

BLOCKING = things that ship a **broken or misleading artifact** (a hallucinated/overclaiming FAQ answer fed into FAQPage schema → wrong rich results / AI citations; a missing or junk meta description; invalid schema). ADVISORY = optimization signals a human reviewer weighs with editorial judgment. This keeps the gate responsible — it catches the irresponsible-AI-SEO failure modes without nagging on stylistic nits.
