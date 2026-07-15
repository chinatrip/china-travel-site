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
  { en: '/guides/trip-planning/', es: '/es/guides/trip-planning/' },
  { en: '/guides/visa-types/', es: '/es/guides/visa-types/' },
  { en: '/guides/mobile-payment/', es: '/es/guides/mobile-payment/' },
  { en: '/guides/vpn-or-esim/', es: '/es/guides/vpn-or-esim/' },
];

// UI chrome strings per locale. Keep keys in sync across locales; t() falls back
// to the default locale (then the raw key) for any gap, so a missing string
// degrades to English rather than throwing.
export const UI = {
  en: {
    home: 'Home',
    travelGuides: 'Travel Guides',
    essentialApps: 'Essential Apps',
    lastVerified: 'Last verified',
    by: 'by',
    faqHeading: 'Frequently Asked Questions',
    relatedHeading: 'Related Guides',
    sourcesHeading: 'Sources & verification',
    sourcesIntro: 'This guide was checked against the following sources:',
    editorialPre: 'Learn how we verify and update our guides in our ',
    editorialLink: 'editorial policy',
    editorialPost: '.',
  },
  es: {
    home: 'Inicio',
    travelGuides: 'Guías de viaje',
    essentialApps: 'Aplicaciones esenciales',
    lastVerified: 'Última verificación',
    by: 'por',
    faqHeading: 'Preguntas frecuentes',
    relatedHeading: 'Guías relacionadas',
    sourcesHeading: 'Fuentes y verificación',
    sourcesIntro: 'Esta guía se contrastó con las siguientes fuentes:',
    editorialPre: 'Consulta cómo verificamos y actualizamos nuestras guías en nuestra ',
    editorialLink: 'política editorial',
    editorialPost: '.',
  },
};

/** A localized UI string, falling back to the default locale then the raw key. */
export function t(locale, key) {
  return UI[locale]?.[key] ?? UI[DEFAULT_LOCALE][key] ?? key;
}

/**
 * Whether a translated page is stale relative to its English source: true when
 * the English source has been re-verified more recently than the translation
 * recorded. Missing translation date → treated as stale (needs attention);
 * missing source date → not stale (nothing to compare against). ISO YYYY-MM-DD
 * strings compare lexicographically.
 *
 * @param {string | undefined} sourceLastVerified - translation's recorded source_last_verified
 * @param {string | undefined} enLastVerified - the English source's current last_verified
 * @returns {boolean}
 */
export function isTranslationStale(sourceLastVerified, enLastVerified) {
  if (!enLastVerified) return false;
  if (!sourceLastVerified) return true;
  return enLastVerified > sourceLastVerified;
}

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
