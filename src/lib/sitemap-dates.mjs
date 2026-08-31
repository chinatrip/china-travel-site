// Maps content entries to sitemap <lastmod> values.
//
//   { collection: 'guides', slug: 'visa-types', gitDate, data: { last_verified, date } }
//     -> '/guides/visa-types/' => '2026-08-21'
//
// The date is the content file's LAST COMMIT date, which is what sitemaps.org
// means by <lastmod>: when the file last changed. `last_verified` / `date` are
// fact-checking dates — deliberately NOT bumped when a page is only rewritten —
// so using them here made the sitemap report a page as unchanged for weeks after
// its title, description and body had all been replaced. They remain as a
// fallback for builds with no git history (e.g. from a tarball).
//
// Entries without any parseable date are omitted entirely — a missing lastmod
// beats a fabricated one. Routes always carry a trailing slash (the site's
// canonical URL shape).

// Translated collections render under a locale prefix, so the route cannot be
// derived from the collection name alone.
const ROUTES = new Map([
  ['guides', (slug) => `/guides/${slug}/`],
  ['apps', (slug) => `/apps/${slug}/`],
  ['guidesEs', (slug) => `/es/guides/${slug}/`],
]);

/**
 * Normalize a frontmatter date (string or Date — YAML auto-parses unquoted
 * dates as Date objects) to a W3C YYYY-MM-DD string, or null if unusable.
 * @param {unknown} value
 * @returns {string | null}
 */
function toW3CDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

/**
 * Resolve one entry's lastmod: the file's commit date, or the frontmatter dates
 * when git history is unavailable.
 * @param {{ gitDate?: unknown, data?: { date?: unknown, last_verified?: unknown } }} entry
 * @returns {string | null}
 */
export function resolveLastmod(entry) {
  return (
    toW3CDate(entry?.gitDate) ??
    toW3CDate(entry?.data?.last_verified) ??
    toW3CDate(entry?.data?.date)
  );
}

/**
 * Build a Map from content-page pathname to lastmod date.
 * @param {Array<{ collection?: string, slug?: string, gitDate?: unknown, data?: { date?: unknown, last_verified?: unknown } }>} entries
 * @returns {Map<string, string>} e.g. '/guides/visa-types/' => '2026-08-21'
 */
export function buildLastmodMap(entries) {
  const map = new Map();
  for (const entry of entries ?? []) {
    if (!entry || typeof entry !== 'object') continue;
    const { collection, slug } = entry;
    const route = ROUTES.get(collection);
    if (!route || typeof slug !== 'string' || slug === '') continue;
    const lastmod = resolveLastmod(entry);
    if (!lastmod) continue;
    map.set(route(slug), lastmod);
  }
  return map;
}

/**
 * Look up the lastmod date for a sitemap URL, or undefined if the page has
 * no reliable date (homepage, listings, search, …).
 * @param {unknown} url full URL, e.g. 'https://chinaguide.ai/guides/visa-types/'
 * @param {Map<string, string>} map from buildLastmodMap
 * @returns {string | undefined}
 */
export function lastmodFor(url, map) {
  if (typeof url !== 'string') return undefined;
  let pathname;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return undefined;
  }
  if (!pathname.endsWith('/')) pathname += '/';
  return map.get(pathname);
}
