import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Accessibility fallbacks live in the single global stylesheet (imported by
// BaseLayout, so they apply site-wide). Two gaps these guards lock in:
//   1. prefers-reduced-motion: reduce — neutralises every Tailwind
//      transition/transform/animation for vestibular-sensitive users without
//      touching individual components (e.g. GuideCard hover:-translate-y).
//   2. :focus-visible — a visible, high-contrast keyboard focus ring instead
//      of relying on the (unverified-contrast) browser default.
// We assert on the *source* CSS (deterministic, no build needed) and, when a
// dist build is present, that both blocks survive Tailwind/Astro bundling.

const SOURCE_CSS = 'src/styles/global.css';
const ASTRO_DIR = join('dist', '_astro');

/** Collapse whitespace so assertions are robust to formatting/minification. */
const squash = (s) => s.replace(/\s+/g, ' ');

const source = readFileSync(SOURCE_CSS, 'utf8');
const flatSource = squash(source);

test('source global.css has a prefers-reduced-motion: reduce reset', () => {
  assert.match(
    flatSource,
    /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/,
    'missing @media (prefers-reduced-motion: reduce) block',
  );
  // The reset must collapse animation + transition durations near-instantly...
  assert.match(flatSource, /animation-duration:\s*0?\.01ms\s*!important/);
  assert.match(flatSource, /transition-duration:\s*0?\.01ms\s*!important/);
  // ...stop looping animations and disable smooth scrolling.
  assert.match(flatSource, /animation-iteration-count:\s*1\s*!important/);
  assert.match(flatSource, /scroll-behavior:\s*auto\s*!important/);
  // Applied broadly via the universal selector (incl. pseudo-elements) so it
  // covers component-level Tailwind utilities without editing those files.
  assert.match(flatSource, /\*\s*,\s*\*::before\s*,\s*\*::after/);
});

test('source global.css defines a :focus-visible outline ring', () => {
  assert.match(flatSource, /:focus-visible\s*{[^}]*}/, 'missing :focus-visible rule');
  const rule = flatSource.match(/:focus-visible\s*{[^}]*}/)[0];
  assert.match(rule, /outline:[^;]*2px/, ':focus-visible should set a 2px outline');
  assert.match(rule, /outline-offset:/, ':focus-visible should set outline-offset');
});

// Build-product guard: only runs when a dist build already exists. The npm
// test chain runs `node --test` before `astro build`, so this is best-effort
// here; the full chain still rebuilds dist afterwards.
const cssFiles = existsSync(ASTRO_DIR)
  ? readdirSync(ASTRO_DIR)
      .filter((f) => f.endsWith('.css'))
      .map((f) => join(ASTRO_DIR, f))
  : [];

test('built dist CSS keeps both a11y blocks (skipped if no dist build)', { skip: cssFiles.length === 0 }, () => {
  const dist = squash(cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n'));
  assert.match(dist, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/, 'reduced-motion block missing from built CSS');
  assert.match(dist, /animation-duration:\s*0?\.01ms\s*!important/, 'reduced-motion duration reset missing from built CSS');
  assert.match(dist, /:focus-visible/, ':focus-visible rule missing from built CSS');
});
