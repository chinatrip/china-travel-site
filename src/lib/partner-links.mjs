// Policy for outbound links to commercial partners (link exchanges, sponsorships,
// any compensated placement). Lives here rather than in the rehype plugin because
// partner links reach readers by two separate routes:
//
//   1. markdown body links  -> qualified at render time by
//      src/plugins/rehype-partner-rel.mjs, which imports this module
//   2. component-rendered links -> the "Sources & verification" list and the
//      /updates/ feed build their <a> tags in .astro, never touching the markdown
//      pipeline, so they must ask for the rel themselves via outboundRel()
//
// Route 2 is why this module exists: adding a partner's URL to a page's
// verified_against silently produced an unqualified partner link, which the dist
// guard in test/partner-rel.test.mjs caught before it shipped.
//
// rel="sponsored" is Google's documented qualifier for links created as part of a
// compensation or link-exchange agreement. Citation links to a partner are NOT
// exempted: the URL is on the page because of the arrangement, and over-qualifying
// costs nothing while under-qualifying is the failure that matters.

/**
 * Domains whose outbound links must carry rel="sponsored".
 *
 * Empty as of 2026-08-21: the Nomad eSIM link exchange — the only entry this list
 * ever had — was ended by the site owner, and the outbound link went with it.
 *
 * The list being empty is not the same as this module being dead. It stays for two
 * reasons. First, the next arrangement only needs a string added here, not the
 * matching logic rebuilt — and that logic is the part with the sharp edges
 * (protocol-relative URLs, trailing-root-label FQDNs, `partner.com.evil.test`,
 * `partner.com@attacker.test`), each of which is a real fail-open this module has
 * already had to close. Second, with the list empty the dist guard in
 * test/partner-rel.test.mjs inverts into something more useful than it was before:
 * it now asserts that NO built page emits rel="sponsored" at all, which catches an
 * undisclosed compensated link being added without a corresponding entry here.
 */
export const PARTNER_DOMAINS = [];

/** Site origin, used only as a resolution base — never matched against. */
const RESOLUTION_BASE = 'https://chinaguide.ai/';

/** A bare, already-punycoded host: "example.com", "a.example.co.uk". */
const BARE_HOST = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/**
 * Normalize a host for comparison: lowercase, and drop the DNS root label so
 * "nomadesim.com." (a valid, working FQDN) compares equal to "nomadesim.com".
 * Also tolerates a configured domain written with stray leading/trailing dots.
 */
function normalizeHost(value) {
  return String(value).toLowerCase().replace(/^\.+/, '').replace(/\.+$/, '');
}

/**
 * Reject malformed partner entries loudly at load time. This list is the one
 * place a future partner gets added, and every way of writing it wrong
 * ("https://partner.com", "partner.com/china", a unicode IDN) fails silently in
 * the fail-open direction — matching nothing, shipping unqualified paid links.
 * @param {string[]} domains
 * @returns {string[]} the same list, when valid
 */
export function assertValidDomains(domains) {
  if (!Array.isArray(domains)) throw new TypeError('partner-links: domains must be an array');
  for (const entry of domains) {
    if (typeof entry !== 'string' || !BARE_HOST.test(normalizeHost(entry))) {
      throw new Error(
        `partner-links: invalid partner domain ${JSON.stringify(entry)} — ` +
          'expected a bare host such as "example.com" (no scheme, no path, no port; ' +
          'use the punycode form for internationalised domains)',
      );
    }
  }
  return domains;
}

assertValidDomains(PARTNER_DOMAINS);

/**
 * True when `url` resolves to an http(s) URL whose host is a partner domain —
 * exact match or a subdomain of one.
 *
 * Resolution uses a base so that protocol-relative links ("//partner.com/x"),
 * which render as working outbound links, are still caught; the protocol check
 * then rejects mailto:/javascript:/etc, and relative links resolve to our own
 * host and fall through as non-partner. Missing a real partner link is the
 * dangerous direction, so the parse is deliberately permissive while the host
 * comparison stays strict: lookalikes ("notnomadesim.com"), domain-in-subdomain
 * ("nomadesim.com.evil.test"), userinfo ("nomadesim.com@attacker.test") and
 * punycode homographs do not match.
 * @param {unknown} url
 * @param {string[]} [domains]
 * @returns {boolean}
 */
export function isPartnerUrl(url, domains = PARTNER_DOMAINS) {
  if (typeof url !== 'string') return false;
  let host;
  try {
    const parsed = new URL(url, RESOLUTION_BASE);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    host = normalizeHost(parsed.hostname);
  } catch {
    return false; // malformed beyond resolution
  }
  return domains.some((entry) => {
    const domain = normalizeHost(entry);
    if (!domain) return false;
    return host === domain || host.endsWith(`.${domain}`);
  });
}

/**
 * Merge `sponsored` into a HAST `rel` property without dropping existing
 * values. Idempotent.
 * @param {unknown} rel Existing rel (HAST array, space-separated string, or absent).
 * @returns {string[]}
 */
export function withSponsored(rel) {
  const existing = Array.isArray(rel)
    ? rel.map(String)
    : typeof rel === 'string' && rel.trim()
      ? rel.trim().split(/\s+/)
      : [];
  return existing.includes('sponsored') ? existing : [...existing, 'sponsored'];
}

/**
 * rel attribute for a component-rendered outbound link. Returns `base`
 * unchanged for ordinary links, and appends `sponsored` for partner domains.
 * @param {unknown} url The href being rendered.
 * @param {string} [base] Base rel this site puts on outbound links.
 * @returns {string}
 */
export function outboundRel(url, base = 'nofollow noopener', domains = PARTNER_DOMAINS) {
  return isPartnerUrl(url, domains) ? withSponsored(base).join(' ') : base;
}
