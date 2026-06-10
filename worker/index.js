/**
 * Worker entry that upgrades trailing-slash redirects from 307 to 301.
 *
 * Why this exists (see issue #32):
 * The site is an Astro static build served by Cloudflare's static assets
 * layer. That layer redirects extensionless paths without a trailing slash
 * (e.g. /guides/visa-types) to the trailing-slash form with a **307
 * Temporary Redirect**. A 307 carries no permanence signal, so Google keeps
 * both URL variants in its index and rejects the declared canonical
 * (duplicate-variant indexing confirmed in GSC).
 *
 * This Worker intercepts GET/HEAD requests before the assets layer (it
 * requires `"run_worker_first": true` in wrangler.json — without it the
 * assets routing still answers first and emits the 307) and issues the same
 * redirect as a **301 Moved Permanently**, preserving the query string.
 * Everything else falls through to the static assets binding.
 */

/**
 * Compute the trailing-slash redirect target for a URL.
 *
 * @param {URL | string} url - Full request URL.
 * @returns {string | null} The redirect target (with query preserved), or
 *   null when no redirect is needed (root, already-slashed paths, and
 *   file-like paths whose last segment contains a dot).
 */
export function redirectTarget(url) {
  const parsed = typeof url === 'string' ? new URL(url) : url;
  const { pathname } = parsed;

  if (pathname.endsWith('/')) return null;

  const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
  if (lastSegment.includes('.')) return null;

  return `${parsed.origin}${pathname}/${parsed.search}`;
}

export default {
  async fetch(request, env) {
    if (request.method === 'GET' || request.method === 'HEAD') {
      const target = redirectTarget(new URL(request.url));
      if (target) {
        return Response.redirect(target, 301);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
