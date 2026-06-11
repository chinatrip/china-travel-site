// Builds the ItemList JSON-LD for collection index pages (/guides/, /apps/).
//
// Positions are 1-based and follow input order, so they match the rendered
// card order. URLs are absolute and carry a trailing slash (the site's
// canonical URL shape — see scripts/check-internal-links.mjs).

const SITE = 'https://chinaguide.ai';

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
      url: `${SITE}${route.endsWith('/') ? route : `${route}/`}`,
    })),
  };
}
