import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectFontPreloadErrors } from '../scripts/check-fonts.mjs';

// Mirrors what BaseLayout emits for the two preloaded Inter weights.
const HREF_400 = '/_astro/inter-latin-400-normal.abc123.woff2';
const HREF_700 = '/_astro/inter-latin-700-normal.def456.woff2';
const CSS_URLS = new Set([HREF_400, HREF_700]);
const ALL_EXIST = () => true;

const opts = { cssFontUrls: CSS_URLS, fileExists: ALL_EXIST };

/** A clean preload tag matching the real BaseLayout product (has crossorigin). */
function preload(href, { crossorigin = ' crossorigin' } = {}) {
  return `<link rel="preload" href="${href}" as="font" type="font/woff2"${crossorigin}>`;
}

test('real BaseLayout-style preloads (with crossorigin) produce no errors', () => {
  const html = `${preload(HREF_400)}\n${preload(HREF_700)}`;
  const { count, errors } = collectFontPreloadErrors(html, opts);
  assert.equal(count, 2);
  assert.deepEqual(errors, []);
});

test('a font preload missing crossorigin is flagged', () => {
  // The RED sample: identical to the product but with crossorigin stripped.
  const html = preload(HREF_400, { crossorigin: '' });
  const { count, errors } = collectFontPreloadErrors(html, opts);
  assert.equal(count, 1);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /lacks crossorigin/);
  assert.match(errors[0], new RegExp(HREF_400.replace(/[.]/g, '\\.')));
});

test('only the preload missing crossorigin is flagged when mixed', () => {
  const html = `${preload(HREF_400)}\n${preload(HREF_700, { crossorigin: '' })}`;
  const { count, errors } = collectFontPreloadErrors(html, opts);
  assert.equal(count, 2);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /lacks crossorigin/);
  assert.match(errors[0], new RegExp(HREF_700.replace(/[.]/g, '\\.')));
});

test('crossorigin accepted whether bare or valued', () => {
  for (const crossorigin of [' crossorigin', ' crossorigin=""', ' crossorigin="anonymous"']) {
    const { errors } = collectFontPreloadErrors(preload(HREF_400, { crossorigin }), opts);
    assert.deepEqual(errors, [], `crossorigin form "${crossorigin}" should pass`);
  }
});

test('preload without href is flagged (and short-circuits other checks)', () => {
  const html = '<link rel="preload" as="font" type="font/woff2" crossorigin>';
  const { count, errors } = collectFontPreloadErrors(html, opts);
  assert.equal(count, 1);
  assert.deepEqual(errors, ['font preload without href']);
});

test('preload href not referenced by built CSS is flagged (hash drift)', () => {
  const stale = '/_astro/inter-latin-400-normal.STALE.woff2';
  const { errors } = collectFontPreloadErrors(preload(stale), opts);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /not referenced by any built CSS/);
});

test('preload href with no matching dist file is flagged', () => {
  const { errors } = collectFontPreloadErrors(preload(HREF_400), {
    cssFontUrls: CSS_URLS,
    fileExists: () => false,
  });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /does not exist in dist/);
});

test('pages with no font preloads yield no errors here (count 0)', () => {
  const { count, errors } = collectFontPreloadErrors('<head><title>x</title></head>', opts);
  assert.equal(count, 0);
  assert.deepEqual(errors, []);
});
