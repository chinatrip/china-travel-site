// rehype plugin: add rel="sponsored" to outbound links pointing at commercial
// partner domains (link exchanges, sponsorships, any compensated placement).
//
// Why a plugin instead of writing the attribute inline: content stays plain
// markdown. Raw <a rel="..."> in a page would be the only HTML in the corpus,
// it would round-trip through the wiki vault, and it would show up verbatim in
// the `.md` siblings and llms.txt we serve to AI agents. Applying the qualifier
// at render time keeps the source clean and means the rule lives in one place
// rather than in every author's memory.
//
// Coverage limit, stated honestly: this transforms parsed markdown links. A raw
// inline <a> written into a page stays a `raw` node at this stage and is NOT
// rewritten. No content in this repo or the wiki vault uses raw anchors — the
// whole point of this plugin is that none has to — but "markdown links only" is
// the guarantee, not "every anchor".
//
// rel="sponsored" is Google's documented value for links created as part of a
// compensation or link-exchange agreement. Editorial links to the same domain
// (should we ever cite them purely on merit) are deliberately NOT exempted —
// over-qualifying is harmless, under-qualifying is not.
//
// No external deps — manual tree walk, matching the remark plugins in this dir.

/** Domains whose outbound links must carry rel="sponsored". */
export const PARTNER_DOMAINS = ['nomadesim.com'];

/** Site origin, used only as a resolution base — never matched against. */
const RESOLUTION_BASE = 'https://chinaguide.ai/';

/**
 * Normalize a host for comparison: lowercase, and drop the DNS root label so
 * "nomadesim.com." (a valid, working FQDN) compares equal to "nomadesim.com".
 * Also tolerates a configured domain written with stray leading/trailing dots.
 */
function normalizeHost(value) {
  return String(value).toLowerCase().replace(/^\.+/, '').replace(/\.+$/, '');
}

/** A bare, already-punycoded host: "example.com", "a.example.co.uk". */
const BARE_HOST = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/**
 * Reject malformed partner entries loudly at load time. This list is the one
 * place a future partner gets added, and every way of writing it wrong
 * ("https://partner.com", "partner.com/china", a unicode IDN) fails silently in
 * the fail-open direction — matching nothing, shipping unqualified paid links.
 * A build-time throw is the cheap end of that trade.
 * @param {string[]} domains
 * @returns {string[]} the same list, when valid
 */
export function assertValidDomains(domains) {
  if (!Array.isArray(domains)) throw new TypeError('rehype-partner-rel: domains must be an array');
  for (const entry of domains) {
    if (typeof entry !== 'string' || !BARE_HOST.test(normalizeHost(entry))) {
      throw new Error(
        `rehype-partner-rel: invalid partner domain ${JSON.stringify(entry)} — ` +
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
 * dangerous direction — it means an unqualified paid link ships — so the parse
 * is deliberately permissive while the host comparison stays strict.
 *
 * Lookalikes ("notnomadesim.com"), domain-in-subdomain
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
 * @param {{ domains?: string[] }} [options]
 */
export default function rehypePartnerRel(options = {}) {
  const domains = assertValidDomains(options.domains ?? PARTNER_DOMAINS);
  return (tree) => {
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'element' && node.tagName === 'a' && node.properties) {
        if (isPartnerUrl(node.properties.href, domains)) {
          node.properties.rel = withSponsored(node.properties.rel);
        }
      }
      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child);
      }
    };
    walk(tree);
  };
}
