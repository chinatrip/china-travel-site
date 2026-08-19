import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { z } from 'zod';
import {
  filterContentPaths,
  buildReviewInput,
  evaluatePageVerdict,
  aggregateResults,
  decideExitCode,
  resolveEnforcedIds,
  BLOCKING_IDS,
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

test('filterContentPaths includes a locale subfolder but not deeper nesting', () => {
  // Regression: translated pages under guides/es/ must be reviewed, not skipped.
  const out = filterContentPaths([
    'src/content/guides/es/visa-types.md', // locale subdir — included
    'src/content/apps/es/alipay.md',       // locale subdir — included
    'src/content/guides/sub/deep.md',      // 3-letter dir — still excluded
    'src/content/guides/es/deep/x.md',     // two levels — excluded
  ]);
  assert.deepEqual(out, ['src/content/guides/es/visa-types.md', 'src/content/apps/es/alipay.md']);
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

test('buildReviewInput preserves the locale prefix in the slug', () => {
  // A translated page keeps its locale in the slug so it stays distinct from the
  // English namesake in the report + decisions ledger.
  const input = buildReviewInput(SAMPLE_MD, 'src/content/guides/es/visa-types.md');
  assert.equal(input.slug, 'es/visa-types');
  assert.equal(input.collection, 'guides');
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

// ---- staged enforcement ----------------------------------------------------
// The gate can be hardened one blocking-class criterion at a time. A criterion
// that is not enforced is still reported, it just cannot fail the run — this is
// what keeps a wiki-sync PR from being hard-blocked by latent issues on pages
// it did not touch (the reason a previous blocking rollout was reverted).

test('resolveEnforcedIds: unset means every blocking criterion', () => {
  for (const raw of [undefined, null, '', '   ']) {
    assert.deepEqual(resolveEnforcedIds(raw), BLOCKING_IDS, `${JSON.stringify(raw)} must mean all`);
  }
});

test('resolveEnforcedIds: parses, trims and de-dupes a subset', () => {
  assert.deepEqual(resolveEnforcedIds('faq_grounding'), ['faq_grounding']);
  assert.deepEqual(resolveEnforcedIds(' faq_grounding , title_quality '), ['faq_grounding', 'title_quality']);
  assert.deepEqual(resolveEnforcedIds('faq_grounding,faq_grounding'), ['faq_grounding']);
});

test('resolveEnforcedIds: a value that parses to no ids throws instead of enforcing nothing', () => {
  // The dangerous shape: SEO_REVIEW_ENFORCED_IDS="," would silently enforce
  // NOTHING while the workflow still declares blocking mode — a gate disabled
  // by a stray comma. Unset/blank already means "all", so this can only be a
  // typo, and it must be loud.
  for (const raw of [',', ' , , ', ',,,', ' ,']) {
    assert.throws(() => resolveEnforcedIds(raw), /contains no ids/, `${JSON.stringify(raw)} must throw`);
  }
});

test('resolveEnforcedIds: rejects ids that are not blocking-class', () => {
  // An advisory id here would silently enforce nothing — fail loudly instead.
  assert.throws(() => resolveEnforcedIds('h2_question_form'), /not blocking-class/);
  assert.throws(() => resolveEnforcedIds('faq_grounding,nonsense'), /nonsense/);
});

test('only enforced criteria fail the run', () => {
  const blocked = evaluatePageVerdict(
    withCriterion(cleanVerdict(), 'meta_description', { passed: false, severity: 'high', rationale: 'too long' }),
    cleanDerived(),
  );
  assert.equal(blocked.pass, false, 'still reported as a blocking-class finding');

  const enforcingOther = aggregateResults([blocked], ['faq_grounding']);
  assert.equal(enforcingOther.enforcedPass, true, 'unenforced finding must not fail the run');
  assert.equal(enforcingOther.overallPass, false, 'but it is still counted as blocking');
  assert.equal(decideExitCode(enforcingOther, 'blocking'), 0);

  const enforcingThis = aggregateResults([blocked], ['meta_description']);
  assert.equal(enforcingThis.enforcedPass, false);
  assert.equal(decideExitCode(enforcingThis, 'blocking'), 1);
});

test('report distinguishes enforced from not-yet-enforced findings', () => {
  const blocked = evaluatePageVerdict(
    withCriterion(cleanVerdict(), 'meta_description', { passed: false, severity: 'high', rationale: 'too long' }),
    cleanDerived(),
  );
  const md = renderMarkdownReport(aggregateResults([blocked], ['faq_grounding']), { mode: 'blocking' });
  assert.match(md, /WOULD BLOCK \(not yet enforced\)/, 'unenforced finding must not be labelled BLOCKING');
  assert.doesNotMatch(md, /\*\*⛔ BLOCKING:\*\*/, 'nothing is actually blocking in this run');
  assert.match(md, /Enforced: `faq_grounding`/, 'report states what is enforced');
  assert.match(md, /Still advisory:.*meta_description/, 'and what is not');
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
    const m = lines[i].match(/^(\s+)SEO_REVIEW_MODE:\s*(\S.*?)\s*$/);
    if (!m) continue;
    const [, indent, value] = m;
    // Plain scalar — return as written.
    if (!/^[>|][-+]?$/.test(value)) return value;
    // Folded/literal block: collect the more-indented lines that follow and join
    // them, so the assertions can see the expression rather than the '>-' marker.
    const body = [];
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[j].trim() === '') continue;
      if (lines[j].search(/\S/) <= indent.length) break;
      body.push(lines[j].trim());
    }
    return body.join(' ');
  }
  return null;
}

// The gate blocks on content PRs and stays advisory on the wiki sync branch and
// the manual full-site scan. That exemption is the whole reason the previous
// blocking rollout could be re-attempted, so it is pinned here: a sync PR
// bundles every pending page and the gate re-reviews each in full, so latent
// issues on untouched pages would otherwise hard-block an unrelated deploy.
test('ci.yml: seo-review blocks on content PRs but not on the sync branch or the manual scan', () => {
  const ciYml = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  const expr = seoReviewModeFromWorkflow(ciYml);
  assert.ok(expr, 'seo-review job must set SEO_REVIEW_MODE');

  assert.match(expr, /github\.event_name == 'pull_request'/, 'blocking must be scoped to pull_request events');
  assert.match(expr, /github\.head_ref != 'auto\/content-sync'/, 'the wiki sync branch must stay advisory');
  assert.match(expr, /'blocking'/, 'the expression must be able to yield blocking');
  assert.match(expr, /'advisory'/, 'and must fall back to advisory');
});

test('ci.yml: enforcement is scoped to faq_grounding only', () => {
  const ciYml = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  const m = ciYml.match(/^\s+SEO_REVIEW_ENFORCED_IDS:\s*(\S+)\s*$/m);
  assert.ok(m, 'seo-review job must pin which criteria are enforced');
  // Widening this is a deliberate decision, not a drive-by edit: every id added
  // here can hard-fail a content PR, and each needs its backlog cleared first.
  assert.deepEqual(
    resolveEnforcedIds(m[1]),
    ['faq_grounding'],
    'only faq_grounding is enforced today — it is the one criterion we have swept for; the other four have not been',
  );
});

// ---- full-site scan coverage (regression) -----------------------------------
// `workflow_dispatch` runs `seo-review.mjs --all`, which reviews every content
// file — but only up to SEO_REVIEW_MAX_FILES, then prints a warning and drops
// the rest. That warning lands in a CI log nobody reads, so a "full-site scan"
// can quietly cover less than the full site. It already did: on 2026-08-19 the
// cap was 40 against a 41-file corpus, so apps/wechat.md was never reviewed and
// the run still reported as a complete scan. This test is the tripwire — when
// the corpus grows past the cap, it fails here instead of silently truncating.
function dispatchScanCap(yamlText) {
  const m = yamlText.match(
    /SEO_REVIEW_MAX_FILES:\s*\$\{\{\s*github\.event_name == 'workflow_dispatch'\s*&&\s*'(\d+)'\s*\|\|\s*'(\d+)'\s*\}\}/,
  );
  return m ? { dispatch: Number(m[1]), pullRequest: Number(m[2]) } : null;
}

function countContentFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countContentFiles(new URL(`${entry.name}/`, dir));
    else if (entry.name.endsWith('.md')) n += 1;
  }
  return n;
}

test('ci.yml: the manual full-site scan cap covers the whole content corpus', () => {
  const ciYml = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
  const caps = dispatchScanCap(ciYml);
  assert.ok(caps, 'seo-review job must set SEO_REVIEW_MAX_FILES per event type');

  const contentFiles = countContentFiles(new URL('../src/content/', import.meta.url));
  assert.ok(contentFiles > 0, 'expected to find content files');
  assert.ok(
    caps.dispatch >= contentFiles,
    `workflow_dispatch cap (${caps.dispatch}) must be >= the ${contentFiles} content files, ` +
      'or `--all` silently reviews only part of the site while reporting a full scan',
  );
});
