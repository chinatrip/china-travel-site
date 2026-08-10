import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname, sep } from 'node:path';
import { SUPPORT_CONTACT_POINT } from '../src/lib/home-schema.mjs';

// GuideLayout.astro inlines its own Organization node (author + publisher of
// the Article schema). It must carry the same support contactPoint as the
// homepage Organization (#38) so every page resolves to one consistent entity
// in Google's graph. The .astro layout can't be imported, so we assert two
// ways:
//   1. Source-level (hermetic, build-independent): the layout shares the
//      SUPPORT_CONTACT_POINT export rather than re-spelling the value.
//   2. Build-output (when a fresh dist exists): the emitted Article schema's
//      author + publisher actually carry the contactPoint.

const here = dirname(fileURLToPath(import.meta.url));
const GUIDE_LAYOUT = join(here, '..', 'src', 'layouts', 'GuideLayout.astro');
const layoutSrc = readFileSync(GUIDE_LAYOUT, 'utf8');

// ---- 1. source-level contract (always runs) --------------------------------
test('GuideLayout imports the shared SUPPORT_CONTACT_POINT from home-schema (#38)', () => {
  assert.match(
    layoutSrc,
    /import\s*\{[^}]*\bSUPPORT_CONTACT_POINT\b[^}]*\}\s*from\s*['"]\.\.\/lib\/home-schema\.mjs['"]/,
    'GuideLayout must import SUPPORT_CONTACT_POINT so its inline Organization cannot drift from the homepage entity',
  );
});

test("GuideLayout's inline Organization node wires contactPoint to the shared export", () => {
  // The inline organization object must reference the shared export — not a
  // re-spelled literal that could silently drift.
  assert.match(
    layoutSrc,
    /"contactPoint":\s*SUPPORT_CONTACT_POINT/,
    'the inline organization node must set contactPoint to SUPPORT_CONTACT_POINT',
  );
});

test('GuideLayout declares inLanguage on the Article and FAQ schemas', () => {
  // inLanguage must be driven by the page `lang` (en|es), not hard-coded, so
  // the Spanish pages self-declare as Spanish.
  const inLangCount = (layoutSrc.match(/"inLanguage":\s*lang/g) || []).length;
  assert.ok(
    inLangCount >= 2,
    'both the Article and FAQPage schemas must set "inLanguage": lang',
  );
});

test('GuideLayout embeds the optional SoftwareApplication as the Article about node', () => {
  assert.match(
    layoutSrc,
    /softwareApp\s*&&\s*\{\s*"about":\s*softwareApp\s*\}/,
    'articleSchema must conditionally attach softwareApp as its `about`',
  );
});

// ---- 2. build-output assertion (runs only against a fresh dist) ------------
const DIST = join(here, '..', 'dist');

/** Recursively collect .html files under dir. */
function collectHtml(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(path, out);
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

/** Parse every <script type="application/ld+json"> block out of a page. */
function ldJsonBlocks(html) {
  const blocks = [];
  for (const m of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      // ignore non-JSON payloads
    }
  }
  return blocks;
}

/** All built pages that carry an Article schema (i.e. GuideLayout output). */
function guideArticleSchemas() {
  const schemas = [];
  for (const f of collectHtml(DIST)) {
    for (const block of ldJsonBlocks(readFileSync(f, 'utf8'))) {
      if (block['@type'] === 'Article') schemas.push({ file: f, schema: block });
    }
  }
  return schemas;
}

// Note: in the `npm test` chain `node --test` runs before `astro build`, so on
// a clean checkout there is no dist yet and these skip; the source-level tests
// above are the always-on guard. When a (fresh) dist is present they verify the
// emitted JSON-LD end-to-end.
const distSkip = !existsSync(DIST) && 'dist/ not built (source-level tests cover the contract)';

test('built guide pages emit an Article schema', { skip: distSkip }, () => {
  assert.ok(guideArticleSchemas().length > 0, 'expected at least one built Article schema');
});

test('built Article author + publisher Organizations carry the support contactPoint (#38)', { skip: distSkip }, () => {
  for (const { file, schema } of guideArticleSchemas()) {
    assert.equal(schema.publisher?.['@type'], 'Organization', `${file}: publisher must be an Organization`);
    assert.equal(schema.publisher['@id'], 'https://chinaguide.ai/#organization', `${file}: publisher @id must match the canonical entity`);
    assert.deepEqual(schema.publisher.contactPoint, SUPPORT_CONTACT_POINT, `${file}: publisher Organization must carry the shared support contactPoint`);
    assert.deepEqual(schema.author?.contactPoint, SUPPORT_CONTACT_POINT, `${file}: author Organization must carry the shared support contactPoint`);
  }
});

test('every built Article declares a supported inLanguage', { skip: distSkip }, () => {
  const schemas = guideArticleSchemas();
  assert.ok(schemas.length > 0, 'expected built Article schemas');
  for (const { file, schema } of schemas) {
    assert.ok(
      ['en', 'es'].includes(schema.inLanguage),
      `${file}: Article inLanguage must be en|es (got ${JSON.stringify(schema.inLanguage)})`,
    );
  }
});

test('built Spanish guide Articles declare inLanguage "es"', { skip: distSkip }, () => {
  const esArticles = guideArticleSchemas().filter(({ file }) => file.includes(`${sep}es${sep}`));
  assert.ok(esArticles.length > 0, 'expected at least one built /es/ Article');
  for (const { file, schema } of esArticles) {
    assert.equal(schema.inLanguage, 'es', `${file}: Spanish page Article must set inLanguage es`);
  }
});

test('built app pages embed a SoftwareApplication about node (no fabricated ratings)', { skip: distSkip }, () => {
  const appArticles = guideArticleSchemas().filter(({ file }) => file.includes(`${sep}apps${sep}`));
  assert.ok(appArticles.length > 0, 'expected built /apps/ Article pages');
  for (const { file, schema } of appArticles) {
    const about = schema.about;
    assert.ok(about, `${file}: app Article must carry an about node`);
    assert.equal(about['@type'], 'SoftwareApplication', `${file}: about must be SoftwareApplication`);
    assert.ok(typeof about.name === 'string' && about.name.length > 0, `${file}: about.name`);
    assert.ok(
      typeof about.applicationCategory === 'string' && about.applicationCategory.length > 0,
      `${file}: about.applicationCategory`,
    );
    assert.equal(about.operatingSystem, 'Android, iOS', `${file}: about.operatingSystem`);
    assert.equal(about.offers?.price, 0, `${file}: free Offer`);
    assert.ok(!('aggregateRating' in about), `${file}: must not fabricate aggregateRating`);
  }
});
