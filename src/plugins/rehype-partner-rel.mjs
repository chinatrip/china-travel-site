// rehype plugin: add rel="sponsored" to outbound links pointing at commercial
// partner domains (link exchanges, sponsorships, any compensated placement).
//
// Why a plugin instead of writing the attribute inline: content stays plain
// markdown. Raw <a rel="..."> in a page would be the only HTML in the corpus,
// it would round-trip through the wiki vault, and it would show up verbatim in
// the `.md` siblings and llms.txt we serve to AI agents. Applying the qualifier
// at render time keeps the source clean and makes the rule impossible to forget:
// a partner link can never reach a built page without its qualifier, because the
// list lives here rather than in prose.
//
// rel="sponsored" is Google's documented value for links created as part of a
// compensation or link-exchange agreement. Editorial links to the same domain
// (should we ever cite them purely on merit) are deliberately NOT exempted —
// over-qualifying is harmless, under-qualifying is not.
//
// No external deps — manual tree walk, matching the remark plugins in this dir.

/** Domains whose outbound links must carry rel="sponsored". */
export const PARTNER_DOMAINS = ['nomadesim.com'];

/**
 * True when `url` is an absolute http(s) URL whose host is a partner domain —
 * exact match or a subdomain of one. Lookalikes ("notnomadesim.com") and
 * relative/internal links do not match.
 * @param {unknown} url
 * @param {string[]} [domains]
 * @returns {boolean}
 */
export function isPartnerUrl(url, domains = PARTNER_DOMAINS) {
  if (typeof url !== 'string') return false;
  let host;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    host = parsed.hostname.toLowerCase();
  } catch {
    return false; // relative/internal link, or malformed
  }
  return domains.some((entry) => {
    const domain = String(entry).toLowerCase();
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
  const domains = options.domains ?? PARTNER_DOMAINS;
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
