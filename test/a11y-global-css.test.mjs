import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

// Accessibility fallbacks live in the single global stylesheet (imported by
// BaseLayout, so they apply site-wide). Two gaps these guards lock in:
//   1. prefers-reduced-motion: reduce — neutralises every Tailwind
//      transition/transform/animation for vestibular-sensitive users without
//      touching individual components (e.g. GuideCard hover:-translate-y).
//   2. :focus-visible — a visible, high-contrast keyboard focus ring instead
//      of relying on the (unverified-contrast) browser default.
// We assert on the *source* CSS (deterministic, no build needed) and, against a
// dist built on demand, that both blocks survive Tailwind/Astro bundling.

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

test('source global.css neutralises hover affordance transforms under reduced-motion', () => {
  // Collapsing transition-duration alone still lets hover transforms (e.g.
  // GuideCard's hover:-translate-y) *instantly* shift the element. To truly
  // reduce motion we must zero out the transform on the interactive states.
  //
  // Tailwind v4 applies the offset via the individual CSS `translate` property
  // (which reads --tw-translate-x/y), NOT the legacy `transform` shorthand. A
  // bare `transform: none` would therefore neither override it nor survive the
  // CSS minifier (which folds identity transform declarations away). So the
  // robust reset is to override Tailwind's --tw-translate-* custom properties,
  // which the minifier cannot merge into a shorthand.
  //
  // The selector may be a list (e.g. `*:hover, *:focus, *:active`), so allow
  // anything but braces between `:hover` and the rule's opening `{`.
  const hoverRule = flatSource.match(/:hover[^{}]*{[^}]*}/);
  assert.ok(hoverRule, 'missing a :hover transform-reset rule under reduced-motion');
  const rule = hoverRule[0];
  // Zero out the translate the GuideCard hover actually uses, both axes.
  assert.match(rule, /--tw-translate-x:\s*0\s*!important/, ':hover should zero --tw-translate-x');
  assert.match(rule, /--tw-translate-y:\s*0\s*!important/, ':hover should zero --tw-translate-y');
  // And neutralise the native transform shorthand for any non-Tailwind usage.
  assert.match(rule, /transform:\s*none\s*!important/, ':hover should reset transform');
});

test('source global.css defines a :focus-visible outline ring', () => {
  assert.match(flatSource, /:focus-visible\s*{[^}]*}/, 'missing :focus-visible rule');
  const rule = flatSource.match(/:focus-visible\s*{[^}]*}/)[0];
  assert.match(rule, /outline:[^;]*2px/, ':focus-visible should set a 2px outline');
  assert.match(rule, /outline-offset:/, ':focus-visible should set outline-offset');
});

// Build-product guard. This used to be best-effort — `npm test` runs
// `node --test` before `astro build`, so on a clean checkout dist/ did not
// exist yet and the assertion silently reported "# SKIP". This file sorts first
// alphabetically, so nothing else had built dist/ for it either: in CI it
// skipped on every run. It now builds on demand, and resolves the CSS files
// inside the test rather than at module load, so the build has already happened
// by the time they are read.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function ensureBuilt() {
  if (existsSync(ASTRO_DIR)) return;
  execFileSync('npx', ['astro', 'build'], { cwd: ROOT, stdio: 'ignore' });
}

before(() => ensureBuilt(), { timeout: 180_000 });

test('built dist CSS keeps both a11y blocks', () => {
  const cssFiles = readdirSync(ASTRO_DIR)
    .filter((f) => f.endsWith('.css'))
    .map((f) => join(ASTRO_DIR, f));
  assert.ok(cssFiles.length > 0, 'expected at least one built CSS bundle in dist/_astro');
  const dist = squash(cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n'));
  assert.match(dist, /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)/, 'reduced-motion block missing from built CSS');
  assert.match(dist, /animation-duration:\s*0?\.01ms\s*!important/, 'reduced-motion duration reset missing from built CSS');
  assert.match(dist, /:hover[^{}]*{[^}]*--tw-translate-y:\s*0\s*!important/, 'hover transform-reset (--tw-translate-y) missing from built CSS');
  assert.match(dist, /:focus-visible/, ':focus-visible rule missing from built CSS');
});
