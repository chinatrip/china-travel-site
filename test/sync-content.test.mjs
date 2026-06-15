import { test } from 'node:test';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {
  splitFrontmatter,
  mergeFrontmatter,
  mergeBody,
  auditedOnly,
  classifyPages,
  recordWarningsInState,
  hasConflictMarkers,
  renderSyncReport,
  SITE_OWNED_FIELDS,
} from '../scripts/sync-content.mjs';

// ---- fixtures ---------------------------------------------------------------
const WIKI_V1 = `---
title: Payments in China
date: 2026-04-30
last_verified: 2026-05-07
review:
  status: audited
---

# Payments

Intro paragraph.

## Setup

Install Alipay before you arrive.

## Cards

Foreign cards rarely work in shops.
`;

// site = wiki v1 + SEO layer (description/faqs/category + question-form H2)
const SITE_CURRENT = `---
title: Payments in China
date: 2026-04-30
last_verified: 2026-05-07
review:
  status: audited
category: guide
description: How foreign visitors pay in China — Alipay, WeChat Pay, cards, and cash, verified for 2026.
faqs:
  - q: "Do foreign cards work in China?"
    a: "Rarely in shops — link them to Alipay instead."
---

# Payments

Intro paragraph.

## How do I set up payments?

Install Alipay before you arrive.

## Cards

Foreign cards rarely work in shops.
`;

// wiki v2: fact-fix in the Cards section (site didn't touch it) → should auto-merge
const WIKI_V2_COMPATIBLE = WIKI_V1.replace(
  'Foreign cards rarely work in shops.',
  'Foreign Visa/Mastercard now work at major chains, but small shops remain cash/Alipay only.',
);

// wiki v2': rewrites the same heading line the site rewrote → conflict
const WIKI_V2_CONFLICTING = WIKI_V1.replace('## Setup', '## Setting Up Payment Apps');

// ---- splitFrontmatter -------------------------------------------------------
test('splitFrontmatter splits block + body; no-frontmatter file → all body', () => {
  const { fmBlock, body } = splitFrontmatter(WIKI_V1);
  assert.ok(fmBlock.startsWith('---\n') && fmBlock.endsWith('---\n'));
  assert.ok(body.startsWith('\n# Payments'));
  assert.deepEqual(splitFrontmatter('# Just body'), { fmBlock: '', body: '# Just body' });
});

// ---- mergeFrontmatter -------------------------------------------------------
test('mergeFrontmatter keeps wiki fields verbatim + re-injects site-owned fields', () => {
  const { fmBlock, fieldConflicts } = mergeFrontmatter(SITE_CURRENT, WIKI_V2_COMPATIBLE, { defaultCategory: 'guide' });
  assert.equal(fieldConflicts.length, 0);
  const merged = matter(fmBlock).data;
  assert.equal(merged.title, 'Payments in China'); // wiki-owned, from wiki
  assert.equal(merged.category, 'guide'); // site-owned, preserved
  assert.ok(merged.description.includes('How foreign visitors pay'));
  assert.equal(merged.faqs.length, 1);
  assert.equal(merged.faqs[0].q, 'Do foreign cards work in China?');
  // wiki block is verbatim: original lines appear unmodified
  assert.ok(fmBlock.includes('title: Payments in China'));
  assert.ok(fmBlock.includes('  status: audited'));
});

test('mergeFrontmatter takes updated wiki-owned fields from the new wiki version', () => {
  const wikiUpdated = WIKI_V2_COMPATIBLE.replace('last_verified: 2026-05-07', 'last_verified: 2026-06-09');
  const { fmBlock } = mergeFrontmatter(SITE_CURRENT, wikiUpdated, { defaultCategory: 'guide' });
  assert.ok(fmBlock.includes('last_verified: 2026-06-09'));
});

test('mergeFrontmatter injects default category for pages that never had one', () => {
  const { fmBlock } = mergeFrontmatter('---\n---\n', WIKI_V1, { defaultCategory: 'app' });
  assert.equal(matter(fmBlock).data.category, 'app');
});

test('mergeFrontmatter: diverging → site value wins + is reported, no duplicate key', () => {
  const wikiWithDesc = WIKI_V1.replace('---\n\n# Payments', 'description: wiki-side description\n---\n\n# Payments');
  const { fmBlock, fieldConflicts } = mergeFrontmatter(SITE_CURRENT, wikiWithDesc, { defaultCategory: 'guide' });
  assert.equal(fieldConflicts.length, 1);
  assert.equal(fieldConflicts[0].field, 'description');
  assert.equal(fieldConflicts[0].wikiValue, 'wiki-side description'); // report carries the wiki (old) value
  const merged = matter(fmBlock).data; // would throw / misparse on duplicate keys
  assert.equal(merged.description, matter(SITE_CURRENT).data.description); // site value wins, wiki stripped
  assert.equal(merged.faqs.length, 1); // other site fields still injected
});

test('mergeFrontmatter: diverging multi-line faqs → site version wins, no duplicate key, reported', () => {
  // wiki carries its OWN faqs block (multi-line) that differs from the site's.
  const wikiWithFaqs = WIKI_V1.replace(
    '---\n\n# Payments',
    'faqs:\n  - q: "Old wiki question?"\n    a: "Old wiki answer."\n---\n\n# Payments',
  );
  const { fmBlock, fieldConflicts } = mergeFrontmatter(SITE_CURRENT, wikiWithFaqs, { defaultCategory: 'guide' });

  // divergence reported, carrying the wiki (old) value
  const faqConflict = fieldConflicts.find((fc) => fc.field === 'faqs');
  assert.ok(faqConflict, 'faqs divergence reported');
  assert.deepEqual(faqConflict.wikiValue, [{ q: 'Old wiki question?', a: 'Old wiki answer.' }]);

  // block is structurally sound — parses, single faqs key, site version kept
  const merged = matter(fmBlock).data; // throws on duplicate top-level YAML keys
  assert.equal(merged.faqs.length, 1);
  assert.equal(merged.faqs[0].q, 'Do foreign cards work in China?'); // site faqs, not wiki's
  assert.ok(!merged.faqs.some((f) => f.q === 'Old wiki question?'), 'wiki faqs fully stripped');
  // no duplicate faqs: the key must appear exactly once in the raw block
  assert.equal((fmBlock.match(/^faqs:/gm) || []).length, 1, 'exactly one faqs key');
  // wiki-owned fields untouched, structure intact
  assert.ok(fmBlock.includes('title: Payments in China'));
  assert.deepEqual(fmBlock.match(/^---$/gm), ['---', '---'], 'exactly 2 delimiter lines');
});

test('mergeFrontmatter: identical wiki value → silent (no noise when wiki adopted the site value)', () => {
  const siteDesc = matter(SITE_CURRENT).data.description;
  const wikiSameDesc = WIKI_V1.replace('---\n\n# Payments', `description: ${siteDesc}\n---\n\n# Payments`);
  const { fmBlock, fieldConflicts } = mergeFrontmatter(SITE_CURRENT, wikiSameDesc, { defaultCategory: 'guide' });
  assert.equal(fieldConflicts.length, 0);
  assert.equal(matter(fmBlock).data.description, siteDesc);
});

test('mergeFrontmatter block is structurally sound: exactly one closing ---, no leakage into body', () => {
  // Regression: matter.stringify('', data) ends with "---\n\n"; a tail-strip regex
  // missed it and a stray "---" leaked into the body of every synced page (PR #27).
  for (const theirs of [WIKI_V1, WIKI_V2_COMPATIBLE]) {
    const { fmBlock } = mergeFrontmatter(SITE_CURRENT, theirs, { defaultCategory: 'guide' });
    assert.deepEqual(fmBlock.match(/^---$/gm), ['---', '---'], 'exactly 2 delimiter lines');
    assert.ok(fmBlock.endsWith('---\n') && !fmBlock.endsWith('\n---\n\n'), 'single trailing delimiter');
    // Full-file roundtrip: composed file must parse back to the same body, byte for byte.
    const body = splitFrontmatter(theirs).body;
    const full = fmBlock + body;
    assert.equal(matter(full).content, matter(theirs).content, 'body survives composition unchanged');
    assert.ok(!matter(full).content.trimStart().startsWith('---'), 'no stray --- at body start');
  }
});

// ---- mergeBody (real git merge-file) ----------------------------------------
test('mergeBody auto-merges non-overlapping edits (site H2 kept + wiki fact-fix applied)', () => {
  const ours = splitFrontmatter(SITE_CURRENT).body;
  const base = splitFrontmatter(WIKI_V1).body;
  const theirs = splitFrontmatter(WIKI_V2_COMPATIBLE).body;
  const { merged, conflicted } = mergeBody(ours, base, theirs);
  assert.equal(conflicted, false);
  assert.ok(merged.includes('## How do I set up payments?')); // site SEO heading survives
  assert.ok(merged.includes('Foreign Visa/Mastercard now work')); // wiki fact-fix flows in
  assert.ok(!hasConflictMarkers(merged));
});

test('mergeBody exposes overlapping edits as conflict markers', () => {
  const ours = splitFrontmatter(SITE_CURRENT).body;
  const base = splitFrontmatter(WIKI_V1).body;
  const theirs = splitFrontmatter(WIKI_V2_CONFLICTING).body;
  const { merged, conflicted } = mergeBody(ours, base, theirs);
  assert.equal(conflicted, true);
  assert.ok(merged.includes('<<<<<<< site'));
  assert.ok(merged.includes('>>>>>>> wiki'));
  assert.ok(hasConflictMarkers(merged));
});

test('mergeBody with identical sides is a no-op', () => {
  const body = splitFrontmatter(WIKI_V1).body;
  const { merged, conflicted } = mergeBody(body, body, body);
  assert.equal(conflicted, false);
  assert.equal(merged, body);
});

// ---- auditedOnly ------------------------------------------------------------
test('auditedOnly keeps nested review.status audited, skips drafts and parse failures', () => {
  const files = [
    { name: 'a.md', content: WIKI_V1 },
    { name: 'b.md', content: '---\nreview:\n  status: draft\n---\nx' },
    { name: 'c.md', content: '---\nstatus: audited\n---\nx' }, // top-level status ≠ nested
    { name: 'd.md', content: '---\ntitle: [broken\n---\nx' },
  ];
  const { audited, skipped } = auditedOnly(files);
  assert.deepEqual(audited.map((f) => f.name), ['a.md']);
  assert.equal(skipped, 3);
});

// ---- classifyPages ----------------------------------------------------------
test('classifyPages buckets new / merge / no-base / site-only / deleted / demoted', () => {
  const wikiAudited = [
    { siteKey: 'guides/payments.md', wikiRel: 'concepts/payments.md', content: 'x' },
    { siteKey: 'guides/brand-new.md', wikiRel: 'concepts/brand-new.md', content: 'x' },
    { siteKey: 'guides/never-synced.md', wikiRel: 'concepts/never-synced.md', content: 'x' },
  ];
  const wikiAllRels = new Set(['concepts/payments.md', 'concepts/brand-new.md', 'concepts/never-synced.md', 'concepts/demoted.md']);
  const siteKeys = new Set(['guides/payments.md', 'guides/never-synced.md', 'guides/vpn-or-esim.md', 'guides/demoted.md', 'guides/gone.md']);
  const state = {
    pages: {
      'guides/payments.md': { wikiPath: 'concepts/payments.md', baseSha: 'abc' },
      'guides/demoted.md': { wikiPath: 'concepts/demoted.md', baseSha: 'abc' },
      'guides/gone.md': { wikiPath: 'concepts/gone.md', baseSha: 'abc' },
    },
  };
  const plan = classifyPages({ wikiAudited, wikiAllRels, siteKeys, state });
  assert.deepEqual(plan.newPages.map((p) => p.siteKey), ['guides/brand-new.md']);
  assert.deepEqual(plan.merges.map((p) => [p.siteKey, p.baseSha]), [
    ['guides/payments.md', 'abc'],
    ['guides/never-synced.md', null], // on site but never recorded → no-base fallback
  ]);
  assert.deepEqual(plan.siteOnly, ['guides/vpn-or-esim.md']); // no wiki page, no state → never touched
  assert.deepEqual(
    plan.removed.map((r) => [r.siteKey, r.reason]),
    [
      ['guides/demoted.md', 'demoted (no longer audited)'],
      ['guides/gone.md', 'deleted from wiki'],
    ],
  );
});

// ---- recordWarningsInState ----------------------------------------------------
test('recordWarningsInState: warnings-only run still produces a committable state diff', () => {
  const state = { pages: { 'guides/gone.md': { wikiPath: 'concepts/gone.md', baseSha: 'abc' } } };
  const before = JSON.stringify(state);
  recordWarningsInState(state, {
    removed: [{ siteKey: 'guides/gone.md', wikiPath: 'concepts/gone.md', reason: 'deleted from wiki' }],
    noBase: [{ siteKey: 'guides/orphan.md', wikiRel: 'concepts/orphan.md' }],
  });
  assert.notEqual(JSON.stringify(state), before); // first occurrence → diff → PR materializes
  assert.equal(state.pages['guides/gone.md'].removedFromWiki, 'deleted from wiki');
  assert.equal(state.pages['guides/gone.md'].baseSha, 'abc'); // original base kept
  assert.deepEqual(state.pages['guides/orphan.md'], { wikiPath: 'concepts/orphan.md', baseSha: null, noBase: true });

  const afterFirst = JSON.stringify(state);
  recordWarningsInState(state, {
    removed: [{ siteKey: 'guides/gone.md', wikiPath: 'concepts/gone.md', reason: 'deleted from wiki' }],
    noBase: [{ siteKey: 'guides/orphan.md', wikiRel: 'concepts/orphan.md' }],
  });
  assert.equal(JSON.stringify(state), afterFirst); // re-runs idempotent — no PR churn
});

test('recordWarningsInState: noBase keeps an existing (unreadable) baseSha for retry', () => {
  const state = { pages: { 'guides/odd.md': { wikiPath: 'concepts/odd.md', baseSha: 'deadbee' } } };
  recordWarningsInState(state, { noBase: [{ siteKey: 'guides/odd.md', wikiRel: 'concepts/odd.md' }] });
  assert.equal(state.pages['guides/odd.md'].baseSha, 'deadbee');
  assert.equal(state.pages['guides/odd.md'].noBase, true);
});

// ---- hasConflictMarkers -----------------------------------------------------
test('hasConflictMarkers detects each marker type, ignores lookalikes', () => {
  assert.equal(hasConflictMarkers('<<<<<<< site\nx\n=======\ny\n>>>>>>> wiki\n'), true);
  assert.equal(hasConflictMarkers('clean text\nwith ======= not at line level? no — '), false);
  assert.equal(hasConflictMarkers('a\n=======\nb'), true); // bare separator counts
  assert.equal(hasConflictMarkers('<<<<<< only six\n>>>>>> six'), false);
});

// ---- renderSyncReport ---------------------------------------------------------
test('renderSyncReport lists conflicts, no-base, removals, field collisions', () => {
  const report = renderSyncReport({
    wikiSha: 'fa550a3b7e6142b4154d3c20f72f67b83ea282e7',
    results: [
      { siteKey: 'guides/clean.md', conflicted: false },
      { siteKey: 'guides/fresh.md', isNew: true, conflicted: false },
      { siteKey: 'guides/clash.md', conflicted: true },
      { siteKey: 'guides/orphan.md', noBase: true, conflicted: false },
      { siteKey: 'guides/claimed.md', conflicted: false, fieldConflicts: [{ field: 'description', wikiValue: 'old wiki desc' }] },
    ],
    removed: [{ siteKey: 'guides/old.md', wikiPath: 'concepts/old.md', reason: 'deleted from wiki' }],
    siteOnly: ['guides/vpn-or-esim.md'],
  });
  assert.ok(report.includes('fa550a3'));
  assert.ok(report.includes('guides/clash.md'));
  assert.ok(report.includes('Body conflicts'));
  assert.ok(report.includes('guides/orphan.md'));
  assert.ok(report.includes('guides/old.md'));
  assert.ok(report.includes('`description`'));
  assert.ok(report.includes('NOT deleted'));
  for (const f of SITE_OWNED_FIELDS) assert.ok(report.includes(f));
});
