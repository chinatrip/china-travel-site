// Pure helpers for the visible trust signals on content pages
// ("Sources & verification" section, issue #38).
//
// Frontmatter `verified_against` is a list of the public sources a page was
// checked against. It can also contain internal provenance entries
// (e.g. "raw/realchinaguide-mini-programs-2026.md") that must never render —
// only real http(s) URLs become visible links.

/**
 * Filter a frontmatter source list down to renderable public http(s) URLs.
 * Non-strings, internal paths (raw/…, wiki/…), non-http protocols, and
 * malformed URLs are dropped; duplicates keep their first occurrence.
 * @param {unknown} entries frontmatter `verified_against` (may be missing)
 * @returns {string[]} ordered, deduped http(s) URLs
 */
export function filterExternalSources(entries) {
  if (!Array.isArray(entries)) return [];
  const seen = new Set();
  const out = [];
  for (const entry of entries) {
    if (typeof entry !== 'string') continue;
    const candidate = entry.trim();
    let url;
    try {
      url = new URL(candidate);
    } catch {
      continue; // relative/internal path or garbage — not a public source
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') continue;
    if (!url.hostname) continue; // e.g. "https://" or "https://?q=1"
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    out.push(candidate);
  }
  return out;
}

/**
 * Format a source URL as a compact human-readable label:
 * hostname (minus a leading "www.") plus path, no protocol/query/fragment,
 * truncated with an ellipsis when longer than `maxLen`.
 * @param {string} urlString
 * @param {number} [maxLen=60]
 * @returns {string}
 */
export function formatSourceLabel(urlString, maxLen = 60) {
  let url;
  try {
    url = new URL(String(urlString).trim());
  } catch {
    return String(urlString); // defensive — callers should pass filtered URLs
  }
  const host = url.hostname.replace(/^www\./, '');
  const path = url.pathname.replace(/\/$/, '');
  const label = `${host}${path === '' ? '' : path}`;
  if (label.length <= maxLen) return label;
  return `${label.slice(0, maxLen - 1)}…`;
}
