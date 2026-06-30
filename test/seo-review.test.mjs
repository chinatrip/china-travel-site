import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { z } from 'zod';
import {
  filterContentPaths,
  buildReviewInput,
  evaluatePageVerdict,
  aggregateResults,
  decideExitCode,
  renderMarkdownReport,
  loadPageHistory,
  reviewPage,
  verdictCompleteness,
  PageVerdictSchema,
  CRITERION_IDS,
  ADVISORY_IDS,
} from '../scripts/seo-review.mjs';

// ---- fixtures ---------------------------------------------------------------
const SAMPLE_MD = `---
description: "A solid 130-character meta description about getting around China by train and metro for foreign visitors in 2026, with apps."
faqs:
  - q: "Do I need a Chinese number?"
    a: "Usually no — a foreign eSIM covers data for most apps."
title: Getting Around
category: guide
---

# Getting Around China

Intro paragraph.

## How do I take the metro?

Use the metro mini-program.

### Buying tickets

Scan at the gate.

## Can I book a taxi?

Yes, via DiDi. See [[wiki/entities/didi.md]].
`;

/** A clean LLM verdict: all criteria passed, all faqs grounded. */
function cleanVerdict(overrides = {}) {
  return {
    slug: 'getting-around',
    collection: 'guides',
    criteria: CRITERION_IDS.map((id) => ({ id, score: 5, severity: 'none', passed: true, rationale: 'ok' })),
    faqGrounding: [{ question: 'Do I need a Chinese number?', groundingStatus: 'grounded' }],
    blockingIssues: [],
    suggestions: [],
    overallScore: 5,
    modelPassRecommendation: true,
    ...overrides,
  };
}

/** Derived facts for a healthy page (in-range meta, 1 FAQ). */
function cleanDerived(overrides = {}) {
  return {
    slug: 'getting-around',
    collection: 'guides',
    descriptionMissing: false,
    descriptionLength: 130,
    faqCount: 1,
    ...overrides,
  };
}

function withCriterion(verdict, id, patch) {
  return {
    ...verdict,
    criteria: verdict.criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)),
  };
}

// ---- filterContentPaths -----------------------------------------------------
test('filterContentPaths keeps only guides/apps markdown', () => {
  const out = filterContentPaths([
    'src/content/guides/visa-types.md',
    'src/content/apps/amap.md',
    'src/content/guides/sub/deep.md', // nested — excluded
    'src/layouts/GuideLayout.astro',
    'README.md',
    'src/content/guides/notes.txt',
    '  src/content/apps/didi.md  ', // trimmed
  ]);
  assert.deepEqual(out, ['src/content/guides/visa-types.md', 'src/content/apps/amap.md', 'src/content/apps/didi.md']);
});

test('filterContentPaths empty input → []', () => {
  assert.deepEqual(filterContentPaths([]), []);
});

// ---- buildReviewInput -------------------------------------------------------
test('buildReviewInput parses frontmatter, faqs, headings, derived', () => {
  const input = buildReviewInput(SAMPLE_MD, 'src/content/guides/getting-around.md');
  assert.equal(input.slug, 'getting-around');
  assert.equal(input.collection, 'guides');
  assert.equal(input.derived.faqCount, 1);
  assert.equal(input.derived.descriptionMissing, false);
  assert.equal(input.derived.h1, 'Getting Around China');
  assert.deepEqual(input.derived.h2Headings, ['How do I take the metro?', 'Can I book a taxi?']); // H3 excluded
  assert.deepEqual(input.derived.h3Headings, ['Buying tickets']);
  assert.equal(input.derived.wikilinkCount, 1);
  assert.equal(input.derived.titleWithSuffix, 'Getting Around | ChinaGuide.ai');
});

test('buildReviewInput flags missing description + apps collection', () => {
  const md = `---\ntitle: Foo\n---\n# Foo\n## H2?`;
  const input = buildReviewInput(md, 'src/content/apps/foo.md');
  assert.equal(input.collection, 'apps');
  assert.equal(input.derived.descriptionMissing, true);
  assert.equal(input.derived.faqCount, 0);
});

// ---- evaluatePageVerdict (the gate) -----------------------------------------
test('clean verdict → pass, no blocking', () => {
  const r = evaluatePageVerdict(cleanVerdict(), cleanDerived());
  assert.equal(r.pass, true);
  assert.equal(r.blocking.length, 0);
});

test('ungrounded FAQ → blocks', () => {
  const v = cleanVerdict({ faqGrounding: [{ question: 'Q', groundingStatus: 'ungrounded', problemQuote: 'made-up fact' }] });
  const r = evaluatePageVerdict(v, cleanDerived());
  assert.equal(r.pass, false);
  assert.ok(r.blocking.some((b) => b.id === 'faq_grounding'));
});

test('overclaims FAQ → blocks (priority case)', () => {
  const v = cleanVerdict({ faqGrounding: [{ question: 'Q', groundingStatus: 'overclaims' }] });
  const r = evaluatePageVerdict(v, cleanDerived());
  assert.equal(r.pass, false);
  assert.ok(r.blocking.some((b) => b.id === 'faq_grounding'));
});

test('missing meta description → blocks', () => {
  const r = evaluatePageVerdict(cleanVerdict(), cleanDerived({ descriptionMissing: true, descriptionLength: 0 }));
  assert.equal(r.pass, false);
  assert.ok(r.blocking.some((b) => b.id === 'meta_description'));
});

test('out-of-range meta length → blocks; in-range borderline → pass', () => {
  const tooLong = evaluatePageVerdict(cleanVerdict(), cleanDerived({ descriptionLength: 200 }));
  assert.equal(tooLong.pass, false);
  const borderline = evaluatePageVerdict(cleanVerdict(), cleanDerived({ descriptionLength: 55 }));
  assert.equal(borderline.pass, true);
});

test('model-failed faqpage_schema_readiness → blocks', () => {
  const v = withCriterion(cleanVerdict(), 'faqpage_schema_readiness', { passed: false, rationale: 'answer has a CTA' });
  const r = evaluatePageVerdict(v, cleanDerived());
  assert.equal(r.pass, false);
  assert.ok(r.blocking.some((b) => b.id === 'faqpage_schema_readiness'));
});

// ---- fail-closed on incomplete model output ---------------------------------
test('page has FAQs but faqGrounding is empty → blocks (fail-closed)', () => {
  const v = cleanVerdict({ faqGrounding: [] });
  const r = evaluatePageVerdict(v, cleanDerived({ faqCount: 1 }));
  assert.equal(r.pass, false);
  assert.ok(r.blocking.some((b) => b.id === 'faq_grounding' && b.detail[0].includes('fail-closed')));
});

test('faqGrounding covers fewer FAQs than the page has → blocks (fail-closed)', () => {
  const v = cleanVerdict(); // grounds 1 question
  const r = evaluatePageVerdict(v, cleanDerived({ faqCount: 3 }));
  assert.equal(r.pass, false);
  assert.ok(r.blocking.some((b) => b.id === 'faq_grounding' && b.detail[0].includes('1/3')));
});

test('no-FAQ page with empty faqGrounding → still passes', () => {
  const v = cleanVerdict({ faqGrounding: [] });
  const r = evaluatePageVerdict(v, cleanDerived({ faqCount: 0 }));
  assert.equal(r.pass, true);
});

test('missing blocking criterion in model output → blocks under its own id (fail-closed)', () => {
  for (const id of ['faq_wellformed', 'faqpage_schema_readiness', 'title_quality', 'meta_description']) {
    const v = cleanVerdict();
    v.criteria = v.criteria.filter((c) => c.id !== id);
    const r = evaluatePageVerdict(v, cleanDerived());
    assert.equal(r.pass, false, `missing ${id} must fail-close`);
    assert.ok(r.blocking.some((b) => b.id === id && b.detail[0].includes('missing')), `blocks under ${id}`);
  }
});

test('missing criterion does not duplicate an existing machine-check block', () => {
  const v = cleanVerdict();
  v.criteria = v.criteria.filter((c) => c.id !== 'meta_description');
  const r = evaluatePageVerdict(v, cleanDerived({ descriptionMissing: true, descriptionLength: 0 }));
  assert.equal(r.pass, false);
  assert.equal(r.blocking.filter((b) => b.id === 'meta_description').length, 1);
});

test('missing ADVISORY criterion does NOT block', () => {
  const v = cleanVerdict();
  v.criteria = v.criteria.filter((c) => !ADVISORY_IDS.includes(c.id));
  const r = evaluatePageVerdict(v, cleanDerived());
  assert.equal(r.pass, true);
});

test('verdictCompleteness reports gaps', () => {
  const incomplete = cleanVerdict({ faqGrounding: [] });
  incomplete.criteria = incomplete.criteria.filter((c) => c.id !== 'title_quality');
  const c = verdictCompleteness(incomplete, cleanDerived({ faqCount: 2 }));
  assert.equal(c.complete, false);
  assert.deepEqual(c.missingBlockingCriteria, ['title_quality']);
  assert.equal(c.groundingGap, 2);
  assert.equal(verdictCompleteness(cleanVerdict(), cleanDerived()).complete, true);
});

test('advisory-only failures do NOT block', () => {
  let v = cleanVerdict();
  for (const id of ADVISORY_IDS) v = withCriterion(v, id, { passed: false, rationale: 'meh' });
  const r = evaluatePageVerdict(v, cleanDerived());
  assert.equal(r.pass, true);
  assert.equal(r.blocking.length, 0);
  assert.equal(r.advisory.length, ADVISORY_IDS.length);
});

// ---- aggregate + exit code --------------------------------------------------
test('aggregateResults: one blocked page fails overall', () => {
  const pass = evaluatePageVerdict(cleanVerdict({ slug: 'a' }), cleanDerived({ slug: 'a' }));
  const fail = evaluatePageVerdict(
    cleanVerdict({ slug: 'b', faqGrounding: [{ question: 'Q', groundingStatus: 'ungrounded' }] }),
    cleanDerived({ slug: 'b' }),
  );
  const agg = aggregateResults([pass, fail]);
  assert.equal(agg.overallPass, false);
  assert.equal(agg.pageCount, 2);
  assert.deepEqual(agg.failedPages, ['b']);
});

test('decideExitCode: advisory always 0; blocking 1 on fail; infra fail-closed', () => {
  const failAgg = aggregateResults([
    evaluatePageVerdict(cleanVerdict({ faqGrounding: [{ question: 'Q', groundingStatus: 'ungrounded' }] }), cleanDerived()),
  ]);
  const passAgg = aggregateResults([evaluatePageVerdict(cleanVerdict(), cleanDerived())]);
  assert.equal(decideExitCode(failAgg, 'advisory'), 0);
  assert.equal(decideExitCode(failAgg, 'blocking'), 1);
  assert.equal(decideExitCode(passAgg, 'blocking'), 0);
  assert.equal(decideExitCode(passAgg, 'blocking', { infraError: true }), 1);
  assert.equal(decideExitCode(passAgg, 'advisory', { infraError: true }), 0);
});

// ---- report -----------------------------------------------------------------
test('renderMarkdownReport includes marker + per-page sections + mode label', () => {
  const agg = aggregateResults([
    evaluatePageVerdict(
      cleanVerdict({ slug: 'b', faqGrounding: [{ question: 'Q', groundingStatus: 'overclaims' }] }),
      cleanDerived({ slug: 'b' }),
    ),
  ]);
  const advisory = renderMarkdownReport(agg, { mode: 'advisory' });
  assert.ok(advisory.startsWith('<!-- seo-review-bot -->'));
  assert.ok(advisory.includes('WOULD BLOCK'));
  assert.ok(advisory.includes('`guides/b`'));
  const blocking = renderMarkdownReport(agg, { mode: 'blocking' });
  assert.ok(blocking.includes('BLOCKING'));
});

// ---- memory -----------------------------------------------------------------
test('loadPageHistory skips # and blank lines, filters by slug', () => {
  const jsonl = [
    '# comment',
    '',
    JSON.stringify({ slug: 'amap', verdict: 'pass' }),
    JSON.stringify({ slug: 'didi', verdict: 'blocked' }),
    'not-json',
    JSON.stringify({ slug: 'amap', verdict: 'blocked', blocking: ['x'] }),
  ].join('\n');
  const hist = loadPageHistory(jsonl, 'amap');
  assert.equal(hist.length, 2);
  assert.ok(hist.every((h) => h.slug === 'amap'));
});

// ---- schema strict-mode compatibility ----------------------------------------
test('PageVerdictSchema: faqGrounding extras are nullable (OpenAI strict mode), not optional', () => {
  // Regression: .optional() drops the key from `required` in the JSON schema and OpenAI
  // strict structured outputs reject the whole request ("Missing 'problemQuote'").
  const v = cleanVerdict({
    faqGrounding: [{ question: 'Q', groundingStatus: 'grounded', problemQuote: null, bodySupport: null }],
  });
  PageVerdictSchema.parse(v); // null must be accepted
  const item = z.toJSONSchema(PageVerdictSchema).properties.faqGrounding.items;
  assert.deepEqual([...item.required].sort(), ['bodySupport', 'groundingStatus', 'problemQuote', 'question']);
});

// ---- reviewPage with injected model ----------------------------------------
test('reviewPage uses injected callModel + stamps slug/collection', async () => {
  const input = { derived: { slug: 'x', collection: 'apps', faqs: [], h2Headings: [], descriptionMissing: true, descriptionLength: 0, titleWithSuffix: 'X | ChinaGuide.ai', titleLength: 16, h1: 'X', wikilinkCount: 0, bodyForGrounding: 'body', description: '' }, history: [] };
  const stub = async () => cleanVerdict({ slug: 'WRONG', collection: 'guides' });
  const v = await reviewPage(input, { standards: 's', calibration: 'c' }, { callModel: stub });
  assert.equal(v.slug, 'x'); // re-stamped from input
  assert.equal(v.collection, 'apps');
});

test('reviewPage retries on incomplete verdict, returns the complete one', async () => {
  const derived = { slug: 'x', collection: 'apps', faqs: [{ q: 'Q?', a: 'A.' }], faqCount: 1, h2Headings: [], descriptionMissing: false, descriptionLength: 130, titleWithSuffix: 'X | ChinaGuide.ai', titleLength: 16, h1: 'X', wikilinkCount: 0, bodyForGrounding: 'body', description: 'd' };
  let calls = 0;
  const stub = async () => {
    calls++;
    return calls === 1 ? cleanVerdict({ faqGrounding: [] }) : cleanVerdict({ faqGrounding: [{ question: 'Q?', groundingStatus: 'grounded' }] });
  };
  const v = await reviewPage({ derived, history: [] }, { standards: '', calibration: '' }, { callModel: stub, retries: 2 });
  assert.equal(calls, 2);
  assert.equal(v.faqGrounding.length, 1);
});

test('reviewPage returns incomplete verdict after retries exhaust (gate blocks it downstream)', async () => {
  const derived = { slug: 'x', collection: 'apps', faqs: [{ q: 'Q?', a: 'A.' }], faqCount: 1, h2Headings: [], descriptionMissing: false, descriptionLength: 130, titleWithSuffix: 'X | ChinaGuide.ai', titleLength: 16, h1: 'X', wikilinkCount: 0, bodyForGrounding: 'body', description: 'd' };
  let calls = 0;
  const stub = async () => {
    calls++;
    return cleanVerdict({ faqGrounding: [] }); // always incomplete
  };
  const v = await reviewPage({ derived, history: [] }, { standards: '', calibration: '' }, { callModel: stub, retries: 1 });
  assert.equal(calls, 2); // 1 + 1 retry
  const r = evaluatePageVerdict(v, derived);
  assert.equal(r.pass, false); // fail-closed at the gate
});

test('reviewPage retries then throws on persistent error', async () => {
  let calls = 0;
  const stub = async () => {
    calls++;
    throw new Error('boom');
  };
  await assert.rejects(
    reviewPage({ derived: { slug: 'x', collection: 'apps', faqs: [], h2Headings: [], descriptionMissing: true, descriptionLength: 0, titleWithSuffix: '', titleLength: 0, h1: '', wikilinkCount: 0, bodyForGrounding: '', description: '' }, history: [] }, { standards: '', calibration: '' }, { callModel: stub, retries: 1 }),
    /boom/,
  );
  assert.equal(calls, 2); // 1 + 1 retry
});

// ---- CI workflow gate config (regression) -----------------------------------
// Read the `SEO_REVIEW_MODE` set on the `seo-review` job in ci.yml. Scoped to that
// job's block so an unrelated occurrence elsewhere can't satisfy the assertion.
// Plain text parse (no yaml dep) keeps this independent of the package tree.
function seoReviewModeFromWorkflow(yamlText) {
  const lines = yamlText.split('\n');
  const jobIdx = lines.findIndex((l) => /^ {2}seo-review:\s*$/.test(l));
  assert.notEqual(jobIdx, -1, 'seo-review job not found in ci.yml');
  for (let i = jobIdx + 1; i < lines.length; i++) {
    // A line at exactly 2-space indent that is non-blank starts the next sibling job.
    if (/^ {2}\S/.test(lines[i])) break;
    const m = lines[i].match(/^\s+SEO_REVIEW_MODE:\s*(\S+)\s*$/);
    if (m) return m[1];
  }
  return null;
}

test('ci.yml: seo-review job runs in blocking mode (gate is enforced)', () => {
  const ciYml = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  assert.equal(
    seoReviewModeFromWorkflow(ciYml),
    'blocking',
    'seo-review job must set SEO_REVIEW_MODE: blocking so the SEO/GEO gate actually blocks merges',
  );
});
