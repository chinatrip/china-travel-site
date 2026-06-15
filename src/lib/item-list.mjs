// Builds the ItemList JSON-LD for collection index pages (/guides/, /apps/).
//
// Positions are 1-based and follow input order, so they match the rendered
// card order. URLs are absolute and carry a trailing slash (the site's
// canonical URL shape — see scripts/check-internal-links.mjs).

const SITE = 'https://chinaguide.ai';

/** Site-relative route → absolute URL with the canonical trailing slash. */
function toAbsolute(route) {
  return `${SITE}${route.endsWith('/') ? route : `${route}/`}`;
}

/**
 * Build an ItemList JSON-LD object from site-relative routes.
 * @param {string} name e.g. "China Travel Guides"
 * @param {string[]} routes e.g. ["/guides/visa-types/", "/guides/mobile-payment/"]
 * @returns {object} schema.org ItemList
 */
export function buildItemList(name, routes) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: routes.length,
    itemListElement: routes.map((route, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: toAbsolute(route),
    })),
  };
}

/**
 * Build a CollectionPage JSON-LD that embeds a *named* ItemList as its
 * mainEntity. Naming each ListItem (vs. url-only in buildItemList) gives Google
 * an entity label per row and ties the list to a real page node (@id/url), so
 * the collection page itself can rank for the set, not just the members.
 * isPartOf points at the homepage WebSite node (see home-schema.mjs) so all
 * pages resolve into one site graph.
 * @param {object} opts
 * @param {string} opts.name Collection title, e.g. "China Travel Guides".
 * @param {string} opts.description Page meta description (single source of truth).
 * @param {string} opts.route Site-relative route of the collection, e.g. "/guides/".
 * @param {{name: string, route: string}[]} opts.items Members, in rendered order.
 * @returns {object} schema.org CollectionPage
 */
export function buildCollectionPage({ name, description, route, items }) {
  const url = toAbsolute(route);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name,
    description,
    isPartOf: { '@id': `${SITE}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      name,
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: toAbsolute(item.route),
      })),
    },
  };
}

/**
 * Build a BreadcrumbList JSON-LD from an ordered list of crumbs. Mirrors the
 * shape emitted by content pages (GuideLayout.astro) so breadcrumb trails are
 * consistent across the site.
 * @param {{name: string, route: string}[]} crumbs Home → … → current, in order.
 * @returns {object} schema.org BreadcrumbList
 */
export function buildBreadcrumbList(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: toAbsolute(crumb.route),
    })),
  };
}
