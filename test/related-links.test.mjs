import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRelated, relatedToRoute } from '../src/lib/related.mjs';

test('maps wiki concepts to /guides/ routes with trailing slash', () => {
  assert.equal(relatedToRoute('wiki/concepts/transportation.md'), '/guides/transportation/');
  assert.equal(relatedToRoute('wiki/concepts/mobile-payment.md'), '/guides/mobile-payment/');
});

test('maps wiki entities to /apps/ routes with trailing slash', () => {
  assert.equal(relatedToRoute('wiki/entities/alipay.md'), '/apps/alipay/');
  assert.equal(relatedToRoute('wiki/entities/12306.md'), '/apps/12306/');
});

test('returns null for summaries (no published route)', () => {
  assert.equal(relatedToRoute('wiki/summaries/reddit-pain-points-2026.md'), null);
});

test('returns null for non-wiki paths', () => {
  assert.equal(relatedToRoute('raw/12306-guide-for-foreign-business-visitors-2025.md'), null);
  assert.equal(relatedToRoute('https://example.com/wiki/concepts/transportation.md'), null);
  assert.equal(relatedToRoute('/guides/transportation/'), null);
});

test('rejects slugs outside [a-z0-9-] (traversal, uppercase, underscore, space)', () => {
  assert.equal(relatedToRoute('wiki/concepts/...md'), null); // '..' slug → would emit /guides/../
  assert.equal(relatedToRoute('wiki/concepts/Transportation.md'), null);
  assert.equal(relatedToRoute('wiki/concepts/mobile_payment.md'), null);
  assert.equal(relatedToRoute('wiki/concepts/mobile payment.md'), null);
  assert.equal(relatedToRoute('wiki/entities/didi%2Ffoo.md'), null);
});

test('returns null for malformed wiki paths', () => {
  assert.equal(relatedToRoute('wiki/concepts/transportation'), null); // missing .md
  assert.equal(relatedToRoute('wiki/concepts/.md'), null); // empty slug
  assert.equal(relatedToRoute('wiki/concepts/sub/dir.md'), null); // nested path
  assert.equal(relatedToRoute('wiki/unknown-section/foo.md'), null);
  assert.equal(relatedToRoute(''), null);
  assert.equal(relatedToRoute(null), null);
  assert.equal(relatedToRoute(undefined), null);
  assert.equal(relatedToRoute(42), null);
});

test('parseRelated exposes collection and id for content lookups', () => {
  assert.deepEqual(parseRelated('wiki/concepts/transportation.md'), {
    collection: 'guides',
    id: 'transportation',
    route: '/guides/transportation/',
  });
  assert.deepEqual(parseRelated('wiki/entities/didi.md'), {
    collection: 'apps',
    id: 'didi',
    route: '/apps/didi/',
  });
  assert.equal(parseRelated('wiki/summaries/foo.md'), null);
  assert.equal(parseRelated('raw/foo.md'), null);
});
