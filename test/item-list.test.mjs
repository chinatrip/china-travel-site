import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildItemList,
  buildCollectionPage,
  buildBreadcrumbList,
} from '../src/lib/item-list.mjs';

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

// ---- buildCollectionPage ----------------------------------------------------
test('wraps an ItemList in a CollectionPage with @id, url, name, description', () => {
  const schema = buildCollectionPage({
    name: 'China Travel Guides',
    description: 'Source-verified guides for foreigners.',
    route: '/guides/',
    items: [
      { name: 'Visa & entry options', route: '/guides/visa-types/' },
      { name: 'Mobile payment setup', route: '/guides/mobile-payment/' },
    ],
  });
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'CollectionPage');
  assert.equal(schema['@id'], 'https://chinaguide.ai/guides/#collection');
  assert.equal(schema.url, 'https://chinaguide.ai/guides/');
  assert.equal(schema.name, 'China Travel Guides');
  assert.equal(schema.description, 'Source-verified guides for foreigners.');
  assert.equal(schema.isPartOf['@id'], 'https://chinaguide.ai/#website');
});

test('CollectionPage embeds a named ItemList as mainEntity (1-based, ordered)', () => {
  const schema = buildCollectionPage({
    name: 'Essential Apps for China Travel',
    description: 'd',
    route: '/apps/',
    items: [
      { name: 'WeChat', route: '/apps/wechat/' },
      { name: 'Alipay', route: '/apps/alipay' }, // missing slash → normalized
    ],
  });
  const list = schema.mainEntity;
  assert.equal(list['@type'], 'ItemList');
  assert.equal(list.numberOfItems, 2);
  assert.deepEqual(
    list.itemListElement.map((e) => [e['@type'], e.position, e.name, e.url]),
    [
      ['ListItem', 1, 'WeChat', 'https://chinaguide.ai/apps/wechat/'],
      ['ListItem', 2, 'Alipay', 'https://chinaguide.ai/apps/alipay/'],
    ],
  );
});

test('CollectionPage with no items is still well-formed', () => {
  const schema = buildCollectionPage({ name: 'X', description: 'd', route: '/guides/', items: [] });
  assert.equal(schema.mainEntity.numberOfItems, 0);
  assert.deepEqual(schema.mainEntity.itemListElement, []);
});

// ---- buildBreadcrumbList -----------------------------------------------------
test('builds a BreadcrumbList from Home to the current collection', () => {
  const schema = buildBreadcrumbList([
    { name: 'Home', route: '/' },
    { name: 'Travel Guides', route: '/guides/' },
  ]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@type'], 'BreadcrumbList');
  assert.deepEqual(
    schema.itemListElement.map((e) => [e['@type'], e.position, e.name, e.item]),
    [
      ['ListItem', 1, 'Home', 'https://chinaguide.ai/'],
      ['ListItem', 2, 'Travel Guides', 'https://chinaguide.ai/guides/'],
    ],
  );
});

test('breadcrumb routes are normalized to absolute trailing-slash URLs', () => {
  const schema = buildBreadcrumbList([{ name: 'Apps', route: '/apps' }]);
  assert.equal(schema.itemListElement[0].item, 'https://chinaguide.ai/apps/');
});
