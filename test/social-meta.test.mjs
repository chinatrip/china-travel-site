import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Build-output assertions for site-wide social/meta head completeness
// (OG, Twitter Card, canonical, meta robots). These render real pages through
// BaseLayout.astro so the test reflects the actual <head> Google/social
// crawlers see — not a unit view of the layout source.

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const SITE = 'https://chinaguide.ai';
const OG_IMAGE = `${SITE}/og-default.png`;

// Build once into an isolated dist dir so the assertions never depend on
// `npm test` step ordering (node --test runs before the pipeline's own build).
let outDir;
before(() => {
  outDir = mkdtempSync(join(tmpdir(), 'social-meta-dist-'));
  const res = spawnSync('npx', ['astro', 'build', '--outDir', outDir], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env },
  });
  assert.equal(res.status, 0, `astro build failed:\n${res.stdout}\n${res.stderr}`);
}, { timeout: 120000 });

function head(relPath) {
  const file = join(outDir, relPath);
  assert.ok(existsSync(file), `expected built page ${relPath}`);
  const html = readFileSync(file, 'utf8');
  return html.slice(0, html.indexOf('</head>'));
}

/** Extract the content="" of a <meta property|name="key"> from a head string. */
function metaContent(headHtml, attr, key) {
  const re = new RegExp(`<meta[^>]*\\b${attr}="${key}"[^>]*>`, 'i');
  const tag = headHtml.match(re);
  if (!tag) return null;
  const m = tag[0].match(/\bcontent="([^"]*)"/i);
  return m ? m[1] : null;
}

function canonicalHref(headHtml) {
  const tag = headHtml.match(/<link[^>]*rel="canonical"[^>]*>/i);
  if (!tag) return null;
  const m = tag[0].match(/\bhref="([^"]*)"/i);
  return m ? m[1] : null;
}

/** Map of hreflang → href for every <link rel="alternate" hreflang> in a head. */
function hreflangs(headHtml) {
  const map = {};
  for (const tag of headHtml.match(/<link[^>]*rel="alternate"[^>]*>/gi) || []) {
    const hl = tag.match(/\bhreflang="([^"]*)"/i);
    const href = tag.match(/\bhref="([^"]*)"/i);
    if (hl && href) map[hl[1]] = href[1];
  }
  return map;
}

/** The <html lang="…"> of a built page (the tag sits before </head>). */
function htmlLang(relPath) {
  const file = join(outDir, relPath);
  assert.ok(existsSync(file), `expected built page ${relPath}`);
  const m = readFileSync(file, 'utf8').match(/<html[^>]*\blang="([^"]*)"/i);
  return m ? m[1] : null;
}

// Representative pages: a static page (home), a guide (via GuideLayout→BaseLayout),
// a listing, and the noindex search shell.
const PAGES = [
  { rel: 'index.html', url: `${SITE}/`, indexable: true },
  { rel: 'guides/visa-types/index.html', url: `${SITE}/guides/visa-types/`, indexable: true },
  { rel: 'guides/index.html', url: `${SITE}/guides/`, indexable: true },
  { rel: 'search/index.html', url: `${SITE}/search/`, indexable: false },
];

for (const page of PAGES) {
  test(`${page.rel}: Open Graph tags are complete`, () => {
    const h = head(page.rel);
    assert.ok(metaContent(h, 'property', 'og:type'), 'og:type');
    assert.ok(metaContent(h, 'property', 'og:title'), 'og:title');
    assert.ok(metaContent(h, 'property', 'og:description'), 'og:description');
    assert.equal(metaContent(h, 'property', 'og:url'), page.url, 'og:url is absolute canonical');
    assert.ok(metaContent(h, 'property', 'og:site_name'), 'og:site_name');
    const ogImage = metaContent(h, 'property', 'og:image');
    assert.ok(ogImage, 'og:image present');
    assert.ok(/^https?:\/\//.test(ogImage), `og:image is an absolute URL (got ${ogImage})`);
  });

  test(`${page.rel}: Twitter Card tags are complete`, () => {
    const h = head(page.rel);
    assert.equal(metaContent(h, 'name', 'twitter:card'), 'summary_large_image', 'twitter:card');
    assert.ok(metaContent(h, 'name', 'twitter:title'), 'twitter:title');
    assert.ok(metaContent(h, 'name', 'twitter:description'), 'twitter:description');
    const twImage = metaContent(h, 'name', 'twitter:image');
    assert.ok(twImage, 'twitter:image present');
    assert.ok(/^https?:\/\//.test(twImage), `twitter:image is an absolute URL (got ${twImage})`);
  });

  test(`${page.rel}: canonical is the absolute trailing-slash URL`, () => {
    assert.equal(canonicalHref(head(page.rel)), page.url);
  });

  test(`${page.rel}: meta robots is ${page.indexable ? 'index, follow' : 'noindex'}`, () => {
    const robots = metaContent(head(page.rel), 'name', 'robots');
    assert.ok(robots, 'robots meta present');
    if (page.indexable) {
      assert.match(robots, /index/);
      assert.doesNotMatch(robots, /noindex/);
      assert.match(robots, /follow/);
    } else {
      assert.match(robots, /noindex/);
    }
  });
}

// --- i18n skeleton: locale <html lang>, og:locale, reciprocal hreflang ---
// The head is the surface Google reads for language targeting, so these assert
// the real built output, not the layout source.

test('English default-locale pages declare lang="en" and og:locale en_US', () => {
  assert.equal(htmlLang('index.html'), 'en');
  assert.equal(metaContent(head('index.html'), 'property', 'og:locale'), 'en_US');
});

test('the /es/ landing page is built with Spanish locale signals', () => {
  assert.equal(htmlLang('es/index.html'), 'es');
  const h = head('es/index.html');
  assert.equal(canonicalHref(h), `${SITE}/es/`, 'self-canonical to /es/');
  assert.equal(metaContent(h, 'property', 'og:locale'), 'es_ES');
});

test('translated pages carry a reciprocal hreflang set (en ↔ es + x-default→en)', () => {
  const enAlts = hreflangs(head('index.html'));
  assert.equal(enAlts.en, `${SITE}/`);
  assert.equal(enAlts.es, `${SITE}/es/`);
  assert.equal(enAlts['x-default'], `${SITE}/`, 'x-default targets the English URL');

  const esAlts = hreflangs(head('es/index.html'));
  assert.equal(esAlts.en, `${SITE}/`);
  assert.equal(esAlts.es, `${SITE}/es/`);
  assert.equal(esAlts['x-default'], `${SITE}/`);
});

test('NO-REGRESSION: an untranslated English page keeps only en + x-default = canonical', () => {
  // accommodation has no Spanish translation, so its head must be exactly what
  // it was before i18n: en and x-default both pointing at its own canonical, and
  // crucially NO hreflang="es" leaking in.
  const h = head('guides/accommodation/index.html');
  const alts = hreflangs(h);
  const canonical = `${SITE}/guides/accommodation/`;
  assert.equal(alts.en, canonical);
  assert.equal(alts['x-default'], canonical);
  assert.equal(alts.es, undefined, 'untranslated page must not advertise a Spanish alternate');
  assert.equal(htmlLang('guides/accommodation/index.html'), 'en');
});

test('a translated guide renders under /es/guides/ with Spanish locale + reciprocal hreflang', () => {
  assert.equal(htmlLang('es/guides/visa-types/index.html'), 'es');
  const h = head('es/guides/visa-types/index.html');
  assert.equal(canonicalHref(h), `${SITE}/es/guides/visa-types/`, 'self-canonical to the /es/ URL');
  assert.equal(metaContent(h, 'property', 'og:locale'), 'es_ES');
  const alts = hreflangs(h);
  assert.equal(alts.en, `${SITE}/guides/visa-types/`);
  assert.equal(alts.es, `${SITE}/es/guides/visa-types/`);
  assert.equal(alts['x-default'], `${SITE}/guides/visa-types/`);
});

test('its English counterpart now advertises the Spanish alternate (reciprocity)', () => {
  const alts = hreflangs(head('guides/visa-types/index.html'));
  assert.equal(alts.es, `${SITE}/es/guides/visa-types/`);
  assert.equal(alts.en, `${SITE}/guides/visa-types/`);
});

test('translated guide chrome is localized (breadcrumb + FAQ heading in Spanish)', () => {
  // Read the full body, not just the head, to assert the GuideLayout chrome.
  const html = readFileSync(join(outDir, 'es/guides/visa-types/index.html'), 'utf8');
  assert.match(html, /Inicio/, 'localized breadcrumb "Home" → "Inicio"');
  assert.match(html, /Preguntas frecuentes/, 'localized FAQ heading');
});

test('default og:image points at the real og-default.png product', () => {
  assert.ok(existsSync(join(repoRoot, 'public', 'og-default.png')), 'public/og-default.png exists');
  const h = head('index.html');
  assert.equal(metaContent(h, 'property', 'og:image'), OG_IMAGE);
  assert.equal(metaContent(h, 'name', 'twitter:image'), OG_IMAGE);
});
