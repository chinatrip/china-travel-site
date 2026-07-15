// i18n registry + helpers for locale routing and reciprocal hreflang.
//
// Routing contract (see issue #104):
//   - English is the DEFAULT locale and lives at the site root with NO /en/
//     prefix (astro.config `prefixDefaultLocale: false`), so every existing URL
//     and its indexing stay untouched.
//   - Translated locales live under a path prefix (/es/…).
//   - Only pages listed in TRANSLATIONS emit <link rel="alternate" hreflang>
//     tags. Every English-only page resolves to `null` here, so BaseLayout
//     leaves its <head> byte-identical to the pre-i18n output. This is the
//     no-regression guarantee for the English site.

export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'es'];

// og:locale value per locale (the region form OG crawlers expect).
export const OG_LOCALE = {
  en: 'en_US',
  es: 'es_ES',
};

// Translation groups: each entry maps every locale that has a PUBLISHED
// translation to its canonical trailing-slash path. Grow this list as pages are
// translated (the Spanish minimal pilot adds the cornerstone guides here). The
// default-locale (English) path is the x-default target.
export const TRANSLATIONS = [
  { en: '/', es: '/es/' },
];

/** Canonical trailing-slash form used for all registry lookups. */
function normalize(pathname) {
  if (!pathname) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

/**
 * Locale of a pathname, inferred from its leading path segment. Only a real
 * `/<locale>/` segment counts, so English slugs that merely start with the
 * locale letters (e.g. /guides/esim/) stay English.
 *
 * @param {string} pathname
 * @returns {string} a member of LOCALES
 */
export function localeOf(pathname) {
  const p = normalize(pathname);
  for (const loc of LOCALES) {
    if (loc === DEFAULT_LOCALE) continue;
    if (p === `/${loc}/` || p.startsWith(`/${loc}/`)) return loc;
  }
  return DEFAULT_LOCALE;
}

/**
 * Reciprocal hreflang alternates for a pathname, or `null` when the page has no
 * translation (English-only pages keep their historical head untouched).
 *
 * @param {string} pathname
 * @returns {{ hreflang: string, path: string }[] | null} includes an
 *   `x-default` entry pointing at the English URL, or null.
 */
export function alternatesFor(pathname) {
  const p = normalize(pathname);
  const group = TRANSLATIONS.find((g) =>
    Object.values(g).some((v) => normalize(v) === p),
  );
  if (!group) return null;

  const alts = [];
  for (const loc of LOCALES) {
    if (group[loc]) alts.push({ hreflang: loc, path: normalize(group[loc]) });
  }
  // x-default → the default-locale (English) URL.
  if (group[DEFAULT_LOCALE]) {
    alts.push({ hreflang: 'x-default', path: normalize(group[DEFAULT_LOCALE]) });
  }
  return alts;
}
