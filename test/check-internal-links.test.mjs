import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { isOffender, routeTargetExists } from '../scripts/check-internal-links.mjs';

// Trailing-slash guard and route-existence guard are separate failures: a link
// to an unpublished page (`/guides/residence-permit/`) is well-formed, so only
// the second one catches it. That regression shipped live once.

function distFixture() {
  const dist = mkdtempSync(join(tmpdir(), 'chinaguide-dist-'));
  writeFileSync(join(dist, 'index.html'), '');
  mkdirSync(join(dist, 'guides', 'visa-types'), { recursive: true });
  writeFileSync(join(dist, 'guides', 'visa-types', 'index.html'), '');
  writeFileSync(join(dist, 'guides', 'visa-types.md'), '');
  mkdirSync(join(dist, 'es', 'guides', 'visa-types'), { recursive: true });
  writeFileSync(join(dist, 'es', 'guides', 'visa-types', 'index.html'), '');
  writeFileSync(join(dist, 'llms.txt'), '');
  return dist;
}

test('isOffender flags only internal directory links missing the trailing slash', () => {
  assert.equal(isOffender('/guides/visa-types'), true);
  assert.equal(isOffender('/guides/visa-types/'), false);
  assert.equal(isOffender('/'), false);
  assert.equal(isOffender('/llms.txt'), false);
  assert.equal(isOffender('/guides/visa-types/#faq'), false);
  assert.equal(isOffender('https://example.com/guides/x'), false);
  assert.equal(isOffender('mailto:hello@chinaguide.ai'), false);
  assert.equal(isOffender('#top'), false);
});

test('routeTargetExists accepts built pages, files and external links', () => {
  const dist = distFixture();
  assert.equal(routeTargetExists('/', dist), true);
  assert.equal(routeTargetExists('/guides/visa-types/', dist), true);
  assert.equal(routeTargetExists('/guides/visa-types/#faq', dist), true);
  assert.equal(routeTargetExists('/es/guides/visa-types/', dist), true);
  assert.equal(routeTargetExists('/guides/visa-types.md', dist), true);
  assert.equal(routeTargetExists('/llms.txt', dist), true);
  assert.equal(routeTargetExists('https://example.com/anything', dist), true);
  assert.equal(routeTargetExists('/_astro/app.css', dist), true);
});

test('routeTargetExists rejects links to pages that were never built', () => {
  const dist = distFixture();
  // The exact regression: wiki page residence-permit.md is still a draft, so
  // the site never emits /guides/residence-permit/.
  assert.equal(routeTargetExists('/guides/residence-permit/', dist), false);
  assert.equal(routeTargetExists('/apps/nonexistent/', dist), false);
  assert.equal(routeTargetExists('/missing.txt', dist), false);
});
