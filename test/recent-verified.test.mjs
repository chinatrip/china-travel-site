import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveRecentlyVerified } from '../src/lib/recent-verified.mjs';

// A content entry as Astro's getCollection yields it: { collection, id, slug?, data }.
// `last_verified` is a string (schema coerces YAML dates to strings) but Date
// objects must also be tolerated defensively.
function entry(collection, id, last_verified, extra = {}) {
  return { collection, id, data: { title: `Title ${id}`, last_verified, ...extra } };
}

test('orders by last_verified descending (most recently verified first)', () => {
  const out = resolveRecentlyVerified([
    entry('guides', 'a', '2026-06-01'),
    entry('guides', 'b', '2026-06-09'),
    entry('apps', 'c', '2026-05-20'),
  ]);
  assert.deepEqual(out.map((r) => r.url), ['/guides/b/', '/guides/a/', '/apps/c/']);
});

test('omits entries with no last_verified date', () => {
  const out = resolveRecentlyVerified([
    entry('guides', 'a', '2026-06-01'),
    entry('guides', 'b', undefined),
    entry('guides', 'c', ''),
    entry('guides', 'd', 'not-a-date'),
  ]);
  assert.deepEqual(out.map((r) => r.url), ['/guides/a/']);
});

test('applies the limit after sorting (keeps the most recent N)', () => {
  const out = resolveRecentlyVerified(
    [
      entry('guides', 'a', '2026-06-01'),
      entry('guides', 'b', '2026-06-09'),
      entry('guides', 'c', '2026-05-20'),
    ],
    { limit: 2 },
  );
  assert.deepEqual(out.map((r) => r.url), ['/guides/b/', '/guides/a/']);
});

test('limit of 0 or negative is ignored (returns everything)', () => {
  const all = [entry('guides', 'a', '2026-06-01'), entry('guides', 'b', '2026-06-09')];
  assert.equal(resolveRecentlyVerified(all, { limit: 0 }).length, 2);
  assert.equal(resolveRecentlyVerified(all, { limit: -3 }).length, 2);
});

test('breaks date ties by title ascending (stable, deterministic order)', () => {
  const out = resolveRecentlyVerified([
    { collection: 'guides', id: 'z', data: { title: 'Zebra', last_verified: '2026-06-09' } },
    { collection: 'guides', id: 'a', data: { title: 'Apple', last_verified: '2026-06-09' } },
    { collection: 'guides', id: 'm', data: { title: 'Mango', last_verified: '2026-06-09' } },
  ]);
  assert.deepEqual(out.map((r) => r.title), ['Apple', 'Mango', 'Zebra']);
});

test('builds trailing-slash collection routes from id', () => {
  const out = resolveRecentlyVerified([
    entry('guides', 'visa-types', '2026-06-09'),
    entry('apps', 'alipay', '2026-06-08'),
  ]);
  assert.equal(out[0].url, '/guides/visa-types/');
  assert.equal(out[1].url, '/apps/alipay/');
});

test('displayDate matches the site format (en-US, "Mon D, YYYY")', () => {
  const [r] = resolveRecentlyVerified([entry('guides', 'a', '2026-06-09')]);
  assert.equal(r.displayDate, 'Jun 9, 2026');
  assert.equal(r.isoDate, '2026-06-09');
});

test('normalizes Date objects (YAML may auto-parse) for both iso and display', () => {
  const [r] = resolveRecentlyVerified([
    entry('guides', 'a', new Date('2026-06-09T00:00:00.000Z')),
  ]);
  assert.equal(r.isoDate, '2026-06-09');
  assert.equal(r.displayDate, 'Jun 9, 2026');
});

test('extracts external sources as {url,label}, dropping internal provenance paths', () => {
  const [r] = resolveRecentlyVerified([
    entry('guides', 'a', '2026-06-09', {
      verified_against: [
        'https://www.gov.cn/policy/notice.html',
        'raw/realchinaguide-accommodation-2026.md', // internal — must be dropped
        'https://www.trip.com/',
      ],
    }),
  ]);
  assert.deepEqual(r.sources, [
    { url: 'https://www.gov.cn/policy/notice.html', label: 'gov.cn/policy/notice.html' },
    { url: 'https://www.trip.com/', label: 'trip.com' },
  ]);
});

test('sources is an empty array when verified_against is missing', () => {
  const [r] = resolveRecentlyVerified([entry('guides', 'a', '2026-06-09')]);
  assert.deepEqual(r.sources, []);
});

test('falls back to slug when id is absent, and skips entries with neither', () => {
  const out = resolveRecentlyVerified([
    { collection: 'guides', slug: 'from-slug', data: { title: 'S', last_verified: '2026-06-09' } },
    { collection: 'guides', data: { title: 'No route', last_verified: '2026-06-08' } },
  ]);
  assert.deepEqual(out.map((r) => r.url), ['/guides/from-slug/']);
});

test('tolerates non-array / malformed input without throwing', () => {
  assert.deepEqual(resolveRecentlyVerified(undefined), []);
  assert.deepEqual(resolveRecentlyVerified(null), []);
  assert.deepEqual(resolveRecentlyVerified('nope'), []);
  assert.deepEqual(resolveRecentlyVerified([null, 42, {}]), []);
});
