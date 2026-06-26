import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { buildReferralDataPoint } from '../worker/index.js';

const ORIGIN = 'https://chinaguide.ai';

// Default args for a logged page view: GET 200 text/html. Individual tests
// override only the fields they exercise.
function args(overrides = {}) {
  return {
    method: 'GET',
    status: 200,
    contentType: 'text/html; charset=utf-8',
    url: new URL(`${ORIGIN}/guides/visa-types/`),
    referer: null,
    country: 'US',
    ...overrides,
  };
}

// --- buildReferralDataPoint: attribution logic ---

test('external referer → source/referrerHost are the host (www stripped), medium referral', () => {
  const point = buildReferralDataPoint(
    args({ referer: 'https://www.reddit.com/r/China/comments/abc/' }),
  );
  assert.notEqual(point, null);
  const [source, medium, campaign, referrerHost, path, country] = point.blobs;
  assert.equal(source, 'reddit.com');
  assert.equal(medium, 'referral');
  assert.equal(campaign, '(none)');
  assert.equal(referrerHost, 'reddit.com');
  assert.equal(path, '/guides/visa-types/');
  assert.equal(country, 'US');
});

test('utm params win and are captured (source/medium lowercased, campaign verbatim)', () => {
  const point = buildReferralDataPoint(
    args({
      url: new URL(
        `${ORIGIN}/guides/visa-types/?utm_source=whatsapp&utm_medium=share&utm_campaign=alipay`,
      ),
    }),
  );
  assert.notEqual(point, null);
  const [source, medium, campaign] = point.blobs;
  assert.equal(source, 'whatsapp');
  assert.equal(medium, 'share');
  assert.equal(campaign, 'alipay');
});

test('internal referer with no utm → null (pure internal navigation is not an entry)', () => {
  const point = buildReferralDataPoint(
    args({ referer: 'https://chinaguide.ai/guides/' }),
  );
  assert.equal(point, null);
});

test('www.chinaguide.ai referer with no utm → null (www stripped before internal check)', () => {
  // The internal-host test runs on the www-stripped host, so a same-site
  // visit that still carries the www. prefix in its Referer is internal too.
  const point = buildReferralDataPoint(
    args({ referer: 'https://www.chinaguide.ai/guides/' }),
  );
  assert.equal(point, null);
});

test('internal referer + utm → NOT null (utm makes it a campaign entry)', () => {
  const point = buildReferralDataPoint(
    args({
      referer: 'https://chinaguide.ai/guides/',
      url: new URL(`${ORIGIN}/guides/visa-types/?utm_source=newsletter`),
    }),
  );
  assert.notEqual(point, null);
  const [source, medium, , referrerHost] = point.blobs;
  assert.equal(source, 'newsletter');
  // No external referrer → referral medium defaults to direct, host empty.
  assert.equal(medium, 'direct');
  assert.equal(referrerHost, '');
});

test('direct (no referer, no utm) → source/medium direct, empty referrerHost', () => {
  const point = buildReferralDataPoint(args({ referer: null }));
  assert.notEqual(point, null);
  const [source, medium, campaign, referrerHost] = point.blobs;
  assert.equal(source, 'direct');
  assert.equal(medium, 'direct');
  assert.equal(campaign, '(none)');
  assert.equal(referrerHost, '');
});

// --- buildReferralDataPoint: when NOT to log ---

test('POST is not logged', () => {
  assert.equal(buildReferralDataPoint(args({ method: 'POST' })), null);
});

test('non-200 status is not logged (404 redirect etc.)', () => {
  assert.equal(buildReferralDataPoint(args({ status: 404 })), null);
  assert.equal(buildReferralDataPoint(args({ status: 301 })), null);
});

test('non-HTML content types are not logged (.md agent fetch, assets)', () => {
  assert.equal(
    buildReferralDataPoint(args({ contentType: 'text/markdown; charset=utf-8' })),
    null,
  );
  assert.equal(buildReferralDataPoint(args({ contentType: 'text/css' })), null);
  assert.equal(buildReferralDataPoint(args({ contentType: null })), null);
});

// --- buildReferralDataPoint: privacy + robustness ---

test('only the referrer host is kept — the full referer URL (with PII) never appears', () => {
  const pii =
    'https://mail.google.com/mail/u/0/?email=victim%40example.com&token=secret123#inbox';
  const point = buildReferralDataPoint(args({ referer: pii }));
  assert.notEqual(point, null);
  // Host stripped to mail.google.com; the path/query/fragment with PII gone.
  const [source, , , referrerHost] = point.blobs;
  assert.equal(source, 'mail.google.com');
  assert.equal(referrerHost, 'mail.google.com');
  const serialized = JSON.stringify(point);
  assert.ok(!serialized.includes('victim'));
  assert.ok(!serialized.includes('secret123'));
  assert.ok(!serialized.includes('/mail/u/0'));
  assert.ok(!serialized.includes('example.com'));
});

test('garbage / unparseable referer is treated as no referrer (direct)', () => {
  const point = buildReferralDataPoint(args({ referer: 'not a url' }));
  assert.notEqual(point, null);
  const [source, medium, , referrerHost] = point.blobs;
  assert.equal(source, 'direct');
  assert.equal(medium, 'direct');
  assert.equal(referrerHost, '');
});

test('missing country falls back to XX', () => {
  const point = buildReferralDataPoint(args({ country: undefined }));
  const [, , , , , country] = point.blobs;
  assert.equal(country, 'XX');
});

test('data-point shape: 1 index, 6 blobs, doubles [1]', () => {
  const point = buildReferralDataPoint(
    args({ referer: 'https://www.reddit.com/r/China/' }),
  );
  assert.equal(point.indexes.length, 1);
  assert.equal(point.blobs.length, 6);
  assert.deepEqual(point.doubles, [1]);
  // The index is the source, clamped to AE's 96-byte index limit.
  assert.equal(point.indexes[0], 'reddit.com');
});

test('index is clamped to ≤96 UTF-8 bytes, not 96 chars (multi-byte utm_source)', () => {
  // 50 CJK chars = 150 UTF-8 bytes — under 96 chars but well over 96 bytes.
  // A char-slice would have passed an oversized index to AE and been rejected.
  const utmSource = '中'.repeat(50);
  const point = buildReferralDataPoint(
    args({
      url: new URL(
        `${ORIGIN}/guides/visa-types/?utm_source=${encodeURIComponent(utmSource)}`,
      ),
    }),
  );
  const byteLen = new TextEncoder().encode(point.indexes[0]).length;
  assert.ok(byteLen <= 96, `index is ${byteLen} bytes, expected ≤96`);
  // And it must remain a valid string (no trailing partial codepoint / U+FFFD).
  assert.ok(!point.indexes[0].includes('�'));
});

// A naive byte-slice + non-fatal decode replaces a mid-codepoint cut with
// U+FFFD (3 bytes), so the re-encoded index can be 97–98 bytes — over the AE
// limit. These cases land the 96-byte cut MID-codepoint (3-byte € and 4-byte
// emoji don't divide 96 evenly), so they fail the old impl and pass the new
// last-complete-codepoint clamp.
for (const utmSource of ['a' + '€'.repeat(40), 'ab' + '😀'.repeat(24)]) {
  test(`index stays ≤96 UTF-8 bytes with a mid-codepoint cut (${utmSource.slice(0, 3)}…)`, () => {
    const point = buildReferralDataPoint(
      args({
        url: new URL(
          `${ORIGIN}/guides/visa-types/?utm_source=${encodeURIComponent(utmSource)}`,
        ),
      }),
    );
    const byteLen = new TextEncoder().encode(point.indexes[0]).length;
    assert.ok(byteLen <= 96, `index is ${byteLen} bytes, expected ≤96`);
    assert.ok(
      !point.indexes[0].includes('�'),
      'index must not contain a U+FFFD replacement char',
    );
  });
}

// --- fetch handler integration: guarded, fire-and-forget, never throws ---

function siteEnv({ referrals } = {}) {
  const env = {
    ASSETS: {
      fetch: async (request) => {
        const { pathname } = new URL(request.url);
        return new Response(`<html>${pathname}</html>`, {
          headers: {
            'Cache-Control': 'public, max-age=0, must-revalidate',
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      },
    },
  };
  if (referrals) env.REFERRALS = referrals;
  return env;
}

test('fetch writes a data point for an external-referral HTML view', async () => {
  const written = [];
  const env = siteEnv({
    referrals: { writeDataPoint: (p) => written.push(p) },
  });
  const response = await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types/`, {
      headers: { Referer: 'https://www.reddit.com/r/China/' },
    }),
    env,
  );
  assert.equal(response.status, 200);
  assert.equal(written.length, 1);
  assert.equal(written[0].blobs[0], 'reddit.com');
});

test('fetch behaves identically when REFERRALS binding is absent', async () => {
  const response = await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types/`, {
      headers: { Referer: 'https://www.reddit.com/r/China/' },
    }),
    siteEnv(),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<html>/guides/visa-types/</html>');
});

test('a throwing writeDataPoint never breaks the response', async () => {
  const env = siteEnv({
    referrals: {
      writeDataPoint: () => {
        throw new Error('AE unavailable');
      },
    },
  });
  const response = await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types/`, {
      headers: { Referer: 'https://www.reddit.com/r/China/' },
    }),
    env,
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<html>/guides/visa-types/</html>');
});

test('fetch does not log pure internal navigation (internal referer, no utm)', async () => {
  const written = [];
  const env = siteEnv({
    referrals: { writeDataPoint: (p) => written.push(p) },
  });
  await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types/`, {
      headers: { Referer: 'https://chinaguide.ai/guides/' },
    }),
    env,
  );
  assert.equal(written.length, 0);
});

test('fetch does not log a 301 redirect (logs only the final ASSETS branch)', async () => {
  const written = [];
  const env = siteEnv({
    referrals: { writeDataPoint: (p) => written.push(p) },
  });
  const response = await worker.fetch(
    // extensionless path → 301 redirect branch, before any ASSETS fetch.
    new Request(`${ORIGIN}/guides/visa-types`, {
      headers: { Referer: 'https://www.reddit.com/r/China/' },
    }),
    env,
  );
  assert.equal(response.status, 301);
  assert.equal(written.length, 0);
});
