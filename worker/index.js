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
    if (request.method === 'GET' || request.method === 'HEAD') {
      const target = redirectTarget(new URL(request.url));
      if (target) {
        return applySecurityHeaders(Response.redirect(target, 301));
      }
    }
    return applySecurityHeaders(await env.ASSETS.fetch(request));
  },
};
