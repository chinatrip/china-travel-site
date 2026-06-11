import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, {
  wantsMarkdown,
  markdownAssetFor,
  alternatesLinkHeader,
} from '../worker/index.js';

const ORIGIN = 'https://chinaguide.ai';
const DEFAULT_CACHE = 'public, max-age=0, must-revalidate';

// --- wantsMarkdown: explicit text/markdown token only (issue #56) ---

test('wantsMarkdown accepts an explicit text/markdown header', () => {
  assert.equal(wantsMarkdown('text/markdown'), true);
});

test('wantsMarkdown accepts text/markdown with q-values and siblings', () => {
  assert.equal(wantsMarkdown('text/markdown;q=0.9, text/html'), true);
});

test('wantsMarkdown rejects a browser Accept header (*/* must not trigger)', () => {
  assert.equal(
    wantsMarkdown('text/html,application/xhtml+xml,*/*;q=0.8'),
    false,
  );
});

test('wantsMarkdown rejects empty and missing headers', () => {
  assert.equal(wantsMarkdown(''), false);
  assert.equal(wantsMarkdown(undefined), false);
  assert.equal(wantsMarkdown(null), false);
});

// --- markdownAssetFor: canonical path → markdown asset path ---

test('root maps to /llms.txt (the agent-facing markdown overview)', () => {
  assert.equal(markdownAssetFor('/'), '/llms.txt');
});

test('content pages map to their .md sibling', () => {
  assert.equal(
    markdownAssetFor('/guides/visa-free-transit/'),
    '/guides/visa-free-transit.md',
  );
  assert.equal(markdownAssetFor('/apps/didi/'), '/apps/didi.md');
});

test('non-content pages do not negotiate', () => {
  assert.equal(markdownAssetFor('/about/'), null);
  assert.equal(markdownAssetFor('/checklist/'), null);
  assert.equal(markdownAssetFor('/search/'), null);
});

test('list pages do not negotiate', () => {
  assert.equal(markdownAssetFor('/guides/'), null);
  assert.equal(markdownAssetFor('/apps/'), null);
});

test('static assets and file-like paths do not negotiate', () => {
  assert.equal(markdownAssetFor('/_astro/x.css'), null);
  assert.equal(markdownAssetFor('/llms.txt'), null);
  assert.equal(markdownAssetFor('/guides/visa-types.md'), null);
});

test('non-canonical and nested paths do not negotiate', () => {
  // Negotiation runs after the redirect check, so only canonical
  // (lowercase, trailing-slash) paths should ever match.
  assert.equal(markdownAssetFor('/guides/visa-types'), null);
  assert.equal(markdownAssetFor('/guides/a/b/'), null);
});

// --- alternatesLinkHeader: RFC 8288 discovery links ---

test('every HTML page advertises /llms.txt as an alternate', () => {
  assert.equal(
    alternatesLinkHeader(null),
    '</llms.txt>; rel="alternate"; type="text/plain"',
  );
});

test('content pages additionally advertise their .md sibling', () => {
  assert.equal(
    alternatesLinkHeader('/guides/visa-types.md'),
    '</llms.txt>; rel="alternate"; type="text/plain", </guides/visa-types.md>; rel="alternate"; type="text/markdown"',
  );
});

test('the home page does not advertise /llms.txt twice', () => {
  // markdownAssetFor('/') is /llms.txt — already covered by the base link.
  assert.equal(
    alternatesLinkHeader('/llms.txt'),
    '</llms.txt>; rel="alternate"; type="text/plain"',
  );
});

// --- fetch handler integration ---

/**
 * Mock assets layer mirroring the production dist/ shape: HTML pages,
 * .md siblings, /llms.txt, and hashed CSS — all carrying the assets-layer
 * default Cache-Control like the real binding does.
 */
function siteEnv({ mdStatus = 200 } = {}) {
  return {
    ASSETS: {
      fetch: async (request) => {
        const { pathname } = new URL(request.url);
        const headers = { 'Cache-Control': DEFAULT_CACHE };
        if (pathname.endsWith('.md')) {
          if (mdStatus !== 200) {
            return new Response('not found', { status: mdStatus, headers });
          }
          return new Response(`# Markdown for ${pathname}`, {
            headers: { ...headers, 'Content-Type': 'text/markdown; charset=utf-8' },
          });
        }
        if (pathname === '/llms.txt') {
          return new Response('# ChinaGuide.ai\n\nllms index', {
            headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
        if (pathname.endsWith('.css')) {
          return new Response('body{}', {
            headers: { ...headers, 'Content-Type': 'text/css; charset=utf-8' },
          });
        }
        return new Response(`<html>${pathname}</html>`, {
          headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
        });
      },
    },
  };
}

const mdRequest = (path) =>
  new Request(`${ORIGIN}${path}`, { headers: { Accept: 'text/markdown' } });

test('GET content page with Accept: text/markdown serves the .md sibling', async () => {
  const response = await worker.fetch(
    mdRequest('/guides/visa-types/'),
    siteEnv(),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '# Markdown for /guides/visa-types.md');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/markdown; charset=utf-8',
  );
  assert.equal(response.headers.get('Vary'), 'Accept');
  assert.equal(response.headers.get('Cache-Control'), DEFAULT_CACHE);
  // Security headers still applied on the negotiated representation.
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('GET / with Accept: text/markdown serves the /llms.txt content', async () => {
  const response = await worker.fetch(mdRequest('/'), siteEnv());
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '# ChinaGuide.ai\n\nllms index');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/markdown; charset=utf-8',
  );
  assert.equal(response.headers.get('Vary'), 'Accept');
});

test('content page without Accept: text/markdown stays HTML, with Vary + Link', async () => {
  const response = await worker.fetch(
    new Request(`${ORIGIN}/guides/visa-types/`, {
      headers: { Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' },
    }),
    siteEnv(),
  );
  assert.equal(await response.text(), '<html>/guides/visa-types/</html>');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/html; charset=utf-8',
  );
  assert.equal(response.headers.get('Vary'), 'Accept');
  assert.equal(
    response.headers.get('Link'),
    '</llms.txt>; rel="alternate"; type="text/plain", </guides/visa-types.md>; rel="alternate"; type="text/markdown"',
  );
  assert.equal(response.headers.get('Cache-Control'), DEFAULT_CACHE);
});

test('non-negotiated HTML pages still get the /llms.txt Link, but no Vary', async () => {
  const response = await worker.fetch(mdRequest('/about/'), siteEnv());
  assert.equal(await response.text(), '<html>/about/</html>');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/html; charset=utf-8',
  );
  assert.equal(
    response.headers.get('Link'),
    '</llms.txt>; rel="alternate"; type="text/plain"',
  );
  assert.equal(response.headers.get('Vary'), null);
});

test('list pages are not negotiated even with Accept: text/markdown', async () => {
  const response = await worker.fetch(mdRequest('/guides/'), siteEnv());
  assert.equal(await response.text(), '<html>/guides/</html>');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/html; charset=utf-8',
  );
});

test('a missing .md asset falls back to the HTML page, never a 404', async () => {
  const response = await worker.fetch(
    mdRequest('/guides/visa-types/'),
    siteEnv({ mdStatus: 404 }),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '<html>/guides/visa-types/</html>');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/html; charset=utf-8',
  );
});

test('static assets are untouched: no negotiation, no Vary, no Link, immutable cache', async () => {
  const response = await worker.fetch(
    mdRequest('/_astro/BaseLayout.Bvi5F7KR.css'),
    siteEnv(),
  );
  assert.equal(await response.text(), 'body{}');
  assert.equal(
    response.headers.get('Content-Type'),
    'text/css; charset=utf-8',
  );
  assert.equal(response.headers.get('Vary'), null);
  assert.equal(response.headers.get('Link'), null);
  assert.equal(
    response.headers.get('Cache-Control'),
    'public, max-age=31536000, immutable',
  );
});

test('redirect normalization still wins over negotiation (single 301 first)', async () => {
  const response = await worker.fetch(
    new Request(`${ORIGIN}/Guides/Visa-Types`, {
      headers: { Accept: 'text/markdown' },
    }),
    siteEnv(),
  );
  assert.equal(response.status, 301);
  assert.equal(
    response.headers.get('Location'),
    `${ORIGIN}/guides/visa-types/`,
  );
});
