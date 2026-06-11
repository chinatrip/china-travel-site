/**
 * Worker entry: permanent-redirect normalization + security headers.
 *
 * Why this exists (see issues #32 and #37):
 * The site is an Astro static build served by Cloudflare's static assets
 * layer. That layer redirects extensionless paths without a trailing slash
 * (e.g. /guides/visa-types) to the trailing-slash form with a **307
 * Temporary Redirect**. A 307 carries no permanence signal, so Google keeps
 * both URL variants in its index and rejects the declared canonical
 * (duplicate-variant indexing confirmed in GSC).
 *
 * This Worker intercepts GET/HEAD requests before the assets layer (it
 * requires `"run_worker_first": true` in wrangler.json — without it the
 * assets routing still answers first and emits the 307) and issues a single
 * **301 Moved Permanently** that composes every applicable normalization,
 * preserving the query string:
 *
 *   1. www.chinaguide.ai → apex
 *   2. trailing /index.html → bare directory form (case-insensitive)
 *   3. uppercase path → lowercase (page paths only, see below)
 *   4. extensionless path without trailing slash → trailing-slash form
 *
 * All rules compose into one hop, so e.g. www.chinaguide.ai/Guides/INDEX.HTML
 * 301s straight to https://chinaguide.ai/guides/ in a single redirect.
 *
 * File-like paths (last segment contains a dot) skip rules 3 and 4 entirely:
 * Astro emits hashed asset filenames containing uppercase (e.g.
 * /_astro/BaseLayout.C2WUMWDk.css, referenced by every page), and with
 * run_worker_first those requests pass through this worker — lowercasing
 * them would 301 to a nonexistent path and break every stylesheet.
 *
 * Every response that passes through the worker (redirects and ASSETS
 * fetches alike) gets the security header set from securityHeaders().
 *
 * Open-redirect safety: targets are always built from the literal apex
 * origin or `parsed.origin` plus the (normalized) pathname, never from
 * user-controlled host material, so protocol-relative inputs like
 * //evil.com can never escape the origin.
 */

const APEX_ORIGIN = 'https://chinaguide.ai';
const WWW_HOSTNAME = 'www.chinaguide.ai';
const INDEX_SUFFIX = '/index.html';

/**
 * Compute the permanent-redirect target for a URL, or null when the URL is
 * already canonical.
 *
 * @param {URL | string} url - Full request URL.
 * @returns {string | null} The redirect target (query preserved), or null
 *   when no redirect is needed.
 */
export function redirectTarget(url) {
  const parsed = typeof url === 'string' ? new URL(url) : url;

  // www → apex. No early return: the pathname keeps flowing through the
  // rules below so any www + non-canonical-path combination still resolves
  // in a single 301.
  const isWww = parsed.hostname === WWW_HOSTNAME;
  const origin = isWww ? APEX_ORIGIN : parsed.origin;

  let pathname = parsed.pathname;

  // **/index.html → bare directory form (/index.html → /,
  // /guides/index.html → /guides/). Case-insensitive (so /INDEX.HTML is
  // stripped too), and applied before the file-like check so the remaining
  // directory path can still be normalized below.
  if (pathname.toLowerCase().endsWith(INDEX_SUFFIX)) {
    pathname = pathname.slice(0, -(INDEX_SUFFIX.length - 1));
  }

  // File-like paths (last segment contains a dot) are served verbatim by
  // the assets layer: hashed asset filenames are case-sensitive, so they
  // must skip both lowercasing and the trailing slash.
  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  if (!lastSegment.includes('.')) {
    // Uppercase → lowercase, then add the missing trailing slash; doing
    // both here composes them into a single 301.
    pathname = pathname.toLowerCase();
    if (!pathname.endsWith('/')) {
      pathname += '/';
    }
  }

  if (!isWww && pathname === parsed.pathname) return null;
  return `${origin}${pathname}${parsed.search}`;
}

/**
 * Security headers applied to every response that passes through the worker.
 *
 * HSTS deliberately omits `preload`: once preloaded, rolling back HTTPS-only
 * is effectively impossible, so we keep that escape hatch for now.
 *
 * @returns {Record<string, string>}
 */
export function securityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const HOURLY_CACHE = 'public, max-age=3600';

// Pagefind's content-addressed chunk files: the hex hash in the filename
// changes whenever the indexed content changes, so the bytes behind a given
// name are immutable (e.g. fragment/en_1f988b1.pf_fragment,
// index/en_847a521.pf_index, pagefind.en_18dbfbe23b.pf_meta).
const HASHED_PAGEFIND = /\.(?:pf_fragment|pf_index|pf_meta)$/;

/**
 * Cache-Control override for a pathname, or null to keep the assets-layer
 * default (`public, max-age=0, must-revalidate`) — see issue #39.
 *
 * - `/_astro/*`: every filename carries an Astro content hash → immutable.
 * - `/pagefind/*` hashed chunks (see HASHED_PAGEFIND) → immutable.
 * - `/pagefind/*` un-hashed loaders (pagefind.js, pagefind-ui.js,
 *   pagefind-entry.json, wasm.*.pagefind, …): the filename never changes
 *   across deploys, so a year-long immutable would pin returning visitors
 *   to a stale loader after a pagefind version bump. One hour bounds that
 *   window while skipping a revalidation round-trip on most /search/
 *   visits. (pagefind-entry.json is additionally cache-busted by
 *   pagefind.js itself via a `?ts=` query, so its max-age barely matters.)
 * - Everything else (HTML, robots.txt, sitemaps, …): null — must-revalidate
 *   on every request is correct for un-hashed, frequently-redeployed files.
 *
 * @param {string} pathname
 * @returns {string | null}
 */
export function cacheControlFor(pathname) {
  if (pathname.startsWith('/_astro/')) return IMMUTABLE_CACHE;
  if (pathname.startsWith('/pagefind/')) {
    return HASHED_PAGEFIND.test(pathname) ? IMMUTABLE_CACHE : HOURLY_CACHE;
  }
  return null;
}

// --- Markdown content negotiation + alternate discovery (issue #56) ---
//
// Implemented in-repo instead of Cloudflare's dashboard-side "Markdown for
// Agents" beta: dashboard toggles don't live in the repo, and config-as-truth
// is a hard rule here (a dashboard-only setting already caused one production
// outage). Negotiation runs *after* redirectTarget(), so only canonical
// (lowercase, trailing-slash) paths ever negotiate, and the .md products are
// file-like paths that the redirect rules skip by design.

// The assets-layer default for HTML; the markdown representation of a page
// deliberately shares the exact same cache policy.
const DEFAULT_PAGE_CACHE = 'public, max-age=0, must-revalidate';

// Canonical content-page paths (/guides/<slug>/, /apps/<slug>/) — the only
// HTML pages with a built .md sibling. List pages (/guides/, /apps/) and
// nested/non-canonical paths intentionally don't match.
const CONTENT_PAGE = /^\/(guides|apps)\/([a-z0-9-]+)\/$/;

const LLMS_TXT_LINK = '</llms.txt>; rel="alternate"; type="text/plain"';

/**
 * Whether the request explicitly asks for markdown. Only a literal
 * `text/markdown` token counts — a browser's `text/html,…,*∕*` must never
 * trigger negotiation, so wildcard matching is deliberately not implemented.
 *
 * @param {string | null | undefined} accept - Accept header value.
 * @returns {boolean}
 */
export function wantsMarkdown(accept) {
  return typeof accept === 'string' && accept.toLowerCase().includes('text/markdown');
}

/**
 * Map a canonical pathname to the markdown asset that represents it, or null
 * when the path has no markdown representation (no negotiation).
 *
 * - `/` → `/llms.txt` (the agent-facing markdown overview of the whole site)
 * - `/guides/<slug>/` → `/guides/<slug>.md`, `/apps/<slug>/` → `/apps/<slug>.md`
 * - everything else (about, checklist, list pages, assets, …) → null
 *
 * @param {string} pathname
 * @returns {string | null}
 */
export function markdownAssetFor(pathname) {
  if (pathname === '/') return '/llms.txt';
  const m = CONTENT_PAGE.exec(pathname);
  return m ? `/${m[1]}/${m[2]}.md` : null;
}

/**
 * RFC 8288 Link header advertising the markdown alternates of an HTML page.
 * Every page links /llms.txt; content pages additionally link their own .md
 * sibling. The home page's markdown asset *is* /llms.txt, so it is not
 * advertised a second time.
 *
 * @param {string | null} mdAsset - Result of markdownAssetFor() for the path.
 * @returns {string}
 */
export function alternatesLinkHeader(mdAsset) {
  if (!mdAsset || mdAsset === '/llms.txt') return LLMS_TXT_LINK;
  return `${LLMS_TXT_LINK}, <${mdAsset}>; rel="alternate"; type="text/markdown"`;
}

/**
 * Return a copy of the response with the security header set applied.
 * Responses from Response.redirect() and ASSETS.fetch() have immutable
 * headers, so we clone before setting.
 *
 * @param {Response} response
 * @returns {Response}
 */
export function applySecurityHeaders(response) {
  const hardened = new Response(response.body, response);
  for (const [name, value] of Object.entries(securityHeaders())) {
    hardened.headers.set(name, value);
  }
  return hardened;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isRead = request.method === 'GET' || request.method === 'HEAD';
    if (isRead) {
      const target = redirectTarget(url);
      if (target) {
        return applySecurityHeaders(Response.redirect(target, 301));
      }
    }

    // Markdown content negotiation: canonical paths only (post-redirect).
    const mdAsset = isRead ? markdownAssetFor(url.pathname) : null;
    if (mdAsset && wantsMarkdown(request.headers.get('Accept'))) {
      // `new Request(url, request)` keeps the method (HEAD stays HEAD) and
      // conditional headers (If-None-Match revalidates against the .md ETag).
      const mdResponse = await env.ASSETS.fetch(
        new Request(new URL(mdAsset, url.origin), request),
      );
      // 304 counts as success: it's an ETag match on the .md asset itself,
      // so falling back to HTML here would break revalidating md clients.
      if (mdResponse.ok || mdResponse.status === 304) {
        const response = applySecurityHeaders(mdResponse);
        response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
        response.headers.set('Cache-Control', DEFAULT_PAGE_CACHE);
        response.headers.set('Vary', 'Accept');
        return response;
      }
      // .md asset missing → fall through to the normal HTML response.
    }

    const response = applySecurityHeaders(await env.ASSETS.fetch(request));
    const cacheControl = cacheControlFor(url.pathname);
    // Status guard: a stale-HTML client can request a hashed asset that no
    // longer exists after a deploy — caching that 404 for a year would break
    // the client permanently, so only 2xx responses opt in. 304 is included
    // as well: the assets layer answers If-None-Match hits with a 304 still
    // carrying the old `max-age=0` header, and per RFC 9111 §4.3.4 browsers
    // refresh the stored entry from the 304's headers — without the override
    // here, clients that cached under the old policy would revalidate
    // forever and never upgrade to immutable. A 304 only happens on an ETag
    // match (the bytes behind the name are unchanged), so it is as safe to
    // upgrade as the 200 it stands in for.
    if (cacheControl && (response.ok || response.status === 304)) {
      response.headers.set('Cache-Control', cacheControl);
    }
    // Negotiable URLs serve two representations, so caches must key on
    // Accept — even on the HTML representation (issue #56).
    if (mdAsset && !response.headers.get('Vary')?.includes('Accept')) {
      response.headers.append('Vary', 'Accept');
    }
    // Markdown discovery (RFC 8288): every HTML page advertises its
    // alternates; non-HTML responses (assets, feeds, …) stay untouched.
    if (response.headers.get('Content-Type')?.includes('text/html')) {
      response.headers.set('Link', alternatesLinkHeader(mdAsset));
    }
    return response;
  },
};
