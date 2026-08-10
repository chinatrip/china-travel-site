// SoftwareApplication JSON-LD for /apps/<slug>/ pages. Each app guide is an
// Article *about* a real software app; this attaches a SoftwareApplication
// entity so AI/search engines resolve "this page is about the <App> app"
// instead of treating it as generic prose. Embedded as the Article's `about`
// node by GuideLayout (see src/pages/apps/[id].astro).
//
// Site-side only, keyed by the app content id (route slug), so it never touches
// the wiki-synced frontmatter. No aggregateRating/review is emitted — we have
// no first-party ratings and won't fabricate them, so this stays an
// entity-clarity node, not a SoftwareApplication rich-result claim.

// slug (content id) → { name, applicationCategory }.
// name is the real product name (not the SEO <title>); applicationCategory uses
// schema.org's documented ApplicationCategory values.
const APPS = {
  '12306':    { name: '12306',    applicationCategory: 'TravelApplication' },
  'alipay':   { name: 'Alipay',   applicationCategory: 'FinanceApplication' },
  'amap':     { name: 'Amap',     applicationCategory: 'TravelApplication' },
  'dianping': { name: 'Dianping', applicationCategory: 'LifestyleApplication' },
  'didi':     { name: 'DiDi',     applicationCategory: 'TravelApplication' },
  'eleme':    { name: 'Ele.me',   applicationCategory: 'LifestyleApplication' },
  'meituan':  { name: 'Meituan',  applicationCategory: 'LifestyleApplication' },
  'tenpaygo': { name: 'TenPayGo', applicationCategory: 'FinanceApplication' },
  'trip-com': { name: 'Trip.com', applicationCategory: 'TravelApplication' },
  'wechat':   { name: 'WeChat',   applicationCategory: 'CommunicationApplication' },
};

/**
 * Build the SoftwareApplication entity for an app page, to embed as the
 * Article's `about`. Returns null for unknown slugs (e.g. guide pages), so
 * callers can attach it conditionally.
 * @param {string} slug App content id / route param (e.g. 'amap').
 * @returns {object|null} schema.org SoftwareApplication node, or null.
 */
export function buildSoftwareApplication(slug) {
  const app = APPS[slug];
  if (!app) return null;
  return {
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: app.applicationCategory,
    // Every listed app ships on both mobile platforms.
    operatingSystem: 'Android, iOS',
    // The apps are free to download; in-app fees vary and are covered in prose.
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  };
}

/** Exposed for tests: the app slugs we emit a SoftwareApplication for. */
export const APP_SLUGS = Object.keys(APPS);
