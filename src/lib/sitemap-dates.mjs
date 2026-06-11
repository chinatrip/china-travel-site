// Maps content frontmatter dates to sitemap <lastmod> values.
//
//   { collection: 'guides', slug: 'visa-types', data: { last_verified, date } }
//     -> '/guides/visa-types/' => '2026-06-09'
//
// `last_verified` wins over `date`; entries without a parseable date are
// omitted entirely — a missing lastmod beats a fabricated one.
// Routes always carry a trailing slash (the site's canonical URL shape).

const COLLECTIONS = new Set(['guides', 'apps']);

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
 * Build a Map from content-page pathname to lastmod date.
 * @param {Array<{ collection?: string, slug?: string, data?: { date?: unknown, last_verified?: unknown } }>} entries
 * @returns {Map<string, string>} e.g. '/guides/visa-types/' => '2026-06-09'
 */
export function buildLastmodMap(entries) {
  const map = new Map();
  for (const entry of entries ?? []) {
    if (!entry || typeof entry !== 'object') continue;
    const { collection, slug, data } = entry;
    if (!COLLECTIONS.has(collection) || typeof slug !== 'string' || slug === '') continue;
    const lastmod = toW3CDate(data?.last_verified) ?? toW3CDate(data?.date);
    if (!lastmod) continue;
    map.set(`/${collection}/${slug}/`, lastmod);
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
