#!/usr/bin/env node
/**
 * CI guard for self-hosted Inter (#39): the font setup lives in BaseLayout
 * imports + preload tags and would silently regress (render-blocking Google
 * Fonts back, broken preload after a hash drift, lost pinyin coverage) without
 * these dist assertions. Runs after `astro build` in the test chain.
 *
 *  1. No page references fonts.googleapis.com / fonts.gstatic.com.
 *  2. Every page's font preload href is a URL actually referenced by the
 *     built CSS (same hashed asset — guards against preload/CSS drift), the
 *     file exists in dist/_astro/, and the tag carries `crossorigin` (font
 *     preloads are CORS requests even same-origin — a missing crossorigin
 *     downloads the font twice, defeating the preload).
 *  3. The built CSS keeps latin-ext @font-face rules with a unicode-range:
 *     guide pages use pinyin tone marks (ǒ ǎ ǐ …) that live in latin-ext;
 *     latin-only subset files would push them to system-font fallback.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Validate every `<link rel="preload" as="font">` tag in one page's HTML.
 * Pure (no fs) so it is unit-testable against HTML fixtures.
 *
 * Each preload must:
 *  - carry an href,
 *  - carry `crossorigin` (font preloads are CORS requests even same-origin;
 *    without it the browser fetches the font a second time and the preload
 *    is wasted),
 *  - point at a URL the built CSS actually references (hash-drift guard),
 *  - resolve to a file that exists in dist.
 *
 * @param {string} html Page HTML.
 * @param {object} opts
 * @param {Set<string>} opts.cssFontUrls woff/woff2 URLs referenced by built CSS.
 * @param {(href: string) => boolean} opts.fileExists Resolves a preload href to a dist file.
 * @returns {{ count: number, errors: string[] }}
 */
export function collectFontPreloadErrors(html, { cssFontUrls, fileExists }) {
  const errors = [];
  let count = 0;
  for (const tag of html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)) {
    count++;
    const raw = tag[0];
    const href = raw.match(/href="([^"]+)"/)?.[1];
    if (!href) {
      errors.push('font preload without href');
      continue;
    }
    // `crossorigin` may appear bare or valued (crossorigin / crossorigin=""
    // / crossorigin="anonymous"); accept all, reject only its absence.
    if (!/\bcrossorigin\b/.test(raw)) {
      errors.push(`preload ${href} lacks crossorigin (font preloads are CORS — the font would download twice)`);
    }
    if (!cssFontUrls.has(href)) {
      errors.push(`preload ${href} is not referenced by any built CSS (hash drift?)`);
    }
    if (!fileExists(href)) {
      errors.push(`preload ${href} does not exist in dist`);
    }
  }
  return { count, errors };
}

// When imported (e.g. by tests), stop here — only run the dist checks as a script.
if (process.argv[1] !== fileURLToPath(import.meta.url)) {
  // exported helpers only; no side effects on import.
} else {
  runDistChecks();
}

function runDistChecks() {
  const DIST = 'dist';
  const ASTRO_DIR = join(DIST, '_astro');

  if (!existsSync(DIST)) {
    console.error('❌ dist/ not found — run `astro build` before check-fonts.');
    process.exit(1);
  }

  /** Recursively collect files under dir with one of the given extensions. */
  function collect(dir, exts, out = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) collect(path, exts, out);
      else if (exts.some((e) => entry.name.endsWith(e))) out.push(path);
    }
    return out;
  }

  const htmlFiles = collect(DIST, ['.html']);
  const cssFiles = existsSync(ASTRO_DIR) ? collect(ASTRO_DIR, ['.css']) : [];
  const cssText = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');
  const errors = [];

  // 1. Zero external Google Fonts references anywhere in built pages or CSS.
  for (const f of [...htmlFiles, ...cssFiles]) {
    if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(readFileSync(f, 'utf8'))) {
      errors.push(`${f}: references external Google Fonts (should be self-hosted)`);
    }
  }

  // 2. Font preloads carry crossorigin, point at URLs the built CSS uses, and exist.
  const cssFontUrls = new Set([...cssText.matchAll(/url\(([^)]+\.woff2?)\)/g)].map((m) => m[1].replace(/["']/g, '')));
  const fileExists = (href) => existsSync(join(DIST, href.replace(/^\//, '')));
  let preloadCount = 0;
  for (const f of htmlFiles) {
    const html = readFileSync(f, 'utf8');
    const { count, errors: pageErrors } = collectFontPreloadErrors(html, { cssFontUrls, fileExists });
    preloadCount += count;
    for (const e of pageErrors) errors.push(`${f}: ${e}`);
  }
  if (htmlFiles.length && preloadCount === 0) {
    errors.push('no font preload tags found in any built page (BaseLayout preloads removed?)');
  }

  // 3. latin-ext coverage with unicode-range survives (pinyin tone marks).
  const faces = cssText.match(/@font-face\s*{[^}]*}/g) ?? [];
  const latinExtFaces = faces.filter((face) => /latin-ext/.test(face));
  if (!latinExtFaces.length) {
    errors.push('built CSS has no latin-ext @font-face — pinyin tone marks (ǒ ǎ ǐ) would fall back to system fonts');
  }
  for (const face of latinExtFaces) {
    if (!/unicode-range/.test(face)) {
      errors.push('a latin-ext @font-face lacks unicode-range — it would shadow the latin face for the whole family');
    }
  }

  if (errors.length) {
    console.error(`❌ ${errors.length} font self-hosting assertion(s) failed:`);
    for (const e of errors) console.error(`   ${e}`);
    process.exit(1);
  }
  console.log(`✅ Fonts self-hosted: 0 Google Fonts refs, ${preloadCount} preloads match built CSS (all crossorigin), latin-ext unicode-range intact.`);
}
