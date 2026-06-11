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
 *   1. www.chinaguide.ai → apex (checked before any other rule)
 *   2. uppercase path → lowercase
 *   3. trailing /index.html → bare directory form
 *   4. extensionless path without trailing slash → trailing-slash form
 *
 * Rules 2–4 compose, so e.g. /Guides/Visa-Types 301s straight to
 * /guides/visa-types/ in one hop. Every response that passes through the
 * worker (redirects and ASSETS fetches alike) gets the security header set
 * from securityHeaders().
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

  // www → apex, before any other rule. Path and query pass through
  // unchanged; any remaining normalization happens on the apex hop.
  if (parsed.hostname === WWW_HOSTNAME) {
    return `${APEX_ORIGIN}${parsed.pathname}${parsed.search}`;
  }

  let pathname = parsed.pathname;

  // Uppercase → lowercase (must precede the trailing-slash rule so the two
  // compose into a single 301).
  pathname = pathname.toLowerCase();

  // **/index.html → bare directory form (/index.html → /,
  // /guides/index.html → /guides/).
  if (pathname.endsWith(INDEX_SUFFIX)) {
    pathname = pathname.slice(0, -(INDEX_SUFFIX.length - 1));
  }

  // Extensionless path without a trailing slash → add the slash. File-like
  // paths (last segment contains a dot) are left alone.
  if (!pathname.endsWith('/')) {
    const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
    if (!lastSegment.includes('.')) {
      pathname += '/';
    }
  }

  if (pathname === parsed.pathname) return null;
  return `${parsed.origin}${pathname}${parsed.search}`;
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
