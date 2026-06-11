// Converts Obsidian-style wiki links in markdown content into real anchor links.
//
//   [[wiki/concepts/mobile-payment.md]]            -> /guides/mobile-payment
//   [[wiki/entities/didi.md]]                      -> /apps/didi
//   [[wiki/concepts/transportation.md#metro-apps]] -> /guides/transportation#metro-apps
//   [[wiki/entities/meituan.md|Meituan]]           -> link text "Meituan"
//   [[wiki/summaries/foo-2026.md]]                 -> plain text (no published route)
//
// `concepts` map to /guides, `entities` map to /apps. `summaries` have no route,
// so they render as plain text instead of broken links.

const SECTION_BASE = { concepts: "/guides", entities: "/apps" };

// Friendly link text for known slugs (overrides the humanized fallback).
const TITLES = {
  "emergency-safety": "Emergency & Safety",
  "food-dining": "Food & Dining",
  "foreign-exchange": "Foreign Exchange",
  "health-medical": "Health & Medical",
  "internet-connectivity": "Internet & Connectivity",
  "sim-card": "SIM Card",
  "mobile-payment": "Mobile Payment",
  "12306": "12306",
  alipay: "Alipay",
  amap: "Amap",
  didi: "DiDi",
  wechat: "WeChat",
  eleme: "Eleme",
};

function humanize(slug) {
  if (TITLES[slug]) return TITLES[slug];
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const RE =
  /\[\[wiki\/(concepts|entities|summaries)\/([^|\]#]+?)\.md(#[^|\]]*)?(?:\|([^\]]+))?\]\]/g;

// Text-level variant of the mdast transform below, for plain-text/markdown
// outputs (e.g. /llms-full.txt). Same RE + section mapping + display names, so
// the feed matches what the rendered HTML links to. `isPublished(section, slug)`
// lets callers downgrade links to unpublished targets to plain text instead of
// advertising dead URLs to AI consumers.
export function resolveWikilinksText(text, { siteBase = '', isPublished } = {}) {
  return text.replace(RE, (_full, section, slug, anchor, alias) => {
    if (section === 'summaries') return alias || slug; // no published route
    if (isPublished && !isPublished(section, slug)) return alias || humanize(slug);
    return `[${alias || humanize(slug)}](${siteBase}${SECTION_BASE[section]}/${slug}/${anchor || ''})`;
  });
}

function splitTextValue(value) {
  const out = [];
  let last = 0;
  let m;
  RE.lastIndex = 0;
  while ((m = RE.exec(value)) !== null) {
    const [full, section, slug, anchor, alias] = m;
    if (m.index > last) {
      out.push({ type: "text", value: value.slice(last, m.index) });
    }
    if (section === "summaries") {
      // No published route — drop the brackets, keep readable text.
      out.push({ type: "text", value: alias || slug });
    } else {
      const url = `${SECTION_BASE[section]}/${slug}/${anchor || ""}`;
      out.push({
        type: "link",
        url,
        children: [{ type: "text", value: alias || humanize(slug) }],
      });
    }
    last = m.index + full.length;
  }
  if (last < value.length) {
    out.push({ type: "text", value: value.slice(last) });
  }
  return out;
}

function transform(node) {
  if (!node || !Array.isArray(node.children)) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === "text" && child.value.includes("[[wiki/")) {
      next.push(...splitTextValue(child.value));
    } else {
      transform(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function remarkWikiLinks() {
  return (tree) => transform(tree);
}
