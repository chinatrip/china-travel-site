import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The custom 404 page is a build artifact: Astro emits src/pages/404.astro to
// dist/404.html (the special filename Cloudflare's static-assets layer serves
// for unknown paths). These assertions therefore run against the *built* HTML,
// not the source — so the test builds the site once before asserting.
//
// `npm test` runs `node --test` *before* `astro build`, so we cannot rely on a
// pre-existing dist/. Building here (idempotent, same command the suite runs
// anyway) keeps this test self-contained and order-independent.

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const html404Path = fileURLToPath(new URL('../dist/404.html', import.meta.url));
let html = '';

before(() => {
  execFileSync('npx', ['astro', 'build'], { cwd: repoRoot, stdio: 'inherit' });
  html = existsSync(html404Path) ? readFileSync(html404Path, 'utf8') : '';
}, { timeout: 180000 });

test('Astro emits the custom 404 page to dist/404.html', () => {
  assert.ok(existsSync(html404Path), 'dist/404.html should exist after build');
  assert.ok(html.length > 0, 'dist/404.html should not be empty');
});

test('404 page is excluded from search indexes (noindex)', () => {
  // BaseLayout renders `<meta name="robots" content="noindex, follow" />` when
  // passed the noindex prop — an error page must never be indexed.
  assert.match(
    html,
    /<meta\s+name="robots"\s+content="noindex, follow"\s*\/?>/,
    'expected a noindex robots meta tag',
  );
});

test('404 page carries a branded, descriptive title', () => {
  assert.match(html, /<title>Page not found \| ChinaGuide\.ai<\/title>/);
});

test('404 page sets a meta description', () => {
  assert.match(
    html,
    /<meta\s+name="description"\s+content="[^"]+"\s*\/?>/,
    'expected a non-empty meta description',
  );
});

test('404 page shows a human-readable "Page not found" heading', () => {
  assert.match(html, /<h1[^>]*>[\s\S]*Page not found[\s\S]*<\/h1>/i);
});

test('404 page links back to the key entry points', () => {
  // Trailing slashes are mandatory (trailingSlash: 'always' + the worker's
  // 301 normalization) — link to the canonical directory form directly.
  for (const href of ['/', '/guides/', '/apps/', '/search/']) {
    assert.match(
      html,
      new RegExp(`href="${href.replace(/\//g, '\\/')}"`),
      `expected a link to ${href}`,
    );
  }
});
