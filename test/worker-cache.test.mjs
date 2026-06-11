import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { cacheControlFor } from '../worker/index.js';

const ORIGIN = 'https://chinaguide.ai';

const IMMUTABLE = 'public, max-age=31536000, immutable';
const HOURLY = 'public, max-age=3600';

// --- cacheControlFor: hashed assets → immutable (issue #39) ---

test('_astro assets are immutable (filenames are content-hashed)', () => {
  assert.equal(cacheControlFor('/_astro/BaseLayout.Bvi5F7KR.css'), IMMUTABLE);
  assert.equal(cacheControlFor('/_astro/Search.AbCdEf12.js'), IMMUTABLE);
});

test('hashed pagefind chunks are immutable', () => {
  // Pagefind writes content-addressed chunk files: the hex hash in the
  // filename changes whenever the indexed content changes.
  assert.equal(
    cacheControlFor('/pagefind/fragment/en_1f988b1.pf_fragment'),
    IMMUTABLE,
  );
  assert.equal(
    cacheControlFor('/pagefind/index/en_847a521.pf_index'),
    IMMUTABLE,
  );
  assert.equal(
    cacheControlFor('/pagefind/pagefind.en_18dbfbe23b.pf_meta'),
    IMMUTABLE,
  );
});

test('un-hashed pagefind files get a short max-age, not immutable', () => {
  // These filenames never change across deploys, so a year-long immutable
  // would pin returning visitors to a stale loader after a pagefind
  // version bump. One hour bounds that window while still avoiding a
  // revalidation round-trip on every /search/ visit.
  assert.equal(cacheControlFor('/pagefind/pagefind-ui.js'), HOURLY);
  assert.equal(cacheControlFor('/pagefind/pagefind-ui.css'), HOURLY);
  assert.equal(cacheControlFor('/pagefind/pagefind.js'), HOURLY);
  assert.equal(cacheControlFor('/pagefind/pagefind-entry.json'), HOURLY);
  assert.equal(cacheControlFor('/pagefind/wasm.en.pagefind'), HOURLY);
  assert.equal(cacheControlFor('/pagefind/wasm.unknown.pagefind'), HOURLY);
});

test('HTML and other paths keep the assets-layer default (no override)', () => {
  assert.equal(cacheControlFor('/'), null);
  assert.equal(cacheControlFor('/guides/visa-types/'), null);
  assert.equal(cacheControlFor('/search/'), null);
  assert.equal(cacheControlFor('/robots.txt'), null);
  assert.equal(cacheControlFor('/sitemap-index.xml'), null);
  assert.equal(cacheControlFor('/llms.txt'), null);
  assert.equal(cacheControlFor('/favicon.ico'), null);
});

test('prefix match is anchored: lookalike paths are not overridden', () => {
  assert.equal(cacheControlFor('/_astro'), null);
  assert.equal(cacheControlFor('/pagefind'), null);
  assert.equal(cacheControlFor('/guides/_astro/x.css'), null);
});

// --- fetch handler integration ---

function assetsEnv(status = 200) {
  return {
    ASSETS: {
      fetch: async () =>
        new Response(status === 404 ? 'not found' : 'asset body', {
          status,
          headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
        }),
    },
  };
}

test('fetch overrides Cache-Control for hashed assets', async () => {
  const response = await worker.fetch(
    new Request(`${ORIGIN}/_astro/BaseLayout.Bvi5F7KR.css`),
    assetsEnv(),
  );
  assert.equal(response.headers.get('Cache-Control'), IMMUTABLE);
  // Security headers still applied alongside the cache override.
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('fetch leaves HTML responses on the assets-layer default', async () => {
  const response = await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types/`),
    assetsEnv(),
  );
  assert.equal(
    response.headers.get('Cache-Control'),
    'public, max-age=0, must-revalidate',
  );
});

test('fetch never marks a 404 immutable (stale-HTML asset misses)', async () => {
  // A client holding stale HTML can request a hashed asset that no longer
  // exists after a deploy. Caching that 404 for a year would break the
  // client permanently, so error responses keep the default.
  const response = await worker.fetch(
    new Request(`${ORIGIN}/_astro/Gone.OldHash1.css`),
    assetsEnv(404),
  );
  assert.equal(response.status, 404);
  assert.equal(
    response.headers.get('Cache-Control'),
    'public, max-age=0, must-revalidate',
  );
});

test('301 redirects are unaffected by the cache override', async () => {
  const response = await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types`),
    assetsEnv(),
  );
  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get('Location'),
    `${ORIGIN}/guides/visa-types/`,
  );
  assert.equal(response.headers.get('Cache-Control'), null);
});
