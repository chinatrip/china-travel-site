import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Page-layer SEO assertions for the listing pages (/guides/, /apps/). Unlike the
// item-list.test.mjs pure-function tests, these assert on the *built* HTML so a
// regression in how the page wires the builders up (or drops a <script> tag) is
// caught. The full `npm test` runs `astro build` after `node --test`, but this
// file also builds on demand so it passes when run standalone.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const dist = (p) => fileURLToPath(new URL(`../dist/${p}`, import.meta.url));

function ensureBuilt() {
  if (existsSync(dist('guides/index.html')) && existsSync(dist('apps/index.html'))) return;
  execFileSync('npx', ['astro', 'build'], { cwd: ROOT, stdio: 'ignore' });
}

/** Parse every <script type="application/ld+json"> block in an HTML string. */
function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
}

function loadPage(relPath) {
  const html = readFileSync(dist(relPath), 'utf8');
  return { html, blocks: jsonLdBlocks(html) };
}

before(() => ensureBuilt(), { timeout: 180_000 });

const PAGES = [
  {
    label: 'guides',
    file: 'guides/index.html',
    collectionName: 'China Travel Guides',
    collectionId: 'https://chinaguide.ai/guides/#collection',
    crumbLabel: 'Travel Guides',
    crumbUrl: 'https://chinaguide.ai/guides/',
    memberPrefix: 'https://chinaguide.ai/guides/',
  },
  {
    label: 'apps',
    file: 'apps/index.html',
    collectionName: 'Essential Apps for China Travel',
    collectionId: 'https://chinaguide.ai/apps/#collection',
    crumbLabel: 'Essential Apps',
    crumbUrl: 'https://chinaguide.ai/apps/',
    memberPrefix: 'https://chinaguide.ai/apps/',
  },
];

for (const page of PAGES) {
  test(`${page.label}: emits a CollectionPage with a named ItemList of every member`, () => {
    const { blocks } = loadPage(page.file);
    const cp = blocks.find((b) => b['@type'] === 'CollectionPage');
    assert.ok(cp, 'CollectionPage JSON-LD is present');
    assert.equal(cp['@id'], page.collectionId);
    assert.equal(cp.name, page.collectionName);
    assert.equal(cp.isPartOf['@id'], 'https://chinaguide.ai/#website');

    const list = cp.mainEntity;
    assert.equal(list['@type'], 'ItemList');
    assert.ok(list.numberOfItems > 0, 'lists at least one member');
    assert.equal(list.itemListElement.length, list.numberOfItems);

    list.itemListElement.forEach((el, i) => {
      assert.equal(el.position, i + 1, 'positions are 1-based and sequential');
      assert.ok(el.name && el.name.length > 0, 'each member is named');
      assert.ok(el.url.startsWith(page.memberPrefix), `member URL under ${page.memberPrefix}`);
      assert.ok(el.url.endsWith('/'), 'member URL has a trailing slash');
    });
  });

  test(`${page.label}: CollectionPage lists exactly the cards rendered on the page`, () => {
    const { html, blocks } = loadPage(page.file);
    const cp = blocks.find((b) => b['@type'] === 'CollectionPage');
    // Card links rendered in the grid (GuideCard anchors), de-duplicated.
    const cardHrefs = new Set(
      [...html.matchAll(new RegExp(`href="(/${page.label}/[^"#?]+/)"`, 'g'))].map((m) => m[1]),
    );
    const listPaths = new Set(cp.mainEntity.itemListElement.map((e) => new URL(e.url).pathname));
    assert.deepEqual([...listPaths].sort(), [...cardHrefs].sort());
  });

  test(`${page.label}: emits a BreadcrumbList from Home to the collection`, () => {
    const { blocks } = loadPage(page.file);
    const bc = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    assert.ok(bc, 'BreadcrumbList JSON-LD is present');
    assert.deepEqual(
      bc.itemListElement.map((e) => [e.position, e.name, e.item]),
      [
        [1, 'Home', 'https://chinaguide.ai/'],
        [2, page.crumbLabel, page.crumbUrl],
      ],
    );
  });

  test(`${page.label}: renders a breadcrumb nav linking back to Home`, () => {
    const { html } = loadPage(page.file);
    const nav = html.match(/<nav[^>]*>[\s\S]*?<\/nav>/);
    assert.ok(nav, 'a <nav> element is present');
    assert.ok(/href="\/"/.test(nav[0]), 'breadcrumb nav links to Home');
  });

  test(`${page.label}: has a single H1 and a meta description ≤ 160 chars`, () => {
    const { html } = loadPage(page.file);
    const h1s = [...html.matchAll(/<h1[\s>]/g)];
    assert.equal(h1s.length, 1, 'exactly one H1');

    const meta = html.match(/<meta name="description" content="([^"]*)"/);
    assert.ok(meta, 'meta description is present');
    assert.ok(meta[1].length > 0, 'meta description is non-empty');
    assert.ok(meta[1].length <= 160, `meta description ≤ 160 chars (got ${meta[1].length})`);
  });
}
