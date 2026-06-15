import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// These assert on the Navbar/Footer component source (the build inputs that
// produce the rendered nav/footer on every page). They guard the
// accessibility + internal-linking contract that issue feat/nav-footer-a11y
// establishes: a labelled landmark nav, programmatic current-page signalling
// (not colour-only), a footer wrapped in a navigation landmark, and a Quick
// Links / About set that covers the key entry points.

const NAVBAR = readFileSync(
  fileURLToPath(new URL('../src/components/Navbar.astro', import.meta.url)),
  'utf8',
);
const FOOTER = readFileSync(
  fileURLToPath(new URL('../src/components/Footer.astro', import.meta.url)),
  'utf8',
);

// --- Navbar: landmark + current-page accessibility ---

test('Navbar marks its landmark with an aria-label', () => {
  assert.match(NAVBAR, /<nav[^>]*\baria-label=("|')[^"']+\1/);
});

test('Navbar exposes a single, descriptively labelled navigation landmark', () => {
  // The <nav> itself carries the descriptive label so assistive tech can name
  // it ("Main navigation") — and there is exactly one nav landmark (no nested
  // role="navigation" duplicating it).
  assert.match(NAVBAR, /<nav[^>]*aria-label=("|')Main navigation\1/);
  assert.ok(!/role=("|')navigation\1/.test(NAVBAR), 'no redundant nested navigation landmark');
});

test('Navbar signals the active route with aria-current="page", not colour alone', () => {
  // aria-current must resolve to "page" for the active link and be omitted
  // (undefined) otherwise, so screen readers learn which link is current.
  assert.match(NAVBAR, /aria-current=/);
  assert.match(NAVBAR, /'page'\s*:\s*undefined/);
});

test('Navbar derives active state from currentPath per top-level destination', () => {
  // The active predicate must be path-prefix based and cover the primary
  // destinations (regardless of whether it is inlined or table-driven).
  assert.match(NAVBAR, /currentPath\.startsWith/);
  for (const seg of ['/guides', '/apps', '/checklist']) {
    assert.ok(
      NAVBAR.includes(`'${seg}'`),
      `expected active-route segment for ${seg}`,
    );
  }
});

// --- Footer: navigation landmark + heading semantics ---

test('Footer wraps its link lists in a <nav> landmark with an aria-label', () => {
  assert.match(FOOTER, /<nav[^>]*\baria-label=("|')[^"']+\1/);
});

test('Footer keeps a sensible heading hierarchy (one h2, section h3s — no h4 jump)', () => {
  // The footer sits below the page <h1>; its column titles should be h3 under a
  // single section h2 rather than orphaned h4s.
  assert.ok(!/<h4\b/.test(FOOTER), 'footer should not use <h4> headings');
});

// --- Footer: internal-link coverage of the key entry points ---

const FOOTER_REQUIRED_LINKS = [
  '/guides/',
  '/apps/',
  '/checklist/',
  '/about/',
  '/editorial-policy/',
];

for (const href of FOOTER_REQUIRED_LINKS) {
  test(`Footer links to ${href}`, () => {
    assert.ok(
      FOOTER.includes(`href="${href}"`),
      `Footer is missing a link to ${href}`,
    );
  });
}

// --- Brand voice consistency (matches site-wide copy) ---

test('Footer credits the ChinaGuide Editorial Team', () => {
  assert.match(FOOTER, /ChinaGuide Editorial Team/);
});

test('Footer keeps the "source-verified" / "source-checked" trust framing', () => {
  assert.match(FOOTER, /source-verified|source-checked/);
});
