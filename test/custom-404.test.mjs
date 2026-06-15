import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The custom 404 page is a build artifact: Astro emits src/pages/404.astro to
// 404.html (the special filename Cloudflare's static-assets layer serves for
// unknown paths). These assertions therefore run against the *built* HTML, not
// the source — so the test builds the site once before asserting.
//
// Build into an isolated temp --outDir (never the shared ./dist), so this test
// can run in parallel with `npm test`'s own build and other self-building tests
// (node --test runs files concurrently) without any of them deleting or
// overwriting each other's output.

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
let outDir;
let html = '';

before(() => {
  outDir = mkdtempSync(join(tmpdir(), 'custom-404-dist-'));
  const res = spawnSync('npx', ['astro', 'build', '--outDir', outDir], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env },
  });
  assert.equal(res.status, 0, `astro build failed:\n${res.stdout}\n${res.stderr}`);
  const html404Path = join(outDir, '404.html');
  html = existsSync(html404Path) ? readFileSync(html404Path, 'utf8') : '';
}, { timeout: 120000 });

test('Astro emits the custom 404 page to 404.html', () => {
  assert.ok(existsSync(join(outDir, '404.html')), '404.html should exist after build');
  assert.ok(html.length > 0, '404.html should not be empty');
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

// --- Activation: CF must actually serve the built 404.html (fix iteration 1) ---
//
// Emitting 404.html is necessary but not sufficient: Cloudflare's static-assets
// layer defaults `not_found_handling` to "none", which returns a generic 404 for
// unknown paths instead of our page. `"404-page"` makes the assets layer serve
// dist/404.html (with a 404 status) for any path that doesn't resolve to an
// asset. This asserts the config and the page ship together.

test('wrangler.json activates the custom 404 via not_found_handling', () => {
  const wrangler = JSON.parse(
    readFileSync(fileURLToPath(new URL('../wrangler.json', import.meta.url)), 'utf8'),
  );
  assert.equal(
    wrangler.assets?.not_found_handling,
    '404-page',
    'assets.not_found_handling must be "404-page" so CF serves dist/404.html for unknown paths',
  );
});
