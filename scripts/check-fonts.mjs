#!/usr/bin/env node
/**
 * CI guard for self-hosted Inter (#39): the font setup lives in BaseLayout
 * imports + preload tags and would silently regress (render-blocking Google
 * Fonts back, broken preload after a hash drift, lost pinyin coverage) without
 * these dist assertions. Runs after `astro build` in the test chain.
 *
 *  1. No page references fonts.googleapis.com / fonts.gstatic.com.
 *  2. Every page's font preload href is a URL actually referenced by the
 *     built CSS (same hashed asset — guards against preload/CSS drift) and
 *     the file exists in dist/_astro/.
 *  3. The built CSS keeps latin-ext @font-face rules with a unicode-range:
 *     guide pages use pinyin tone marks (ǒ ǎ ǐ …) that live in latin-ext;
 *     latin-only subset files would push them to system-font fallback.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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

// 2. Font preloads point at URLs the built CSS actually uses, and files exist.
const cssFontUrls = new Set([...cssText.matchAll(/url\(([^)]+\.woff2?)\)/g)].map((m) => m[1].replace(/["']/g, '')));
let preloadCount = 0;
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const tag of html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)) {
    preloadCount++;
    const href = tag[0].match(/href="([^"]+)"/)?.[1];
    if (!href) {
      errors.push(`${f}: font preload without href`);
      continue;
    }
    if (!cssFontUrls.has(href)) {
      errors.push(`${f}: preload ${href} is not referenced by any built CSS (hash drift?)`);
    }
    if (!existsSync(join(DIST, href.replace(/^\//, '')))) {
      errors.push(`${f}: preload ${href} does not exist in dist`);
    }
  }
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
console.log(`✅ Fonts self-hosted: 0 Google Fonts refs, ${preloadCount} preloads match built CSS, latin-ext unicode-range intact.`);
