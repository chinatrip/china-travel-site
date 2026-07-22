import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Favicon / touch-icon / web-manifest completeness. The site shipped with the
// Astro starter's default favicon and NO <link rel="icon"> in <head>, so Google
// (favicon-in-search, wants a declared icon that's a multiple of 48px) and
// Yandex (flagged FAVICON_PROBLEM, wants >=120px) had nothing branded to show.
// These assert the real built <head> plus the on-disk assets it references, so a
// dropped tag or a renamed/missing file fails CI instead of silently regressing.

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const publicDir = join(repoRoot, 'public');

// Local (site-root) icon assets the head must reference and ship.
const ICON_FILES = [
  'favicon.ico',
  'favicon-48.png',
  'favicon-192.png',
  'favicon-512.png',
  'apple-touch-icon.png',
  'site.webmanifest',
];

// Build once into an isolated dist so assertions never depend on `npm test`
// step ordering (node --test runs before the pipeline's own build).
let outDir;
before(() => {
  outDir = mkdtempSync(join(tmpdir(), 'favicon-dist-'));
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

/** All <link> tags whose rel matches, as raw tag strings. */
function links(headHtml, rel) {
  const re = new RegExp(`<link[^>]*\\brel="${rel}"[^>]*>`, 'gi');
  return headHtml.match(re) || [];
}
function hrefOf(tag) {
  const m = tag.match(/\bhref="([^"]*)"/i);
  return m ? m[1] : null;
}
/** href of the first <link rel> tag that also contains `needle` (e.g. a sizes/type). */
function iconHref(headHtml, needle) {
  for (const tag of links(headHtml, 'icon')) {
    if (tag.includes(needle)) return hrefOf(tag);
  }
  return null;
}

test('every referenced icon asset ships in public/', () => {
  for (const f of ICON_FILES) {
    assert.ok(existsSync(join(publicDir, f)), `public/${f} must exist`);
  }
});

test('the built root carries the icon assets (public/ copied to dist)', () => {
  for (const f of ICON_FILES) {
    assert.ok(existsSync(join(outDir, f)), `dist/${f} must be emitted`);
  }
});

test('home <head> declares favicon.ico, PNG icons, apple-touch-icon and manifest', () => {
  const h = head('index.html');
  // legacy .ico
  assert.ok(
    links(h, 'icon').some((t) => hrefOf(t) === '/favicon.ico'),
    'rel="icon" → /favicon.ico',
  );
  // PNG icons Google/Yandex prefer (>=48px, >=120px)
  assert.equal(iconHref(h, '48x48'), '/favicon-48.png', '48x48 PNG icon');
  assert.equal(iconHref(h, '192x192'), '/favicon-192.png', '192x192 PNG icon');
  // apple-touch-icon for iOS home screen / bookmarks
  assert.equal(hrefOf(links(h, 'apple-touch-icon')[0] || ''), '/apple-touch-icon.png', 'apple-touch-icon');
  // web app manifest
  assert.equal(hrefOf(links(h, 'manifest')[0] || ''), '/site.webmanifest', 'manifest link');
});

test('the /es/ page carries the SAME icon head (shared BaseLayout parity)', () => {
  const h = head('es/index.html');
  assert.ok(links(h, 'icon').some((t) => hrefOf(t) === '/favicon.ico'), 'es rel="icon" → /favicon.ico');
  assert.equal(iconHref(h, '192x192'), '/favicon-192.png', 'es 192x192 PNG icon');
  assert.equal(hrefOf(links(h, 'apple-touch-icon')[0] || ''), '/apple-touch-icon.png', 'es apple-touch-icon');
  assert.equal(hrefOf(links(h, 'manifest')[0] || ''), '/site.webmanifest', 'es manifest link');
});

test('site.webmanifest is valid JSON referencing existing icons + brand theme color', () => {
  const manifest = JSON.parse(readFileSync(join(publicDir, 'site.webmanifest'), 'utf8'));
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, 'has an icons array');
  for (const icon of manifest.icons) {
    const rel = icon.src.replace(/^\//, '');
    assert.ok(existsSync(join(publicDir, rel)), `manifest icon ${icon.src} must exist`);
  }
  assert.equal(manifest.theme_color, '#dc2626', 'brand red theme_color');
});
