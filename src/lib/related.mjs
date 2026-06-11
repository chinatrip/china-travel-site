// Maps frontmatter `related` wiki paths to published site routes.
//
//   wiki/concepts/transportation.md -> /guides/transportation/
//   wiki/entities/alipay.md         -> /apps/alipay/
//   wiki/summaries/*, raw/*, etc.   -> null (no published route)
//
// Mirrors the section mapping used by src/plugins/remark-wikilinks.mjs.
// Routes always carry a trailing slash (the site's canonical URL shape).

const SECTION_COLLECTION = { concepts: 'guides', entities: 'apps' };

// Slugs are strictly kebab-case ([a-z0-9-]) — rejects traversal shapes
// (".." via "...md"), uppercase, underscores, spaces, and encoded separators.
const RE = /^wiki\/(concepts|entities)\/([a-z0-9-]+)\.md$/;

/**
 * Parse a `related` wiki path into its content collection, entry id, and route.
 * @param {unknown} wikiPath e.g. "wiki/concepts/transportation.md"
 * @returns {{ collection: 'guides'|'apps', id: string, route: string } | null}
 */
export function parseRelated(wikiPath) {
  if (typeof wikiPath !== 'string') return null;
  const m = RE.exec(wikiPath);
  if (!m) return null;
  const [, section, id] = m;
  if (!id) return null;
  const collection = SECTION_COLLECTION[section];
  return { collection, id, route: `/${collection}/${id}/` };
}

/**
 * Map a `related` wiki path to a site route, or null if it has no published route.
 * @param {unknown} wikiPath
 * @returns {string | null}
 */
export function relatedToRoute(wikiPath) {
  return parseRelated(wikiPath)?.route ?? null;
}
