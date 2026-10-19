import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SITE,
  SCHEMA_VERSION,
  normalizeDate,
  staleAfter,
  confidenceOf,
  buildTldr,
  extractSections,
  contentHash,
  buildFacts,
  buildPageModel,
  buildPagesIndex,
  buildFactDetail,
  pageUrl,
  pageJsonUrl,
  pageMarkdownUrl,
} from '../src/lib/facts.mjs';

const makeEntry = (overrides = {}) => ({
  id: 'sim-card',
  body: '## Should I get an eSIM?\n\nIntro paragraph.\n\n### Providers\n\nMore.\n',
  data: {
    title: 'SIM Card and eSIM in China',
    description: '',
    last_verified: '2026-10-08',
    volatility: 'high',
    status: 'audited',
    review: { status: 'audited', page_audit: '2026-10-08' },
    verified_against: ['https://example.com/a', 'https://example.com/b'],
    faqs: [
      { q: 'Do I need a VPN?', a: 'Usually not.' },
      { q: 'How much data?', a: 'About 5 GB per 10 days.' },
    ],
    related: ['wiki/concepts/internet-connectivity.md'],
    ...overrides,
  },
});

test('normalizeDate handles strings, Dates, and junk', () => {
  assert.equal(normalizeDate('2026-10-08'), '2026-10-08');
  assert.equal(normalizeDate(new Date('2026-10-08T00:00:00Z')), '2026-10-08');
  assert.equal(normalizeDate('not-a-date'), null);
  assert.equal(normalizeDate(undefined), null);
});

test('staleAfter applies the volatility window', () => {
  assert.equal(staleAfter('2026-10-08', 'high'), '2027-01-06');
  assert.equal(staleAfter('2026-10-08', 'medium'), '2027-04-06');
  assert.equal(staleAfter('2026-10-08', 'low'), '2027-10-08');
  assert.equal(staleAfter(null, 'high'), null);
});

test('confidence mirrors review status, never inventing verification', () => {
  assert.equal(confidenceOf({ review: { status: 'audited' } }), 'audited');
  assert.equal(confidenceOf({ review: { status: 'verified' } }), 'verified');
  assert.equal(confidenceOf({ status: 'draft' }), 'draft');
  assert.equal(confidenceOf({}), 'draft');
});

test('buildTldr prefers description and falls back to first prose paragraph', () => {
  assert.equal(buildTldr({ description: 'Short answer.' }, '## H\n\nBody.'), 'Short answer.');
  assert.equal(buildTldr({}, '## H\n\nFirst prose line.\n\nSecond.'), 'First prose line.');
});

test('extractSections keeps H2/H3 only', () => {
  const sections = extractSections('# H1\n\n## A\n\n### B\n\n#### C\n');
  assert.deepEqual(sections, [
    { level: 2, heading: 'A' },
    { level: 3, heading: 'B' },
  ]);
});

test('contentHash is stable and changes with the body', () => {
  const data = makeEntry().data;
  const a = contentHash(data, 'body one');
  assert.equal(a, contentHash(data, 'body one'));
  assert.notEqual(a, contentHash(data, 'body two'));
  assert.match(a, /^sha256:[0-9a-f]{64}$/);
});

test('buildFacts promotes FAQs with stable ids and provenance', () => {
  const facts = buildFacts(makeEntry(), 'guides');
  assert.equal(facts.length, 2);
  assert.equal(facts[0].id, 'sim-card.faq.1');
  assert.equal(facts[1].id, 'sim-card.faq.2');
  assert.equal(facts[0].confidence, 'audited');
  assert.equal(facts[0].verified_at, '2026-10-08');
  assert.equal(facts[0].stale_after, '2027-01-06');
  assert.deepEqual(facts[0].sources, ['https://example.com/a', 'https://example.com/b']);
  assert.equal(facts[0].page_json_url, `${SITE}/guides/sim-card.json`);
});

test('buildFacts tolerates malformed FAQ entries', () => {
  const entry = makeEntry({ faqs: [{ q: 'Q?', a: 'A.' }, { q: null, a: 'x' }, null] });
  const facts = buildFacts(entry, 'guides');
  assert.equal(facts.length, 1);
  assert.equal(facts[0].id, 'sim-card.faq.1');
});

test('buildPageModel carries urls, dates, sections and facts', () => {
  const model = buildPageModel(makeEntry(), 'guides');
  assert.equal(model.schema_version, SCHEMA_VERSION);
  assert.equal(model.url, `${SITE}/guides/sim-card/`);
  assert.equal(model.json_url, `${SITE}/guides/sim-card.json`);
  assert.equal(model.markdown_url, `${SITE}/guides/sim-card.md`);
  assert.equal(model.lang, 'en');
  assert.equal(model.last_verified, '2026-10-08');
  assert.equal(model.stale_after, '2027-01-06');
  assert.equal(model.fact_count, 2);
  assert.equal(model.sections.length, 2);
  assert.match(model.content_hash, /^sha256:/);
});

test('Spanish pages get an /es/ route and no markdown endpoint', () => {
  const model = buildPageModel(makeEntry(), 'guidesEs');
  assert.equal(model.url, `${SITE}/es/guides/sim-card/`);
  assert.equal(model.json_url, `${SITE}/es/guides/sim-card.json`);
  assert.equal(model.markdown_url, null);
  assert.equal(model.lang, 'es');
});

test('pageUrls follow the collection routes', () => {
  assert.equal(pageUrl('guides', 'x'), `${SITE}/guides/x/`);
  assert.equal(pageUrl('apps', 'x'), `${SITE}/apps/x/`);
  assert.equal(pageJsonUrl('guidesEs', 'x'), `${SITE}/es/guides/x.json`);
  assert.equal(pageMarkdownUrl('apps', 'x'), `${SITE}/apps/x.md`);
});

test('buildPagesIndex is compact, sorted, and excludes full facts', () => {
  const models = [
    buildPageModel(makeEntry(), 'guides'),
    buildPageModel(makeEntry({ title: 'Alipay' }), 'apps'),
  ];
  const index = buildPagesIndex(models, { generatedAt: '2026-10-19T00:00:00.000Z' });
  assert.equal(index.schema_version, SCHEMA_VERSION);
  assert.equal(index.count, 2);
  assert.equal(index.generated_at, '2026-10-19T00:00:00.000Z');
  assert.equal(index.pages[0].url, `${SITE}/apps/sim-card/`);
  assert.ok(!('facts' in index.pages[0]), 'index must not inline facts');
  assert.equal(index.pages[0].fact_count, 2);
});

test('buildFactDetail returns one fact plus its page, null when unknown', () => {
  const model = buildPageModel(makeEntry(), 'guides');
  const detail = buildFactDetail(model, 'sim-card.faq.2');
  assert.equal(detail.fact.claim, 'About 5 GB per 10 days.');
  assert.equal(detail.page.slug, 'sim-card');
  assert.equal(detail.page.confidence, 'audited');
  assert.equal(buildFactDetail(model, 'nope'), null);
});
