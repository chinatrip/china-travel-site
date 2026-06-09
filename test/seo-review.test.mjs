import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filterContentPaths,
  buildReviewInput,
  evaluatePageVerdict,
  aggregateResults,
  decideExitCode,
  renderMarkdownReport,
  loadPageHistory,
  reviewPage,
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

/** Derived facts for a healthy page (in-range meta). */
function cleanDerived(overrides = {}) {
  return {
    slug: 'getting-around',
    collection: 'guides',
    descriptionMissing: false,
    descriptionLength: 130,
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

// ---- reviewPage with injected model ----------------------------------------
test('reviewPage uses injected callModel + stamps slug/collection', async () => {
  const input = { derived: { slug: 'x', collection: 'apps', faqs: [], h2Headings: [], descriptionMissing: true, descriptionLength: 0, titleWithSuffix: 'X | ChinaGuide.ai', titleLength: 16, h1: 'X', wikilinkCount: 0, bodyForGrounding: 'body', description: '' }, history: [] };
  const stub = async () => cleanVerdict({ slug: 'WRONG', collection: 'guides' });
  const v = await reviewPage(input, { standards: 's', calibration: 'c' }, { callModel: stub });
  assert.equal(v.slug, 'x'); // re-stamped from input
  assert.equal(v.collection, 'apps');
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
