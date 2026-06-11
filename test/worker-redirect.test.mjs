import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  redirectTarget,
  securityHeaders,
  applySecurityHeaders,
} from '../worker/index.js';

const ORIGIN = 'https://chinaguide.ai';
const WWW_ORIGIN = 'https://www.chinaguide.ai';

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

// --- **/index.html → directory form (issue #37) ---

test('redirects /index.html to the bare directory form', () => {
  assert.equal(redirectTarget(`${ORIGIN}/index.html`), `${ORIGIN}/`);
  assert.equal(redirectTarget(`${ORIGIN}/guides/index.html`), `${ORIGIN}/guides/`);
  assert.equal(
    redirectTarget(`${ORIGIN}/guides/visa-types/index.html`),
    `${ORIGIN}/guides/visa-types/`,
  );
});

test('preserves the query string on index.html redirects', () => {
  assert.equal(
    redirectTarget(`${ORIGIN}/guides/index.html?utm_source=reddit`),
    `${ORIGIN}/guides/?utm_source=reddit`,
  );
});

test('does not touch files merely ending in index.html without a slash boundary', () => {
  assert.equal(redirectTarget(`${ORIGIN}/myindex.html`), null);
  assert.equal(redirectTarget(`${ORIGIN}/guides/reindex.html`), null);
});

test('strips index.html case-insensitively, including at the root', () => {
  assert.equal(redirectTarget(`${ORIGIN}/INDEX.HTML`), `${ORIGIN}/`);
  assert.equal(redirectTarget(`${ORIGIN}/guides/Index.Html`), `${ORIGIN}/guides/`);
});

test('index.html redirect is idempotent', () => {
  assert.equal(redirectTarget(redirectTarget(`${ORIGIN}/guides/index.html`)), null);
});

// --- www → apex (issue #37) ---

test('redirects www host to the apex domain, preserving path and query', () => {
  assert.equal(redirectTarget(`${WWW_ORIGIN}/`), `${ORIGIN}/`);
  assert.equal(
    redirectTarget(`${WWW_ORIGIN}/guides/esim/`),
    `${ORIGIN}/guides/esim/`,
  );
  assert.equal(
    redirectTarget(`${WWW_ORIGIN}/guides/esim/?utm_source=x`),
    `${ORIGIN}/guides/esim/?utm_source=x`,
  );
});

test('www redirect applies before other rules and never leaves the apex origin', () => {
  // Even file-like and weird paths on www must land on the apex origin.
  const target = redirectTarget(`${WWW_ORIGIN}/llms.txt`);
  assert.equal(new URL(target).origin, ORIGIN);
  assert.equal(new URL(target).pathname, '/llms.txt');
});

test('does not redirect unrelated hostnames', () => {
  assert.equal(redirectTarget('http://localhost:8787/guides/esim/'), null);
});

// --- uppercase path → lowercase (issue #37) ---

test('redirects uppercase paths to lowercase', () => {
  assert.equal(
    redirectTarget(`${ORIGIN}/Guides/Visa-Types/`),
    `${ORIGIN}/guides/visa-types/`,
  );
  assert.equal(
    redirectTarget(`${ORIGIN}/Checklist/?q=X`),
    `${ORIGIN}/checklist/?q=X`,
  );
});

test('compounds lowercase + trailing slash into a single redirect', () => {
  assert.equal(
    redirectTarget(`${ORIGIN}/Guides/Visa-Types`),
    `${ORIGIN}/guides/visa-types/`,
  );
  // ...and its output needs no further redirect (single 301 hop).
  assert.equal(redirectTarget(`${ORIGIN}/guides/visa-types/`), null);
});

test('compounds lowercase + index.html strip into a single redirect', () => {
  assert.equal(
    redirectTarget(`${ORIGIN}/Guides/INDEX.HTML`),
    `${ORIGIN}/guides/`,
  );
});

test('leaves uppercase file-like paths untouched (hashed static assets)', () => {
  // Astro emits hashed asset filenames containing uppercase (component name
  // + base64 hash). Lowercasing them would 301 to a nonexistent path and,
  // with run_worker_first, take down every stylesheet on the site.
  assert.equal(redirectTarget(`${ORIGIN}/_astro/BaseLayout.C2WUMWDk.css`), null);
  assert.equal(redirectTarget(`${ORIGIN}/_astro/Search.AbCdEf12.js`), null);
  assert.equal(redirectTarget(`${ORIGIN}/Robots.TXT`), null);
});

// --- www compound single-hop (review iteration 1) ---

test('compounds www + lowercase + trailing slash into a single redirect', () => {
  assert.equal(
    redirectTarget(`${WWW_ORIGIN}/Guides/Visa-Types`),
    `${ORIGIN}/guides/visa-types/`,
  );
  // ...and its output needs no further redirect (single 301 hop).
  assert.equal(
    redirectTarget(redirectTarget(`${WWW_ORIGIN}/Guides/Visa-Types`)),
    null,
  );
});

test('compounds www + uppercase + index.html into a single redirect', () => {
  assert.equal(
    redirectTarget(`${WWW_ORIGIN}/Guides/INDEX.HTML`),
    `${ORIGIN}/guides/`,
  );
  assert.equal(
    redirectTarget(redirectTarget(`${WWW_ORIGIN}/Guides/INDEX.HTML`)),
    null,
  );
});

// --- open redirect regression (protocol-relative // paths) ---

test('never emits a target off the apex origin for protocol-relative paths', () => {
  // Pre-existing guard: //evil.com last segment has a dot → no redirect.
  assert.equal(redirectTarget(`${ORIGIN}//evil.com`), null);

  // File-like paths skip lowercasing entirely, so //EVIL.com gets no
  // redirect at all (it can never become another origin).
  assert.equal(redirectTarget(`${ORIGIN}//EVIL.com`), null);

  // www rule must not preserve // paths as another origin either.
  const fromWww = redirectTarget(`${WWW_ORIGIN}//evil.com`);
  assert.equal(new URL(fromWww).origin, ORIGIN);

  // www + extensionless // path: slash is appended, origin stays apex.
  const fromWwwDir = redirectTarget(`${WWW_ORIGIN}//evil`);
  assert.equal(new URL(fromWwwDir).origin, ORIGIN);
});

// --- security headers (issue #37) ---

test('securityHeaders returns the exact hardening header set', () => {
  assert.deepEqual(securityHeaders(), {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  });
});

test('applySecurityHeaders sets every header without losing status or body', async () => {
  const original = new Response('hello', {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
  const hardened = applySecurityHeaders(original);

  for (const [name, value] of Object.entries(securityHeaders())) {
    assert.equal(hardened.headers.get(name), value);
  }
  assert.equal(hardened.status, 200);
  assert.equal(hardened.headers.get('Content-Type'), 'text/html');
  assert.equal(await hardened.text(), 'hello');
});

test('applySecurityHeaders works on immutable redirect responses', () => {
  const redirect = Response.redirect(`${ORIGIN}/guides/`, 301);
  const hardened = applySecurityHeaders(redirect);

  assert.equal(hardened.status, 301);
  assert.equal(hardened.headers.get('Location'), `${ORIGIN}/guides/`);
  assert.equal(
    hardened.headers.get('Strict-Transport-Security'),
    'max-age=31536000; includeSubDomains',
  );
});
