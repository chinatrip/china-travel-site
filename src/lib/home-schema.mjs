// Brand JSON-LD (issue #7): WebSite + SearchAction and the canonical
// Organization entity. The WebSite node is emitted only on the homepage; the
// Organization node is emitted on the homepage and inlined on /about/ (as the
// AboutPage mainEntity). Content pages inline their own copy of the same
// entity from GuideLayout.astro — keep the @id values in sync with that file.
// The support contactPoint (#38) is the shared SUPPORT_CONTACT_POINT export,
// reused by GuideLayout's inline node so the two never drift.

const SITE = 'https://chinaguide.ai';
const BRAND = 'ChinaGuide.ai';

/**
 * Canonical support ContactPoint for the Organization entity (#38).
 * Reachable support inbox shown on /about/ and /editorial-policy/, so the
 * entity and the visible pages agree. Shared so the homepage Organization
 * node and GuideLayout's inline copy never drift apart.
 */
export const SUPPORT_CONTACT_POINT = {
  '@type': 'ContactPoint',
  email: 'support@chinaguide.ai',
  // "customer service" is Google's conventional contactType enum value.
  contactType: 'customer service',
};

/**
 * WebSite schema with a Sitelinks Searchbox SearchAction.
 * The target relies on /search/ reading `?q=` and auto-running the query
 * (see src/pages/search.astro) — without that, the action lands on an empty box.
 * @param {string} description Homepage meta description (single source of truth).
 * @returns {object} schema.org WebSite
 */
export function buildWebsiteSchema(description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    name: BRAND,
    // Google Site Names reads alternateName — covers the brand spellings
    // issue #7 targets ("chinaguide" position 12, "china guide" 0 impressions).
    alternateName: ['ChinaGuide', 'China Guide'],
    url: `${SITE}/`,
    description,
    inLanguage: 'en',
    publisher: { '@id': `${SITE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Canonical Organization entity. @id/name/url/logo mirror the inline
 * `organization` object in GuideLayout.astro so every page resolves to
 * one entity in Google's graph.
 * @param {string} logoUrl Absolute URL of the brand logo image.
 * @returns {object} schema.org Organization
 */
export function buildOrganizationSchema(logoUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: BRAND,
    url: SITE,
    logo: { '@type': 'ImageObject', url: logoUrl },
    // Reachable support inbox (#38), shared with GuideLayout's inline node.
    contactPoint: SUPPORT_CONTACT_POINT,
    // TODO(#9): fill in social profiles (X/Reddit/YouTube/…) once the
    // accounts exist; an empty sameAs is valid and ignored by parsers.
    sameAs: [],
  };
}
