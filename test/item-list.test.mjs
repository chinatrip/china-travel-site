import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildItemList } from '../src/lib/item-list.mjs';

test('builds ItemList JSON-LD with absolute trailing-slash URLs and 1-based positions', () => {
  const schema = buildItemList('China Travel Guides', [
    '/guides/visa-types/',
    '/guides/mobile-payment/',
  ]);
  assert.deepEqual(schema, {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'China Travel Guides',
    numberOfItems: 2,
    itemListElement: [
      { '@type': 'ListItem', position: 1, url: 'https://chinaguide.ai/guides/visa-types/' },
      { '@type': 'ListItem', position: 2, url: 'https://chinaguide.ai/guides/mobile-payment/' },
    ],
  });
});

test('normalizes routes missing a trailing slash (canonical URL shape)', () => {
  const schema = buildItemList('Essential Apps for China Travel', ['/apps/alipay']);
  assert.equal(schema.itemListElement[0].url, 'https://chinaguide.ai/apps/alipay/');
});

test('preserves input order so positions match the rendered card order', () => {
  const schema = buildItemList('Essential Apps for China Travel', [
    '/apps/wechat/',
    '/apps/12306/',
    '/apps/amap/',
  ]);
  assert.deepEqual(
    schema.itemListElement.map((e) => [e.position, e.url]),
    [
      [1, 'https://chinaguide.ai/apps/wechat/'],
      [2, 'https://chinaguide.ai/apps/12306/'],
      [3, 'https://chinaguide.ai/apps/amap/'],
    ],
  );
});

test('empty route list yields an empty but well-formed ItemList', () => {
  const schema = buildItemList('China Travel Guides', []);
  assert.equal(schema.numberOfItems, 0);
  assert.deepEqual(schema.itemListElement, []);
});
