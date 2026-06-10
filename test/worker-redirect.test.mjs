import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redirectTarget } from '../worker/index.js';

const ORIGIN = 'https://chinaguide.ai';

test('redirects extensionless page paths to the trailing-slash form', () => {
  assert.equal(
    redirectTarget(`${ORIGIN}/guides/visa-types`),
    `${ORIGIN}/guides/visa-types/`,
  );
  assert.equal(redirectTarget(`${ORIGIN}/apps/didi`), `${ORIGIN}/apps/didi/`);
  assert.equal(redirectTarget(`${ORIGIN}/checklist`), `${ORIGIN}/checklist/`);
});

test('preserves the query string on redirect', () => {
  assert.equal(
    redirectTarget(`${ORIGIN}/search?q=x`),
    `${ORIGIN}/search/?q=x`,
  );
  assert.equal(
    redirectTarget(`${ORIGIN}/guides/visa-types?utm_source=reddit&ref=1`),
    `${ORIGIN}/guides/visa-types/?utm_source=reddit&ref=1`,
  );
});

test('accepts a URL object as well as a string', () => {
  assert.equal(
    redirectTarget(new URL(`${ORIGIN}/guides/esim`)),
    `${ORIGIN}/guides/esim/`,
  );
});

test('returns null for the root path', () => {
  assert.equal(redirectTarget(`${ORIGIN}/`), null);
});

test('returns null for paths that already end with a slash', () => {
  assert.equal(redirectTarget(`${ORIGIN}/guides/visa-types/`), null);
  assert.equal(redirectTarget(`${ORIGIN}/apps/didi/?from=nav`), null);
});

test('returns null for file-like paths (last segment contains a dot)', () => {
  assert.equal(redirectTarget(`${ORIGIN}/llms.txt`), null);
  assert.equal(redirectTarget(`${ORIGIN}/robots.txt`), null);
  assert.equal(redirectTarget(`${ORIGIN}/sitemap-index.xml`), null);
  assert.equal(redirectTarget(`${ORIGIN}/_astro/x.css`), null);
  assert.equal(redirectTarget(`${ORIGIN}/pagefind/pagefind.js`), null);
  assert.equal(redirectTarget(`${ORIGIN}/favicon.ico`), null);
});

test('is idempotent: applying it to its own output yields null', () => {
  const target = redirectTarget(`${ORIGIN}/guides/visa-types`);
  assert.equal(redirectTarget(target), null);

  const withQuery = redirectTarget(`${ORIGIN}/search?q=x`);
  assert.equal(redirectTarget(withQuery), null);
});
