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

test('checklist asks for the entry route and covers uncertain travellers without assigning eligibility by nationality', () => {
  assert.match(source, /Your planned entry route/);
  assert.match(source, /value="unsure"/);
  assert.doesNotMatch(source, /USA \(240-hour transit only|Other \(visa required\)|\d+ countries qualify/);
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
