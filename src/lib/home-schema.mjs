// Homepage brand JSON-LD (issue #7): WebSite + SearchAction and the canonical
// Organization entity. Both are emitted only on the homepage; content pages
// reference the same Organization via @id from GuideLayout.astro — keep the
// @id values and entity fields in sync with that file.

const SITE = 'https://chinaguide.ai';
const BRAND = 'ChinaGuide.ai';

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
    // Reachable support inbox (#38) — same address shown on /about/ and
    // /editorial-policy/, so the entity and the visible pages agree.
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@chinaguide.ai',
      contactType: 'customer support',
    },
    // TODO(#9): fill in social profiles (X/Reddit/YouTube/…) once the
    // accounts exist; an empty sameAs is valid and ignored by parsers.
    sameAs: [],
  };
}
