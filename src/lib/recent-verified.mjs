// Builds the "Recently Verified" record: a human-readable, dated list of pages
// ordered by when each was last re-checked against its sources. This is the
// site-internal, traveler-facing alternative to dumping visitors into a raw
// GitHub commit list — the verification record is the moat (every page already
// carries last_verified + verified_against), so we surface it as a real page.
//
// Pure and dependency-light so it can be unit-tested without Astro: it takes the
// same entry shape getCollection yields ({ collection, id|slug, data }) and
// returns view-ready rows. Date formatting matches GuideLayout's `formatDate`
// (en-US "Jun 9, 2026") so /updates/ and every guide header read identically.

import { filterExternalSources, formatSourceLabel } from './trust-signals.mjs';

/**
 * Normalize a frontmatter date (string or Date — YAML may auto-parse unquoted
 * dates as Date objects) to a W3C YYYY-MM-DD string, or null if unusable.
 * @param {unknown} value
 * @returns {string | null}
 */
function toISODate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }
  if (typeof value !== 'string' || value.trim() === '') return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

/**
 * Format an ISO date as the site's human-readable date — same call as
 * GuideLayout's `formatDate`, so "Last verified" reads identically everywhere.
 * Parsed at UTC noon to keep the calendar day stable across timezones.
 * @param {string} isoDate YYYY-MM-DD
 * @returns {string} e.g. 'Jun 9, 2026'
 */
function toDisplayDate(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * @typedef {Object} VerifiedSource
 * @property {string} url   public http(s) source URL
 * @property {string} label compact human-readable label (host + path)
 */

/**
 * @typedef {Object} VerifiedEntry
 * @property {string} title       page title
 * @property {string} url         canonical route, e.g. '/guides/visa-types/'
 * @property {string} isoDate     YYYY-MM-DD (machine/datetime attr)
 * @property {string} displayDate human date matching the guide headers
 * @property {VerifiedSource[]} sources external sources the page was checked against
 */

/**
 * Build the recently-verified list from content entries.
 *
 * Rules:
 *  - entries without a parseable `last_verified` are omitted (no fake dates);
 *  - sorted by `last_verified` descending, then `title` ascending for a stable,
 *    deterministic order on same-day ties;
 *  - `url` is the canonical trailing-slash route `/${collection}/${id}/`;
 *  - entries with no route key (neither id nor slug) are skipped;
 *  - `sources` is the page's external `verified_against` URLs as {url,label},
 *    internal provenance paths (raw/…, wiki/…) filtered out;
 *  - a positive `limit` truncates after sorting; 0/negative/absent means all.
 *
 * @param {Array<{ collection?: string, id?: string, slug?: string, data?: { title?: string, last_verified?: unknown, verified_against?: unknown } }>} entries
 * @param {{ limit?: number }} [options]
 * @returns {VerifiedEntry[]}
 */
export function resolveRecentlyVerified(entries, { limit } = {}) {
  if (!Array.isArray(entries)) return [];

  const rows = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const { collection, id, slug, data } = entry;
    if (typeof collection !== 'string' || collection === '') continue;
    const routeKey = typeof id === 'string' && id !== '' ? id : slug;
    if (typeof routeKey !== 'string' || routeKey === '') continue;
    if (!data || typeof data !== 'object') continue;

    const isoDate = toISODate(data.last_verified);
    if (!isoDate) continue;

    rows.push({
      title: typeof data.title === 'string' ? data.title : '',
      url: `/${collection}/${routeKey}/`,
      isoDate,
      displayDate: toDisplayDate(isoDate),
      sources: filterExternalSources(data.verified_against).map((url) => ({
        url,
        label: formatSourceLabel(url),
      })),
    });
  }

  rows.sort((a, b) => {
    if (a.isoDate !== b.isoDate) return a.isoDate < b.isoDate ? 1 : -1; // date desc
    return a.title.localeCompare(b.title); // title asc — stable tiebreak
  });

  return typeof limit === 'number' && limit > 0 ? rows.slice(0, limit) : rows;
}
