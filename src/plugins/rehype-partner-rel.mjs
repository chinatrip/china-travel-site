// rehype plugin: add rel="sponsored" to outbound links to commercial partner
// domains, for links written as markdown in page bodies.
//
// The policy itself — which domains, what counts as a match, how the rel is
// merged — lives in src/lib/partner-links.mjs, because component-rendered links
// (the "Sources & verification" list, the /updates/ feed) need the same rules
// and never pass through this pipeline. This file is only the markdown half.
//
// Why apply it at render time rather than writing the attribute inline: content
// stays plain markdown. Raw <a rel="..."> would be the only HTML in the corpus,
// it would round-trip through the wiki vault, and it would show up verbatim in
// the `.md` siblings and llms.txt we serve to AI agents.
//
// Coverage limit, stated honestly: this transforms parsed markdown links. A raw
// inline <a> written into a page stays a `raw` node at this stage and is NOT
// rewritten. No content in this repo or the wiki vault uses raw anchors — the
// whole point of this plugin is that none has to — but "markdown links only" is
// the guarantee, not "every anchor". The dist guard in test/partner-rel.test.mjs
// is what covers the rest.
//
// No external deps — manual tree walk, matching the remark plugins in this dir.

import { PARTNER_DOMAINS, isPartnerUrl, withSponsored, assertValidDomains } from '../lib/partner-links.mjs';

// Re-exported so the plugin module stays a usable entry point for its tests.
export { PARTNER_DOMAINS, isPartnerUrl, withSponsored, assertValidDomains };

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
