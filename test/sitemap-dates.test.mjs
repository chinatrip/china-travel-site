import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLastmodMap, lastmodFor } from '../src/lib/sitemap-dates.mjs';

const SITE = 'https://chinaguide.ai';

test('maps guides and apps entries to their routes', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'visa-types', data: { date: '2026-04-30', last_verified: '2026-06-09' } },
    { collection: 'apps', slug: 'alipay', data: { date: '2026-04-30' } },
  ]);
  assert.equal(map.get('/guides/visa-types/'), '2026-06-09');
  assert.equal(map.get('/apps/alipay/'), '2026-04-30');
});

test('prefers last_verified over date', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', data: { date: '2026-01-01', last_verified: '2026-06-01' } },
  ]);
  assert.equal(map.get('/guides/a/'), '2026-06-01');
});

test('falls back to date when last_verified is missing', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', data: { date: '2026-01-01' } },
  ]);
  assert.equal(map.get('/guides/a/'), '2026-01-01');
});

test('omits entries without any usable date (no fake lastmod)', () => {
  const map = buildLastmodMap([
    { collection: 'guides', slug: 'a', data: {} },
    { collection: 'guides', slug: 'b', data: { date: 'not-a-date' } },
  ]);
  assert.equal(map.has('/guides/a/'), false);
  assert.equal(map.has('/guides/b/'), false);
});

test('normalizes Date objects (YAML auto-parses dates) to YYYY-MM-DD', () => {
  const map = buildLastmodMap([
    { collection: 'apps', slug: 'wechat', data: { last_verified: new Date('2026-06-09T00:00:00.000Z') } },
  ]);
  assert.equal(map.get('/apps/wechat/'), '2026-06-09');
});

test('skips malformed entries instead of throwing', () => {
  const map = buildLastmodMap([
    null,
    { collection: 'guides', data: { date: '2026-01-01' } }, // no slug
    { collection: 'wiki', slug: 'a', data: { date: '2026-01-01' } }, // unknown collection
    { collection: 'guides', slug: 'ok', data: { date: '2026-01-01' } },
  ]);
  assert.equal(map.size, 1);
  assert.equal(map.get('/guides/ok/'), '2026-01-01');
});

test('lastmodFor resolves full URLs against the map', () => {
  const map = new Map([['/guides/visa-types/', '2026-06-09']]);
  assert.equal(lastmodFor(`${SITE}/guides/visa-types/`, map), '2026-06-09');
});

test('lastmodFor tolerates a missing trailing slash', () => {
  const map = new Map([['/apps/didi/', '2026-06-09']]);
  assert.equal(lastmodFor(`${SITE}/apps/didi`, map), '2026-06-09');
});

test('lastmodFor returns undefined for non-content pages', () => {
  const map = new Map([['/guides/visa-types/', '2026-06-09']]);
  assert.equal(lastmodFor(`${SITE}/`, map), undefined);
  assert.equal(lastmodFor(`${SITE}/checklist/`, map), undefined);
  assert.equal(lastmodFor(`${SITE}/guides/`, map), undefined);
  assert.equal(lastmodFor(`${SITE}/search/`, map), undefined);
});

test('lastmodFor returns undefined for unparseable input', () => {
  const map = new Map([['/guides/visa-types/', '2026-06-09']]);
  assert.equal(lastmodFor('not a url', map), undefined);
  assert.equal(lastmodFor(null, map), undefined);
  assert.equal(lastmodFor(undefined, map), undefined);
});
