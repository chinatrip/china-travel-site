import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The checklist page renders its items from a JS data array, so the built-HTML
// link checker (scripts/check-internal-links.mjs) never sees these links and
// the visa-free copy never goes through content review. Guard both at the source.
const source = readFileSync(
  fileURLToPath(new URL('../src/pages/checklist.astro', import.meta.url)),
  'utf8',
);

// ---- fact guard: nationwide visa-free count is 50 (NIA list, 2026-02-17) ----
test('visa-free country count is 50, not 59 (59 is the Hainan-only program)', () => {
  assert.ok(!source.includes('59 countries'), 'stale "59 countries" claim found in checklist.astro');
  assert.ok(source.includes('50 countries'), 'expected the corrected "50 countries" claim in checklist.astro');
  // "unilateral" keeps the claim aligned with the visa-types FAQ: bilateral
  // mutual-exemption countries (Singapore, UAE, Thailand, ...) are not in the 50.
  assert.ok(
    source.includes('unilateral visa-free entry'),
    'the 50-country claim must be qualified as "unilateral visa-free entry"',
  );
});

// ---- link guard: checklist data links must use the canonical trailing-slash form ----
test('every internal link in the checklist data ends with a trailing slash', () => {
  // Quote-agnostic so `link: "..."` or a template literal can't slip past the guard.
  const links = [...source.matchAll(/link:\s*(['"`])([^'"`]+)\1/g)].map((m) => m[2]);
  assert.ok(links.length > 0, 'no link: fields found — extraction regex is broken');

  const offenders = links.filter((link) => {
    if (!link.startsWith('/')) return false; // external links are out of scope
    const path = link.split(/[#?]/)[0];
    return !path.endsWith('/');
  });
  assert.deepEqual(offenders, [], `internal checklist links missing trailing slash: ${offenders.join(', ')}`);
});
